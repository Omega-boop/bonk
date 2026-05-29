/**
 * apps/provider/app/page.tsx — bonk provider job-feed home.
 *
 * Day-0 substrate. The real job feed + accept-race UX lands in W2.
 */

export default function ProviderHomePage() {
  return (
    <main style={{ fontFamily: 'system-ui, -apple-system, sans-serif', maxWidth: 720, margin: '0 auto', padding: '4rem 1.5rem' }}>
      <h1 style={{ fontSize: '2.5rem', margin: 0 }}>bonk pros</h1>
      <p style={{ fontSize: '1.25rem', marginTop: '0.5rem', color: '#444' }}>
        Real-time job feed. Accept what fits. Get paid fast.
      </p>

      <section style={{ marginTop: '3rem', padding: '2rem', border: '2px solid black', borderRadius: 12, background: '#f8f8f8' }}>
        <h2 style={{ marginTop: 0 }}>Already running a service business?</h2>
        <p>
          If you&apos;re a Cinch tenant, opt-in to bonk in your Cinch admin and we&apos;ll start
          surfacing matching jobs in your existing dispatch board. No extra app to manage.
        </p>
        <a href="https://cinch.app/settings/integrations/bonk" style={{ color: 'black', fontWeight: 700 }}>
          Connect via Cinch →
        </a>
      </section>

      <section style={{ marginTop: '2rem', padding: '2rem', border: '2px solid #ddd', borderRadius: 12 }}>
        <h2 style={{ marginTop: 0 }}>Solo pro?</h2>
        <p>Sign up below. We&apos;ll vet you in under 24 hours and start surfacing local jobs.</p>
        <a href="/signup" style={{ color: 'black', fontWeight: 700 }}>
          Apply to be a bonk pro →
        </a>
      </section>

      <footer style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid #ddd', color: '#888' }}>
        <p>Status: Day 0 substrate (2026-05-29). Real job feed lands in W2.</p>
      </footer>
    </main>
  )
}
