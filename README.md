# The Sound of Australia 🎵

**An interactive data-visualisation essay on four decades of Australian music — what we buy, what we vote for, and what we stream.**

🔗 **[View the live interactive site →](https://ngoctuan3451.github.io/FIT2179/)**

[![The Sound of Australia](docs/preview.png)](https://ngoctuan3451.github.io/FIT2179/)
<!-- Drop a screenshot or a short scrolling GIF at docs/preview.png. The image above links to the live site. -->

---

## Problem

Australian music *feels* everywhere if you grew up on the Triple J Hottest 100 — but does the data agree? This project tests that assumption by tracing the Australian-artist share across nearly 40 years of charts, listener votes, live venues, and global streaming, and tells a single story: **Australia has always had a strong local base, but only streaming let it reach the world.**

Audience: the general Australian public. Design framework: Munzner's *What / Why / How*.

## Data sources

| Source | Coverage | Notes |
|---|---|---|
| ARIA Charts ([caseybriggs/ARIA-charts](https://github.com/caseybriggs/ARIA-charts)) | 1988–2025 | ~95,800 weekly singles & album rows, with Australian-artist flags and country of origin |
| Triple J Hottest 100 (ABC Australia) | 1993–2025 | ~3,300 annual-poll entries + ~900 all-time/special entries |
| Melbourne Live-Music Venues (City of Melbourne Open Data) | 2024 | 227 registered venues with location and type |
| US Billboard Hot 100 (Billboard + Wikipedia) | 1970s–2024 | Australian #1 singles |
| Spotify Global / all-time (Guinness, The Music Network, Wikipedia) | to May 2026 | Daily-global #1 records and most-streamed snapshot |
| Eurovision (Wikipedia) | 2015–2025 | Australia's entries and placings |

Basemap geometry: Victoria locality polygons and Natural Earth countries via the FIT3179 Vega-Lite repo.

## What I did

- **Collected and integrated 6 sources** spanning 1988–2025 into a single narrative.
- **Wrangled the raw chart data** into purpose-built JSON aggregates (see `data/derived/`) — yearly Australian share, decade comparisons, artist longevity, heatmaps, seasonality, etc.
- **Built 17 Vega-Lite visualisations** across 5 narrative sections: maps (dot + choropleth), line, slope, grouped dot, lollipop, bump chart, heatmap, stacked area, scatter, radial, and bubble timelines.
- **Added interaction** where it earns its place — a play-through-the-years animation and a draggable year-range filter on the artist rankings.
- **Documented data-quality decisions** honestly in a method note (incomplete historic Australian-artist flags are repaired with a conservative lower bound; rows missing country metadata are excluded from the world map).

## Key findings

- **Albums stayed local, singles went global.** In the late 1980s Australian artists held ~25% of *both* charts. Album share held near that level for decades; singles share fell to single digits.
- **Familiar names dominate Triple J.** The share of *returning* artists in each Hottest 100 has grown over time — Hilltop Hoods lead all-time entries.
- **Peaking ≠ lasting.** Several of the longest-charting ARIA singles never cracked the top 10 (e.g. *Mr Brightside*, peak #19). Peak position and weeks-on-chart are largely independent.
- **Streaming was the structural shift.** Two Australian songs held Spotify's Global #1 for a combined 197 days; three sit in the all-time top 30 (*Stay* #10, *Riptide* #20, *Dance Monkey* #27) — a breakthrough that was nearly impossible under the old radio/sales model.

## How to run

It's a static site — no build step.

```bash
# clone, then from the project folder:
python -m http.server 8000
# open http://localhost:8000
```

Or just open the [live site](https://ngoctuan3451.github.io/FIT2179/).

## Repository structure

```
.
├── index.html              # the narrative page and all chart containers
├── style.css               # layout and typography
├── vega_lite_vis.js        # embeds the Vega-Lite specs and wires up interactions
├── vega/                   # 17 Vega-Lite JSON specifications (one per chart)
├── data/
│   ├── *.csv / *.json      # raw source data
│   └── derived/            # wrangled aggregates feeding the charts
└── docs/preview.png        # README thumbnail (add your screenshot/GIF)
```

## Built with

Vega-Lite 5 · Vega-Embed · plain HTML/CSS. No framework.

## Author

**Tuan Ngoc Chu** — FIT2179 Data Visualisation 2, Monash University (Semester 1, 2026).

*AI acknowledgement: ChatGPT and Claude assisted with code structure, debugging, and prose. All data interpretation, design decisions, and final wording are my own.*
