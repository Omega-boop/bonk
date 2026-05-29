/**
 * apps/consumer/app/page.tsx — bonk consumer home page.
 *
 * Day-0 substrate. The job-post flow is wired in W1 (per README build order).
 * For now this renders the hero + value prop + CTA to the post-job flow stub.
 */

import Link from 'next/link'

export default function HomePage() {
  return (
    <main style={{ fontFamily: 'system-ui, -apple-system, sans-serif', maxWidth: 720, margin: '0 auto', padding: '4rem 1.5rem' }}>
      <h1 style={{ fontSize: '3rem', lineHeight: 1.1, margin: 0, fontWeight: 900 }}>bonk</h1>
      <p style={{ fontSize: '1.5rem', marginTop: '0.5rem', color: '#444' }}>
        Service pros. Instantly.
      </p>

      <section style={{ marginTop: '3rem', padding: '2rem', border: '2px solid black', borderRadius: 12 }}>
        <h2 style={{ marginTop: 0 }}>Post a job. Get a pro in under 30 seconds.</h2>
        <p style={{ fontSize: '1.125rem', lineHeight: 1.5 }}>
          Heat out? Sink leaking? Dog matted? Lawn overgrown? Post it. Vetted local pros see it
          instantly. First one to accept is on their way. You see them coming. You pay in-app
          when the job&apos;s done.
        </p>
        <Link
          href="/post"
          style={{
            display: 'inline-block',
            marginTop: '1rem',
            padding: '1rem 2rem',
            background: 'black',
            color: 'white',
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: '1.125rem',
            borderRadius: 8,
          }}
        >
          Post a job →
        </Link>
      </section>

      <section style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        <div>
          <div style={{ fontSize: '2rem' }}>⚡</div>
          <h3 style={{ marginBottom: '0.25rem' }}>Instant match</h3>
          <p style={{ color: '#666', margin: 0 }}>30-second broadcast. First pro to accept wins.</p>
        </div>
        <div>
          <div style={{ fontSize: '2rem' }}>📍</div>
          <h3 style={{ marginBottom: '0.25rem' }}>On-the-way tracking</h3>
          <p style={{ color: '#666', margin: 0 }}>See your pro&apos;s ETA. Know when they arrive.</p>
        </div>
        <div>
          <div style={{ fontSize: '2rem' }}>⭐</div>
          <h3 style={{ marginBottom: '0.25rem' }}>Real reviews</h3>
          <p style={{ color: '#666', margin: 0 }}>Provider reputation is visible and ungameable.</p>
        </div>
        <div>
          <div style={{ fontSize: '2rem' }}>💳</div>
          <h3 style={{ marginBottom: '0.25rem' }}>Pay when done</h3>
          <p style={{ color: '#666', margin: 0 }}>In-app payment. Funds held until you confirm.</p>
        </div>
      </section>

      <footer style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid #ddd', color: '#888' }}>
        <p>
          A sister product to{' '}
          <a href="https://cinch.app" style={{ color: '#888' }}>Cinch</a> — the AI Operations
          platform for service businesses.
        </p>
        <p>Status: Day 0 substrate (2026-05-29).</p>
      </footer>
    </main>
  )
}
