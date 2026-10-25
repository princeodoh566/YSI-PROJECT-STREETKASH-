import { useEffect, useRef, useState } from 'react'
import { CheckIcon, PinIcon, WifiIcon } from './Icons.jsx'
import { SITE, getSessionExample } from './demoData.js'

// Passenger journey: idle -> connecting -> connected -> ended.
// Everything here is front-end state only. No network connection is made.
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
      <main className="page narrow stack" aria-live="polite">
        <div className="card stack">
          <div className="big-status">
            <span className="badge"><CheckIcon /></span>
            <div>
              <h1>Demo session active</h1>
              <p className="muted small">Simulated. Your device is not connected to any network.</p>
            </div>
          </div>
          <div>
            <p className="eyebrow">Session time (demo clock)</p>
            <p className="timer">{seconds} min</p>
            <p className="muted small">1 second on screen = 1 minute, so the demo moves quickly.</p>
          </div>
          <div>
            <div className="kv"><span>Data used (illustrative)</span><span>{(seconds * example.mbPerMinute).toFixed(1)} MB</span></div>
            <div className="kv"><span>Speed (illustrative)</span><span>{example.speed.toFixed(1)} Mbps</span></div>
            <div className="kv"><span>Access point (example ID)</span><span>{example.ap}</span></div>
          </div>
          <button className="btn btn-primary" onClick={end}>End demo session</button>
        </div>
      </main>
    )
  }

  if (phase === 'ended') {
    return (
      <main className="page narrow stack">
        <div className="card stack">
          <h1>Demo session ended</h1>
          <div>
            <div className="kv"><span>Session length (demo clock)</span><span>{summary.minutes} min</span></div>
            <div className="kv"><span>Data used (illustrative)</span><span>{summary.mb.toFixed(1)} MB</span></div>
          </div>
          <p className="muted small">
            Nothing was connected, paid for or stored. This screen only shows how a session summary could look.
          </p>
          <button className="btn btn-primary" onClick={reset}>Back to start</button>
          <a className="btn btn-secondary" href="#/operator">See the operator view</a>
        </div>
      </main>
    )
  }

  const busy = phase === 'connecting'
  return (
    <main className="page narrow stack">
      <section className="hero">
        <p className="eyebrow">Concept demo</p>
        <h1>Public Wi-Fi for busy places</h1>
        <p>
          StreetKash is exploring affordable, reliable internet access where many people wait and travel,
          starting with a transport terminal.
        </p>
      </section>

      <section className="card" aria-label="Proposed pilot site">
        <p className="eyebrow" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <PinIcon /> Proposed pilot site
        </p>
        <h2 style={{ marginTop: 6 }}>{SITE.name}</h2>
        <p className="muted small">{SITE.place}</p>
        <div style={{ marginTop: 'var(--s3)' }}>
          <div className="kv">
            <span>Wi-Fi service</span>
            <span><span className="pill"><span className="dot" />Available (simulated)</span></span>
          </div>
          <div className="kv">
            <span>Deployment status</span>
            <span><span className="pill grey">Not deployed</span></span>
          </div>
        </div>
      </section>

      <section className="stack">
        <button className="btn btn-primary" onClick={connect} disabled={busy} aria-busy={busy}>
          {busy ? (<><span className="spinner" aria-hidden="true" />Simulating connection…</>) : (<><WifiIcon size={20} />Try the demo connection</>)}
        </button>
        <p className="muted small" role="status">
          No payment, phone number or personal details are needed. This only changes what you see on this
          screen. It does not connect your device to any network.
        </p>
      </section>
    </main>
  )
}
