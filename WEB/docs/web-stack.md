# Web Stack

**JavaScript is the main programming language** for browser code and the live telemetry backend. HTML defines the pages, and shared CSS handles layout and styling. See [Site Structure](structure.md) for the page hierarchy.

## Frontend

| Technology | Role |
| --- | --- |
| HTML and CSS | Home and Tech are ordinary HTML pages with shared CSS. Add small JavaScript modules only where a feature needs them. Telemetry uses the same page structure and styles. |
| JavaScript | On Telemetry, load the selected flight, parse its CSV, and update the dashboard. When live telemetry is available, fetch new samples from the API. |
| Apache ECharts | Plot timestamped sensor readings in the browser for both CSV recordings and live telemetry. |
| React | Optional JavaScript UI library for Telemetry. If coordinating the dataset selector, playback timeline, charts, and table becomes difficult, React can manage their shared state. The first version uses plain JavaScript. |

## Serving the site

Express serves the HTML, CSS, JavaScript, and assets directly. Edit `header.html` or
`footer.html` to update the shared layout across Home, Tech, and Telemetry.
The browser fetches the sample CSV and plots it on the Telemetry page.
**Live** shows **Disconnected** until a live API is available.

### Local development

```sh
npm ci
npm run dev
```

Run these commands from `WEB/`, then open `http://127.0.0.1:3000`. Development
mode restarts Node when server code changes. Refresh the browser to see edits
to HTML, CSS, or browser JavaScript.

### Deployment

Run `npm ci --omit=dev` and `npm start` from `WEB/`. Express serves the source
files directly. It listens on `127.0.0.1:3000` by default, and the `HOST` and
`PORT` environment variables can override those settings. On the VPS, leave
Express on loopback and point the reverse proxy at it. On the flight PC, set
`HOST` to its LAN address if other devices need to connect.

## Live telemetry

| Technology | Role |
| --- | --- |
| Node.js | Run the JavaScript backend on the public server. |
| Express | Provide an authenticated HTTPS endpoint for the ground station to submit readings and a public read-only endpoint for browsers to fetch new samples. Backend code validates incoming readings before storing them. |
| SQLite | Store incoming live samples. The read endpoint returns samples added since the browser's last request. |

The dashboard will poll the read endpoint while **Live** is selected. It will use the same chart code for live samples and CSV recordings. The same Express app can run on the public server and flight PC. Deployment settings will determine where a live API is available.

## Launch-day deployment options

| Option | How it would work |
| --- | --- |
| Public live feed | If venue internet is reliable, the ground station sends readings to the public Express API over HTTPS. The public site can serve the frontend and read API under the same domain. |
| Local live feed | Run Express, SQLite, and the same frontend on the ground-station machine or a laptop on the launch network. People on that network can view the live dashboard. The public site shows **Disconnected** until recorded data is published. |

In either setup, the ground station should record readings locally throughout the flight so an internet outage does not interrupt the recording. For the public setup, enable the upload endpoint only during tests and launch, require a credential held by the ground station, and limit request size and rate. The public read endpoint can serve the dashboard independently. For local operation, keep the upload endpoint on the launch network or on the ground-station machine itself.

## Open questions

- The team will define the ground-station-to-server protocol. The fields, units, timestamp format, and wire format are open, including whether the ground station sends structured messages or uploads files.
- The send frequency and whether readings are sent individually or in batches are also open. We can build the dummy CSV dashboard before deciding these details.
- After testing the venue connection, decide whether launch day uses the public live API or the local setup.
- Who will publish the recorded flight CSVs?
