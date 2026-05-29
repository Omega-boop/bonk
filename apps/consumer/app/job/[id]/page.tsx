/**
 * apps/consumer/app/job/[id]/page.tsx — job tracking page.
 *
 * Day-0 substrate. Currently renders a static placeholder showing the
 * job ID + a fake broadcasting state. W3 wires this to:
 *   - Firestore subscription to MarketplaceJob.status changes
 *   - Provider info once matched
 *   - Real-time ETA via Maps Distance Matrix
 *   - On-the-way map view (W6)
 */

import Link from 'next/link'

interface Props {
  params: Promise<{ id: string }>
}

export default async function JobStatusPage({ params }: Props) {
  const { id } = await params

  return (
    <main
      style={{
        fontFamily: 'system-ui, -apple-system, sans-serif',
        maxWidth: 720,
        margin: '0 auto',
        padding: '2rem 1.5rem',
      }}
    >
      <Link href="/" style={{ color: '#666', textDecoration: 'none' }}>
        ← Home
      </Link>

      <h1 style={{ marginTop: '1rem' }}>Your job</h1>
      <p style={{ color: '#666' }}>
        Job ID: <code>{id}</code>
      </p>

      <section
        style={{
          marginTop: '2rem',
          padding: '2rem',
          background: '#fef3c7',
          border: '2px solid #f59e0b',
          borderRadius: 12,
        }}
      >
        <h2 style={{ marginTop: 0 }}>📡 Broadcasting to nearby pros</h2>
        <p>
          We&apos;re notifying providers within your service area. First one to
          accept will appear here with their ETA.
        </p>
        <div
          style={{
            marginTop: '1.5rem',
            fontSize: '0.875rem',
            color: '#92400e',
          }}
        >
          <strong>W3 status:</strong> live broadcasting + provider feed lands when
          the marketplace coordination service (Cloud Workflows saga) is built.
          This page is a Day-0 substrate.
        </div>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h3>What happens next</h3>
        <ol style={{ lineHeight: 1.8 }}>
          <li>
            <strong>Broadcast:</strong> top-10 nearest qualified pros get a push
            notification (30s window).
          </li>
          <li>
            <strong>First to accept wins:</strong> their info + ETA appears here.
          </li>
          <li>
            <strong>On their way:</strong> live map view shows their location.
          </li>
          <li>
            <strong>On site:</strong> auto-detected via geofence.
          </li>
          <li>
            <strong>Job complete:</strong> photo evidence + you confirm + payment
            releases.
          </li>
        </ol>
      </section>
    </main>
  )
}
