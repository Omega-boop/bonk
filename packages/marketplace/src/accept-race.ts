/**
 * accept-race — the optimistic-locking primitive that makes first-to-accept
 * actually first-to-accept.
 *
 * Implementation strategy per ADR-0004 §1.4:
 *   - Firestore transactional update on MarketplaceJob.acceptedProviderId
 *   - where status === 'broadcasting'
 *   - returns OK on first writer; CONFLICT on every subsequent attempt
 *
 * This module exports the TYPE shape — the actual Firestore call lives in
 * the marketplace service (apps/server/marketplace/ in W3). Consumer + provider
 * apps import the type to render the loser-state UI ('this job has been
 * matched by another pro — try the next one').
 */

import type { JobId, ProviderId } from '@bonk/types'

export type AcceptRaceResult =
  | { ok: true; jobId: JobId; providerId: ProviderId; acceptedAt: string }
  | { ok: false; reason: 'ALREADY_MATCHED' | 'EXPIRED' | 'NOT_FOUND' | 'NOT_ELIGIBLE' }

/**
 * Day-0 stub. The real implementation in apps/server/marketplace performs a
 * Firestore transaction; this stub exists so the consumer + provider apps can
 * import + type-check the call signature before W3 lands.
 */
export async function acceptRace(_jobId: JobId, _providerId: ProviderId): Promise<AcceptRaceResult> {
  return { ok: false, reason: 'NOT_FOUND' }
}
