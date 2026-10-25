# StreetKash MVP (concept demo)

Front-end only demo for the YSI Cohort 1 project. Every figure is SIMULATED.
No Wi-Fi network exists, nothing is measured, and nothing connects to the internet.

## Run
    npm install
    npm run dev      # open the printed URL (works on your phone via the Network URL)
    npm run build    # static files in dist/ (hash routing, can be hosted anywhere)

## Views
- `#/`          Passenger: proposed site, simulated availability, demo connection journey
- `#/operator`  Operator (internal demo, no login): metrics, usage chart, incidents, Today / Last 7 days filter
- `#/status`    What is existing, simulated, proposed, and still to be validated

## Data
All figures come from `demoData.js` (seeded, so identical on every load).
- Uptime = share of minutes without a service-wide outage.
- "Active now" is a snapshot at 17:30 demo time and is a subset of today's sessions.
- Passenger session screen uses a demo clock (1 second = 1 minute).

## Not built (later)
Real captive portal, real telemetry, authentication, payments, multiple sites.
