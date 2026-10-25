// Tiny decorative trend line for a metric card. The exact numbers are in the charts below.
export default function Spark({ values }) {
  const v = values.filter((x) => x != null)
  if (v.length < 2) return null
  const w = 100, h = 32, pad = 3
  const lo = Math.min(...v), hi = Math.max(...v)
  const span = hi - lo || 1
  const pts = v.map((x, i) => [(i / (v.length - 1)) * w, pad + (1 - (x - lo) / span) * (h - pad * 2)])
  const line = pts.map((p) => p.map((n) => n.toFixed(1)).join(',')).join(' ')
  return (
    <svg className="spark" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <polygon points={`0,${h} ${line} ${w},${h}`} fill="#0f766e" opacity="0.1" />
      <polyline points={line} fill="none" stroke="#0f766e" strokeWidth="1.8" vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}
