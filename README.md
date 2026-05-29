# bonk

> **Uber for service providers.** Post a job. Vetted pros nearby see it instantly. First to accept gets it (or they quote you back). On-the-way tracking. In-app payment. Done.

**Status:** Day 0 — substrate. Sister product to [Cinch](https://github.com/Omega-boop/diamond-hands) (B2B AI Ops for service businesses). Cinch tenants are the seed provider pool; bonk is the consumer-facing acquisition channel.

**Working name "bonk"** is placeholder. Rename via `gh repo rename` once founder picks a final brand.

---

## Why this exists

Per [Cinch ADR-0044](https://github.com/Omega-boop/diamond-hands/blob/iac-runbook-pavel-grep/docs/decisions/0044-marketplace-strategy-decision-deferred.md) + [strategic capture](https://github.com/Omega-boop/diamond-hands/blob/iac-runbook-pavel-grep/docs/strategic/UBER_FOR_SERVICE_PROVIDERS.md), the marketplace opportunity:

- **62-74% of contractor calls go unanswered** (Housecall Pro 2025 Customer Service Report)
- **78% of customers hire whoever picks up first** (Invoca 2025 Call Conversion Benchmarks)
- **Existing players have catastrophic UX**: Angi's $2M Vermont AG fine; 1,800+ BBB complaints; TaskRabbit consolidated; Thumbtack lead-quality issues
- **Cinch has 80% of the marketplace infrastructure already** — voice intake, AI triage, provider pool, dispatch broadcast, magic-link tracking, HITL approvals

bonk is the consumer brand that activates this latent infrastructure.

---

## Architecture (initial)

```
bonk/                                 # this repo
├── apps/
│   ├── consumer/                     # Next.js — end-user posts jobs
│   └── provider/                     # Next.js PWA — providers accept jobs
├── packages/
│   ├── marketplace/                  # job broadcast + accept-race + saga
│   └── types/                        # bonk-specific shared contracts
└── infra/terraform/                  # Cloud Run + Pub/Sub + Firestore
```

**Cross-repo dependencies on Cinch:**
- `@cinch/types` (Job, Vertical, Person — share the type spine)
- `@cinch/voice-service` (AI voice receptionist for jobs that come in by phone)
- `@cinch/observability` (OpenTelemetry + Cloud Logging)
- `@cinch/design` (visual tokens — adapted brand layer for consumer audience)

Shared via npm publication (later) or git submodule (initially).

---

## Build order

| Wave | Scope | Status |
|---|---|---|
| W0 | substrate (this commit): repo, README, ADRs 0001-0004, pnpm workspace, Next.js stubs | 🟢 in progress |
| W1 | Consumer home page + job-post flow (vertical picker → details → broadcast) | ⏳ |
| W2 | Provider PWA + accept-race UX + push notifications | ⏳ |
| W3 | Marketplace coordination service — first-to-accept saga (Cloud Workflows + Cloud Tasks timeout) | ⏳ |
| W4 | Stripe Connect Express integration (provider payouts + hold-on-funds dispute window) | ⏳ |
| W5 | Reputation engine (composite score: acceptance + on-time + completion + reviews) | ⏳ |
| W6 | Geofence + on-the-way live tracking (Maps Distance Matrix + Cloud Tasks geofence events) | ⏳ |
| W7 | Cinch tenant auto-enrollment as providers (cross-repo handshake) | ⏳ |
| W8 | Dispute moderation tooling (internal admin surface) | ⏳ |

---

## ADRs (decisions log)

- [ADR-0001 — Product Mission](./docs/decisions/0001-product-mission.md) — what bonk does, what it doesn't
- [ADR-0002 — Cinch Relationship](./docs/decisions/0002-cinch-relationship.md) — how this repo relates to the parent
- [ADR-0003 — Architecture](./docs/decisions/0003-architecture.md) — services, tech stack, deploy
- [ADR-0004 — First-to-Accept Saga](./docs/decisions/0004-first-to-accept-saga.md) — the core matching primitive

---

## Local dev (once W0 lands)

```bash
pnpm install
pnpm --filter @bonk/consumer dev      # → http://localhost:3010
pnpm --filter @bonk/provider dev      # → http://localhost:3011
```

---

## Not in scope (yet)

- Native iOS/Android (PWA is enough through Year 1)
- Customer login with password (magic-link only)
- Direct ServiceTitan/Jobber integration (competitors, not partners)
- MCP for end customers (they don't run Claude Desktop)
- In-house calendar engine (Google Calendar via Cinch's `calendar-direct.ts`)

---

*This is a Day 0 substrate. The marketplace decision was committed in [Cinch ADR-0044](https://github.com/Omega-boop/diamond-hands/blob/iac-runbook-pavel-grep/docs/decisions/0044-marketplace-strategy-decision-deferred.md) on 2026-05-29 with Option B (sister product, separate repo) chosen by founder directive. This repo materializes that decision.*
