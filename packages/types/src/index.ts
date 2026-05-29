/**
 * @bonk/types — shared type contracts for the bonk marketplace.
 *
 * Day-0 minimal surface. Will grow to include Job, Provider, Customer,
 * Saga state, Pub/Sub event schemas, etc. through W1-W8.
 *
 * Eventually some types will MIGRATE into @cinch/shared once the third-repo
 * extraction happens (per ADR-0002 Phase 1).
 */

// Branded ID types for safety
export type JobId = string & { readonly __brand: 'JobId' }
export type ProviderId = string & { readonly __brand: 'ProviderId' }
export type CustomerId = string & { readonly __brand: 'CustomerId' }
export type TenantId = string & { readonly __brand: 'TenantId' }

// Geo
export interface GeoPoint {
  lat: number
  lng: number
}

// Vertical — must match Cinch's TenantVertical at @cinch/types
// Phase 1 (per ADR-0002): import from the shared package directly. For now
// duplicated here so bonk can compile standalone before the package extraction.
export type Vertical =
  | 'hvac'
  | 'plumbing'
  | 'electrical'
  | 'cleaning'
  | 'handyman'
  | 'pest_control'
  | 'landscaping'
  | 'pool_service'
  | 'str_turnover'
  | 'property_management'
  | 'construction'
  | 'pet_grooming'
  | 'senior_care'
  | 'junk_removal'
  | 'mobile_detail'
  | 'appliance_repair'
  | 'locksmith'
  | 'garage_door'
  | 'mobile_mechanic'
  | 'other'

// Re-export the bonk-only matching strategy type
export type MatchStrategy = 'first_to_accept' | 'quote_back'

export type JobStatus =
  | 'broadcasting'
  | 'matched'
  | 'en_route'
  | 'on_site'
  | 'completed'
  | 'cancelled'
  | 'expired'
  | 'disputed'
  | 'settled'

export type Urgency = 'now' | 'today' | 'this_week' | 'scheduled'
