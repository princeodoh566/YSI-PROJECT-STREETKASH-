import { useEffect, useRef, useState } from 'react'
import Icon from './Icons.jsx'
import { SITE, getSessionExample } from './demoData.js'

// Passenger journey: idle -> connecting -> connected -> ended.
// Everything here is front-end state only. No network connection is ever made.
const example = getSessionExample()

// How the service works, from connection to monitoring.
const FLOW = [
  { icon: 'server', title: 'Internet backhaul', text: 'A dependable connection that brings internet into the location.' },
  { icon: 'wifi', title: 'Wi-Fi access points', text: 'Coverage across waiting and boarding areas.' },
  { icon: 'users', title: 'Passenger access', text: 'A simple way to connect and see session status.' },
  { icon: 'activity', title: 'Monitoring and analytics', text: 'Usage, speed, uptime and incidents for operators.' },
]

// Where StreetKash starts and where it is going.
const GROWTH = [
  { label: 'Start', text: 'Prof. Nnenna Oti Central Bus Terminal, Umuahia' },
  { label: 'Grow', text: 'Terminals, markets and campuses across Abia State' },
  { label: 'Scale', text: 'Suitable public locations across Nigeria' },
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
      <figcaption className="signal-cap">Reliable access where people wait</figcaption>
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
            <p className="t-caption on-dark">Passenger preview</p>
            <h1 className="t-page" style={{ marginTop: 'var(--s3)' }}>You are connected</h1>
            <p className="timer" aria-label={`Session time ${seconds} minutes`}>{seconds} min</p>
            <p className="t-caption on-dark">Preview clock: 1 second = 1 minute</p>
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
              This is a preview of the passenger experience. Usage figures are sample data.
            </span>
          </div>
          <button className="btn btn-on-dark" onClick={end}>Disconnect</button>
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
            <h1 className="t-page" style={{ marginTop: 'var(--s3)' }}>Session ended</h1>
          </div>
          <div className="divided">
            <div className="line"><span className="muted">Session length</span><strong>{summary.minutes} min</strong></div>
            <div className="line"><span className="muted">Data used</span><strong>{summary.mb.toFixed(1)} MB</strong></div>
          </div>
          <p className="t-caption">This is how a session summary looks. Figures are sample data.</p>
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
          <p className="tag"><Icon name="wifi" size={16} />Public connectivity service</p>
          <h1 id="hero-title" className="t-hero">Better connectivity where people gather.</h1>
          <p className="t-lead" style={{ marginTop: 'var(--s4)' }}>
            StreetKash brings affordable, reliable internet access to busy public places, with a dashboard
            that helps operators run the service.
          </p>
          <p className="t-body muted" style={{ marginTop: 'var(--s3)' }}>
            We are starting at Prof. Nnenna Oti Central Bus Terminal in Umuahia, and growing to more
            terminals, markets and campuses across Abia State and Nigeria.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary inline" onClick={connect} disabled={busy} aria-busy={busy}>
              {busy ? (
                <><span className="spinner" aria-hidden="true" />Connecting…</>
              ) : (
                <><Icon name="wifi" size={20} />Try the passenger experience</>
              )}
            </button>
            <p className="t-caption">
              <Icon name="info" size={14} />
              <span>A preview of how passengers connect. No payment or personal details needed.</span>
            </p>
          </div>
        </section>

        <div className="stack-4 rise" style={{ '--d': '90ms' }}>
          <SignalPanel />

          <section className="card" aria-labelledby="loc-title">
            <div className="row" style={{ alignItems: 'flex-start' }}>
              <span className="loc-icon"><Icon name="pin" size={20} /></span>
              <div>
                <p id="loc-title" className="t-caption">Starting location</p>
                <p className="t-label" style={{ fontSize: '1rem' }}>{SITE.name}</p>
                <p className="t-caption">Umuahia, Abia State</p>
              </div>
            </div>
          </section>

          <section className="card" aria-labelledby="growth-title">
            <h2 id="growth-title" className="t-section">Where we are going</h2>
            <div className="divided" style={{ marginTop: 'var(--s3)' }}>
              {GROWTH.map((g) => (
                <div className="line" key={g.label} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
                  <span className="t-caption">{g.label}</span>
                  <strong>{g.text}</strong>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <section className="flow-wrap rise" style={{ '--d': '160ms' }} aria-labelledby="flow-title">
        <div className="flow-head">
          <h2 id="flow-title" className="t-section">How it works</h2>
          <p className="t-caption">From the internet connection to the operator view.</p>
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
            </li>
          ))}
        </ol>
        <p className="t-caption flow-foot">
          <Icon name="zap" size={14} />
          <span>Backup power keeps the service available through outages.</span>
          <a className="link-btn" href="#/operator">View the operator dashboard <Icon name="arrow" size={16} /></a>
        </p>
      </section>
    </main>
  )
}
