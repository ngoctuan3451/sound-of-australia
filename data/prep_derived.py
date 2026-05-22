"""
Build small derived JSON datasets for The Sound of Australia.
Run once; outputs to data/derived/*.json. Keeps page payload tiny.
"""
import csv, json, os
from collections import defaultdict, Counter
from datetime import date

ROOT = os.path.dirname(os.path.abspath(__file__))
OUT  = os.path.join(ROOT, "derived")
os.makedirs(OUT, exist_ok=True)

def is_aus(flag):
    return str(flag).strip().upper() == "TRUE"

# ---------- Load ARIA singles + albums ----------
def load_aria(path):
    rows = []
    with open(path, "r", encoding="utf-8") as f:
        r = csv.DictReader(f)
        for row in r:
            rows.append({
                "date": row["chart_date"],
                "rank": int(row["rank"]),
                "artist": row["artist"].strip(),
                "title": row["title"].strip(),
                "aus": is_aus(row["aus_flag"]),
            })
    return rows

singles = load_aria(os.path.join(ROOT, "single_charts.csv"))
albums  = load_aria(os.path.join(ROOT, "album_charts.csv"))

# Helper: year from "YYYY-MM-DD"
yr = lambda s: int(s[:4])
mo = lambda s: int(s[5:7])

# ---------- 1. Hottest100 artist x year heatmap (Sec 3) ----------
h100 = json.load(open(os.path.join(ROOT, "hottest100.json"), encoding="utf-8"))
# only regular yearly polls (not 'alltime' specials)
h100_reg = [r for r in h100 if not r.get("alltime")]

artist_total = Counter(r["artist"] for r in h100_reg)
top_artists = [a for a, _ in artist_total.most_common(25)]

heat_rows = []
artist_year_count = Counter((r["artist"], r["pollyear"]) for r in h100_reg)
years = sorted({r["pollyear"] for r in h100_reg})
for a in top_artists:
    for y in years:
        heat_rows.append({
            "artist": a,
            "year": y,
            "count": artist_year_count.get((a, y), 0),
            "total": artist_total[a],
        })
json.dump(heat_rows, open(os.path.join(OUT, "h100_heatmap.json"), "w"), separators=(",", ":"))

# ---------- 2. Hottest100 new-vs-returning artists per year (Sec 3 area) ----------
seen = set()
area_rows = []
for y in years:
    artists_y = {r["artist"] for r in h100_reg if r["pollyear"] == y}
    new = len(artists_y - seen)
    returning = len(artists_y & seen)
    seen |= artists_y
    area_rows.append({"year": y, "status": "New artist", "count": new})
    area_rows.append({"year": y, "status": "Returning", "count": returning})
json.dump(area_rows, open(os.path.join(OUT, "h100_new_returning.json"), "w"), separators=(",", ":"))

# ---------- 3. Hottest100 artist longevity scatter (Sec 3) ----------
# x = years active (last_year - first_year + 1)
# y = total entries
# color = best (lowest) position
art_first, art_last, art_best = {}, {}, {}
for r in h100_reg:
    a = r["artist"]; y = r["pollyear"]; p = r["position"]
    art_first[a] = min(art_first.get(a, y), y)
    art_last[a]  = max(art_last.get(a, y), y)
    art_best[a]  = min(art_best.get(a, 100), p)

scatter_rows = []
for a, total in artist_total.items():
    if total < 3: continue  # focus on repeat appearers, keeps file small
    scatter_rows.append({
        "artist": a,
        "span": art_last[a] - art_first[a] + 1,
        "total": total,
        "best": art_best[a],
        "first": art_first[a],
        "last":  art_last[a],
    })
json.dump(scatter_rows, open(os.path.join(OUT, "h100_longevity.json"), "w"), separators=(",", ":"))

# ---------- 4. ARIA per-song summary (Sec 4 scatter: peak rank vs weeks) ----------
def song_summary(rows):
    agg = defaultdict(lambda: {"weeks": 0, "best": 100, "aus": False, "first": "9999", "last": "0"})
    for r in rows:
        key = (r["artist"], r["title"])
        d = agg[key]
        d["weeks"] += 1
        d["best"] = min(d["best"], r["rank"])
        d["aus"] = d["aus"] or r["aus"]
        d["first"] = min(d["first"], r["date"])
        d["last"]  = max(d["last"],  r["date"])
    out = []
    for (a, t), d in agg.items():
        if d["weeks"] < 5: continue  # drop one-week wonders to slim file
        out.append({
            "artist": a, "title": t, "weeks": d["weeks"], "best": d["best"],
            "aus": d["aus"], "first": d["first"], "last": d["last"],
        })
    return out

singles_sum = song_summary(singles)
json.dump(singles_sum, open(os.path.join(OUT, "aria_singles_summary.json"), "w"), separators=(",", ":"))

# ---------- 5. ARIA monthly seasonality (Sec 4 radial) ----------
# Count *new* singles chart debuts per month (first appearance date).
debut_counts = defaultdict(lambda: {"aus": 0, "intl": 0})
seen_song = set()
for r in sorted(singles, key=lambda x: x["date"]):
    key = (r["artist"], r["title"])
    if key in seen_song: continue
    seen_song.add(key)
    m = mo(r["date"])
    if r["aus"]: debut_counts[m]["aus"] += 1
    else:        debut_counts[m]["intl"] += 1
month_rows = []
month_names = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
for m in range(1, 13):
    month_rows.append({"month": m, "label": month_names[m-1], "origin": "Australian", "debuts": debut_counts[m]["aus"]})
    month_rows.append({"month": m, "label": month_names[m-1], "origin": "International", "debuts": debut_counts[m]["intl"]})
json.dump(month_rows, open(os.path.join(OUT, "aria_seasonality.json"), "w"), separators=(",", ":"))

# ---------- 6. ARIA decade grouped: Aus vs Intl share, singles vs albums ----------
def decade(d):
    y = yr(d); return f"{y//10*10}s"

def decade_share(rows, fmt):
    cnt = defaultdict(lambda: {"aus": 0, "intl": 0})
    for r in rows:
        d = decade(r["date"])
        if r["aus"]: cnt[d]["aus"] += 1
        else:        cnt[d]["intl"] += 1
    out = []
    for d, v in sorted(cnt.items()):
        tot = v["aus"] + v["intl"]
        if tot == 0: continue
        out.append({"decade": d, "format": fmt, "origin": "Australian",    "share": v["aus"]/tot*100,  "weeks": v["aus"]})
        out.append({"decade": d, "format": fmt, "origin": "International", "share": v["intl"]/tot*100, "weeks": v["intl"]})
    return out

dec_rows = decade_share(singles, "Singles") + decade_share(albums, "Albums")
json.dump(dec_rows, open(os.path.join(OUT, "aria_decades.json"), "w"), separators=(",", ":"))

# ---------- 7. Top 15 Aussie artists: combined singles + albums (Sec 2 dotplot) ----------
sing_weeks = Counter()
for r in singles:
    if r["aus"]: sing_weeks[r["artist"]] += 1
alb_weeks = Counter()
for r in albums:
    if r["aus"]: alb_weeks[r["artist"]] += 1

all_artists = set(sing_weeks) | set(alb_weeks)
combo = []
for a in all_artists:
    s = sing_weeks.get(a, 0); al = alb_weeks.get(a, 0)
    combo.append({"artist": a, "singles": s, "albums": al, "total": s + al})
combo.sort(key=lambda x: -x["total"])
top15 = combo[:15]

rows = []
for r in top15:
    rows.append({"artist": r["artist"], "format": "Albums",  "weeks": r["albums"],  "total": r["total"]})
    rows.append({"artist": r["artist"], "format": "Singles", "weeks": r["singles"], "total": r["total"]})
json.dump(rows, open(os.path.join(OUT, "aria_top_artists_format.json"), "w"), separators=(",", ":"))

# ---------- 8. Choropleth country totals (Sec 1) ----------
country = Counter()
with open(os.path.join(ROOT, "album_charts.csv"), encoding="utf-8") as f:
    r = csv.DictReader(f)
    for row in r:
        loc = row.get("location", "").strip()
        if not loc or loc == "non-Australian": continue
        country[loc] += 1
country_rows = [{"location": k, "weeks": v} for k, v in country.most_common()]
json.dump(country_rows, open(os.path.join(OUT, "aria_country_totals.json"), "w"), separators=(",", ":"))

# ---------- 9. Aussie share of singles top 50 per year (Sec 2 line) ----------
year_counts = defaultdict(lambda: {"aus": 0, "total": 0})
for r in singles:
    y = yr(r["date"])
    year_counts[y]["total"] += 1
    if r["aus"]: year_counts[y]["aus"] += 1
year_rows = [
    {"year": y, "aus": v["aus"], "total": v["total"], "aus_pct": v["aus"]/v["total"]*100 if v["total"] else 0}
    for y, v in sorted(year_counts.items())
]
json.dump(year_rows, open(os.path.join(OUT, "aria_singles_yearly.json"), "w"), separators=(",", ":"))

# ---------- 10. Bump rankings: top 5 Aussie artists by year (Sec 2) ----------
year_artist = defaultdict(lambda: defaultdict(int))
for r in singles:
    if not r["aus"]: continue
    y = yr(r["date"])
    if y < 2018: continue
    year_artist[y][r["artist"]] += 1

bump = []
for y, artists in sorted(year_artist.items()):
    ranked = sorted(artists.items(), key=lambda kv: -kv[1])[:5]
    for rank, (a, w) in enumerate(ranked, 1):
        bump.append({"year": y, "artist": a, "weeks": w, "rank": rank})

# keep top 5 Aussie artists per year, but require artist to appear in 2+ years overall
appearances = Counter(b["artist"] for b in bump)
kept = {a for a, c in appearances.items() if c >= 2}
bump = [b for b in bump if b["artist"] in kept]
json.dump(bump, open(os.path.join(OUT, "aria_bump_rankings.json"), "w"), separators=(",", ":"))

# ---------- 12. Every Australian #1 album (Sec 4 timeline) ----------
aus_alb_n1_weeks = Counter()
aus_alb_n1_first = {}
for r in albums:
    if r["aus"] and r["rank"] == 1:
        key = (r["artist"], r["title"])
        aus_alb_n1_weeks[key] += 1
        if key not in aus_alb_n1_first or r["date"] < aus_alb_n1_first[key]:
            aus_alb_n1_first[key] = r["date"]

aus_alb_timeline = [
    {"artist": k[0], "title": k[1],
     "year": yr(aus_alb_n1_first[k]), "first": aus_alb_n1_first[k],
     "weeks_at_1": v}
    for k, v in aus_alb_n1_weeks.items()
]
aus_alb_timeline.sort(key=lambda x: (x["year"], -x["weeks_at_1"]))
json.dump(aus_alb_timeline, open(os.path.join(OUT, "aus_n1_albums_timeline.json"), "w"), separators=(",", ":"))

# ---------- 11. Lollipop: top 15 Aussie artists by singles weeks (Sec 2) ----------
lolli = [{"artist": a, "weeks": w} for a, w in sing_weeks.most_common(15)]
json.dump(lolli, open(os.path.join(OUT, "aria_top_singles_artists.json"), "w"), separators=(",", ":"))

# ---------- Report ----------
print("Wrote:")
for f in sorted(os.listdir(OUT)):
    p = os.path.join(OUT, f)
    print(f"  data/derived/{f}  {os.path.getsize(p)/1024:.1f} KB")
