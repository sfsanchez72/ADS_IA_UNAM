"""
Figuras adicionales para el informe v10:
  F7  Distribución de citas por artículo (log-log, power-law)
  F8  Scatter artículos vs citas por autor (identifica perfiles)
  F9  h-index individual del top-30 (barras horizontales)
  F10 Evolución anual institucional (artículos + mediana vs media)
  F11 Pirámide de generaciones (año del primer artículo IA-UNAM)
  F12 Curva de Lorenz y coeficiente de Gini (concentración de citas)
  F13 Fracción como primer autor vs volumen total (perfiles de rol)
  F14 Top-15 journals usados por el IA-UNAM
"""
import matplotlib.pyplot as plt
import matplotlib as mpl
import numpy as np
import csv, re
from collections import defaultdict, Counter

plt.rcParams.update({
    'figure.facecolor': '#000000',
    'axes.facecolor': '#000000',
    'axes.edgecolor': '#5a5a7a',
    'axes.labelcolor': '#e0e0e8',
    'xtick.color': '#e0e0e8',
    'ytick.color': '#e0e0e8',
    'text.color': '#e0e0e8',
    'axes.grid': False,
    'font.family': 'sans-serif',
    'font.sans-serif': ['Arial', 'DejaVu Sans'],
    'font.size': 13,
    'savefig.facecolor': '#000000',
    'savefig.dpi': 140,
})

ACCENT    = '#4FA8E8'
HIGHLIGHT = '#F5A623'
GREEN     = '#2ECC71'
PURPLE    = '#9b59b6'
RED       = '#E74C3C'
TEAL      = '#1ABC9C'

# ───────────────── Load data ─────────────────
with open('/mnt/user-data/uploads/inferred_all_per_author.txt') as f:
    reader = csv.DictReader(f, delimiter='|')
    records = [r for r in reader if r['is_ia_unam_researcher'] == 'True']

papers = {}
for r in records:
    bib = r['bibcode']
    if bib not in papers:
        papers[bib] = {
            'year': int(bib[:4]) if bib[:4].isdigit() else 0,
            'cites': int(r['citation_count']) if r['citation_count'].isdigit() else 0,
        }

authors_data = []
with open('/mnt/user-data/uploads/inferred_summary_per_author.csv') as f:
    for row in csv.DictReader(f):
        n = int(row['n_total_assigned'])
        if n > 0:
            authors_data.append({
                'name': row['author'].replace('_', ' ').replace('Sebástion', 'Sebastián')
                                     .replace('Cantö', 'Cantó').replace('María.', 'María'),
                'n': n,
                'c': int(row['citations_total_assigned']),
                'fa_n': int(row['n_first_author_total_assigned']),
                'fa_c': int(row['citations_first_author_total_assigned']),
            })

# ═══════════════════════════════════════════════════════════════════
# F7: DISTRIBUCIÓN DE CITAS (log-log) — power law
# ═══════════════════════════════════════════════════════════════════
cites_all = sorted([c for c in [p['cites'] for p in papers.values()] if c >= 1], reverse=True)
ranks = np.arange(1, len(cites_all) + 1)

fig, ax = plt.subplots(figsize=(11, 7), facecolor='#000000')
ax.set_facecolor('#000000')
ax.loglog(ranks, cites_all, 'o', color=ACCENT, markersize=4, alpha=0.6,
          markeredgecolor='none')

# Fit power law to the body (ranks 10-500)
mask = (ranks >= 10) & (ranks <= 500)
slope, intercept = np.polyfit(np.log10(ranks[mask]), np.log10(np.array(cites_all)[mask]), 1)
x_fit = np.logspace(0, np.log10(len(cites_all)), 100)
y_fit = 10**intercept * x_fit**slope
ax.plot(x_fit, y_fit, '--', color=HIGHLIGHT, linewidth=2.2,
        label=f'Ley de potencias (α={-slope:.2f})')

# Annotate the top papers at well-separated positions
top5_names = [
    (1,  "GW170817 (4,016)",    4,    0.35),
    (2,  "MaNGA Bundy (1,707)", 20,   0.55),
    (3,  "SDSS Blanton (1,564)",80,   0.35),
    (4,  "SDSS Ahumada (1,413)",300,  0.22),
    (5,  "SDSS DR17 (1,316)",   1200, 0.12),
]
for rank, name, xpos, ypos_frac in top5_names:
    ax.annotate(name, xy=(rank, cites_all[rank-1]),
                xytext=(xpos, cites_all[rank-1]*ypos_frac),
                fontsize=11, color='#e0e0e8',
                arrowprops=dict(arrowstyle='->', color='#7AC5F0', lw=0.8, alpha=0.7))

ax.set_xlabel('Posición (rank)', fontsize=14)
ax.set_ylabel('Citas', fontsize=14)
ax.set_title('IA-UNAM: distribución de citas por artículo (log-log)',
             fontsize=16, color='#e0e0e8', pad=15, fontweight='bold')
ax.legend(fontsize=12, loc='upper right', frameon=False, labelcolor='#e0e0e8')
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
ax.grid(True, alpha=0.2, color='#3a3a5a', linestyle=':', which='both')
plt.tight_layout()
plt.savefig('/home/claude/charts/f7_citation_distribution.png',
            bbox_inches='tight', facecolor='#000000')
plt.close()
print("Saved F7")

# ═══════════════════════════════════════════════════════════════════
# F8: SCATTER papers vs citations por autor
# ═══════════════════════════════════════════════════════════════════
fig, ax = plt.subplots(figsize=(13, 8), facecolor='#000000')
ax.set_facecolor('#000000')
xs = [a['n'] for a in authors_data]
ys = [a['c'] for a in authors_data]
# Size proportional to FA fraction
sizes = [30 + 2*a['fa_n'] for a in authors_data]
# Color by FA fraction
fa_frac = [100*a['fa_n']/a['n'] if a['n']>0 else 0 for a in authors_data]

sc = ax.scatter(xs, ys, s=sizes, c=fa_frac, cmap='viridis',
                alpha=0.65, edgecolors='none')
cbar = plt.colorbar(sc, ax=ax, label='% artículos como primer autor')
cbar.ax.yaxis.label.set_color('#e0e0e8')
cbar.ax.tick_params(colors='#e0e0e8')
cbar.outline.set_edgecolor('#5a5a7a')

# Annotate outliers with ABSOLUTE positions (not relative) in log coords.
# Target: push labels into the empty top-left and bottom-right regions of the plot.
#
# The data span: x = 1 to ~330 papers (log), y = 1 to ~22000 citations (log).
# The dense "line" where most top authors live is at the top-right.
# Empty regions: top-left (few papers, many citations — nearly empty)
#                bottom-right (many papers, few citations — also empty).
#
# We route labels to those two regions using connected leader lines.
#
# Each entry: full_name : (label, tx_abs, ty_abs, halign, valign)
ANNOT_MAP = {
    # ===== Top-left column: 10 labels, high citations, small x =====
    'Sánchez, Sebastián F.':         ('Sánchez, S.F.',              1.3, 22000, 'left', 'center'),
    'Ávila-Reese, Vladimir':          ('Ávila-Reese, V.',            1.3, 15500, 'left', 'center'),
    'Miyaji, Takamitsu':              ('Miyaji, T.',                 1.3, 11800, 'left', 'center'),
    'Lee, William H.':                ('Lee, W.H.',                  1.3,  9000, 'left', 'center'),
    'Cano-Díaz, Mariana':             ('Cano-Díaz, M.',              1.3,  6800, 'left', 'center'),
    'Román-Zúñiga, Carlos G.':        ('Román-Zúñiga, C.G.',         1.3,  5300, 'left', 'center'),
    'Hernández-Toledo, Héctor':       ('Hernández-Toledo, H.',       1.3,  4100, 'left', 'center'),
    'Valenzuela, Octavio':            ('Valenzuela, O.',             1.3,  3200, 'left', 'center'),
    'Fraija, Nissim':                 ('Fraija, N.',                 1.3,  2500, 'left', 'center'),
    'Cruz-González, Irene':           ('Cruz-González, I.',          1.3,  1950, 'left', 'center'),

    # ===== Middle-left column (next tier) =====
    'Suárez, Genaro':                 ('Suárez, G.',                 1.3,  1500, 'left', 'center'),
    'González, María Magdalena':      ('González, M.M.',             1.3,  1150, 'left', 'center'),
    'Rodríguez, Luis F.':             ('Rodríguez, L.F.',            1.3,   880, 'left', 'center'),
    'Barrera-Ballesteros, Jorge K.':  ('Barrera-Ballesteros, J.K.',  1.3,   670, 'left', 'center'),
    'Garma Oehmichen, Luis Alberto':  ('Garma Oehmichen, L.A.',      1.3,   510, 'left', 'center'),

    # ===== Right column: anchored at x=360 (just right of densest cluster) =====
    'Peimbert, Manuel':               ('Peimbert, M.',              360,  13500, 'left', 'center'),
    'Benítez, Erika':                 ('Benítez, E.',               360,   9500, 'left', 'center'),
    'Page, Dany':                     ('Page, D.',                  360,   6700, 'left', 'center'),
    'Gómez Maqueo Chew, Yilen':       ('Gómez M. C., Y.',           360,   4700, 'left', 'center'),
    'Cantó, Jorge':                   ('Cantó, J.',                 360,   3300, 'left', 'center'),
    'Morisset, Christophe':           ('Morisset, C.',              360,   2300, 'left', 'center'),
    'Krongold, Yair':                 ('Krongold, Y.',              360,   1600, 'left', 'center'),
    'López, José Alberto':            ('López, J.A.',               360,   1100, 'left', 'center'),
    'Richer, Michael G.':             ('Richer, M.G.',              360,    770, 'left', 'center'),
    'Rosado, Margarita':              ('Rosado, M.',                360,    540, 'left', 'center'),
    'Zharikov, Sergey V.':            ('Zharikov, S.V.',            360,    380, 'left', 'center'),
    'Sabin, Laurence':                ('Sabin, L.',                 360,    267, 'left', 'center'),
    'Tovmassian, Gaghik H.':          ('Tovmassian, G.',            360,    187, 'left', 'center'),
    'Michel, Raúl':                   ('Michel, R.',                360,    131, 'left', 'center'),
}
for a in authors_data:
    entry = ANNOT_MAP.get(a['name'])
    if entry is None:
        continue
    label, tx, ty, ha, va = entry
    ax.annotate(label, xy=(a['n'], a['c']),
                xytext=(tx, ty),
                fontsize=10, color='#e0e0e8', alpha=0.95, ha=ha, va=va,
                fontweight='bold',
                arrowprops=dict(arrowstyle='-', color='#7AC5F0',
                                lw=0.6, alpha=0.55,
                                connectionstyle='arc3,rad=0.08'))

# Extend plot limits a little to leave room for labels
ax.set_xlim(0.8, 650)
ax.set_ylim(0.7, 35000)

ax.set_xscale('log')
ax.set_yscale('log')
ax.set_xlabel('Número de artículos', fontsize=14)
ax.set_ylabel('Citas totales', fontsize=14)
ax.set_title('IA-UNAM: artículos vs. citas por investigador (color = %FA, tamaño ∝ FA#)',
             fontsize=15, color='#e0e0e8', pad=15, fontweight='bold')
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
ax.grid(True, alpha=0.2, color='#3a3a5a', linestyle=':', which='both')
plt.tight_layout()
plt.savefig('/home/claude/charts/f8_scatter_authors.png',
            bbox_inches='tight', facecolor='#000000')
plt.close()
print("Saved F8")

# ═══════════════════════════════════════════════════════════════════
# F9: h-index individual del top-30
# ═══════════════════════════════════════════════════════════════════
# Compute h-index per author
author_papers = defaultdict(list)
for r in records:
    try:
        c = int(r['citation_count'])
    except:
        c = 0
    author_papers[r['author']].append(c)

def h_index(cites):
    s = sorted(cites, reverse=True)
    h = 0
    for i, c in enumerate(s, 1):
        if c >= i:
            h = i
        else:
            break
    return h

h_data = []
for a in authors_data:
    key = a['name'].replace(' ', '_')
    # Rebuild key with original underscores from inferred file
    # Use fuzzy match: find author key whose stripped version matches
    best = None
    for k in author_papers:
        if k.replace('_', ' ').replace('Sebástion', 'Sebastián').replace('Cantö','Cantó').replace('María.','María') == a['name']:
            best = k
            break
    if best:
        h = h_index(author_papers[best])
        h_data.append({'name': a['name'], 'h': h, 'c': a['c'], 'n': a['n']})

# Top 30 by h-index
h_data.sort(key=lambda x: -x['h'])
top30 = h_data[:30]
names = [a['name'].split(',')[0] + (', ' + a['name'].split(',')[1].strip()[:4] if ',' in a['name'] else '')
         for a in top30][::-1]
hs = [a['h'] for a in top30][::-1]

fig, ax = plt.subplots(figsize=(11, 11), facecolor='#000000')
ax.set_facecolor('#000000')
colors = [HIGHLIGHT if i == 29 else ACCENT for i in range(30)]
bars = ax.barh(names, hs, color=colors, edgecolor='#7AC5F0',
               linewidth=1.0, height=0.75)
for bar, v in zip(bars, hs):
    ax.text(v + 0.3, bar.get_y() + bar.get_height()/2, f'{v}',
            va='center', fontsize=10, color='#e0e0e8', fontweight='bold')
ax.set_xlabel('h-index individual', fontsize=14)
ax.set_title('IA-UNAM: h-index individual (top-30, histórico)',
             fontsize=16, color='#e0e0e8', pad=15, fontweight='bold')
ax.set_xlim(0, max(hs)*1.08)
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
ax.grid(True, alpha=0.2, color='#3a3a5a', linestyle=':', axis='x')
plt.tight_layout()
plt.savefig('/home/claude/charts/f9_h_index.png',
            bbox_inches='tight', facecolor='#000000')
plt.close()
print("Saved F9")

# ═══════════════════════════════════════════════════════════════════
# F10: Evolución anual institucional (papers + mediana vs media)
# ═══════════════════════════════════════════════════════════════════
years = sorted(set(p['year'] for p in papers.values() if 1990 <= p['year'] <= 2026))
n_per_year = {y: 0 for y in years}
cites_per_year = {y: [] for y in years}
for p in papers.values():
    y = p['year']
    if 1990 <= y <= 2026:
        n_per_year[y] += 1
        cites_per_year[y].append(p['cites'])

medians = [np.median(cites_per_year[y]) if cites_per_year[y] else 0 for y in years]
means   = [np.mean(cites_per_year[y])   if cites_per_year[y] else 0 for y in years]
counts  = [n_per_year[y] for y in years]

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(13, 9), facecolor='#000000',
                                gridspec_kw={'hspace': 0.32, 'height_ratios': [1, 1]})

# Panel 1: Papers per year
ax1.set_facecolor('#000000')
ax1.bar(years, counts, color=ACCENT, edgecolor='#7AC5F0', linewidth=0.5, width=0.85)
# Mark peak
peak = max(counts)
peak_year = years[counts.index(peak)]
ax1.axvline(peak_year, color=HIGHLIGHT, linestyle=':', alpha=0.6)
ax1.annotate(f'Pico: {peak_year} ({peak} papers)',
             xy=(peak_year, peak), xytext=(peak_year-6, peak*0.95),
             fontsize=11, color=HIGHLIGHT, fontweight='bold')
ax1.set_xlabel('Año', fontsize=13)
ax1.set_ylabel('Artículos únicos', fontsize=13)
ax1.set_title('IA-UNAM: artículos únicos por año',
              fontsize=15, color='#e0e0e8', pad=10, fontweight='bold')
ax1.spines['top'].set_visible(False)
ax1.spines['right'].set_visible(False)
ax1.grid(True, alpha=0.2, color='#3a3a5a', linestyle=':', axis='y')
ax1.set_xlim(1989, 2027)

# Panel 2: Mean vs median citations per paper
ax2.set_facecolor('#000000')
ax2.plot(years, means, '-', color=ACCENT, linewidth=2.5,
         label='Media de citas/artículo', marker='o', markersize=5)
ax2.plot(years, medians, '-', color=HIGHLIGHT, linewidth=2.5,
         label='Mediana de citas/artículo', marker='s', markersize=5)
ax2.set_xlabel('Año', fontsize=13)
ax2.set_ylabel('Citas por artículo', fontsize=13)
ax2.set_title('IA-UNAM: evolución de la media y mediana de citas/artículo',
              fontsize=15, color='#e0e0e8', pad=10, fontweight='bold')
ax2.legend(fontsize=12, frameon=False, loc='upper right', labelcolor='#e0e0e8')
ax2.spines['top'].set_visible(False)
ax2.spines['right'].set_visible(False)
ax2.grid(True, alpha=0.2, color='#3a3a5a', linestyle=':', axis='y')
ax2.set_xlim(1989, 2027)

plt.savefig('/home/claude/charts/f10_evolution.png',
            bbox_inches='tight', facecolor='#000000')
plt.close()
print("Saved F10")

# ═══════════════════════════════════════════════════════════════════
# F11: Pirámide de generaciones (año del primer artículo IA-UNAM)
# ═══════════════════════════════════════════════════════════════════
# For each researcher, find year of their first IA-UNAM paper
first_year = {}
for r in records:
    auth = r['author']
    bib = r['bibcode']
    if bib[:4].isdigit():
        y = int(bib[:4])
        if auth not in first_year or y < first_year[auth]:
            first_year[auth] = y

# Group into decades
decade_count = Counter()
for auth, y in first_year.items():
    decade = (y // 5) * 5
    if 1970 <= decade <= 2025:
        decade_count[decade] += 1

decades = sorted(decade_count.keys())
counts_dec = [decade_count[d] for d in decades]
labels = [f'{d}-{d+4}' for d in decades]

fig, ax = plt.subplots(figsize=(12, 7), facecolor='#000000')
ax.set_facecolor('#000000')
colors = [HIGHLIGHT if d >= 2010 else ACCENT for d in decades]
bars = ax.bar(labels, counts_dec, color=colors, edgecolor='#7AC5F0',
              linewidth=0.8, width=0.75)
for bar, v in zip(bars, counts_dec):
    ax.text(bar.get_x() + bar.get_width()/2, v + 1, f'{v}',
            ha='center', fontsize=11, color='#e0e0e8', fontweight='bold')
ax.set_xlabel('Lustro del primer artículo IA-UNAM', fontsize=14)
ax.set_ylabel('Investigadores que debutaron', fontsize=14)
ax.set_title('IA-UNAM: generaciones de investigadores (año de debut)',
             fontsize=16, color='#e0e0e8', pad=15, fontweight='bold')
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
ax.grid(True, alpha=0.2, color='#3a3a5a', linestyle=':', axis='y')
plt.setp(ax.get_xticklabels(), rotation=35, ha='right')
plt.tight_layout()
plt.savefig('/home/claude/charts/f11_generations.png',
            bbox_inches='tight', facecolor='#000000')
plt.close()
print("Saved F11")

# ═══════════════════════════════════════════════════════════════════
# F12: Curva de Lorenz y coeficiente de Gini
# ═══════════════════════════════════════════════════════════════════
# Sort authors by citations ASC
cites_sorted = sorted([a['c'] for a in authors_data])
n = len(cites_sorted)
cum_cites = np.cumsum(cites_sorted)
total = cum_cites[-1]
# Lorenz curve: x = fraction of authors (sorted ASC), y = fraction of citations
x = np.arange(1, n+1) / n
y = cum_cites / total

# Gini coefficient = 1 - 2 * area under Lorenz
gini = 1 - 2 * np.trapezoid(y, x)

fig, ax = plt.subplots(figsize=(10, 10), facecolor='#000000')
ax.set_facecolor('#000000')
ax.plot(x, y, color=ACCENT, linewidth=3, label='Curva de Lorenz')
ax.plot([0, 1], [0, 1], '--', color='#7a7a9a', linewidth=1.5,
        label='Igualdad perfecta')
ax.fill_between(x, x, y, color=ACCENT, alpha=0.15)
# Annotate Gini
ax.text(0.05, 0.75, f'Coeficiente de Gini = {gini:.3f}',
        fontsize=14, color=HIGHLIGHT, fontweight='bold',
        bbox=dict(boxstyle='round,pad=0.4', facecolor='#1a1a2e',
                  edgecolor='#5a5a7a', linewidth=0.8))
# Also mark some points
for frac in [0.5, 0.75, 0.9]:
    idx = int(frac * n) - 1
    ax.scatter([x[idx]], [y[idx]], s=80, color=HIGHLIGHT,
               zorder=5, edgecolors='#FFD080')
    ax.annotate(f'{100*frac:.0f}% autores\n→ {100*y[idx]:.1f}% citas',
                xy=(x[idx], y[idx]), xytext=(x[idx]-0.08, y[idx]+0.08),
                fontsize=10, color='#e0e0e8',
                arrowprops=dict(arrowstyle='-', color='#7AC5F0', lw=0.8))

ax.set_xlabel('Fracción de investigadores (ordenados por citas, asc.)',
              fontsize=13)
ax.set_ylabel('Fracción acumulada de citas', fontsize=13)
ax.set_title('IA-UNAM: curva de Lorenz de concentración de citas',
             fontsize=16, color='#e0e0e8', pad=15, fontweight='bold')
ax.set_xlim(0, 1)
ax.set_ylim(0, 1)
ax.legend(fontsize=12, loc='upper left', frameon=False, labelcolor='#e0e0e8')
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
ax.grid(True, alpha=0.2, color='#3a3a5a', linestyle=':')
ax.set_aspect('equal')
plt.tight_layout()
plt.savefig('/home/claude/charts/f12_lorenz.png',
            bbox_inches='tight', facecolor='#000000')
plt.close()
print(f"Saved F12 — Gini = {gini:.3f}")

# ═══════════════════════════════════════════════════════════════════
# F13: Fracción FA vs volumen (perfil de rol)
# ═══════════════════════════════════════════════════════════════════
fig, ax = plt.subplots(figsize=(11, 7), facecolor='#000000')
ax.set_facecolor('#000000')
# Filter to authors with ≥5 papers
filt = [a for a in authors_data if a['n'] >= 5]
xs = [a['n'] for a in filt]
ys = [100 * a['fa_n'] / a['n'] for a in filt]
cols = [a['c'] for a in filt]

sc = ax.scatter(xs, ys, s=50, c=cols, cmap='plasma',
                alpha=0.7, edgecolors='none', norm=mpl.colors.LogNorm())
cbar = plt.colorbar(sc, ax=ax, label='Citas totales (log)')
cbar.ax.yaxis.label.set_color('#e0e0e8')
cbar.ax.tick_params(colors='#e0e0e8')

# Annotate interesting points
hi_fa = sorted(filt, key=lambda a: -a['fa_n']/a['n'] if a['n']>=15 else 0)[:5]
hi_vol = sorted(filt, key=lambda a: -a['n'])[:10]

labeled = set()
for a in hi_fa + hi_vol:
    if a['name'] in labeled:
        continue
    labeled.add(a['name'])
    short = a['name'].split(',')[0]
    ax.annotate(short, xy=(a['n'], 100*a['fa_n']/a['n']),
                xytext=(a['n']*1.02, 100*a['fa_n']/a['n']+1),
                fontsize=9, color='#e0e0e8', alpha=0.9)

# Reference lines
ax.axhline(50, color='#7a7a9a', linestyle=':', alpha=0.4)
ax.text(500, 51, 'Paridad: 50% como primer autor', fontsize=9,
        color='#7a7a9a', alpha=0.8, va='bottom')

ax.set_xscale('log')
ax.set_xlabel('Número total de artículos (log)', fontsize=14)
ax.set_ylabel('% artículos como primer autor', fontsize=14)
ax.set_title('IA-UNAM: perfil de rol (fracción primer autor vs. volumen)',
             fontsize=15, color='#e0e0e8', pad=15, fontweight='bold')
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
ax.grid(True, alpha=0.2, color='#3a3a5a', linestyle=':', which='both')
ax.set_ylim(0, 105)
plt.tight_layout()
plt.savefig('/home/claude/charts/f13_fa_fraction.png',
            bbox_inches='tight', facecolor='#000000')
plt.close()
print("Saved F13")

# ═══════════════════════════════════════════════════════════════════
# F14: Top-15 journals usados por el IA-UNAM
# ═══════════════════════════════════════════════════════════════════
# Extract journal from bibcode positions 4-9 (5 chars, journal code)
# Format: YYYYJJJJJVVVV.PPPPA
JOURNAL_NAMES = {
    'A&A..': 'A&A',
    'ApJ..': 'ApJ',
    'MNRAS': 'MNRAS',
    'ApJS.': 'ApJS',
    'AJ...': 'AJ',
    'RMxAA': 'RMxAA',
    'A&ARv': 'A&A Rev',
    'PASP.': 'PASP',
    'ApJL.': 'ApJL',
    'Natur': 'Nature',
    'NatAs': 'Nat Astron',
    'Sci..': 'Science',
    'JCAP.': 'JCAP',
    'PhRvD': 'PhysRev D',
    'PhRvL': 'PhysRev Lett',
    'A&AT.': 'A&A Trans',
    'NewA.': 'New Astron',
    'JKAS.': 'J Korean AS',
    'PASJ.': 'PASJ',
    'IJMPD': 'Int J Mod Phys D',
    'AN...': 'Astron. Nachr.',
    'MmSAI': 'Mem SAI',
    'EM&P.': 'Earth Moon Planets',
    'Ap&SS': 'Ap&SS',
    'JATIS': 'JATIS',
    'ARA&A': 'ARA&A',
    'JPhCS': 'J Phys Conf Ser',
    'ChA&A': 'Chinese A&A',
    'EAS..': 'EAS Pub Ser',
    'BAVSR': 'BAV Rund',
    'OEJV.': 'OEJV',
}

def journal_of(bib):
    if len(bib) < 10:
        return None
    code = bib[4:9]
    return JOURNAL_NAMES.get(code, code)

journal_count = Counter()
for p in papers:
    j = journal_of(p)
    if j:
        journal_count[j] += 1

top15j = journal_count.most_common(15)
jnames = [j[0] for j in top15j][::-1]
jcounts = [j[1] for j in top15j][::-1]

fig, ax = plt.subplots(figsize=(11, 8), facecolor='#000000')
ax.set_facecolor('#000000')
colors = [HIGHLIGHT if i == 14 else ACCENT for i in range(15)]
bars = ax.barh(jnames, jcounts, color=colors, edgecolor='#7AC5F0',
               linewidth=0.8, height=0.75)
for bar, v in zip(bars, jcounts):
    ax.text(v + 10, bar.get_y() + bar.get_height()/2, f'{v:,}',
            va='center', fontsize=11, color='#e0e0e8', fontweight='bold')
ax.set_xlabel('Número de artículos', fontsize=14)
ax.set_title('IA-UNAM: top-15 revistas por número de publicaciones (histórico)',
             fontsize=15, color='#e0e0e8', pad=15, fontweight='bold')
ax.set_xlim(0, max(jcounts)*1.10)
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
ax.grid(True, alpha=0.2, color='#3a3a5a', linestyle=':', axis='x')
plt.tight_layout()
plt.savefig('/home/claude/charts/f14_journals.png',
            bbox_inches='tight', facecolor='#000000')
plt.close()
print("Saved F14")

print("\nAll 8 extra figures generated.")
