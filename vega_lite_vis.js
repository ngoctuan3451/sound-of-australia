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
const viewBySel = {};
const lastWidth = {};      // container width each chart was last embedded at

// Concat / facet / repeat specs ignore width:"container" (a Vega-Lite limit), so
// we fetch them and inject the measured container width into each child.
const concatSelectors = new Set(['#chart-lollipop']);

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
  lastWidth[sel] = el.clientWidth;
  return fetch(spec + cacheBust)
    .then(r => r.json())
    .then(specObj => {
      // For concat, "width" is the PLOT area only; the fixed-extent left axis
      // (160px, set in the spec) sits outside it. Subtract that + a little right
      // padding so the whole chart fits the container instead of overflowing.
      const AXIS_ALLOWANCE = 180;
      const w = Math.max(220, el.clientWidth - AXIS_ALLOWANCE);
      (specObj.vconcat || specObj.hconcat || specObj.concat || []).forEach(c => { c.width = w; });
      return vegaEmbed(sel, specObj, embedOpts);
    })
    .then(res => { if (res && res.view) { viewBySel[sel] = res.view; if (sel === '#chart-lollipop') wireExploreSelection(res.view); } })
    .catch(showError(sel, spec));
}

function embedSingle(sel, spec) {
  const el = document.querySelector(sel);
  if (!el) return Promise.resolve();
  lastWidth[sel] = el.clientWidth;
  return vegaEmbed(sel, spec + cacheBust, embedOpts)
    .then(res => { if (res && res.view) { viewBySel[sel] = res.view; if (sel === '#chart-slope') wireSlopePlayer(); } })
    .catch(showError(sel, spec));
}

function embedChart(sel, spec) {
  return concatSelectors.has(sel) ? embedConcat(sel, spec) : embedSingle(sel, spec);
}

charts.forEach(([sel, spec]) => embedChart(sel, spec));

// width:"container" only measures correctly if the container already has its final
// width when the chart embeds; view.resize() does NOT re-fit it afterwards. So when
// a container's width actually changes we RE-EMBED that chart — reliably rescuing any
// chart that first embedded into a not-yet-laid-out (narrow) box.
function refitCharts() {
  charts.forEach(([sel, spec]) => {
    const el = document.querySelector(sel);
    if (!el) return;
    const w = el.clientWidth;
    if (w > 0 && Math.abs((lastWidth[sel] || 0) - w) < 2) return;
    embedChart(sel, spec);
  });
}

// ── Explore-by-year panel (Section 2): manual brush + selected-year readout ──
// The user drags an interval brush on the year strip; we mirror the selected
// span into a label below the chart. The signal listener is re-attached on each
// embed (the concat view is recreated on resize).
let _exploreResetWired = false;
function wireExploreSelection(view) {
  const label = document.getElementById('explore-window');
  function render(sel) {
    const yr = sel && sel.year;
    if (yr && yr.length === 2) {
      const lo = Math.round(Math.min(yr[0], yr[1])), hi = Math.round(Math.max(yr[0], yr[1]));
      if (label) label.textContent = `Showing ${lo}–${hi}`;
    } else if (label) {
      label.textContent = 'Showing all years (1988–2025)';
    }
  }
  try {
    view.addSignalListener('brush', (n, v) => render(v));
    render(view.signal('brush'));
  } catch (e) { /* ignore */ }

  if (!_exploreResetWired) {
    _exploreResetWired = true;
    const reset = document.getElementById('explore-reset');
    if (reset) reset.addEventListener('click', () => {
      const v = viewBySel['#chart-lollipop']; if (!v) return;
      v.data('brush_store', []); v.runAsync();
      if (label) label.textContent = 'Showing all years (1988–2025)';
    });
  }
}

// ── Album-vs-singles play-through (Section 4): sweep a playhead across years ─
// Advances the `playYear` param so both lines trace out + a marker moves along.
let _slopePlayerWired = false;
function wireSlopePlayer() {
  if (_slopePlayerWired) return;              // wired once; reads the live view each tick
  const btn = document.getElementById('slope-play');
  const reset = document.getElementById('slope-reset');
  const label = document.getElementById('slope-year');
  if (!btn) return;
  _slopePlayerWired = true;

  const FIRST = 1988, LAST = 2025, STEP_MS = 320;
  let timer = null, y = FIRST;

  function set(year) {
    const v = viewBySel['#chart-slope']; if (!v) return;
    v.signal('playYear', year); v.runAsync();
    if (label) label.textContent = year > 0 ? `${year}` : '';
  }
  function stop() { if (timer) { clearInterval(timer); timer = null; } btn.textContent = '▶ Play through the years'; }
  function tick() {
    set(y);
    if (y >= LAST) { stop(); return; }
    y += 1;
  }
  btn.addEventListener('click', () => {
    if (timer) { stop(); return; }
    y = FIRST; btn.textContent = '⏸ Pause'; tick();
    timer = setInterval(tick, STEP_MS);
  });
  if (reset) reset.addEventListener('click', () => { stop(); set(0); });
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

// ResizeObserver: robustly refit when any chart container's width changes.
// width:"container" can measure 0/too-small if a chart embeds before its box
// has laid out (leaving it stuck narrow, e.g. the singles-vs-albums bars). This
// fires whenever a container resizes — including the initial layout pass — so
// every chart snaps to its true width without relying on load-event timing.
if (typeof ResizeObserver !== 'undefined') {
  let _roTimer;
  const ro = new ResizeObserver(() => {
    clearTimeout(_roTimer);
    _roTimer = setTimeout(refitCharts, 120);
  });
  charts.forEach(([sel]) => { const el = document.querySelector(sel); if (el) ro.observe(el); });
}
