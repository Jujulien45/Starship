# Web Stack

**JavaScript is the main programming language** for browser code and the live telemetry backend. HTML defines the pages, and shared CSS handles layout and styling. See [Site Structure](structure.md) for the page hierarchy.

## Frontend

| Technology | Role |
| --- | --- |
| HTML and CSS | Home and Engineering are ordinary HTML pages with shared CSS. Add small JavaScript modules only where a feature needs them. Telemetry uses the same page structure and styles. |
| JavaScript | On Telemetry, load the selected flight, parse its CSV, and update the dashboard. When live telemetry is available, fetch new samples from the API. |
| Vite | Run the local development server and build the three pages and their assets for deployment. |
| Apache ECharts | Plot timestamped sensor readings in the browser for both CSV recordings and live telemetry. |
| React | Optional JavaScript UI library for Telemetry. If coordinating the dataset selector, playback timeline, charts, and table becomes difficult, React can manage their shared state. The first version uses plain JavaScript. |

## Static release

Home and Engineering use static HTML and shared CSS. Edit `header.html` and `footer.html` to update both pages. Vite inserts these shared files when it serves or builds either page. The shared `site.js` handles the theme switcher and marks the current page in the main navigation. CSS shows its section links, and the browser follows the section anchors. ECharts is planned for the Telemetry milestone.

### Local development

Run these commands from `WEB/`:

```sh
npm ci
npm run dev
```

Open the URL Vite prints for Home and append `/engineering.html` for Engineering. Run `npm run build` to generate the deployable static files in `dist/`, then `npm run preview` to check that build locally.

Publish the three pages, a dataset list, and the dummy or recorded flight CSVs as static files. The browser loads the selected CSV and displays it in the shared dashboard. **Live** shows **Disconnected** before launch. The first milestone is selecting a dummy flight and seeing its readings plotted.

## Live telemetry

| Technology | Role |
| --- | --- |
| Node.js | Run the JavaScript backend on the public server. |
| Express | Provide an authenticated HTTPS endpoint for the ground station to submit readings and a public read-only endpoint for browsers to fetch new samples. Backend code validates incoming readings before storing them. |
| SQLite | Store incoming live samples. The read endpoint returns samples added since the browser's last request. |

The dashboard polls the read endpoint while **Live** is selected. It uses the same chart code for live samples and CSV recordings. The same frontend build can be deployed publicly or served locally. Deployment settings determine whether a live API is available. Without a reachable live API, **Live** shows **Disconnected**.

## Launch-day deployment options

| Option | How it would work |
| --- | --- |
| Public live feed | If venue internet is reliable, the ground station sends readings to the public Express API over HTTPS. The public site can serve the frontend and read API under the same domain. |
| Local live feed | Run Express, SQLite, and the same frontend on the ground-station machine or a laptop on the launch network. People on that network can view the live dashboard. The public site stays static and shows **Disconnected**. Publish the recorded CSV afterward. |

In either setup, the ground station should record readings locally throughout the flight so an internet outage does not interrupt the recording. For the public setup, enable the upload endpoint only during tests and launch, require a credential held by the ground station, and limit request size and rate. The public read endpoint can serve the dashboard independently. For local operation, keep the upload endpoint on the launch network or on the ground-station machine itself.

## Open questions

- The team will define the ground-station-to-server protocol. The fields, units, timestamp format, and wire format are open, including whether the ground station sends structured messages or uploads files.
- The send frequency and whether readings are sent individually or in batches are also open. We can build the dummy CSV dashboard before deciding these details.
- Where will the static site be hosted? After testing the venue connection, decide whether launch day uses the public live API or the local setup.
- Who will publish the recorded flight CSVs?
