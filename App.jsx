import { useEffect, useState } from 'react'
import { WifiIcon } from './Icons.jsx'
import { DEMO_BANNER } from './demoData.js'
import Operator from './Operator.jsx'
import Passenger from './Passenger.jsx'
import Status from './Status.jsx'

const ROUTES = {
  '/': { title: 'Passenger', label: 'Passenger', Page: Passenger },
  '/operator': { title: 'Operator', label: 'Operator', Page: Operator },
  '/status': { title: 'Status', label: 'Status', Page: Status },
}

const readRoute = () => {
  const path = window.location.hash.replace(/^#/, '') || '/'
  return ROUTES[path] ? path : '/'
}

export default function App() {
  const [route, setRoute] = useState(readRoute)
  const [runKey, setRunKey] = useState(0) // bumping this remounts the pages = restart the demo

  useEffect(() => {
    const onHash = () => setRoute(readRoute())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  useEffect(() => {
    document.title = `${ROUTES[route].title} · StreetKash demo`
    window.scrollTo(0, 0)
  }, [route])

  const restart = () => {
    setRunKey((k) => k + 1)
    if (window.location.hash !== '#/') window.location.hash = '#/'
    window.scrollTo(0, 0)
  }

  const { Page } = ROUTES[route]
  return (
    <>
      <div className="demo-banner" role="note">{DEMO_BANNER}</div>
      <header className="topbar">
        <div className="topbar-inner">
          <a className="brand" href="#/"><WifiIcon size={22} />StreetKash</a>
          <nav className="nav" aria-label="Demo views">
            {Object.entries(ROUTES).map(([path, r]) => (
              <a key={path} href={`#${path}`} aria-current={route === path ? 'page' : undefined}>
                {r.label}
              </a>
            ))}
          </nav>
        </div>
      </header>
      <Page key={`${route}-${runKey}`} />
      <footer className="footer">
        <span>YSI Cohort 1 · early-stage concept. No live network exists yet.</span>
        <button className="btn btn-secondary auto" onClick={restart}>Restart demo</button>
      </footer>
    </>
  )
}
