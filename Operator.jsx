import { useMemo, useState } from 'react'
import BarChart from './BarChart.jsx'
import {
  RANGES,
  dayLabel,
  fmtTime,
  getIncidents,
  getInsights,
  getMetrics,
  getUsageSeries,
  periodLabel,
} from './demoData.js'

function Metric({ label, value, unit, def }) {
  return (
    <div className="card metric">
      <p className="label">{label}</p>
      <p className="value">
        {value}
        {unit && <small>{unit}</small>}
      </p>
      <p className="def">{def}</p>
    </div>
  )
}

export default function Operator() {
  const [range, setRange] = useState('today')
  const m = useMemo(() => getMetrics(range), [range])
  const series = useMemo(() => getUsageSeries(range), [range])
  const incidents = useMemo(() => getIncidents(range), [range])
  const insights = useMemo(() => getInsights(range), [range])
  const peak = series.reduce((best, d, i) => (d.value > series[best].value ? i : best), 0)
  const today = range === 'today'

  return (
    <main className="page">
      <div className="page-head">
        <div>
          <p className="eyebrow">Operator view · internal demo, no login</p>
          <h1>Service monitoring</h1>
          <p className="muted small">{periodLabel(range)}</p>
        </div>
        <div className="seg" role="group" aria-label="Time range">
          {RANGES.map((r) => (
            <button key={r.id} aria-pressed={range === r.id} onClick={() => setRange(r.id)}>
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <section className="metrics" aria-label="Key metrics (simulated)">
        <Metric label="Active now" value={m.activeNow} unit="sessions" def="Open sessions at 17:30 demo time" />
        <Metric label="Sessions started" value={m.sessions.toLocaleString()} unit="sessions" def={today ? 'Today so far' : 'Across the 7 demo days'} />
        <Metric label="Data used" value={m.dataGB.toFixed(1)} unit="GB" def="All sessions in the period" />
        <Metric label="Average speed" value={m.avgSpeed.toFixed(1)} unit="Mbps" def="Mean of session averages" />
        <Metric label="Uptime" value={m.uptime.toFixed(1)} unit="%" def={`Minutes without a service-wide outage (${m.downMinutes} min down)`} />
        <Metric label="Incidents" value={m.incidents} unit="logged" def="Outages and slowdowns in the period" />
      </section>

      <div className="grid-main">
        <section className="card" aria-labelledby="usage-title">
          <h2 id="usage-title">{today ? 'Sessions started per hour' : 'Sessions started per day'}</h2>
          <p className="muted small">{periodLabel(range)} · simulated · darkest bar is the busiest</p>
          <BarChart
            data={series}
            highlight={peak}
            yLabel="Sessions"
            xLabel={today ? 'Hour of day (demo time)' : 'Demo day'}
            describe={`Bar chart of simulated sessions started per ${today ? 'hour' : 'day'}. Total ${m.sessions}.`}
          />
        </section>

        <section className="card" aria-labelledby="insight-title">
          <h2 id="insight-title">What this data suggests</h2>
          <p className="muted small">Computed from the simulated data only. Not a finding about any real site.</p>
          <ul className="insights">
            {insights.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <p className="small" style={{ marginTop: 'var(--s3)' }}>
            <strong>How an operator could use this:</strong> if real measurements ever showed speed falling at the
            busiest hour, the next step would be to check backhaul capacity, access-point placement, interference
            and demand before spending on upgrades.
          </p>
        </section>

        <section className="card span-2" aria-labelledby="inc-title">
          <h2 id="inc-title">Service incidents</h2>
          <p className="muted small">Simulated log. A service-wide outage counts against uptime; slowdowns and single access-point events do not.</p>
          <div className="table-wrap">
            <table className="incident-table">
              <thead>
                <tr><th>ID</th><th>When (demo time)</th><th>Type</th><th>Affects</th><th>Minutes</th><th>Status</th></tr>
              </thead>
              <tbody>
                {incidents.map((i) => (
                  <tr key={i.id}>
                    <td data-label="ID" className="num">{i.id}</td>
                    <td data-label="When" className="num">{dayLabel(i.day)} {fmtTime(i.start)}</td>
                    <td data-label="Type">{i.type}</td>
                    <td data-label="Affects">{i.scope === 'All' ? 'Whole service' : i.scope}</td>
                    <td data-label="Minutes" className="num">{i.minutes}{i.ongoing ? ' so far' : ''}</td>
                    <td data-label="Status">
                      <span className={`pill ${i.ongoing ? 'warn' : 'grey'}`}>{i.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  )
}
