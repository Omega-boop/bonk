# ADR-0004 — First-to-Accept Saga (the core matching primitive)

> **Status:** Accepted (2026-05-29).
> Defines the core marketplace coordination mechanic.

---

## §1 — The mechanic

When a customer posts a job:

1. **Triage** — Vertex Gemini classifies vertical, urgency, scope. AI may ask 1-3 clarifying questions via the consumer surface OR via Twilio voice callback.
2. **Match pool selection** — Firestore composite query: `vertical IN [...]` + `geo within radius` + `reputation_tier >= floor` + `status='active'` + `availability_now=true`. Returns top-50 providers ranked by composite score.
3. **Broadcast** — push notification + SMS to top-10 providers (decreasing batches). Each provider sees the job in their feed with vertical-specific context (HVAC: equipment make/model; cleaning: square footage; etc.).
4. **Accept-race** — first provider to tap "Accept" wins. Optimistic-locking on Firestore: transactional update on `MarketplaceJob.acceptedProviderId` with `where status='broadcasting'`. Loser's request returns `409 ALREADY_MATCHED`.
5. **Confirmation** — winner notified, customer notified, both parties receive deep links to their respective surfaces.
6. **Timeout cascade** — if no acceptance within 30s, broadcast extends to providers 11-25; 60s, 26-50; 90s, all eligible. After 5min broadcasting, job marked `expired` and customer prompted to (a) re-broadcast with adjusted radius/price, (b) switch to `quote_back` mode, or (c) cancel.

## §2 — Quote-back mode (alternative)

When the customer chooses "I'm comparing" instead of "I need this NOW":

1. **Triage** — same as §1.1
2. **Broadcast** — top-10 providers get the job in their feed marked "Send a quote"
3. **Provider quotes** — each interested provider sends: ETA + price + 1-sentence pitch within 15min
4. **Customer chooses** — up to 3 quotes shown; customer picks one; chosen provider gets confirmation; others get "this job has been awarded"
5. **Timeout** — if <2 quotes within 15min, fall back to first-to-accept

## §3 — Saga orchestration

Implemented as Cloud Workflows YAML triggered by Pub/Sub `bonk_job_posted` event.

### Workflow stages
```yaml
stages:
  - triage:        # 1-3 sec
      service: bonk-marketplace
      action: classify_job
  - broadcast_batch_1:
      service: bonk-notifications
      action: notify_top_10_providers
      timeout: 30s
  - check_accepted:
      service: bonk-marketplace
      action: check_match_status
      branch_accepted: confirm_match
      branch_continue: broadcast_batch_2
  - broadcast_batch_2:
      timeout: 30s
      providers: 11-25
  - check_accepted: ...
  - broadcast_batch_3:
      timeout: 30s
      providers: 26-50
  - check_accepted: ...
  - broadcast_batch_all:
      timeout: 180s
      providers: all_eligible
  - check_accepted: ...
  - expire:
      service: bonk-marketplace
      action: expire_job_offer
      next_step: customer_prompt_retry
```

### Saga state machine
```
broadcasting → matched (winner accepts)
broadcasting → expired (5min timeout)
matched → en_route (winner taps "On my way")
en_route → on_site (geofence trigger 100m from customer)
on_site → completed (winner taps "Done" with photo evidence)
completed → settled (24h auto OR customer confirmation, whichever first)
matched → cancelled_by_provider (within 2min grace)
en_route → cancelled_by_customer (customer can cancel up to "on_site")
```

## §4 — Cost controls

- AI triage: gemini-2.5-flash-lite (cheap), per-tenant `withMarketplaceBudget()` cap
- Per-job notification spend cap: 50 SMS max per broadcast cycle ($0.50 floor)
- Per-customer monthly cap on broadcasts to prevent abuse (5 / day default, configurable per tenant)
- Pub/Sub publishing batched (3 events per batch) to stay under free tier

## §5 — Failure modes + mitigations

| Failure | Mitigation |
|---|---|
| Provider taps "Accept" but offline | Push + SMS confirmation; 90s window to re-confirm; otherwise re-broadcast |
| Two providers accept simultaneously | Optimistic-locking transaction; loser gets `409 ALREADY_MATCHED` |
| Customer cancels mid-en-route | Provider compensated for trip ($X minimum); cancellation tracked toward customer reputation |
| Provider doesn't show after acceptance | No-show flagged; provider reputation drops; customer offered priority re-match |
| Workflows orchestrator dies mid-saga | Cloud Workflows resumes from last successful step; idempotent operations |
| Customer ghosts on completed job | 24h auto-confirm; funds release; customer reputation note |

## §6 — Open implementation questions

- Saga compensation: when accept-race winner backs out, do we re-broadcast or cascade to runner-up? (default: cascade if within 2min, else re-broadcast)
- Geofence trigger: at 100m radius (Cloud Tasks scheduled poll) or via provider device GPS push? (default: poll for now, device push in W6)
- Multi-job providers: can a provider hold multiple matched jobs in `matched` state simultaneously? (default: yes — providers manage their own pipeline)
