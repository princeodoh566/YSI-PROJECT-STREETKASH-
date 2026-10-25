import { Component, useEffect, useState } from 'react'
import Icon from './Icons.jsx'
import { DEMO_BANNER } from './demoData.js'
import About from './About.jsx'
import Operator from './Operator.jsx'
import Passenger from './Passenger.jsx'

// Two main views. "About" lives in the footer because it explains the prototype rather than being part of the product.
const ROUTES = {
  '/': { title: 'Passenger', Page: Passenger, nav: 'Passenger' },
  '/operator': { title: 'Operator dashboard', Page: Operator, nav: 'Operator' },
  '/about': { title: 'About this prototype', Page: About },
}
const ALIASES = { '/status': '/about' } // the old Status page now lives at /about

const readRoute = () => {
  const raw = window.location.hash.replace(/^#/, '') || '/'
  const path = ALIASES[raw] || raw
  return ROUTES[path] ? path : '/'
}

class Boundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() {
    if (!this.state.failed) return this.props.children
    return (
      <main className="page narrow">
        <div className="card pad-lg stack-4">
          <h1 className="t-page">Something went wrong</h1>
          <p className="muted">This screen could not be shown. Restarting the demo usually fixes it.</p>
          <button className="btn btn-primary" onClick={this.props.onRestart}>Restart demo</button>
        </div>
      </main>
    )
  }
}

export default function App() {
  const [route, setRoute] = useState(readRoute)
  const [runKey, setRunKey] = useState(0) // bumping this remounts the page = restart the demo

  useEffect(() => {
    const onHash = () => setRoute(readRoute())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  useEffect(() => {
    document.title = `${ROUTES[route].title} · StreetKash`
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
      <header className="topbar">
        <div className="topbar-inner">
          <a className="brand" href="#/" aria-label="StreetKash home">
            <span className="brand-mark"><Icon name="wifi" size={18} /></span>
            StreetKash
          </a>
          <nav className="nav" aria-label="Main">
            {Object.entries(ROUTES).filter(([, r]) => r.nav).map(([path, r]) => (
              <a key={path} href={`#${path}`} aria-current={route === path ? 'page' : undefined}>{r.nav}</a>
            ))}
          </nav>
        </div>
      </header>
      <Boundary key={`${route}-${runKey}`} onRestart={restart}>
        <Page />
      </Boundary>
      <footer className="footer">
        <div className="footer-inner">
          <p className="t-caption">{DEMO_BANNER}</p>
          <div className="footer-links">
            <a className="link-btn" href="#/about">About this prototype</a>
            <button className="link-btn" onClick={restart}><Icon name="reset" size={16} />Restart demo</button>
          </div>
        </div>
      </footer>
    </>
  )
}
