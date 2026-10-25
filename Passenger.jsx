import { useEffect, useRef, useState } from 'react'
import Icon from './Icons.jsx'
import StatusBadge from './StatusBadge.jsx'
import { SITE, getSessionExample } from './demoData.js'

// Passenger journey: idle -> connecting -> connected -> ended.
// Everything here is front-end state only. No network connection is ever made.
const example = getSessionExample()

// What each part of the concept is, and its honest status today.
const FLOW = [
  { icon: 'server', title: 'Internet backhaul', text: 'The connection that brings internet into the site.', badge: 'proposed', label: 'Proposed' },
  { icon: 'wifi', title: 'Wi-Fi access points', text: 'Coverage across the waiting and boarding areas.', badge: 'proposed', label: 'Proposed' },
  { icon: 'users', title: 'Passenger access', text: 'A simple way to connect and see session status.', badge: 'simulated', label: 'Demo built' },
  { icon: 'activity', title: 'Monitoring and analytics', text: 'Usage, speed, uptime and incidents for operators.', badge: 'simulated', label: 'Demo built' },
]

function SignalPanel() {
  return (
    <figure className="signal-panel">
      <svg viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
        <g fill="none" stroke="#ffffff" strokeOpacity="0.09" strokeWidth="1.5">
          <circle cx="200" cy="110" r="46" />
          <circle cx="200" cy="110" r="80" />
          <circle cx="200" cy="110" r="114" />
          <circle cx="200" cy="110" r="150" />
        </g>
        <g fill="none" stroke="#3fb5a8" strokeWidth="2">
          <circle className="ring" cx="200" cy="110" r="150" />
          <circle className="ring" cx="200" cy="110" r="150" />
          <circle className="ring" cx="200" cy="110" r="150" />
        </g>
      </svg>
      <div className="signal-core"><Icon name="wifi" size={30} /></div>
      <figcaption>
        <StatusBadge kind="proposed">Concept illustration</StatusBadge>
      </figcaption>
    </figure>
  )
}

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
      <main className="page narrow" aria-live="polite">
        <div className="session-card stack-5">
          <div className="session-hero">
            <div className="session-ring">
              <span className="pulse" /><span className="pulse" />
              <Icon name="wifi" size={30} />
            </div>
            <StatusBadge kind="simulated">Simulated demo session</StatusBadge>
            <h1 className="t-page" style={{ marginTop: 'var(--s3)' }}>Demo session active</h1>
            <p className="timer" aria-label={`Session time ${seconds} minutes on the demo clock`}>{seconds} min</p>
            <p className="t-caption on-dark">Demo clock: 1 second on screen = 1 minute of session time</p>
          </div>
          <div className="stat-trio">
            <div>
              <p className="t-caption on-dark">Data used</p>
              <p className="t-metric">{(seconds * example.mbPerMinute).toFixed(1)}<small>MB</small></p>
            </div>
            <div>
              <p className="t-caption on-dark">Speed</p>
              <p className="t-metric">{example.speed.toFixed(1)}<small>Mbps</small></p>
            </div>
            <div>
              <p className="t-caption on-dark">Access point</p>
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
          <button className="btn btn-on-dark" onClick={end}>Disconnect demo session</button>
        </div>
      </main>
    )
  }

  if (phase === 'ended') {
    return (
      <main className="page narrow stack-4">
        <div className="card pad-lg stack-5">
          <div className="session-hero light">
            <div className="session-ring light"><Icon name="check" size={30} /></div>
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
        <section aria-labelledby="hero-title" className="rise">
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

        <div className="stack-4 rise" style={{ '--d': '90ms' }}>
          <SignalPanel />

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
        </div>
      </div>

      <section className="flow-wrap rise" style={{ '--d': '160ms' }} aria-labelledby="flow-title">
        <div className="flow-head">
          <h2 id="flow-title" className="t-section">How it could work</h2>
          <p className="t-caption">The proposed system, and what exists today.</p>
        </div>
        <ol className="flow">
          {FLOW.map((s, i) => (
            <li key={s.title} className="card flow-step">
              <div className="flow-top">
                <span className="flow-icon"><Icon name={s.icon} size={20} /></span>
                <span className="flow-num">{i + 1}</span>
              </div>
              <h3 className="t-label" style={{ fontSize: '1rem', marginTop: 'var(--s3)' }}>{s.title}</h3>
              <p className="t-caption" style={{ marginTop: 2 }}>{s.text}</p>
              <div style={{ marginTop: 'var(--s3)' }}>
                <StatusBadge kind={s.badge}>{s.label}</StatusBadge>
              </div>
            </li>
          ))}
        </ol>
        <p className="t-caption flow-foot">
          <Icon name="zap" size={14} />
          <span>Optional solar and battery power is being considered, subject to feasibility.</span>
          <a className="link-btn" href="#/operator">View the operator dashboard <Icon name="arrow" size={16} /></a>
        </p>
      </section>
    </main>
  )
}
