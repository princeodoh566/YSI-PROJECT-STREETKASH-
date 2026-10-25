const base = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
}

export const WifiIcon = ({ size = 24 }) => (
  <svg {...base} width={size} height={size}>
    <path d="M2 8.8a15 15 0 0 1 20 0" />
    <path d="M5.5 12.4a10 10 0 0 1 13 0" />
    <path d="M9 16a5 5 0 0 1 6 0" />
    <circle cx="12" cy="19.5" r="0.8" fill="currentColor" />
  </svg>
)

export const CheckIcon = ({ size = 24 }) => (
  <svg {...base} width={size} height={size}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
)

export const PinIcon = ({ size = 18 }) => (
  <svg {...base} width={size} height={size}>
    <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)
