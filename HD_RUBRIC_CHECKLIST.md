# FIT2179 Data Visualisation 2 HD Checklist

Source: `FIT2179 Data Visualisation 2.pdf`, Semester 1 2026 brief.

## Non-negotiables

- Due: Friday 29 May 2026, 11:55 PM.
- Final deliverable must be one publicly accessible GitHub Pages URL.
- All Vega-Lite JSON specs must be accessible in the same GitHub repository and formatted for readability.
- Domain must be clearly different from Data Visualisation 1, otherwise the mark is 0.
- Maps and diagrams must be created with Vega-Lite unless tutor approval was granted for another library.
- At least one geographic map is required. Without a map, the Visualisation Idioms and Complexity component is capped at 5%.
- Submit a GitHub URL to a PDF sketch. No sketch, or sketch for a different domain, receives a -3% penalty.
- Total downloadable data should be less than a few megabytes.
- Use real, accurate, reliable, recent data, and combine at least two different data sources.
- Single scrolling page, no horizontal scrolling on a small laptop screen.
- Acknowledge AI use and external data/media sources.

## HD Target

### Sketch, 2%

- Four or more clear sections.
- Headings, text, figures, detailed/creative/varied charts and maps.
- Clean and tidy hand-created sketch, not digital.

### Visualisation Idioms and Complexity, 10%

- Minimum 10 charts overall.
- A substantial number of creative, custom-built idioms.
- Demonstrates high-level understanding of visual marks and channels.
- Strong HD evidence can come from derived data, combined idioms, layered specs, annotations, interactions, and purposeful custom encodings.

### Layout, Colour, Figure-Ground, 4%

- Balanced, symmetric layout structured in columns and rows.
- Strong alignment with sight lines.
- Good use of white space.
- Clear visual hierarchy through consistent colour and figure-ground contrast.

### Typography, 2%

- Advanced typography that matches the topic.
- Excellent readability for main text.
- Appropriate line height, size, weight, colour, line length, alignment, and spacing.

### Storytelling, Annotations, Grammar, Metadata, 5%

- Clearly structured and engaging story that guides the reader.
- Extensive informative annotations on diagrams and in surrounding text.
- Correct grammar and easy-to-follow writing.
- Complete, well-formatted metadata: author, date, data sources, URLs, AI acknowledgement.

### Moodle 500-Word Description, 2%

- Succinctly describe domain, who, what, why, and how.
- Explain data sources, authors, relevance, and creation process.
- Justify visualisation idioms using Munzer's What/Why/How framework.
- Explain special features and custom-built elements.

## Current Project Audit, 20 May 2026

- Topic: Australian music charts, Triple J Hottest 100, and Melbourne live music venues. This is relevant to an Australian audience and has a strong storytelling angle.
- Current page has 12 chart/map containers in `index.html`.
- Current `vega_lite_vis.js` embeds only 5 specs, so 7 chart slots are currently empty.
- Existing Vega-Lite specs: two maps, one area/line chart, one lollipop chart, one bump chart.
- Existing specs contain some custom/layered idioms and tooltips, but need more annotations and a fuller story arc for HD.
- Current raw data files total more than a few megabytes. The page also fetches large CSVs directly from GitHub raw URLs, so derived smaller datasets should be created for performance and rubric compliance.
- Several visible text strings show mojibake / broken dash characters; these should be replaced with normal punctuation before submission.
- Footer already includes authorship/date, data sources, and an AI acknowledgement, but source metadata can be polished.

## Working Standard For Future Edits

- Build at least 10 finished, embedded Vega-Lite charts, with no empty chart containers.
- Make every chart answer one clear story question.
- Prefer compact derived datasets over raw full CSVs.
- Use annotations inside the Vega-Lite specs, not only text around them.
- Use interactivity only when it helps the reader compare, filter, or inspect.
- Keep the single-page layout clean, aligned, readable, and responsive.
- Keep the visual style consistent with the Australian music theme.
- Prepare the sketch PDF and 500-word Moodle description as separate deliverables before submission.
