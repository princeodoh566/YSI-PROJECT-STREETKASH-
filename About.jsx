import Icon from './Icons.jsx'

// About StreetKash: what the service is, how it earns, and where it is going.
const OFFER = [
  {
    icon: 'users',
    title: 'For passengers',
    items: ['Find the StreetKash access point', 'Open a simple access page', 'Connect and see session status'],
  },
  {
    icon: 'activity',
    title: 'For operators',
    items: ['See usage, speed and uptime', 'Track incidents and demand patterns', 'Make better decisions about the service'],
  },
]

const REVENUE = [
  { title: 'Access packages', text: 'Affordable paid access for passengers who need more than a sponsored allowance.' },
  { title: 'Venue agreements', text: 'Operators and nearby businesses pay for managed connectivity and a better visitor experience.' },
  { title: 'Sponsorship', text: 'Brands sponsor access where the audience and the arrangement make sense.' },
]

const GROWTH = [
  { label: 'Stage 1', title: 'Umuahia', text: 'Prof. Nnenna Oti Central Bus Terminal is the starting location.' },
  { label: 'Stage 2', title: 'Across Abia State', text: 'Other transport terminals, markets, campuses and suitable public locations.' },
  { label: 'Stage 3', title: 'Across Nigeria', text: 'A wider public-connectivity network built from a repeatable location model.' },
]

export default function About() {
  return (
    <main className="page">
      <header className="stack-3" style={{ maxWidth: 680 }}>
        <h1 className="t-page">About StreetKash</h1>
        <p className="t-lead">
          StreetKash is a public-connectivity service. It combines managed Wi-Fi access, a simple passenger
          experience and an operator dashboard, so busy public places can offer dependable internet.
        </p>
      </header>

      <div className="about-grid">
        {OFFER.map((o) => (
          <section key={o.title} className="card">
            <span className="loc-icon"><Icon name={o.icon} size={20} /></span>
            <h2 className="t-section" style={{ marginTop: 'var(--s3)' }}>{o.title}</h2>
            <ul>{o.items.map((t) => (<li key={t}>{t}</li>))}</ul>
          </section>
        ))}
      </div>

      <h2 className="t-section section-title">How StreetKash earns</h2>
      <div className="about-grid three">
        {REVENUE.map((r) => (
          <section key={r.title} className="card">
            <h3 className="t-label" style={{ fontSize: '1.0625rem' }}>{r.title}</h3>
            <p className="t-body muted" style={{ marginTop: 'var(--s2)' }}>{r.text}</p>
          </section>
        ))}
      </div>

      <h2 className="t-section section-title">Where StreetKash is going</h2>
      <div className="about-grid three">
        {GROWTH.map((g) => (
          <section key={g.label} className="card">
            <p className="t-caption">{g.label}</p>
            <h3 className="t-label" style={{ fontSize: '1.0625rem', marginTop: 4 }}>{g.title}</h3>
            <p className="t-body muted" style={{ marginTop: 'var(--s2)' }}>{g.text}</p>
          </section>
        ))}
      </div>

      <section className="card" style={{ marginTop: 'var(--s5)' }}>
        <p className="t-caption">
          <Icon name="info" size={14} /> The operator dashboard uses simulated figures for demonstration.
        </p>
        <a className="link-btn" href="#/operator" style={{ marginTop: 'var(--s2)' }}>
          See the dashboard <Icon name="arrow" size={16} />
        </a>
      </section>
    </main>
  )
}
