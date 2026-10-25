import Icon from './Icons.jsx'
import StatusBadge from './StatusBadge.jsx'

// One honest page that separates what exists from what is only proposed.
const GROUPS = [
  {
    kind: 'live',
    badge: 'Built in this prototype',
    icon: 'check',
    note: 'Works in the software today. Front-end only.',
    items: [
      'Passenger journey: start, simulated connection, session screen, end',
      'Operator dashboard with summary metrics, two charts, incident log and a time-range filter',
      'One shared simulated dataset behind every figure',
    ],
  },
  {
    kind: 'simulated',
    badge: 'Shown with simulated data',
    icon: 'info',
    note: 'Visible on screen, but the numbers are generated, not measured.',
    items: [
      'Sessions, active sessions, data use, speed and uptime',
      'Incident log and the observations drawn from it',
    ],
  },
  {
    kind: 'proposed',
    badge: 'Proposed, not built',
    icon: 'planned',
    note: 'Intended for a later stage.',
    items: [
      'Internet backhaul, router and Wi-Fi access points at a real site',
      'Optional solar and battery power, subject to feasibility',
      'Real access portal, usage limits and live equipment telemetry',
    ],
  },
  {
    kind: 'warning',
    badge: 'To be validated',
    icon: 'search',
    note: 'Assumptions that need field research, tests, or partner and cost checks.',
    items: [
      'Permission to use and measure the proposed site',
      'Real connectivity baseline by provider, place and time of day',
      'Whether passengers want and would trust a shared Wi-Fi service',
      'Equipment, power and connectivity costs, and a sustainable operating model',
      'Privacy and security requirements',
    ],
  },
]

export default function About() {
  return (
    <main className="page">
      <header className="stack-3" style={{ maxWidth: 680 }}>
        <h1 className="t-page">About this prototype</h1>
        <p className="t-lead">
          StreetKash is an early-stage investigation into accessible public connectivity. This page separates
          what the software does today from what is still an idea or an assumption. There is no live network
          and no field data yet.
        </p>
      </header>
      <div className="about-grid">
        {GROUPS.map((g) => (
          <section key={g.badge} className="card">
            <StatusBadge kind={g.kind} icon={g.icon}>{g.badge}</StatusBadge>
            <p className="t-caption" style={{ marginTop: 'var(--s3)' }}>{g.note}</p>
            <ul>
              {g.items.map((t) => (<li key={t}>{t}</li>))}
            </ul>
          </section>
        ))}
      </div>
      <section className="card" style={{ marginTop: 'var(--s4)' }}>
        <h2 className="t-section">Guiding question</h2>
        <p className="t-body muted" style={{ marginTop: 'var(--s2)' }}>
          How can data, user research and a carefully scoped prototype be used to evaluate a practical model
          for improving access to public internet connectivity in busy public places?
        </p>
        <a className="link-btn" href="#/operator" style={{ marginTop: 'var(--s2)' }}>
          See the dashboard <Icon name="arrow" size={16} />
        </a>
      </section>
    </main>
  )
}
