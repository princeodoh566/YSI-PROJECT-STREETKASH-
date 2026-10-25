import { useEffect, useRef, useState } from 'react'

// Dependency-free responsive bar chart (SVG). Draws at the real pixel width of
// its container so labels stay legible on a phone.

function niceMax(v) {
  if (v <= 5) return 5
  const pow = Math.pow(10, Math.floor(Math.log10(v)))
  const n = v / pow
  const step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10
  return step * pow
}

export default function BarChart({ data, yLabel, xLabel, describe, highlight = -1, height = 260 }) {
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

  const m = { top: 12, right: 8, bottom: 46, left: 44 }
  const iw = width - m.left - m.right
  const ih = height - m.top - m.bottom
  const maxVal = niceMax(Math.max(1, ...data.map((d) => d.value)))
  const ticks = [0, 1, 2, 3, 4].map((i) => (maxVal / 4) * i)
  const slot = iw / data.length
  const barW = Math.max(4, slot * 0.7)
  const every = Math.max(1, Math.ceil(30 / slot)) // x-label spacing so labels never collide
  const y = (v) => m.top + ih - (v / maxVal) * ih

  return (
    <div ref={ref} className="chart-wrap">
      <svg width={width} height={height} role="img" aria-label={describe}>
        {ticks.map((tk) => (
          <g key={tk}>
            <line x1={m.left} x2={width - m.right} y1={y(tk)} y2={y(tk)} stroke="#d9e2ec" />
            <text x={m.left - 8} y={y(tk) + 4} textAnchor="end" fontSize="12" fill="#526579">
              {Number.isInteger(tk) ? tk : tk.toFixed(1)}
            </text>
          </g>
        ))}
        {data.map((d, i) => {
          const x = m.left + i * slot + (slot - barW) / 2
          const h = (d.value / maxVal) * ih
          return (
            <g key={d.title}>
              <rect
                x={x}
                y={y(d.value)}
                width={barW}
                height={h}
                rx="2"
                fill={i === highlight ? '#102a43' : '#0f766e'}
              >
                <title>{`${d.title}: ${d.value} ${yLabel.toLowerCase()}`}</title>
              </rect>
              {i % every === 0 && (
                <text x={x + barW / 2} y={m.top + ih + 16} textAnchor="middle" fontSize="12" fill="#526579">
                  {d.label}
                </text>
              )}
            </g>
          )
        })}
        <text
          x={12}
          y={m.top + ih / 2}
          transform={`rotate(-90 12 ${m.top + ih / 2})`}
          textAnchor="middle"
          fontSize="12"
          fill="#526579"
        >
          {yLabel}
        </text>
        <text x={m.left + iw / 2} y={height - 6} textAnchor="middle" fontSize="12" fill="#526579">
          {xLabel}
        </text>
      </svg>
      <div className="sr-only">
        <table>
          <caption>{describe}</caption>
          <thead>
            <tr><th>Period</th><th>{yLabel}</th></tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.title}><td>{d.title}</td><td>{d.value}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
