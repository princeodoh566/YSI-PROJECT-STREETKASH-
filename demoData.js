// StreetKash — centralised SIMULATED demo dataset.
// Every figure in the passenger and operator views is derived from this file.
// Nothing here is measured at, or about, any real location. It is generated
// from a fixed seed so it is identical on every load and refresh.

export const DEMO_BANNER =
  'Figures on this dashboard are simulated for demonstration.'

export const SITE = {
  name: 'Prof. Nnenna Oti Central Bus Terminal',
  place: 'Umuahia, Abia State, Nigeria',
}

export const DAYS = 7 // simulated days, the last one is "today"
export const TODAY = DAYS - 1
export const NOW_MIN = 17 * 60 + 30 // simulated "now" = 17:30 on the last day
export const ACCESS_POINTS = ['AP-01', 'AP-02', 'AP-03'] // example identifiers only

export const fmtTime = (min) =>
  `${String(Math.floor(min / 60) % 24).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`

export const dayLabel = (day) => (day === TODAY ? 'Today' : `Day ${day + 1}`)

// ---------- seeded random helpers ----------
function mulberry32(a) {
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const rand = mulberry32(2026)
const normal = () => {
  const u = 1 - rand()
  const v = rand()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}
const poisson = (lambda) => {
  const L = Math.exp(-lambda)
  let k = 0
  let p = 1
  do {
    k++
    p *= rand()
  } while (p > L)
  return k - 1
}
const clamp = (x, lo, hi) => Math.min(hi, Math.max(lo, x))

// ---------- incidents (hand-written so they stay stable and explainable) ----------
// kind: 'outage' | 'degraded'; scope: 'All' (service-wide) or an access point.
const t = (h, m) => h * 60 + m
const RAW_INCIDENTS = [
  { id: 'INC-001', day: 1, start: t(13, 5), dur: 38, type: 'Backhaul interruption', scope: 'All', kind: 'outage' },
  { id: 'INC-002', day: 2, start: t(19, 20), dur: 5, type: 'Access point reboot', scope: 'AP-01', kind: 'outage' },
  { id: 'INC-003', day: 3, start: t(8, 10), dur: 40, type: 'Throughput degraded', scope: 'AP-03', kind: 'degraded' },
  { id: 'INC-004', day: 4, start: t(10, 30), dur: 4, type: 'Access point reboot', scope: 'AP-02', kind: 'outage' },
  { id: 'INC-005', day: 4, start: t(21, 45), dur: 22, type: 'Power fluctuation', scope: 'All', kind: 'outage' },
  { id: 'INC-006', day: 5, start: t(16, 15), dur: 30, type: 'Throughput degraded', scope: 'All', kind: 'degraded' },
  { id: 'INC-007', day: 6, start: t(9, 12), dur: 15, type: 'Backhaul interruption', scope: 'All', kind: 'outage' },
  { id: 'INC-008', day: 6, start: t(12, 40), dur: 4, type: 'Access point reboot', scope: 'AP-02', kind: 'outage' },
  { id: 'INC-009', day: 6, start: t(17, 5), dur: 40, type: 'Throughput degraded', scope: 'AP-03', kind: 'degraded' },
]

export const INCIDENTS = RAW_INCIDENTS.map((i) => {
  const ongoing = i.day === TODAY && i.start + i.dur > NOW_MIN
  return {
    ...i,
    ongoing,
    minutes: ongoing ? NOW_MIN - i.start : i.dur, // minutes elapsed so far if still open
    status: ongoing ? 'Monitoring' : 'Resolved',
  }
})

const serviceWideOutages = INCIDENTS.filter((i) => i.kind === 'outage' && i.scope === 'All')
const inServiceOutage = (day, minute) =>
  serviceWideOutages.some((i) => i.day === day && minute >= i.start && minute < i.start + i.dur)

// ---------- sessions ----------
// Expected session starts per hour of day on a typical day (illustrative shape).
const HOURLY_PROFILE = [
  1, 1, 0.5, 0.5, 1, 4, 10, 18, 22, 18, 14, 13, 15, 14, 14, 17, 21, 24, 20, 14, 9, 5, 3, 2,
]
const DAY_FACTOR = [0.92, 0.88, 0.95, 0.9, 1.0, 1.08, 0.85]

function buildSessions() {
  const out = []
  for (let day = 0; day < DAYS; day++) {
    for (let hour = 0; hour < 24; hour++) {
      const hourStart = hour * 60
      const lastMinute = day === TODAY ? Math.min(hourStart + 60, NOW_MIN) : hourStart + 60
      const span = lastMinute - hourStart
      if (span <= 0) continue
      const lambda = HOURLY_PROFILE[hour] * DAY_FACTOR[day]
      const n = poisson((lambda * span) / 60)
      for (let k = 0; k < n; k++) {
        const start = hourStart + Math.floor(rand() * span)
        if (inServiceOutage(day, start)) continue // no new sessions during a service-wide outage
        const planned = Math.round(clamp(Math.exp(Math.log(35) + 0.7 * normal()), 5, 180))
        const stillOpen = day === TODAY && start + planned > NOW_MIN
        const minutes = stillOpen ? NOW_MIN - start : planned
        const rate = clamp(Math.exp(Math.log(1.5) + 0.6 * normal()), 0.3, 8) // MB per minute
        // illustrative congestion effect: busier hours get slightly lower speeds
        const speed = clamp(11 - 0.13 * lambda + normal() * 1.4, 1.5, 20)
        out.push({
          day,
          hour,
          start,
          minutes,
          active: stillOpen,
          mb: minutes * rate,
          speed,
          ap: ACCESS_POINTS[Math.floor(rand() * ACCESS_POINTS.length)],
        })
      }
    }
  }
  out.sort((a, b) => a.day - b.day || a.start - b.start)
  out.forEach((s, i) => {
    s.id = `D${s.day + 1}-${String(i + 1).padStart(4, '0')}`
  })
  return out
}

export const SESSIONS = buildSessions()

// ---------- selectors used by the UI ----------
export const RANGES = [
  { id: 'today', label: 'Today' },
  { id: 'week', label: 'Last 7 days' },
]

export const periodLabel = (range) =>
  range === 'today'
    ? `Today, 00:00–${fmtTime(NOW_MIN)}`
    : `Last 7 days, to ${fmtTime(NOW_MIN)} today`

const periodMinutes = (range) => (range === 'today' ? NOW_MIN : TODAY * 1440 + NOW_MIN)
const sessionsIn = (range) => (range === 'today' ? SESSIONS.filter((s) => s.day === TODAY) : SESSIONS)
const incidentsIn = (range) => (range === 'today' ? INCIDENTS.filter((i) => i.day === TODAY) : INCIDENTS)

const mean = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0)

export function getMetrics(range) {
  const sessions = sessionsIn(range)
  const incidents = incidentsIn(range)
  const downMinutes = incidents
    .filter((i) => i.kind === 'outage' && i.scope === 'All')
    .reduce((a, i) => a + i.minutes, 0)
  const total = periodMinutes(range)
  return {
    // "active now" is a snapshot at the simulated current time, so it does not depend on the range
    activeNow: SESSIONS.filter((s) => s.active).length,
    sessions: sessions.length,
    dataGB: sessions.reduce((a, s) => a + s.mb, 0) / 1000,
    avgSpeed: mean(sessions.map((s) => s.speed)),
    uptime: (100 * (total - downMinutes)) / total,
    downMinutes,
    incidents: incidents.length,
  }
}

// Bars for the usage chart. Totals always equal getMetrics(range).sessions.
export function getUsageSeries(range) {
  if (range === 'today') {
    const hours = Math.floor(NOW_MIN / 60) + 1 // 0..17 inclusive
    return Array.from({ length: hours }, (_, h) => {
      const end = h === hours - 1 ? NOW_MIN : (h + 1) * 60
      return {
        label: String(h).padStart(2, '0'),
        value: SESSIONS.filter((s) => s.day === TODAY && s.hour === h).length,
        title: `${fmtTime(h * 60)}–${fmtTime(end)}`,
      }
    })
  }
  return Array.from({ length: DAYS }, (_, d) => ({
    label: d === TODAY ? 'Today' : `D${d + 1}`,
    value: SESSIONS.filter((s) => s.day === d).length,
    title: d === TODAY ? `Today (to ${fmtTime(NOW_MIN)})` : `Day ${d + 1}`,
  }))
}

export function getIncidents(range) {
  return incidentsIn(range)
    .slice()
    .sort((a, b) => b.day - a.day || b.start - a.start)
}

// Plain-language observations computed from the simulated data only.
export function getInsights(range) {
  const sessions = sessionsIn(range)
  const incidents = incidentsIn(range)
  const out = []

  const byHour = Array.from({ length: 24 }, (_, h) => sessions.filter((s) => s.hour === h))
  let peak = 0
  byHour.forEach((g, h) => {
    if (g.length > byHour[peak].length) peak = h
  })
  const peakGroup = byHour[peak]
  const rest = sessions.filter((s) => s.hour !== peak)
  const peakEnd = range === 'today' ? Math.min((peak + 1) * 60, NOW_MIN) : (peak + 1) * 60
  const share = Math.round((100 * peakGroup.length) / sessions.length)
  out.push(
    `Session starts are highest at ${fmtTime(peak * 60)}–${fmtTime(peakEnd)}: ${peakGroup.length} of ${sessions.length} sessions (${share}%).`,
  )
  out.push(
    `Mean session speed in that hour is ${mean(peakGroup.map((s) => s.speed)).toFixed(1)} Mbps, against ${mean(rest.map((s) => s.speed)).toFixed(1)} Mbps in other hours.`,
  )

  const outages = incidents.filter((i) => i.kind === 'outage' && i.scope === 'All')
  const longest = incidents.slice().sort((a, b) => b.minutes - a.minutes)[0]
  out.push(
    `${incidents.length} incidents recorded, ${outages.length} of them service-wide outage${outages.length === 1 ? '' : 's'} (${outages.reduce((a, i) => a + i.minutes, 0)} min in total). Longest: ${longest.type.toLowerCase()}, ${longest.minutes} min on ${longest.scope === 'All' ? 'the whole service' : longest.scope}.`,
  )
  return out
}

// Illustrative figures for the passenger session screen, taken from the same dataset.
export function getSessionExample() {
  const today = sessionsIn('today')
  return {
    ap: 'AP-02',
    speed: mean(today.map((s) => s.speed)),
    mbPerMinute: mean(today.map((s) => s.mb / s.minutes)),
  }
}

// ---------- additions for the redesigned dashboard (same dataset) ----------
const MIN_SESSIONS_FOR_SPEED = 3 // hours with fewer sessions are left blank instead of plotting noise

// Mean session speed per hour (today) or per day (7 days). value is null when there is too little data.
export function getSpeedSeries(range) {
  const group = (list) =>
    list.length >= MIN_SESSIONS_FOR_SPEED ? mean(list.map((s) => s.speed)) : null
  if (range === 'today') {
    const hours = Math.floor(NOW_MIN / 60) + 1
    return Array.from({ length: hours }, (_, h) => ({
      label: String(h).padStart(2, '0'),
      title: `${fmtTime(h * 60)}–${fmtTime(h === hours - 1 ? NOW_MIN : (h + 1) * 60)}`,
      value: group(SESSIONS.filter((s) => s.day === TODAY && s.hour === h)),
    }))
  }
  return Array.from({ length: DAYS }, (_, d) => ({
    label: d === TODAY ? 'Today' : `D${d + 1}`,
    title: d === TODAY ? `Today (to ${fmtTime(NOW_MIN)})` : `Day ${d + 1}`,
    value: group(SESSIONS.filter((s) => s.day === d)),
  }))
}

// Human label for an incident, so meaning never depends on colour alone.
export function incidentLabel(i) {
  if (i.kind === 'degraded') return { text: 'Slowdown', tone: 'warning', icon: 'gauge' }
  if (i.scope === 'All') return { text: 'Service outage', tone: 'warning', icon: 'x' }
  return { text: 'Access point outage', tone: 'warning', icon: 'alert' }
}

// Prompts for an operator, built from the simulated figures. These are questions to investigate, not findings.
export function getInvestigate(range) {
  const sessions = sessionsIn(range)
  const incidents = incidentsIn(range)
  const byHour = Array.from({ length: 24 }, (_, h) => sessions.filter((s) => s.hour === h).length)
  const peak = byHour.indexOf(Math.max(...byHour))
  const perAp = ACCESS_POINTS.map((ap) => ({ ap, n: sessions.filter((s) => s.ap === ap).length }))
  const busiestAp = perAp.slice().sort((a, b) => b.n - a.n)[0]
  const counts = {}
  incidents.forEach((i) => (counts[i.type] = (counts[i.type] || 0) + 1))
  const topType = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]
  return [
    `Is backhaul capacity enough between ${fmtTime(peak * 60)} and ${fmtTime((peak + 1) * 60)}, when session starts peak?`,
    `Is load balanced across access points? ${busiestAp.ap} carried ${Math.round((100 * busiestAp.n) / sessions.length)}% of sessions in this simulation.`,
    !topType
      ? 'No incidents in this period, so there is nothing to investigate yet.'
      : topType[1] > 1
        ? `"${topType[0]}" happened ${topType[1]} times in this period. Is there a common cause?`
        : `Was the "${topType[0].toLowerCase()}" an isolated event? Check its cause before it repeats.`,
  ]
}

// Data used (GB) per hour (today) or per day (7 days). Same sessions as every other figure.
export function getDataSeries(range) {
  if (range === 'today') {
    const hours = Math.floor(NOW_MIN / 60) + 1
    return Array.from({ length: hours }, (_, h) =>
      SESSIONS.filter((s) => s.day === TODAY && s.hour === h).reduce((a, s) => a + s.mb, 0) / 1000,
    )
  }
  return Array.from({ length: DAYS }, (_, d) =>
    SESSIONS.filter((s) => s.day === d).reduce((a, s) => a + s.mb, 0) / 1000,
  )
}
