import Icon from './Icons.jsx'

// One status vocabulary used everywhere, always with an icon AND a text label:
//   proposed  = a planned idea, nothing built or confirmed
//   simulated = shown for demonstration with generated data
//   live      = a confirmed, working real service (none exists yet, so it is never shown)
//   warning   = something an operator should look at
//   neutral   = informational, e.g. resolved
const KINDS = {
  proposed: { icon: 'planned', cls: 'badge-proposed' },
  simulated: { icon: 'info', cls: 'badge-simulated' },
  live: { icon: 'check', cls: 'badge-live' },
  warning: { icon: 'alert', cls: 'badge-warning' },
  neutral: { icon: 'check', cls: 'badge-neutral' },
  built: { icon: 'check', cls: 'badge-built' }, // exists in the prototype software (not a live service)
}

export default function StatusBadge({ kind = 'neutral', icon, children }) {
  const k = KINDS[kind]
  return (
    <span className={`badge ${k.cls}`}>
      <Icon name={icon || k.icon} size={14} />
      {children}
    </span>
  )
}
