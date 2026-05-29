# ADR-0003 — Architecture

> **Status:** Accepted (2026-05-29).
> Initial substrate-level architectural decisions for bonk.

---

## §1 — Tech stack

### Frontend
- **Next.js 16** (App Router, Turbopack) — same as Cinch
- **React 19** + Server Components first
- **Tailwind CSS 4** — design tokens from `@cinch/design`
- **TypeScript** strict mode, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`
- **pnpm 9.15.9** workspaces

### Backend
- **Cloud Run** (us-east1) for all services — sub-second cold-start with `min_instances=0` on batch + `min_instances=1` on customer-facing
- **Firestore** in Native mode — provider profiles, job offers, accept-races
- **Pub/Sub** for event broadcast — job_offered, accepted, en_route, arrived, completed
- **Cloud Tasks** for accept-race timeouts (30s broadcast → cascade)
- **Cloud Workflows** for the orchestrating saga
- **Vertex Gemini** for AI triage (per Cinch ADR-0039) — 2.5-flash for triage, 2.5-pro for dispute moderation
- **Stripe Connect Express** for payments + provider payouts (per Cinch ADR-0038 §K)
- **Twilio Voice** for phone-in jobs (shared with Cinch's voice-service)
- **Cloudflare Turnstile** for bot prevention on job posts

### Per-tenant cost discipline (mirrors Cinch ADR-0003)
- `withMarketplaceBudget(tenantId, fn)` circuit-breaker on AI calls
- GCS lifecycle: job photos hot → nearline 30d → coldline 90d → archive 365d
- 1% Cloud Trace sampling in prod, 100% in staging
- Free-tier Pub/Sub (under 10GB/mo) — batch where possible

## §2 — Service inventory at launch

| Service | Purpose | min/max | Tech |
|---|---|---|---|
| `bonk-consumer` | Customer-facing site (post job, track status, magic-link) | 1/20 | Next.js 16 |
| `bonk-provider` | Provider PWA (job feed, accept, on-the-way) | 1/20 | Next.js 16 PWA |
| `bonk-marketplace` | Coordination saga + accept-race + cascade | 0/10 | Cloud Run + Workflows |
| `bonk-notifications` | Push + SMS via Twilio + Email via Resend | 0/5 | Cloud Run |

Total at launch: **4 services**. Mirrors Cinch's discipline (ADR-0038 §A) of starting small.

## §3 — Data model (initial)

```ts
// packages/types/src/job.ts
interface MarketplaceJob {
  id: string                     // bonk:job:{uuid}
  customerId: string             // bonk:customer:{uuid} — magic-link auth
  vertical: TenantVertical       // from @cinch/types
  postedAt: ISO8601
  geo: { lat: number; lng: number; radius_mi: number }
  scope: { summary: string; photos: string[]; voice_note?: string }
  urgency: 'now' | 'today' | 'this_week' | 'scheduled'
  matching_mode: 'first_to_accept' | 'quote_back'
  pricing: { model: 'fixed' | 'time_and_materials' | 'quote_first'; estimate?: number }
  status: 'broadcasting' | 'matched' | 'en_route' | 'on_site' | 'completed' | 'cancelled' | 'expired'
  acceptedProviderId?: string    // bonk:provider:{uuid}
  expiresAt: ISO8601             // hard expiry on broadcast
}

interface Provider {
  id: string                     // bonk:provider:{uuid}
  source: 'cinch_tenant' | 'solo_signup'
  cinchTenantId?: string         // links to Cinch if source === 'cinch_tenant'
  legalName: string
  serviceArea: { center: GeoPoint; radius_mi: number }
  verticals: TenantVertical[]
  certifications: Certification[]
  reputation: { score: number; jobs_completed: number; on_time_rate: number; complaint_rate: number }
  payoutMethod: { stripe_account_id: string; status: 'active' | 'pending' | 'suspended' }
  status: 'active' | 'paused' | 'suspended'
}
```

## §4 — Auth model

### Customer
- Magic-link only (per Cinch ADR-0006)
- No password
- Token in Firestore with 30-day rolling refresh

### Provider
- Cinch tenant providers: SSO from Cinch via OAuth handshake
- Solo providers: email + password (bcryptjs cost 12) per Cinch ADR-0006 pattern
- Mobile push tokens registered per device

### Cross-service auth
- HMAC-signed Pub/Sub messages (per Cinch's `@cinch/public-contract`)
- Cloud Run IAM with `aiplatform.user` per Cinch ADR-0039 for Vertex calls

## §5 — Observability

- OpenTelemetry via `@cinch/observability`
- Cloud Logging structured JSON
- Cloud Trace with span attributes: `bonk.job_id`, `bonk.provider_id`, `bonk.match_strategy`
- Sentry for errors (org `knoemi`, new project `bonk`)
- Cloud Monitoring dashboards: accept-rate by vertical, time-to-match p50/p95/p99, provider acceptance rate

## §6 — Migration to GCP rename

Per Cinch ADR-0041, the GCP project ID `diamond-hands-pm` stays through Phase 1. bonk services are named `bonk-*` from day 1 (no rename debt). Eventually both products move to a clean `cinch-platform-prod-XXXX` GCP project when Cinch finishes its Phase 6 rename.

## §7 — Deferred decisions

- Subdomain routing (`{providerName}.bonk.app/jobs` vs centralized) — TBD
- Native iOS/Android (after Year 1 — PWA covers it)
- White-label provider portal — TBD
- B2B2C revenue split with Cinch — TBD (governance ADR after Phase 1)
