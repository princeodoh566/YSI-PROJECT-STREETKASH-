import { useEffect, useRef, useState } from 'react'
import Icon from './Icons.jsx'
import StatusBadge from './StatusBadge.jsx'
import { SITE, getSessionExample } from './demoData.js'

// Passenger journey: idle -> connecting -> connected -> ended.
// Everything here is front-end state only. No network connection is ever made.
const example = getSessionExample()

export default function Passenger() {
  const [phase, setPhase] = useState('idle')
  const [seconds, setSeconds] = useState(0)
  const [summary, setSummary] = useState(null)
  const timeout = useRef(null)

  useEffect(() => () => clearTimeout(timeout.current), [])

  // Demo clock: 1 real second stands for 1 minute of session time.
  useEffect(() => {
    if (phase !== 'connected') return undefined
    const id = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [phase])

  const connect = () => {
    setPhase('connecting')
    setSeconds(0)
    timeout.current = setTimeout(() => setPhase('connected'), 1400)
  }
  const end = () => {
    setSummary({ minutes: seconds, mb: seconds * example.mbPerMinute })
    setPhase('ended')
  }
  const reset = () => {
    setSummary(null)
    setSeconds(0)
    setPhase('idle')
  }

  if (phase === 'connected') {
    return (
      <main className="page narrow stack-4" aria-live="polite">
        <div className="card pad-lg stack-5">
          <div className="session-hero">
            <div className="session-ring"><Icon name="wifi" size={30} /></div>
            <StatusBadge kind="simulated">Simulated demo session</StatusBadge>
            <h1 className="t-page" style={{ marginTop: 'var(--s3)' }}>Demo session active</h1>
            <p className="timer" aria-label={`Session time ${seconds} minutes on the demo clock`}>{seconds} min</p>
            <p className="t-caption">Demo clock: 1 second on screen = 1 minute of session time</p>
          </div>
          <div className="stat-trio">
            <div>
              <p className="t-caption">Data used</p>
              <p className="t-metric">{(seconds * example.mbPerMinute).toFixed(1)}<small>MB</small></p>
            </div>
            <div>
              <p className="t-caption">Speed</p>
              <p className="t-metric">{example.speed.toFixed(1)}<small>Mbps</small></p>
            </div>
            <div>
              <p className="t-caption">Access point</p>
              <p className="t-metric">{example.ap}</p>
            </div>
          </div>
          <div className="note">
            <Icon name="info" size={18} />
            <span>
              This is a simulation. Your phone is not connected to StreetKash Wi-Fi, because no StreetKash
              network exists yet. Usage figures are illustrative.
            </span>
          </div>
          <button className="btn btn-secondary" onClick={end}>Disconnect demo session</button>
        </div>
      </main>
    )
  }

  if (phase === 'ended') {
    return (
      <main className="page narrow stack-4">
        <div className="card pad-lg stack-5">
          <div className="session-hero">
            <div className="session-ring"><Icon name="check" size={30} /></div>
            <StatusBadge kind="simulated">Simulated demo session</StatusBadge>
            <h1 className="t-page" style={{ marginTop: 'var(--s3)' }}>Demo session ended</h1>
          </div>
          <div className="divided">
            <div className="line"><span className="muted">Session length (demo clock)</span><strong>{summary.minutes} min</strong></div>
            <div className="line"><span className="muted">Data used (illustrative)</span><strong>{summary.mb.toFixed(1)} MB</strong></div>
          </div>
          <p className="t-caption">Nothing was connected, paid for or stored. This screen only shows how a session summary could look.</p>
          <div className="stack-3">
            <button className="btn btn-primary" onClick={reset}>Back to start</button>
            <a className="btn btn-secondary" href="#/operator">See what an operator would see</a>
          </div>
        </div>
      </main>
    )
  }

  const busy = phase === 'connecting'
  return (
    <main className="page">
      <div className="passenger-grid">
        <section aria-labelledby="hero-title">
          <p className="tag"><Icon name="search" size={16} />Concept demo · YSI Cohort 1</p>
          <h1 id="hero-title" className="t-hero">Better access to connectivity in busy public places.</h1>
          <p className="t-lead" style={{ marginTop: 'var(--s4)' }}>
            StreetKash is exploring a practical way to make internet access more accessible at transport
            terminals, supported by data on usage and service performance.
          </p>
          <p className="t-body muted" style={{ marginTop: 'var(--s3)' }}>
            Terminals bring many people together to wait and travel. This project sets out to find out how
            well they are connected today, and what it would take to improve it.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary inline" onClick={connect} disabled={busy} aria-busy={busy}>
              {busy ? (
                <><span className="spinner" aria-hidden="true" />Starting demo session…</>
              ) : (
                <><Icon name="wifi" size={20} />Try the demo connection</>
              )}
            </button>
            <p className="t-caption">
              <Icon name="info" size={14} />
              <span>Simulated. No real Wi-Fi connection is made, and no payment or personal details are needed.</span>
            </p>
          </div>
        </section>

        <div className="stack-4">
          <section className="card" aria-labelledby="status-title">
            <h2 id="status-title" className="t-section">Service status</h2>
            <div className="divided" style={{ marginTop: 'var(--s3)' }}>
              <div className="line">
                <span>Demonstration</span>
                <StatusBadge kind="simulated" icon="wifi">Wi-Fi available (simulated)</StatusBadge>
              </div>
              <div className="line">
                <span>Real-world service</span>
                <StatusBadge kind="proposed">Proposed, not deployed</StatusBadge>
              </div>
            </div>
            <p className="t-caption legend-note">
              Proposed means planned, not built. Simulated means shown for demonstration. A live label would
              appear only for a confirmed, working service. There is none yet.
            </p>
          </section>

          <section className="card" aria-labelledby="loc-title">
            <div className="row" style={{ alignItems: 'flex-start' }}>
              <span className="loc-icon"><Icon name="pin" size={20} /></span>
              <div>
                <p id="loc-title" className="t-caption">Proposed pilot location</p>
                <p className="t-label" style={{ fontSize: '1rem' }}>{SITE.name}</p>
                <p className="t-caption">Umuahia, Abia State. Site access and approval are not yet confirmed.</p>
              </div>
            </div>
          </section>

          <section className="card">
            <h2 className="t-section">The other side: operators</h2>
            <p className="t-caption" style={{ marginTop: 'var(--s2)', fontSize: '0.875rem' }}>
              A future operator would need to see usage, speed, uptime and incidents to decide what to improve.
            </p>
            <a className="link-btn" href="#/operator" style={{ marginTop: 'var(--s2)' }}>
              View the operator dashboard <Icon name="arrow" size={16} />
            </a>
          </section>
        </div>
      </div>
    </main>
  )
}
