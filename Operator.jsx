import { useMemo, useState } from 'react'
import BarChart from './BarChart.jsx'
import LineChart from './LineChart.jsx'
import Spark from './Spark.jsx'
import Icon from './Icons.jsx'
import StatusBadge from './StatusBadge.jsx'
import {
  DEMO_BANNER,
  NOW_MIN,
  RANGES,
  dayLabel,
  fmtTime,
  getDataSeries,
  getIncidents,
  getInsights,
  getInvestigate,
  getMetrics,
  getSpeedSeries,
  getUsageSeries,
  incidentLabel,
  periodLabel,
} from './demoData.js'

function Metric({ icon, label, value, unit, def, spark }) {
  return (
    <div className="card metric">
      <p className="m-label"><Icon name={icon} size={16} />{label}</p>
      <p className="t-metric m-value">
        {value}
        {unit && <span className="m-unit">{unit}</span>}
      </p>
      <p className="t-caption">{def}</p>
      {spark && <Spark values={spark} />}
    </div>
  )
}

export default function Operator() {
  const [range, setRange] = useState('today')
  const m = useMemo(() => getMetrics(range), [range])
  const usage = useMemo(() => getUsageSeries(range), [range])
  const speed = useMemo(() => getSpeedSeries(range), [range])
  const dataSeries = useMemo(() => getDataSeries(range), [range])
  const incidents = useMemo(() => getIncidents(range), [range])
  const insights = useMemo(() => getInsights(range), [range])
  const investigate = useMemo(() => getInvestigate(range), [range])
  const today = range === 'today'
  const peak = usage.reduce((best, d, i) => (d.value > usage[best].value ? i : best), 0)
  const unitWord = today ? 'hour' : 'day'
  const period = periodLabel(range)

  return (
    <main>
      {/* A. Header and selected period */}
      <div className="dash-band">
        <div className="dash-band-inner">
          <div className="stack-3">
            <p className="band-eyebrow">Operator view · proposed Nenoti Posta pilot</p>
            <h1 className="t-page">Service dashboard</h1>
            <p className="band-sub">{period}</p>
            <div className="note note-dark" role="note">
              <Icon name="info" size={18} />
              <span>{DEMO_BANNER}</span>
            </div>
          </div>
          <div className="seg seg-dark" role="group" aria-label="Time range">
            {RANGES.map((r) => (
              <button key={r.id} aria-pressed={range === r.id} onClick={() => setRange(r.id)}>
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="page dash-body">
        {/* B. Summary metrics */}
        <section className="metrics" aria-label="Summary metrics (simulated)">
          <Metric icon="users" label="Active now" value={m.activeNow} unit="sessions" def={`Open at ${fmtTime(NOW_MIN)} demo time`} />
          <Metric icon="activity" label="Sessions" value={m.sessions.toLocaleString()} unit="started" def={today ? 'Today so far' : 'Across 7 demo days'} spark={usage.map((d) => d.value)} />
          <Metric icon="database" label="Data used" value={m.dataGB.toFixed(1)} unit="GB" def="All sessions in period" spark={dataSeries} />
          <Metric icon="gauge" label="Average speed" value={m.avgSpeed.toFixed(1)} unit="Mbps" def="Mean of session speeds" spark={speed.map((d) => d.value)} />
          <Metric icon="clock" label="Uptime" value={m.uptime.toFixed(1)} unit="%" def={`${m.downMinutes} min service-wide outage`} />
          <Metric icon="alert" label="Incidents" value={m.incidents} unit="logged" def="Outages and slowdowns" />
        </section>

        {/* C and D. Usage and performance trends */}
        <h2 className="t-section section-title">Demand and performance</h2>
        <div className="grid-2">
          <section className="card chart-card" aria-labelledby="usage-title">
            <h3 id="usage-title" className="t-section">Sessions started per {unitWord}</h3>
            <p className="t-caption">Number of sessions · {period}</p>
            <div className="legend" aria-hidden="true">
              <span><i className="sw" style={{ background: '#0f766e' }} />Sessions</span>
              <span><i className="sw" style={{ background: '#102a43' }} />Busiest {unitWord}</span>
            </div>
            <BarChart
              data={usage}
              highlight={peak}
              yLabel="Sessions started"
              xLabel={today ? 'Hour of day (demo time)' : 'Demo day'}
              describe={`Bar chart of simulated sessions started per ${unitWord}. Total ${m.sessions}.`}
            />
            <p className="t-caption hint">Hover or tap a bar for its exact value.</p>
          </section>

          <section className="card chart-card" aria-labelledby="speed-title">
            <h3 id="speed-title" className="t-section">Average speed per {unitWord}</h3>
            <p className="t-caption">Mean session speed in Mbps · {period}</p>
            <div className="legend" aria-hidden="true">
              <span><i className="sw sw-line" style={{ background: '#0f766e' }} />Average speed</span>
              <span><i className="sw" style={{ background: '#dcece7', border: '1px solid #b9d6cd' }} />Busiest {unitWord} for sessions</span>
            </div>
            <LineChart
              data={speed}
              highlight={speed[peak] && speed[peak].value != null ? peak : -1}
              unit="Mbps"
              yLabel="Speed (Mbps)"
              xLabel={today ? 'Hour of day (demo time)' : 'Demo day'}
              describe={`Line chart of simulated average speed per ${unitWord}, in megabits per second.`}
            />
            <p className="t-caption hint">Gaps mean fewer than 3 sessions, too few to average.</p>
          </section>
        </div>

        {/* E and F. Incidents and interpretation */}
        <h2 className="t-section section-title">Incidents and interpretation</h2>
        <div className="grid-2 wide-left">
          <section className="card" aria-labelledby="inc-title">
            <h3 id="inc-title" className="t-section">Service incidents</h3>
            <p className="t-caption">
              A service-wide outage counts against uptime. Slowdowns and single access-point events are logged but do not.
            </p>
            {incidents.length === 0 ? (
              <div className="empty">
                <Icon name="check" size={28} />
                <p className="t-label">No incidents in this period</p>
              </div>
            ) : (
              <div className="table-wrap">
                <table className="incident-table">
                  <thead>
                    <tr><th>When (demo time)</th><th>Event</th><th>Affects</th><th>Minutes</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {incidents.map((i) => {
                      const lab = incidentLabel(i)
                      return (
                        <tr key={i.id}>
                          <td data-label="When" className="num">{dayLabel(i.day)} {fmtTime(i.start)}</td>
                          <td data-label="Event">
                            <span className="stack-3">
                              <StatusBadge kind={lab.tone} icon={lab.icon}>{lab.text}</StatusBadge>
                              <span className="t-caption" style={{ display: 'block' }}>{i.type}</span>
                            </span>
                          </td>
                          <td data-label="Affects">{i.scope === 'All' ? 'Whole service' : i.scope}</td>
                          <td data-label="Minutes" className="num">{i.minutes}{i.ongoing ? ' so far' : ''}</td>
                          <td data-label="Status">
                            {i.ongoing ? <StatusBadge kind="warning" icon="clock">Monitoring</StatusBadge> : <StatusBadge kind="neutral">Resolved</StatusBadge>}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="card" aria-labelledby="insight-title">
            <h3 id="insight-title" className="t-section">What the data may suggest</h3>
            <div style={{ marginTop: 'var(--s2)' }}>
              <StatusBadge kind="simulated">Illustrative, not a measured finding</StatusBadge>
            </div>
            <ul className="insight-list">
              {insights.map((t) => (
                <li key={t}><Icon name="bulb" size={18} /><span>{t}</span></li>
              ))}
            </ul>
            <div className="sub-head">
              <h4 className="t-label" style={{ margin: 0 }}>What an operator might investigate</h4>
              <ul className="insight-list">
                {investigate.map((t) => (
                  <li key={t}><Icon name="search" size={18} /><span>{t}</span></li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
