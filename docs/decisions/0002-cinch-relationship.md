# ADR-0002 — Relationship to Cinch

> **Status:** Accepted (2026-05-29).
> Defines how this repo (`bonk`) interacts with the parent Cinch repo (`Omega-boop/cinch-platform`).

---

## §1 — Sister product, not subsidiary

bonk and Cinch are SISTER products. Neither owns the other. Both serve different users with different go-to-markets, but they share substrate:

- Cinch tenants can opt-in to be bonk providers (extra demand source)
- bonk uses Cinch's voice agent infrastructure for phone-in jobs
- Shared `@cinch/types`, `@cinch/observability`, `@cinch/design` (consumer-adapted)

## §2 — Code sharing model — chosen

### Phase 0 (now): published npm packages via Cinch's existing workspace
Cinch already publishes:
- `@cinch/types` — domain contracts (Job, Person, Vertical, etc.)
- `@cinch/observability` — OpenTelemetry + Cloud Logging helpers
- `@cinch/design` — design tokens

For Phase 0 we **vendor-import** these from Cinch (initially as git-submoduled `packages/cinch-shared/` or via local `file:` resolution). Avoid the npm publication step until shape is stable.

### Phase 1: extract shared packages to a third repo (`cinch-shared`)
Once contracts settle, move `types`, `observability`, `design`, and the voice-service client into `Omega-boop/cinch-shared` consumed by both repos via npm publication.

### Phase 2: shared compute substrate
Both products run on the same GCP project (`diamond-hands-pm` per Cinch ADR-0041 Phase 1, or a future `cinch-prod-XXXX`) with namespaced Cloud Run services:
- `cinch-{web,admin,voice,intake,...}`
- `bonk-{consumer,provider,marketplace,...}`

Per-tenant cost isolation per Cinch ADR-0003 + ADR-0039 applies to bonk providers identically.

## §3 — Tenant ↔ Provider mapping

A Cinch tenant who opts-in becomes a bonk Provider with:
- Same Firestore tenant ID
- Provider profile auto-populated from tenant settings (service area, skills, crew size, vertical)
- Provider AI receptionist == tenant's existing AI receptionist (no new voice agent)
- Provider job feed == tenant's existing dispatch board with a `source: 'bonk_marketplace'` filter

Cross-repo handshake: bonk reads tenant data via Cinch's `/api/internal/provider-eligibility` endpoint (HMAC-signed per Cinch's `packages/public-contract/src/hmac.ts` pattern). bonk writes marketplace job events to a shared Pub/Sub topic (`cinch-events:bonk_job_offered`) that Cinch's intake-service consumes.

## §4 — Brand separation

- Cinch = B2B AI Ops for service businesses (operator-facing)
- bonk = consumer marketplace (customer-facing)
- No domain confusion: `cinch.app` vs `bonk.app` (or chosen names)
- Distinct visual identities (shared design tokens, distinct brand layers)

## §5 — Failure isolation

A bonk outage MUST NOT take down Cinch B2B. Cross-repo dependencies are one-way: bonk reads from Cinch APIs and consumes Cinch events; bonk writes to ITS OWN database and ITS OWN events. Cinch never reads from bonk.

## §6 — Repo ownership + governance

- `Omega-boop/cinch-platform` — Cinch, owned by founder
- `Omega-boop/bonk` — bonk, owned by founder
- Future: separate GitHub org `cinch-platform` housing both (rename via `gh repo transfer`)
