# Site Design Draft

Starship CanSat 2026–2027. See [Site Structure](structure.md) for the page hierarchy and [Web Stack](web-stack.md) for implementation details.

## Current draft

Home and Engineering share a responsive header, footer, typography, and light and dark themes. The sticky header has two rows. The project name and theme switcher sit at opposite ends of the first row. Home and Engineering anchor the second row, with shorter, smaller serif section labels in between. Home sections align left beside Home, and Engineering sections align right beside Engineering. Active sections slide out from their page label and retract when switching pages. On narrow screens the section links scroll horizontally while both page labels stay visible. The footer sits at the end of the page. It identifies CEPES in Jodoigne, Belgium, and includes Instagram, Facebook, and email links with emoji icons. The links are placeholders until the team provides its accounts and contact address. Section links scroll to their targets and respect reduced-motion preferences. Home has a text-only hero and placeholders for the team motto and profiles. Telemetry is planned for a later pass.

## Visual direction

- Use the project name and logo as a masthead. The masthead and browser tab share `assets/favicon.svg`, with white artwork on a `#202e43` background. Home is the dedicated navigation link, and the footer focuses on the school, location, and contact details.
- Support light and dark modes on all three pages, including the telemetry charts. Follow the visitor’s system preference by default and keep their choice when they switch themes in the shared header.
- Use a clean, regular layout with the same header, navigation, typography, spacing, and control styles across Home, Engineering, and Telemetry. Use a shared accent color and keep text, controls, and chart labels legible in both modes.
- Use a restrained blue palette with pale blue-gray surfaces in light mode and deep navy surfaces in dark mode. Reserve muted red for statuses that need it.
- Give Home and Engineering room to be more expressive through larger headings, team photos, CAD renders, or hardware close-ups. The Home layout should also work with a text-only hero.
- Give Telemetry a professional dashboard layout with aligned controls, restrained color, and clear labels and units. Use fixed-width digits for measurements so changing values stay easy to scan.

## Page layouts

### Home

Lead with **Starship CanSat 2026–2027**, a short mission introduction, and a link to Telemetry. Put a project photo or render beside the introduction on wide screens and below it on mobile. Follow with What is CanSat?, Our Mission, Team Motto / Philosophy, Our Team, and Project Progress.

### Engineering

Start with Mission Objectives, then walk through Hardware, Software, Communication, Mechanical Design, and Testing. Use the Engineering section links in the shared header to jump to a subsystem. Place diagrams and photos next to the relevant explanation. On mobile, stack the text and images in reading order.

### Telemetry

Put the dataset selector and source status above the shared dashboard. Show a labeled dummy flight by default so the chart is visible on arrival. Keep **Live** and any available recorded flights in the same selector. Place charts first, with measurements, statistics, the data table, playback, and export added to the shared dashboard as those features are built. Keep the selector and status above the first chart on mobile.

## Telemetry states

| State | What visitors see |
| --- | --- |
| Dummy or recorded flight selected | The dataset name and charts with labeled axes and units. |
| Loading a file | A loading message in the dashboard while the selected dataset is fetched. |
| File unavailable or invalid | A message that the selected dataset could not be loaded. The selector remains available. |
| Live selected before launch | **Disconnected** in the source status and an empty chart area. |

## First release

Build the three pages with shared navigation and light and dark modes. On Telemetry, visitors can select a dummy CSV and see its readings plotted. Selecting **Live** shows **Disconnected** before launch.

## Open design questions

- Do we have team colors, a logo, or a photo or render for the Home hero?
- What short mission description, motto, and team details should appear on Home?
- Is a dummy flight the right default when visitors open Telemetry?
