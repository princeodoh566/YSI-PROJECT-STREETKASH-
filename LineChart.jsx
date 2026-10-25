import { useEffect, useRef, useState } from 'react'

// Dependency-free responsive line chart (SVG) for a value that can be missing (null).
// A mint band marks the busiest period so the reader can compare it with the line.
export default function LineChart({ data, yLabel, xLabel, unit, describe, highlight = -1, height = 260 }) {
  const ref = useRef(null)
  const [width, setWidth] = useState(320)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const update = () => setWidth(Math.max(260, Math.floor(el.clientWidth)))
    update()
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', update)
      return () => window.removeEventListener('resize', update)
    }
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const m = { top: 12, right: 12, bottom: 46, left: 44 }
  const iw = width - m.left - m.right
  const ih = height - m.top - m.bottom
  const vals = data.map((d) => d.value).filter((v) => v != null)
  const yMax = Math.max(4, Math.ceil(Math.max(...vals, 1) / 4) * 4) // multiples of 4 so 4 gridlines are whole numbers
  const ticks = [0, 1, 2, 3, 4].map((i) => (yMax / 4) * i)
  const slot = iw / data.length
  const x = (i) => m.left + i * slot + slot / 2
  const y = (v) => m.top + ih - (v / yMax) * ih
  const every = Math.max(1, Math.ceil(30 / slot))

  // break the line wherever a value is missing
  const segments = []
  let cur = []
  data.forEach((d, i) => {
    if (d.value == null) {
      if (cur.length) segments.push(cur)
      cur = []
    } else cur.push([x(i), y(d.value)])
  })
  if (cur.length) segments.push(cur)

  return (
    <div ref={ref} className="chart-wrap">
      <svg width={width} height={height} role="img" aria-label={describe}>
        {highlight >= 0 && (
          <rect x={m.left + highlight * slot} y={m.top} width={slot} height={ih} fill="#dcece7" />
        )}
        {ticks.map((tk) => (
          <g key={tk}>
            <line x1={m.left} x2={width - m.right} y1={y(tk)} y2={y(tk)} stroke="#d9e2ec" />
            <text x={m.left - 8} y={y(tk) + 4} textAnchor="end" fontSize="12" fill="#526579">{tk}</text>
          </g>
        ))}
        {segments.map((seg, i) =>
          seg.length > 1 ? (
            <polyline key={i} points={seg.map((p) => p.join(',')).join(' ')} fill="none" stroke="#0f766e" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
          ) : null,
        )}
        {data.map((d, i) =>
          d.value == null ? null : (
            <circle key={d.title} cx={x(i)} cy={y(d.value)} r="3.5" fill="#fff" stroke="#0f766e" strokeWidth="2">
              <title>{`${d.title}: ${d.value.toFixed(1)} ${unit}`}</title>
            </circle>
          ),
        )}
        {data.map((d, i) =>
          i % every === 0 ? (
            <text key={`l${i}`} x={x(i)} y={m.top + ih + 16} textAnchor="middle" fontSize="12" fill="#526579">{d.label}</text>
          ) : null,
        )}
        <text x={12} y={m.top + ih / 2} transform={`rotate(-90 12 ${m.top + ih / 2})`} textAnchor="middle" fontSize="12" fill="#526579">{yLabel}</text>
        <text x={m.left + iw / 2} y={height - 6} textAnchor="middle" fontSize="12" fill="#526579">{xLabel}</text>
      </svg>
      <div className="sr-only">
        <table>
          <caption>{describe}</caption>
          <thead><tr><th>Period</th><th>{yLabel}</th></tr></thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.title}><td>{d.title}</td><td>{d.value == null ? 'Too few sessions' : d.value.toFixed(1)}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
