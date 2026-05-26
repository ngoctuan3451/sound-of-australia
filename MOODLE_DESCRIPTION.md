# 500-word Moodle Description — paste this into the Moodle form

(Word count ≈ 490. Trim a sentence if Moodle's counter pushes over 500.)

---

## Domain, Why and Who

*The Sound of Australia* examines how Australian music has been bought, voted for, broadcast and exported over almost four decades. The audience is the average Australian — someone who has heard a *Hottest 100* countdown on Triple J, watched Eurovision on SBS, or stumbled across *Dance Monkey* on the radio — but has never seen the data behind those moments. The "why" is to convert that ambient cultural familiarity into a coherent, evidence-based story: which artists have actually dominated, where the live-music scene physically lives in Melbourne, how recent the streaming era really is, and how rarely Australian artists have cracked the international charts.

## Data (What)

Six real-world datasets are combined. **ARIA Charts** (caseybriggs/ARIA-charts on GitHub) provides 95,800 weekly chart rows for both singles and albums (1988–2025), each row flagged with Australian-artist status and country of origin — this is the spine of the project. **Triple J Hottest 100** (ABC Australia) supplies 4,200 song entries across 33 annual listener polls. **City of Melbourne Open Data** lists 227 registered live-music venues with coordinates and venue types. **Eurovision Australia** entries (2015–2025) come from Wikipedia. **Billboard Hot 100 #1s by Australian artists** were compiled from Billboard's *Down Under on Top* article and the corresponding Wikipedia list. **Spotify Global #1 records** come from Guinness World Records and The Music Network. All raw data is aggregated into compact derived JSON files (≈800 KB total page weight) using a single Python preparation script committed to the repository for full reproducibility.

## How (Idioms and Custom Elements)

The page is structured as five "story" sections following Munzer's What/Why/How framework, each answering one question: where Aussie music comes from, what we buy (ARIA), what we love (Triple J), what shape a hit takes, and how Australia rates globally. Marks and channels are matched to each task: *position + size* on the longevity bubble scatter, *colour* hue for the streaming-era inflection on the rise-of-Aus-music line, and *position* on a step chart for Eurovision placement. Standard idioms (bar, line, area) are paired with several custom-built ones: a **hex-density map** of Melbourne venues using an offset-tile coordinate transform and a custom SVG hex path; an **annotated bump chart** with mouseover-highlight interaction; a **categorical-colour longevity leaderboard** with per-row callouts; an **annotated quadrant bubble scatter** for Hottest 100 careers; and a **timeline scatter** of every Australian Billboard #1, segmented by era. Every chart carries at least one specific in-spec annotation that turns raw data into an insight — *"Tones and I: 215 weeks, 60% more than #2 Vance Joy"*, *"27-year gap between INXS and Iggy Azalea on Billboard"*, *"★ Hilltop Hoods — most-played artist in Triple J history"*. A consistent palette (orange = Australian, navy = international, blue = albums) supports figure–ground clarity, and Playfair Display + Inter typography mirrors the editorial tone of music journalism.

## AI acknowledgement

ChatGPT and Claude (Anthropic) assisted with code structure, JSON debugging, prose grammar, and chart-design iteration. All data interpretation, design choices, and final wording were reviewed and approved by the author.

---

## Submission checklist

- [ ] Push everything to https://github.com/ngoctuan3451/FIT2179 main branch
- [ ] Verify the live page renders at https://ngoctuan3451.github.io/FIT2179/ (all 14 charts visible, no 404s)
- [ ] Hand-draw the sketch PDF on paper (4+ sections, headings, varied chart types, tidy), photograph or scan it, commit it to the repo, link the GitHub URL on Moodle
- [ ] Paste the 500-word description above into the Moodle form
- [ ] Confirm Moodle URL submission: live GitHub Pages URL + sketch PDF URL
