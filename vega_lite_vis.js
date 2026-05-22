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

  // Section 4 — longevity, decades, seasons
  ["#chart-grouped",         "vega/grouped_decade_share.json"],
  ["#chart-radial",          "vega/radial_seasonality.json"],
  ["#chart-scatter-release", "vega/scatter_peak_weeks.json"]
];

const embedOpts = { actions: { export: true, source: true, editor: true, compiled: false } };

charts.forEach(([sel, spec]) => {
  vegaEmbed(sel, spec, embedOpts).catch(err => {
    console.error(`Failed to embed ${sel} from ${spec}:`, err);
    const el = document.querySelector(sel);
    if (el) el.innerHTML =
      `<p style="color:#c0392b;font-size:0.85rem;padding:1rem;">
        Could not load <code>${spec}</code>. ${err.message || err}
      </p>`;
  });
});
