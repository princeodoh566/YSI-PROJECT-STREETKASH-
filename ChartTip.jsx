// SVG tooltip used by both charts. Placed above the point and kept inside the plot area.
export default function ChartTip({ x, y, minX, maxX, title, text }) {
  const w = Math.max(title.length, text.length) * 7 + 22
  const h = 46
  const bx = Math.min(Math.max(x - w / 2, minX), maxX - w)
  const by = y - h - 10 < 2 ? y + 12 : y - h - 10
  return (
    <g pointerEvents="none">
      <rect x={bx} y={by} width={w} height={h} rx="8" fill="#102a43" />
      <text x={bx + 11} y={by + 19} fontSize="12" fill="#b9c8d6">{title}</text>
      <text x={bx + 11} y={by + 37} fontSize="13" fontWeight="600" fill="#ffffff">{text}</text>
    </g>
  )
}
