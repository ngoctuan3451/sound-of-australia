# 500-word Moodle Description — paste the prose below into the Moodle form

(Prose ≈ 480 words. Paste only the text under the rules; drop the markdown headings if the counter is tight.)

---

**Domain, Why and Who.** *The Sound of Australia* traces how Australian music has been bought, voted for, and exported over nearly four decades. It is written for the average Australian — someone who has heard a Triple J Hottest 100 countdown, watched Eurovision on SBS, or caught *Dance Monkey* on the radio — but has never seen the data behind those moments. The aim is to turn that cultural familiarity into an evidence-based story: who has really dominated the charts, where Melbourne's live-music scene physically sits, how Australia's share of its own charts has shifted, and how rarely local acts break through overseas.

**What (Data).** Six real datasets are combined. ARIA Charts (caseybriggs/ARIA-charts, GitHub) supply 95,800 weekly singles and album rows (1988–2025), each flagged by artist origin — the spine of the project. Triple J Hottest 100 (ABC Australia) adds 4,200 entries across 33 listener polls. City of Melbourne Open Data lists 227 live-music venues with coordinates and types. Eurovision (2015–2025), Australian Billboard Hot 100 #1s, and Spotify Global #1 records come from Wikipedia, Billboard, and Guinness World Records. A single Python script aggregates everything into compact derived JSON (about 950 KB total) committed to the repository for reproducibility.

**How (Idioms and custom elements).** Five sections follow Munzer's What/Why/How framework, each answering one question: where the music comes from, what we buy, what we love, what shape a hit takes, and how we rate globally. Marks and channels are matched to tasks: a Mercator dot map and an equal-Earth, log-scaled choropleth (geoshape + colour value) for geography; position and length for rankings; colour hue for origin (orange = Australian, blue = albums); size on the Hottest 100 longevity bubble scatter; and area for seasonal and new-versus-returning trends. Standard bars and lines are paired with custom-built idioms: a **dumbbell** showing the album-versus-singles gap each decade; an **animated dual-line** that plays through the years to trace album and singles share; an **interactive brush-linked panel** where dragging a year range re-ranks the top-15 artists; an **annotated bump chart** of yearly number-one artists; a **callout dot map** pointing into the dense CBD core; and an **era-segmented Billboard timeline** marking the 27-year drought between INXS (1987) and Iggy Azalea (2014). Every chart carries an in-spec annotation that turns data into insight — Kylie Minogue's 370 chart-weeks (100 clear of number two), the album-singles gap peaking at 25% versus 10% in the 2010s, Hilltop Hoods as Triple J's most-played act, and *Dance Monkey*'s record Spotify reign. A consistent palette and Playfair Display + Inter typography give the page an editorial, music-journalism tone.

**AI acknowledgement.** ChatGPT and Claude (Anthropic) assisted with code structure, debugging, grammar, and design iteration; all data interpretation, design choices, and final wording were reviewed and approved by the author.

---

## Submission checklist

- [ ] Push everything to https://github.com/ngoctuan3451/FIT2179 (main branch)
- [ ] Verify the live page at https://ngoctuan3451.github.io/FIT2179/ — all 17 charts render, no 404s
- [ ] Hand-draw the sketch on paper (4+ sections, headings, varied chart types, tidy), photograph/scan to PDF, commit it, link the GitHub URL on Moodle
- [ ] Paste the prose above into the Moodle form (confirm ≤ 500 words in the counter)
- [ ] Submit on Moodle: live GitHub Pages URL + sketch PDF URL
- [ ] Confirm this domain is clearly different from your Data Visualisation 1 (otherwise the mark is 0)
