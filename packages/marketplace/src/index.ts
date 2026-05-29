/**
 * @bonk/marketplace — core coordination primitives for the bonk marketplace.
 *
 * Day-0 substrate: exports type definitions and stub functions for the
 * first-to-accept saga (ADR-0004). The actual Cloud Workflows YAML + saga
 * implementation lands in W3.
 */

export { type MatchStrategy, type SagaStage, BROADCAST_SCHEDULE } from './saga'
export { acceptRace, type AcceptRaceResult } from './accept-race'
