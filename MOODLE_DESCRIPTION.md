# 500-word Moodle Description — paste the prose below (≈490 words)

---

**Domain, Why and Who.** This visualisation examines how Australian music has been bought, voted for, and exported across almost four decades. The intended audience is the average Australian — someone familiar with Triple J's Hottest 100, the ARIA charts, and Melbourne's live scene, but who has never seen the underlying data. The why: to turn ambient cultural knowledge into a data-driven story, testing the assumption that Australian music is everywhere against what the numbers actually show.

**What (Data).** Six real-world datasets are combined — satisfying Munzner's *what* dimension. ARIA Charts (caseybriggs/ARIA-charts on GitHub) supplies 95,800 weekly singles and album rows (1988–2025), each flagged with Australian-artist status. Triple J Hottest 100 (ABC Australia) adds about 4,200 entries overall, including 3,300 regular annual-poll entries. City of Melbourne Open Data lists 227 live-music venues with coordinates and types. Eurovision Australia entries (2015–2025), Australian Billboard Hot 100 number-ones, and Spotify Global records come from Wikipedia, Billboard, and Guinness World Records. Raw data is aggregated into compact derived JSON files using a committed Python script.

**Why (Tasks).** Following Munzner's *why* dimension, the main analytic tasks are: comparing Australian versus international shares over time (trend), ranking artists by chart presence (order), locating the spatial distribution of venues (browse), and looking up specific records such as Kylie Minogue's all-time singles lead and Dance Monkey's Spotify reign (lookup).

**How (Idioms and custom elements).** Idioms were chosen to match each task. A Mercator dot map and an Equal-Earth choropleth use geoshape and longitude/latitude encodings to answer geographic questions. A dumbbell plot joins two quantitative values per decade with a connecting rule, making the album-versus-singles gap visible as line length. An animated dual-line chart uses a Vega-Lite `params` signal driven by a JavaScript timer so the viewer traces both album and singles share year by year. A brush-linked panel uses an interval selection on a mini area strip to cross-filter and re-aggregate a top-15 ranking in real time — the most technically complex element, requiring a separate artist-by-year derived dataset. A bump chart with end labels places artist names directly on each line's latest point. A heatmap uses rect marks with a coral-to-plum sequential palette to encode Hottest 100 entry counts across 33 years. A bubble scatter uses size for total songs and colour value for best rank, using the same music-themed coral, amber, teal and plum palette as the page. In every case, the idiom was chosen so the visual encoding directly reflects the analytic question. Interactivity (brush, hover-highlight, select menus, tooltips and Play button) is used only where exploration adds genuine value, consistent with the assignment's presentation-not-exploration goal.

**AI acknowledgement.** ChatGPT and Claude (Anthropic) assisted with code structure, debugging, grammar, and chart-design iteration. All data interpretation, design choices, and final wording were reviewed and approved by the author.

---

## Submission checklist

- [ ] Push to https://github.com/ngoctuan3451/FIT2179 (main branch)
- [ ] Verify live page at https://ngoctuan3451.github.io/FIT2179/
- [ ] **Hand-draw the sketch** (see SKETCH_BLUEPRINT.md) → scan to PDF → commit → link URL on Moodle
- [ ] Paste the prose above (≤500 words) into the Moodle form
- [ ] Submit: GitHub Pages URL + sketch PDF URL
- [ ] Confirm this domain is clearly different from your Data Visualisation 1
