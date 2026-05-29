/**
 * Saga primitives — broadcast schedule + stage definitions per ADR-0004.
 *
 * The actual orchestrator is a Cloud Workflows YAML (deployed via infra/);
 * this module is the type-level + reference implementation used by the
 * consumer + provider apps for unit-testing and local simulation.
 */

export type MatchStrategy = 'first_to_accept' | 'quote_back'

export type SagaStage =
  | 'triage'
  | 'broadcast_batch_1'
  | 'broadcast_batch_2'
  | 'broadcast_batch_3'
  | 'broadcast_batch_all'
  | 'matched'
  | 'expired'

/**
 * Broadcast schedule per ADR-0004 §3.
 * - batch 1: top 10 providers, 30 second window
 * - batch 2: providers 11-25, 30 second window
 * - batch 3: providers 26-50, 30 second window
 * - batch all: every eligible provider, 180 second window
 * - total broadcast window: 270 seconds (4.5 minutes)
 *
 * After the final batch expires without acceptance, the job is marked
 * `expired` and the customer is prompted to retry / adjust / cancel.
 */
export const BROADCAST_SCHEDULE: ReadonlyArray<{
  stage: SagaStage
  providers: { from: number; to: number | null }
  timeoutSeconds: number
}> = [
  { stage: 'broadcast_batch_1', providers: { from: 1, to: 10 }, timeoutSeconds: 30 },
  { stage: 'broadcast_batch_2', providers: { from: 11, to: 25 }, timeoutSeconds: 30 },
  { stage: 'broadcast_batch_3', providers: { from: 26, to: 50 }, timeoutSeconds: 30 },
  { stage: 'broadcast_batch_all', providers: { from: 51, to: null }, timeoutSeconds: 180 },
] as const
