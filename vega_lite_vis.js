// The Sound of Australia — Vega-Lite embeds
// Each spec lives as a human-readable JSON in /vega and is loaded by id.

const charts = [
  // Section 1 — geography
  ["#map-venues",            "vega/map_venues.json"],
  ["#map-choropleth",        "vega/map_choropleth.json"],

  // Section 2 — ARIA sales story
  ["#chart-line",            "vega/line_aussie_share.json"],
  ["#chart-lollipop",        "vega/explore_singles_by_year.json"],
  ["#chart-bump",            "vega/bump_rankings.json"],
  ["#chart-dotplot",         "vega/bar_singles_albums.json"],

  // Section 3 — Triple J Hottest 100
  ["#chart-heatmap",         "vega/heatmap_h100.json"],
  ["#chart-area",            "vega/area_h100_new_returning.json"],
  ["#chart-scatter-j",       "vega/scatter_h100_longevity.json"],

  // Section 4 — the shape of a hit
  ["#chart-grouped",         "vega/dumbbell_decade_gap.json"],
  ["#chart-slope",           "vega/slope_decade_share.json"],
  ["#chart-radial",          "vega/radial_seasonality.json"],
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

// Keep every embedded view so we can force a re-fit after layout settles.
// width:"container" charts measure their box once at embed time; if the page
// is still reflowing (fonts loading, scrollbars, flex re-order) they can lock
// to a too-narrow width and leave white space on the right. Re-running each
// view on load + resize makes them snap back to the full container width.
const liveViews = [];
const viewBySel = {};

// Concat / facet / repeat specs ignore width:"container" (a known Vega-Lite limit),
// so we fetch them, inject the measured container width into each child, then embed —
// and re-embed on resize. Everything else uses the normal URL + width:"container" path.
const concatSelectors = new Set(['#chart-lollipop']);
const concatWidths = {};   // last embedded width per concat sel, to avoid needless re-embeds

function showError(sel, spec) {
  return err => {
    console.error(`Failed to embed ${sel} from ${spec}:`, err);
    const el = document.querySelector(sel);
    if (el) el.innerHTML =
      `<p style="color:#c0392b;font-size:0.85rem;padding:1rem;">
        Could not load <code>${spec}</code>. ${err.message || err}
      </p>`;
  };
}

function embedConcat(sel, spec) {
  const el = document.querySelector(sel);
  if (!el) return Promise.resolve();
  return fetch(spec + cacheBust)
    .then(r => r.json())
    .then(specObj => {
      // For concat, "width" is the PLOT area only; the fixed-extent left axis
      // (160px, set in the spec) sits outside it. Subtract that + a little right
      // padding so the whole chart fits the container instead of overflowing.
      const AXIS_ALLOWANCE = 225;
      const w = Math.max(220, el.clientWidth - AXIS_ALLOWANCE);
      concatWidths[sel] = el.clientWidth;
      (specObj.vconcat || specObj.hconcat || specObj.concat || []).forEach(c => { c.width = w; });
      return vegaEmbed(sel, specObj, embedOpts);
    })
    .then(res => { if (res && res.view) { viewBySel[sel] = res.view; if (sel === '#chart-lollipop') wireExplorePlayer(); } })
    .catch(showError(sel, spec));
}

charts.forEach(([sel, spec]) => {
  if (concatSelectors.has(sel)) { embedConcat(sel, spec); return; }
  const url = spec + cacheBust;
  vegaEmbed(sel, url, embedOpts)
    .then(res => { if (res && res.view) { liveViews.push(res.view); viewBySel[sel] = res.view; } })
    .catch(showError(sel, spec));
});

function refitCharts() {
  liveViews.forEach(v => { try { v.resize().run(); } catch (e) { /* ignore */ } });
  // Concat specs can't just resize() to the container — re-embed, but only when
  // the width actually changed (so load-time refits don't reset a running animation).
  concatSelectors.forEach(sel => {
    const el = document.querySelector(sel);
    if (!el) return;
    const w = Math.max(280, el.clientWidth);
    if (Math.abs((concatWidths[sel] || 0) - w) < 2) return;
    const found = charts.find(c => c[0] === sel);
    if (found) embedConcat(sel, found[1]);
  });
}

// ── Interactive "explore by year" player (Section 2) ───────────────────────
// Drives the interval selection on the embedded explore chart by writing its
// selection store directly, sweeping a moving window across the years.
let _explorePlayerWired = false;
function wireExplorePlayer() {
  if (_explorePlayerWired) return;            // listeners attach once; handlers read the live view
  const btn = document.getElementById('explore-play');
  const reset = document.getElementById('explore-reset');
  const label = document.getElementById('explore-window');
  if (!btn) return;
  _explorePlayerWired = true;

  const FIRST = 1988, LAST = 2025, WIN = 5, STEP_MS = 750;
  let timer = null, start = FIRST;

  function tuple(s, e) {
    return [{ unit: '', fields: [{ field: 'year', channel: 'x', type: 'R' }], values: [[s, e]] }];
  }
  function setWindow(s, e) {
    const v = viewBySel['#chart-lollipop']; if (!v) return;
    v.data('brush_store', tuple(s, e)); v.runAsync();
    if (label) label.textContent = `Showing ${s}–${e}`;
  }
  function clearWindow() {
    const v = viewBySel['#chart-lollipop']; if (!v) return;
    v.data('brush_store', []); v.runAsync();
    if (label) label.textContent = 'Showing all years (1988–2025)';
  }
  function stop() {
    if (timer) { clearInterval(timer); timer = null; }
    btn.textContent = '▶ Play through the years';
  }
  function tick() {
    const e = Math.min(start + WIN - 1, LAST);
    setWindow(start, e);
    if (e >= LAST) { stop(); return; }
    start += 1;
  }
  btn.addEventListener('click', () => {
    if (timer) { stop(); return; }
    start = FIRST; btn.textContent = '⏸ Pause'; tick();
    timer = setInterval(tick, STEP_MS);
  });
  if (reset) reset.addEventListener('click', () => { stop(); clearWindow(); });
}

// Refit after the page has fully loaded and once more shortly after, to catch
// late reflows (web fonts, async layout).
window.addEventListener('load', () => {
  refitCharts();
  setTimeout(refitCharts, 200);
  setTimeout(refitCharts, 800);
});

// Debounced refit on window resize.
let _refitTimer;
window.addEventListener('resize', () => {
  clearTimeout(_refitTimer);
  _refitTimer = setTimeout(refitCharts, 150);
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
