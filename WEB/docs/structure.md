# Starship CanSat 2026–2027

## Site Structure

```text
Starship CanSat 2026–2027
├── Home (page)
│   ├── Introduction / Hero
│   ├── What is CanSat?
│   ├── Our Mission
│   ├── Team Motto / Philosophy
│   ├── Our Team
│   └── Project Progress
├── Engineering (page)
│   ├── Mission Objectives
│   ├── Hardware
│   ├── Software
│   ├── Communication
│   ├── Mechanical Design
│   └── Testing
└── Telemetry (page)
    ├── Dataset Selector (component)
    │   ├── Live (mode)
    │   ├── Dummy datasets (stored files)
    │   └── Recorded flights (stored files)
    └── Shared Dashboard (component)
        ├── Graphs
        ├── Measurements
        ├── Statistics
        ├── Data Table
        ├── Timeline / Playback
        └── Export Data
```

## Telemetry Behavior

### Dataset Selector

- **Live** — a live data source and dashboard mode. Before launch, show **Disconnected**.
- **Dummy datasets and recorded flights** — stored dataset files available for selection. After launch, visitors can select a recorded flight to view its data in the shared dashboard.

### Shared Dashboard

The dashboard shows data from the selected source.
