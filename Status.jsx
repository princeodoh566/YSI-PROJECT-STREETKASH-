const GROUPS = [
  {
    name: 'Existing in this demo',
    tone: '',
    note: 'Works in the software today. All of it is front-end only.',
    items: [
      'Passenger journey: start, simulated connection, session screen, end',
      'Operator view with summary metrics, usage chart, incident table and time-range filter',
      'One shared simulated dataset behind every figure',
    ],
  },
  {
    name: 'Demonstrated with simulated data',
    tone: 'warn',
    note: 'Visible on screen, but the numbers are generated, not measured.',
    items: [
      'Sessions, active sessions, data use, speed and uptime',
      'Incident log and the observations drawn from it',
    ],
  },
  {
    name: 'Proposed',
    tone: 'grey',
    note: 'Intended for a later stage. Not built.',
    items: [
      'Internet backhaul, router and Wi-Fi access point at a real site',
      'Optional solar and battery power, subject to feasibility',
      'Real captive portal and access or usage limits',
      'Live telemetry from network equipment into the dashboard',
    ],
  },
  {
    name: 'To be validated',
    tone: 'bad',
    note: 'Assumptions that need field research, tests or partner and cost checks.',
    items: [
      'Permission to use and measure the proposed site',
      'Real connectivity baseline by provider, place and time of day',
      'Whether passengers want and would trust a shared Wi-Fi service',
      'Equipment, power and connectivity costs, and a sustainable operating model',
      'Privacy and security requirements',
    ],
  },
]

export default function Status() {
  return (
    <main className="page narrow stack">
      <section className="hero">
        <p className="eyebrow">Honest status</p>
        <h1>What is built, and what is not</h1>
        <p>StreetKash is an early-stage investigation. There is no live network and no field data yet.</p>
      </section>
      {GROUPS.map((g) => (
        <section key={g.name} className="card">
          <h2><span className={`pill ${g.tone}`}>{g.name}</span></h2>
          <p className="muted small" style={{ marginTop: 'var(--s2)' }}>{g.note}</p>
          <ul style={{ margin: 'var(--s3) 0 0', paddingLeft: '1.1rem' }}>
            {g.items.map((t) => (
              <li key={t} style={{ marginBottom: 6 }}>{t}</li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  )
}
