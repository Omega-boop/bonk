# ADR-0001 — Product Mission

> **Status:** Accepted (2026-05-29).
> **Source:** Founder directive to materialize Cinch ADR-0044 Option B (sister product, separate repo).

---

## §1 — The mission in one sentence

> bonk connects an end customer to a vetted, available service provider in under 30 seconds — instant match, on-the-way tracking, in-app payment, photo-gated quality evidence.

## §2 — Who we serve

### Customer-side
- **Homeowner** with an urgent service need (heat out, sink broken, dog matted, lawn overgrown, gutter clogged) who doesn't already have "their HVAC guy"
- **Renter / STR host** who needs turnover support, lockout response, or emergency repair without driving
- **Property manager** with units to maintain who wants overflow capacity beyond their in-house crew

### Provider-side
- **Cinch tenants** (HVAC shops, cleaning services, dog groomers, etc.) who opt-in for marketplace job overflow
- **Solo professionals** (handymen, mobile groomers, mobile detailers, pressure washers) who don't run a Cinch tenant but want jobs

## §3 — What we don't do

- Long-term contracts (recurring is fine; locked-in is not — that's a B2B relationship outside the marketplace)
- Job-board listings ("here's a bunch of jobs, browse them") — the marketplace is broadcast-style
- Provider reputation that ignores customer reviews (no pay-to-rank)
- Hidden fees, deceptive pricing, dark patterns (we are the anti-Angi)

## §4 — Brand attitude

- **Punchy.** "Bonk." It's hit and it's done. No long forms.
- **Trustworthy.** Provider reputation is visible, real, ungameable. Customer reviews drive ranking.
- **Operator-friendly.** Cinch tenants opt-in and get treated as first-class providers, not gig workers.
- **Consumer-facing.** This is NOT a B2B brand. Voice + UX is warm, fast, and proudly local.

## §5 — Mission boundaries (anti-scope)

- Not a contractor-license aggregator (we use existing license check APIs)
- Not a payment processor (Stripe Connect handles money)
- Not a CRM (providers run Cinch for that, or use their existing tools)
- Not a Facebook / Twitter / TikTok (we are not a content platform)
- Not an Insurance broker (we verify cert but don't sell coverage)
