'use client'

/**
 * JobPostWizard — 3-step job-post flow.
 *
 * State machine: vertical → details → confirm → submitted
 *
 * Server interaction is W3 work — this component currently calls a
 * client-side mock that simulates the broadcast saga. When W3 lands,
 * swap the mock for a server action that publishes to the
 * `bonk_job_posted` Pub/Sub topic.
 */

import { useState } from 'react'
import type { Vertical, Urgency, MatchStrategy } from '@bonk/types'

type Step = 'vertical' | 'details' | 'confirm' | 'submitted'

interface DraftJob {
  vertical: Vertical | null
  scope: string
  urgency: Urgency
  matching: MatchStrategy
}

const VERTICALS: Array<{ value: Vertical; label: string; icon: string }> = [
  { value: 'hvac', label: 'HVAC', icon: '🌡️' },
  { value: 'plumbing', label: 'Plumbing', icon: '🔧' },
  { value: 'electrical', label: 'Electrical', icon: '⚡' },
  { value: 'cleaning', label: 'Cleaning', icon: '🧹' },
  { value: 'pet_grooming', label: 'Dog Grooming', icon: '🐾' },
  { value: 'landscaping', label: 'Lawn Care', icon: '🌿' },
  { value: 'handyman', label: 'Handyman', icon: '🛠️' },
  { value: 'pest_control', label: 'Pest Control', icon: '🐛' },
  { value: 'junk_removal', label: 'Junk Removal', icon: '🚛' },
  { value: 'mobile_detail', label: 'Auto Detailing', icon: '🚗' },
  { value: 'pool_service', label: 'Pool Service', icon: '🏊' },
  { value: 'senior_care', label: 'Senior Care', icon: '💙' },
  { value: 'other', label: 'Other', icon: '⚙️' },
]

const URGENCY_OPTIONS: Array<{ value: Urgency; label: string; desc: string }> = [
  { value: 'now', label: 'Right now', desc: 'Emergency — broadcast to providers immediately' },
  { value: 'today', label: 'Today', desc: 'Within 24 hours' },
  { value: 'this_week', label: 'This week', desc: 'Flexible — next few days' },
  { value: 'scheduled', label: 'Scheduled', desc: "I'll pick a time" },
]

export function JobPostWizard() {
  const [step, setStep] = useState<Step>('vertical')
  const [draft, setDraft] = useState<DraftJob>({
    vertical: null,
    scope: '',
    urgency: 'today',
    matching: 'first_to_accept',
  })
  const [jobId, setJobId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  function pickVertical(v: Vertical) {
    setDraft({ ...draft, vertical: v })
    setStep('details')
  }

  function submitDetails(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStep('confirm')
  }

  async function broadcast() {
    setSubmitting(true)
    // W3 stub: simulate the broadcast saga. Replace with a Server Action
    // that publishes to bonk_job_posted Pub/Sub when W3 lands.
    await new Promise((r) => setTimeout(r, 800))
    const fakeJobId = `bonk-${Math.random().toString(36).slice(2, 10)}`
    setJobId(fakeJobId)
    setStep('submitted')
    setSubmitting(false)
  }

  return (
    <div>
      <Stepper current={step} />

      {step === 'vertical' && (
        <section style={{ marginTop: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>
            What kind of work?
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '0.75rem',
            }}
          >
            {VERTICALS.map((v) => (
              <button
                key={v.value}
                onClick={() => pickVertical(v.value)}
                style={tileStyle}
              >
                <div style={{ fontSize: '1.75rem' }}>{v.icon}</div>
                <div style={{ marginTop: '0.5rem', fontWeight: 600 }}>{v.label}</div>
              </button>
            ))}
          </div>
        </section>
      )}

      {step === 'details' && (
        <section style={{ marginTop: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
            Tell us what&apos;s going on
          </h2>
          <p style={{ color: '#666', marginBottom: '1.5rem' }}>
            One sentence is fine. Pros will ask follow-ups if needed.
          </p>
          <form onSubmit={submitDetails}>
            <label style={labelStyle}>
              <span>Describe the job</span>
              <textarea
                required
                value={draft.scope}
                onChange={(e) => setDraft({ ...draft, scope: e.target.value })}
                placeholder="My AC stopped blowing cold air around noon. Filter looks dirty."
                rows={4}
                style={inputStyle}
              />
            </label>

            <fieldset
              style={{
                marginTop: '1.5rem',
                border: 'none',
                padding: 0,
              }}
            >
              <legend style={{ fontWeight: 600, marginBottom: '0.5rem' }}>
                How urgent?
              </legend>
              {URGENCY_OPTIONS.map((o) => (
                <label
                  key={o.value}
                  style={{
                    display: 'block',
                    padding: '0.75rem 1rem',
                    border: `2px solid ${draft.urgency === o.value ? 'black' : '#ddd'}`,
                    borderRadius: 8,
                    marginBottom: '0.5rem',
                    cursor: 'pointer',
                    background: draft.urgency === o.value ? '#f5f5f5' : 'white',
                  }}
                >
                  <input
                    type="radio"
                    name="urgency"
                    value={o.value}
                    checked={draft.urgency === o.value}
                    onChange={() => setDraft({ ...draft, urgency: o.value })}
                    style={{ marginRight: '0.5rem' }}
                  />
                  <strong>{o.label}</strong>{' '}
                  <span style={{ color: '#666', fontSize: '0.875rem' }}>— {o.desc}</span>
                </label>
              ))}
            </fieldset>

            <fieldset
              style={{
                marginTop: '1.5rem',
                border: 'none',
                padding: 0,
              }}
            >
              <legend style={{ fontWeight: 600, marginBottom: '0.5rem' }}>
                Matching mode
              </legend>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                <input
                  type="radio"
                  name="matching"
                  value="first_to_accept"
                  checked={draft.matching === 'first_to_accept'}
                  onChange={() => setDraft({ ...draft, matching: 'first_to_accept' })}
                  style={{ marginRight: '0.5rem' }}
                />
                <strong>First to accept</strong> — Uber-style. Fastest pro gets the job.
              </label>
              <label style={{ display: 'block' }}>
                <input
                  type="radio"
                  name="matching"
                  value="quote_back"
                  checked={draft.matching === 'quote_back'}
                  onChange={() => setDraft({ ...draft, matching: 'quote_back' })}
                  style={{ marginRight: '0.5rem' }}
                />
                <strong>I&apos;m comparing</strong> — See up to 3 quotes, then pick.
              </label>
            </fieldset>

            <button type="submit" style={primaryBtn}>
              Review and post →
            </button>
          </form>
        </section>
      )}

      {step === 'confirm' && (
        <section style={{ marginTop: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Confirm</h2>
          <dl style={{ background: '#f5f5f5', padding: '1rem', borderRadius: 8 }}>
            <dt style={{ fontWeight: 600 }}>Vertical</dt>
            <dd style={{ marginLeft: 0, marginBottom: '0.75rem' }}>{draft.vertical}</dd>

            <dt style={{ fontWeight: 600 }}>Job</dt>
            <dd style={{ marginLeft: 0, marginBottom: '0.75rem' }}>{draft.scope}</dd>

            <dt style={{ fontWeight: 600 }}>Urgency</dt>
            <dd style={{ marginLeft: 0, marginBottom: '0.75rem' }}>{draft.urgency}</dd>

            <dt style={{ fontWeight: 600 }}>Matching</dt>
            <dd style={{ marginLeft: 0 }}>{draft.matching}</dd>
          </dl>

          <button
            onClick={broadcast}
            disabled={submitting}
            style={{ ...primaryBtn, opacity: submitting ? 0.6 : 1 }}
          >
            {submitting ? 'Broadcasting…' : 'Post now'}
          </button>
          <button
            onClick={() => setStep('details')}
            style={{ ...secondaryBtn, marginLeft: '0.5rem' }}
          >
            Back
          </button>
        </section>
      )}

      {step === 'submitted' && jobId && (
        <section
          style={{
            marginTop: '1.5rem',
            padding: '2rem',
            background: '#f0fdf4',
            border: '2px solid #16a34a',
            borderRadius: 12,
          }}
        >
          <h2 style={{ marginTop: 0 }}>🚀 Posted!</h2>
          <p>
            We&apos;re notifying nearby pros now. The first one to accept will
            send you their ETA.
          </p>
          <p style={{ fontSize: '0.875rem', color: '#666' }}>
            Job ID: <code>{jobId}</code>
          </p>
          <a href={`/job/${jobId}`} style={primaryBtn}>
            See live status →
          </a>
        </section>
      )}
    </div>
  )
}

function Stepper({ current }: { current: Step }) {
  const steps: Step[] = ['vertical', 'details', 'confirm', 'submitted']
  const i = steps.indexOf(current)
  return (
    <ol
      style={{
        listStyle: 'none',
        padding: 0,
        margin: 0,
        display: 'flex',
        gap: '0.5rem',
      }}
    >
      {steps.slice(0, 3).map((s, idx) => (
        <li
          key={s}
          style={{
            flex: 1,
            height: 4,
            background: idx <= i ? 'black' : '#ddd',
            borderRadius: 2,
          }}
        />
      ))}
    </ol>
  )
}

const tileStyle: React.CSSProperties = {
  padding: '1rem',
  border: '2px solid #ddd',
  borderRadius: 8,
  background: 'white',
  cursor: 'pointer',
  textAlign: 'center',
  fontFamily: 'inherit',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontWeight: 600,
  marginBottom: '0.25rem',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.75rem',
  border: '2px solid #ddd',
  borderRadius: 8,
  fontSize: '1rem',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
  marginTop: '0.25rem',
}

const primaryBtn: React.CSSProperties = {
  display: 'inline-block',
  marginTop: '1.5rem',
  padding: '0.875rem 1.5rem',
  background: 'black',
  color: 'white',
  border: 'none',
  borderRadius: 8,
  fontSize: '1rem',
  fontWeight: 700,
  cursor: 'pointer',
  textDecoration: 'none',
  fontFamily: 'inherit',
}

const secondaryBtn: React.CSSProperties = {
  display: 'inline-block',
  marginTop: '1.5rem',
  padding: '0.875rem 1.5rem',
  background: 'white',
  color: 'black',
  border: '2px solid black',
  borderRadius: 8,
  fontSize: '1rem',
  fontWeight: 700,
  cursor: 'pointer',
  fontFamily: 'inherit',
}
