# StreetKash MVP (concept demo)

Front-end only demo for YSI Cohort 1. Every figure is SIMULATED. No Wi-Fi network exists,
nothing is measured, and nothing connects to the internet.

## Run
    npm install
    npm run dev
    npm run build

## Views (hash routes, no server config needed)
- `#/`          Passenger: concept, service status (simulated vs proposed), demo session journey
- `#/operator`  Operator dashboard: 6 metrics, sessions chart, speed trend, incidents, interpretation
- `#/about`     What is built, simulated, proposed and still to be validated (`#/status` still works)

## Files
- `demoData.js`  the single seeded simulated dataset; all figures derive from it
- `styles.css`   design tokens and components (navy / teal / mint / amber palette, Inter with system fallback)
- `Icons.jsx`    one Lucide-style icon set drawn inline (no extra package)
- `StatusBadge.jsx` proposed / simulated / live / warning vocabulary, always icon + text

## Data rules
Uptime = share of minutes without a service-wide outage. "Active now" is a snapshot at 17:30 demo time.
Passenger session screen uses a demo clock (1 second = 1 minute).

## Not built
Real captive portal, real telemetry, authentication, payments, multiple sites.
