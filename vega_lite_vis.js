// The Sound of Australia — Vega-Lite embeds
// Each spec lives as a human-readable JSON in /vega and is loaded by id.

const charts = [
  // Section 1 — geography
  ["#map-venues",            "vega/map_venues.json"],
  ["#map-choropleth",        "vega/map_choropleth.json"],

  // Section 2 — ARIA sales story
  ["#chart-line",            "vega/line_aussie_share.json"],
  ["#chart-lollipop",        "vega/lollipop_number1.json"],
  ["#chart-bump",            "vega/bump_rankings.json"],
  ["#chart-dotplot",         "vega/bar_singles_albums.json"],

  // Section 3 — Triple J Hottest 100
  ["#chart-heatmap",         "vega/heatmap_h100.json"],
  ["#chart-area",            "vega/area_h100_new_returning.json"],
  ["#chart-scatter-j",       "vega/scatter_h100_longevity.json"],

  // Section 4 — the shape of a hit
  ["#chart-grouped",         "vega/grouped_decade_share.json"],
  ["#chart-scatter-release", "vega/scatter_peak_weeks.json"],

  // Section 5 — Australia on the world stage
  ["#chart-billboard",        "vega/billboard_aus_no1s.json"],
  ["#chart-spotify",          "vega/spotify_global_throne.json"],
  ["#chart-eurovision",       "vega/eurovision_journey.json"],
  ["#chart-spotify-alltime",  "vega/spotify_alltime_top50.json"]
];

const embedOpts = { actions: { export: true, source: true, editor: true, compiled: false } };

// Cache-bust: a fresh suffix on every page load forces the browser to refetch
// each Vega-Lite spec JSON instead of using a stale cached copy. Required while
// GitHub Pages / the raw.githubusercontent.com CDN serve recent edits.
const cacheBust = '?v=' + Date.now();

charts.forEach(([sel, spec]) => {
  const url = spec + cacheBust;
  vegaEmbed(sel, url, embedOpts).catch(err => {
    console.error(`Failed to embed ${sel} from ${url}:`, err);
    const el = document.querySelector(sel);
    if (el) el.innerHTML =
      `<p style="color:#c0392b;font-size:0.85rem;padding:1rem;">
        Could not load <code>${spec}</code>. ${err.message || err}
      </p>`;
  });
});

// Scroll-spy for the sticky section nav.
// Hides nav while hero is on screen; highlights the current section pill.
(function () {
  const nav = document.getElementById('section-nav');
  if (!nav) return;
  const pills = Array.from(nav.querySelectorAll('.nav-pill'));
  const sections = pills.map(p => document.querySelector(p.getAttribute('href'))).filter(Boolean);
  const hero = document.querySelector('.hero');

  function update() {
    // Show nav once the hero is mostly scrolled past.
    const heroBottom = hero ? hero.getBoundingClientRect().bottom : 0;
    nav.classList.toggle('visible', heroBottom < 80);

    // Pick the section whose top is closest to (but not past) the 25% viewport line.
    const triggerLine = window.innerHeight * 0.25;
    let activeId = sections[0] && sections[0].id;
    for (const s of sections) {
      if (s.getBoundingClientRect().top - triggerLine <= 0) activeId = s.id;
    }
    pills.forEach(p =>
      p.classList.toggle('active', p.getAttribute('href') === '#' + activeId)
    );
  }

  // Smooth-scroll on pill click.
  pills.forEach(p =>
    p.addEventListener('click', e => {
      e.preventDefault();
      const t = document.querySelector(p.getAttribute('href'));
      if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    })
  );

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();
