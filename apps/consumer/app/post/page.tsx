/**
 * apps/consumer/app/post/page.tsx — bonk job-post flow entrypoint.
 *
 * W1 substrate. Renders the 3-step wizard:
 *   1. Pick your vertical (HVAC / plumbing / cleaning / dog-grooming / etc.)
 *   2. Describe the job (text + optional photo + urgency)
 *   3. Confirm + broadcast (calls @bonk/marketplace acceptRace stub)
 *
 * Real broadcasting (Cloud Workflows saga + provider push) ships W3.
 * For now: client-side state machine + a stub server action that simulates
 * the broadcast and returns a fake jobId so the customer can land on
 * /job/[id] tracking page.
 */

import { Suspense } from 'react'
import { JobPostWizard } from './_components/JobPostWizard'

export default function PostJobPage() {
  return (
    <main
      style={{
        fontFamily: 'system-ui, -apple-system, sans-serif',
        maxWidth: 720,
        margin: '0 auto',
        padding: '2rem 1.5rem',
      }}
    >
      <a
        href="/"
        style={{ color: '#666', textDecoration: 'none', fontSize: '0.875rem' }}
      >
        ← Back
      </a>

      <h1 style={{ fontSize: '2rem', marginTop: '1rem', marginBottom: '0.5rem' }}>
        Post a job
      </h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Tell us what you need. Vetted pros nearby will see it in seconds.
      </p>

      <Suspense fallback={<p>Loading…</p>}>
        <JobPostWizard />
      </Suspense>
    </main>
  )
}
