import matplotlib.pyplot as plt
import matplotlib as mpl
import numpy as np
import json
from matplotlib.patches import Wedge, Patch
from matplotlib.path import Path
import matplotlib.patches as mpatches

# ────────────────────────────────────────────────────────────────────
# CONFIGURACIÓN
# ────────────────────────────────────────────────────────────────────
DATA_DIR   = '/home/claude'              # donde están los JSON intermedios
CHARTS_DIR = '/home/claude/charts'       # donde guardar las figuras PNG

import os
os.makedirs(CHARTS_DIR, exist_ok=True)

# ADS dark theme
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
    'font.size': 14,
    'savefig.facecolor': '#000000',
    'savefig.dpi': 140,
})

# ────────────────────────────────────────────────────────────────────
# FIGURE 1 (split in 4): AUTHOR NETWORK — one file per period
# ────────────────────────────────────────────────────────────────────
with open('/home/claude/coauth_data.json') as f:
    cd = json.load(f)

# Normalize names (fix typos)
for a in cd['top20']:
    a['name'] = a['name'].replace('Sebástion', 'Sebastián').replace('Cantö', 'Cantó').replace('María.', 'María')
for p_list in cd['pairs_by_period'].values():
    for p in p_list:
        p['a'] = p['a'].replace('Sebástion', 'Sebastián').replace('Cantö', 'Cantó').replace('María.', 'María')
        p['b'] = p['b'].replace('Sebástion', 'Sebastián').replace('Cantö', 'Cantó').replace('María.', 'María')
for p in cd['pairs_all']:
    p['a'] = p['a'].replace('Sebástion', 'Sebastián').replace('Cantö', 'Cantó').replace('María.', 'María')
    p['b'] = p['b'].replace('Sebástion', 'Sebastián').replace('Cantö', 'Cantó').replace('María.', 'María')

AUTHOR_GROUPS = {
    'Sánchez,_Sebastián_F.':       ('IFS/galaxias',        '#9b59b6'),
    'Cano-Díaz,_Mariana':          ('IFS/galaxias',        '#9b59b6'),
    'Barrera-Ballesteros,_Jorge_K.':('IFS/galaxias',        '#9b59b6'),
    'Hernández-Toledo,_Héctor':    ('IFS/galaxias',        '#9b59b6'),
    'Román-Zúñiga,_Carlos_G.':     ('Cúmulos/poblaciones', '#1abc9c'),
    'Gómez_Maqueo_Chew,_Yilen':    ('Estrellas/binarias',  '#16a085'),
    'Ávila-Reese,_Vladimir':       ('Cosmología',          '#f39c12'),
    'Valenzuela,_Octavio':         ('Cosmología',          '#f39c12'),
    'Miyaji,_Takamitsu':           ('AGN/Rayos X',         '#e74c3c'),
    'Benítez,_Erika':              ('AGN/Rayos X',         '#e74c3c'),
    'Lee,_William_H.':             ('Compactos/GRB',       '#3498db'),
    'Fraija,_Nissim':              ('Compactos/GRB',       '#3498db'),
    'Page,_Dany':                  ('Compactos/GRB',       '#3498db'),
    'Suárez,_Genaro':              ('Compactos/GRB',       '#3498db'),
    'González,_María_Magdalena':   ('HAWC / γ-ray',        '#e67e22'),
    'Garma_Oehmichen,_Luis_Alberto':('HAWC / γ-ray',       '#e67e22'),
    'Peimbert,_Manuel':            ('Física nebular',      '#27ae60'),
    'Rodríguez,_Luis_F.':          ('Formación estelar',   '#c0392b'),
    'Cantó,_Jorge':                ('Formación estelar',   '#c0392b'),
    'Cruz-González,_Irene':        ('Estrellas/binarias',  '#16a085'),
}

key_map = {
    'Sánchez,_Sebástion_F.': 'Sánchez,_Sebastián_F.',
    'Cantö,_Jorge': 'Cantó,_Jorge',
    'González,_María._Magdalena': 'González,_María_Magdalena',
}

def short_name(k):
    n = k.replace('_', ' ')
    parts = n.split(', ')
    if len(parts) == 2:
        surname = parts[0]
        given = parts[1]
        initials = ''.join(w[0] + '.' for w in given.split() if w and w[0].isalpha())
        return f"{surname}, {initials}"
    return n

# Group authors by community for angular ordering
groups_order = ['IFS/galaxias', 'Cúmulos/poblaciones', 'Estrellas/binarias',
                'Cosmología', 'AGN/Rayos X', 'Compactos/GRB', 'HAWC / γ-ray',
                'Física nebular', 'Formación estelar']

author_keys = [a['key'] for a in cd['top20']]
author_keys = [key_map.get(k, k) for k in author_keys]

ordered_authors = []
for g in groups_order:
    for k in author_keys:
        info = AUTHOR_GROUPS.get(k)
        if info and info[0] == g:
            ordered_authors.append(k)
for k in author_keys:
    if k not in ordered_authors:
        ordered_authors.append(k)

def plot_author_ring_single(period_pairs, title, filename):
    """Plot a single chord diagram to its own file"""
    fig, ax = plt.subplots(figsize=(12, 12), facecolor='#000000')
    ax.set_facecolor('#000000')
    ax.set_aspect('equal')
    ax.axis('off')
    
    N = len(ordered_authors)
    angles = np.linspace(0, 2*np.pi, N, endpoint=False)
    angles = np.pi/2 - angles
    
    R_inner = 1.0
    R_outer = 1.10
    
    # Ring segments
    for i, k in enumerate(ordered_authors):
        info = AUTHOR_GROUPS.get(k, ('other', '#888888'))
        color = info[1]
        theta1 = np.degrees(angles[i]) - 180/N
        theta2 = np.degrees(angles[i]) + 180/N
        wedge = Wedge((0,0), R_outer, theta1, theta2, width=R_outer-R_inner,
                      facecolor=color, edgecolor='#000000', linewidth=0.8, alpha=0.95)
        ax.add_patch(wedge)
    
    # Labels — larger font
    for i, k in enumerate(ordered_authors):
        a = angles[i]
        r = R_outer + 0.05
        x = r * np.cos(a)
        y = r * np.sin(a)
        rot = np.degrees(a)
        if rot > 90 and rot < 270:
            rot = rot - 180
            ha = 'right'
        else:
            ha = 'left'
        sname = short_name(k)
        ax.text(x, y, sname, fontsize=13, color='#e0e0e8', fontweight='bold',
                ha=ha, va='center', rotation=rot, rotation_mode='anchor')
    
    if period_pairs:
        max_count = max(p['count'] for p in period_pairs)
    else:
        max_count = 1
    
    key_to_idx = {k: i for i, k in enumerate(ordered_authors)}
    # Sort pairs by count ASC so strongest on top
    for p in sorted(period_pairs, key=lambda x: x['count']):
        a_key = key_map.get(p['a'], p['a'])
        b_key = key_map.get(p['b'], p['b'])
        if a_key not in key_to_idx or b_key not in key_to_idx:
            continue
        ia = key_to_idx[a_key]
        ib = key_to_idx[b_key]
        ang_a = angles[ia]
        ang_b = angles[ib]
        xa, ya = R_inner * np.cos(ang_a), R_inner * np.sin(ang_a)
        xb, yb = R_inner * np.cos(ang_b), R_inner * np.sin(ang_b)
        
        alpha = min(0.9, 0.25 + 0.65 * p['count']/max_count)
        lw = 0.8 + 4.0 * p['count']/max_count
        
        info_a = AUTHOR_GROUPS.get(a_key, ('', '#888'))
        info_b = AUTHOR_GROUPS.get(b_key, ('', '#888'))
        if info_a[0] == info_b[0]:
            color = info_a[1]
        else:
            color = '#aaaaaa'
        
        verts = [(xa, ya), (0, 0), (xb, yb)]
        codes = [Path.MOVETO, Path.CURVE3, Path.CURVE3]
        path = Path(verts, codes)
        patch = mpatches.PathPatch(path, facecolor='none', edgecolor=color,
                                    lw=lw, alpha=alpha, capstyle='round')
        ax.add_patch(patch)
    
    # Annotate strongest pairs (top 5) with their count
    if period_pairs:
        top_pairs = sorted(period_pairs, key=lambda x: -x['count'])[:5]
        for p in top_pairs:
            a_key = key_map.get(p['a'], p['a'])
            b_key = key_map.get(p['b'], p['b'])
            if a_key not in key_to_idx or b_key not in key_to_idx:
                continue
            ia, ib = key_to_idx[a_key], key_to_idx[b_key]
            ang_a, ang_b = angles[ia], angles[ib]
            mx = 0.3 * (np.cos(ang_a) + np.cos(ang_b)) / 2
            my = 0.3 * (np.sin(ang_a) + np.sin(ang_b)) / 2
            ax.text(mx, my, str(p['count']), fontsize=11, color='#ffffff',
                    fontweight='bold', ha='center', va='center',
                    bbox=dict(boxstyle='round,pad=0.25', facecolor='#1a1a2e',
                              edgecolor='#5a5a7a', linewidth=0.8))
    
    ax.set_xlim(-1.75, 1.75)
    ax.set_ylim(-1.65, 1.65)
    ax.set_title(title, fontsize=18, color='#e0e0e8', pad=18, fontweight='bold')
    
    # Legend
    seen_groups = set()
    unique_handles = []
    for g in groups_order:
        for k in ordered_authors:
            info = AUTHOR_GROUPS.get(k)
            if info and info[0] == g and g not in seen_groups:
                unique_handles.append(Patch(facecolor=info[1], edgecolor='#000000', label=g))
                seen_groups.add(g)
    fig.legend(handles=unique_handles, loc='lower center',
               ncol=5, fontsize=11, frameon=False, bbox_to_anchor=(0.5, 0.02),
               labelcolor='#e0e0e8')
    
    plt.tight_layout(rect=[0, 0.06, 1, 0.97])
    plt.savefig(filename, bbox_inches='tight', facecolor='#000000', dpi=140)
    plt.close()
    print(f"Saved: {filename}")

# Four separate files
periods_data = [
    ('1990-2003', cd['pairs_by_period'].get('1990-2003', []),
     'Red de coautorías IA-UNAM — 1990–2003',
     '/home/claude/charts/network_1_1990-2003.png'),
    ('2003-2013', cd['pairs_by_period'].get('2003-2013', []),
     'Red de coautorías IA-UNAM — 2003–2013',
     '/home/claude/charts/network_2_2003-2013.png'),
    ('2013-2026', cd['pairs_by_period'].get('2013-2026', []),
     'Red de coautorías IA-UNAM — 2013–2026',
     '/home/claude/charts/network_3_2013-2026.png'),
    ('all',
     [{'a': p['a'], 'b': p['b'], 'count': p['count']} for p in cd['pairs_all']],
     'Red de coautorías IA-UNAM — histórico completo',
     '/home/claude/charts/network_4_historico.png'),
]

for pkey, pairs, title, fname in periods_data:
    plot_author_ring_single(pairs, title, fname)


# ────────────────────────────────────────────────────────────────────
# FIGURE 2: SCIENCE CASES (larger fonts)
# ────────────────────────────────────────────────────────────────────
with open('/home/claude/topics_data.json') as f:
    td = json.load(f)

TOPIC_COLORS = {
    'IFS / galaxias':             '#9b59b6',
    'AGN / Rayos X':              '#e74c3c',
    'Compactos / GRB':            '#3498db',
    'Cosmología':                 '#f39c12',
    'Física nebular':             '#27ae60',
    'Formación estelar / Radio':  '#c0392b',
    'ISM / hidrodinámica':        '#8e44ad',
    'Estrellas / binarias':       '#16a085',
    'HAWC / γ-ray':               '#e67e22',
    'Cúmulos / poblaciones':      '#1abc9c',
    'Dinámica galáctica':         '#7f8c8d',
}

topic_totals = td['topic_totals_papers']
topics_sorted = sorted(topic_totals.keys(), key=lambda t: -topic_totals[t])

fig = plt.figure(figsize=(22, 11), facecolor='#000000')
gs = fig.add_gridspec(1, 2, width_ratios=[1, 1.05], wspace=0.15)
ax_ring = fig.add_subplot(gs[0, 0])
ax_evo = fig.add_subplot(gs[0, 1])

# --- Ring (left) ---
ax_ring.set_facecolor('#000000')
ax_ring.set_aspect('equal')
ax_ring.axis('off')

total = sum(topic_totals.values())
start_angle = 90
current = start_angle
topic_angles = {}
R_inner = 0.70
R_outer = 1.00

for t in topics_sorted:
    n = topic_totals[t]
    frac = n / total
    sweep = frac * 360
    color = TOPIC_COLORS.get(t, '#888888')
    wedge = Wedge((0,0), R_outer, current - sweep, current, width=R_outer-R_inner,
                  facecolor=color, edgecolor='#000000', linewidth=1.2, alpha=0.92)
    ax_ring.add_patch(wedge)
    topic_angles[t] = (current - sweep, current)
    
    mid = current - sweep/2
    # Topic label inside (wedge is thin, so put outside if narrow)
    if sweep > 22:
        lbl_r = (R_outer + R_inner)/2
        lx = lbl_r * np.cos(np.radians(mid))
        ly = lbl_r * np.sin(np.radians(mid))
        words = t.split(' / ')
        label_str = '\n'.join(words)
        ax_ring.text(lx, ly, label_str, fontsize=12, color='white', fontweight='bold',
                     ha='center', va='center')
    else:
        # Outside the ring — label with name + count on same line
        ro = R_outer + 0.25
        mx = ro * np.cos(np.radians(mid))
        my = ro * np.sin(np.radians(mid))
        rot = mid
        if 90 < rot < 270:
            rot = rot - 180
        ax_ring.text(mx, my, f"{t}\n({n})", fontsize=11, color=color, fontweight='bold',
                     ha='center', va='center', rotation=rot, linespacing=1.2)
    # Paper count for big wedges only
    if sweep > 22:
        ro = R_outer + 0.12
        nx = ro * np.cos(np.radians(mid))
        ny = ro * np.sin(np.radians(mid))
        ax_ring.text(nx, ny, f'{n}', fontsize=14, color=color, fontweight='bold',
                     ha='center', va='center')
    current -= sweep

# Chord connections
connections = [
    ('IFS / galaxias', 'Cosmología', 0.7),
    ('IFS / galaxias', 'AGN / Rayos X', 0.4),
    ('Compactos / GRB', 'HAWC / γ-ray', 0.8),
    ('Compactos / GRB', 'Formación estelar / Radio', 0.3),
    ('Física nebular', 'Formación estelar / Radio', 0.5),
    ('Física nebular', 'ISM / hidrodinámica', 0.5),
    ('Estrellas / binarias', 'Cúmulos / poblaciones', 0.7),
    ('Cúmulos / poblaciones', 'Formación estelar / Radio', 0.5),
    ('AGN / Rayos X', 'Cosmología', 0.3),
]
for t1, t2, strength in connections:
    if t1 not in topic_angles or t2 not in topic_angles: continue
    s1, e1 = topic_angles[t1]
    s2, e2 = topic_angles[t2]
    m1 = np.radians((s1+e1)/2)
    m2 = np.radians((s2+e2)/2)
    x1, y1 = R_inner * np.cos(m1), R_inner * np.sin(m1)
    x2, y2 = R_inner * np.cos(m2), R_inner * np.sin(m2)
    verts = [(x1,y1), (0,0), (x2,y2)]
    codes = [Path.MOVETO, Path.CURVE3, Path.CURVE3]
    path = Path(verts, codes)
    alpha = 0.15 + 0.4 * strength
    lw = 1.5 + 6 * strength
    patch = mpatches.PathPatch(path, facecolor='none', edgecolor='#cccccc',
                                lw=lw, alpha=alpha, capstyle='round')
    ax_ring.add_patch(patch)

ax_ring.set_xlim(-1.85, 1.85)
ax_ring.set_ylim(-1.75, 1.75)
ax_ring.set_title('Casos científicos del IA-UNAM\n(tamaño ∝ número de artículos)',
                  fontsize=17, color='#e0e0e8', pad=18, fontweight='bold')

# --- Evolution plot (right) ---
ax_evo.set_facecolor('#000000')
years = td['years']
def smooth(y, w=5):
    y = np.array(y, dtype=float)
    kern = np.ones(w) / w
    return np.convolve(y, kern, mode='same')

for t in topics_sorted:
    y_vals = td['topics'][t]
    color = TOPIC_COLORS.get(t, '#888888')
    ax_evo.plot(years, smooth(y_vals, 5), color=color, linewidth=3.0,
                label=f"{t}", alpha=0.95)

ax_evo.set_xlabel('Año', fontsize=15, color='#e0e0e8')
ax_evo.set_ylabel('Artículos publicados (promedio móvil 5 años)',
                  fontsize=14, color='#e0e0e8')
ax_evo.set_title('Actividad temporal por caso científico',
                 fontsize=17, color='#e0e0e8', pad=18, fontweight='bold')
ax_evo.set_xlim(1995, 2026)
ax_evo.grid(True, alpha=0.2, color='#3a3a5a', linestyle=':')
ax_evo.spines['top'].set_visible(False)
ax_evo.spines['right'].set_visible(False)
ax_evo.spines['left'].set_color('#5a5a7a')
ax_evo.spines['bottom'].set_color('#5a5a7a')
ax_evo.tick_params(axis='both', labelsize=13)
ax_evo.legend(fontsize=13, loc='upper left', frameon=False, ncol=1,
              labelcolor='#e0e0e8')

fig.suptitle("IA-UNAM: casos científicos — estructura y evolución temporal",
             fontsize=20, color='#e0e0e8', y=0.97, fontweight='bold')
plt.savefig('/home/claude/charts/science_cases.png', bbox_inches='tight',
            facecolor='#000000', dpi=140)
plt.close()
print("Saved: science_cases.png")


# ────────────────────────────────────────────────────────────────────
# FIGURE 3: ACTIVITY BY SITE (larger fonts too)
# ────────────────────────────────────────────────────────────────────
with open('/home/claude/site_data.json') as f:
    sd = json.load(f)

SITE_COLORS = {
    'CU':       '#3498db',
    'Ensenada': '#9b59b6',
    'Morelia':  '#27ae60',
    'SPM':      '#e67e22',
}

fig, axes = plt.subplots(2, 1, figsize=(15, 10), facecolor='#000000',
                          gridspec_kw={'hspace': 0.32})

ax = axes[0]
ax.set_facecolor('#000000')
years = sd['years']
cu    = sd['sites']['CU']
en    = sd['sites']['Ensenada']
mo    = sd['sites']['Morelia']
sp    = sd['sites']['SPM']

width = 0.85
ax.bar(years, cu, width=width, color=SITE_COLORS['CU'],
       label=f'Ciudad Universitaria (CU) — {sum(cu):,} papers',
       edgecolor='#000000', linewidth=0.3)
ax.bar(years, en, width=width, bottom=cu, color=SITE_COLORS['Ensenada'],
       label=f'Ensenada — {sum(en):,} papers',
       edgecolor='#000000', linewidth=0.3)
ax.bar(years, mo, width=width, bottom=[a+b for a,b in zip(cu, en)],
       color=SITE_COLORS['Morelia'],
       label=f'Morelia — {sum(mo):,} papers',
       edgecolor='#000000', linewidth=0.3)
ax.bar(years, sp, width=width, bottom=[a+b+c for a,b,c in zip(cu, en, mo)],
       color=SITE_COLORS['SPM'],
       label=f'SPM — {sum(sp):,} papers',
       edgecolor='#000000', linewidth=0.3)

ax.set_xlabel('Año', fontsize=14, color='#e0e0e8')
ax.set_ylabel('Artículos', fontsize=14, color='#e0e0e8')
ax.set_title('IA-UNAM: artículos por año y sede',
             fontsize=16, color='#e0e0e8', pad=12, fontweight='bold')
ax.set_xlim(1995, 2027)
ax.legend(fontsize=12, loc='upper left', frameon=True, facecolor='#111122',
          edgecolor='#5a5a7a', labelcolor='#e0e0e8')
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
ax.spines['left'].set_color('#5a5a7a')
ax.spines['bottom'].set_color('#5a5a7a')
ax.tick_params(axis='both', labelsize=12)
ax.grid(True, alpha=0.2, color='#3a3a5a', linestyle=':', axis='y')

ax2 = axes[1]
ax2.set_facecolor('#000000')
cu_c = sd['cites_by_site_year']['CU']
en_c = sd['cites_by_site_year']['Ensenada']
mo_c = sd['cites_by_site_year']['Morelia']
sp_c = sd['cites_by_site_year']['SPM']

def smooth3(y, w=3):
    y = np.array(y, dtype=float)
    kern = np.ones(w) / w
    return np.convolve(y, kern, mode='same')

for site, cites, label_sum in [
    ('CU', cu_c, sum(cu_c)),
    ('Ensenada', en_c, sum(en_c)),
    ('Morelia', mo_c, sum(mo_c)),
    ('SPM', sp_c, sum(sp_c)),
]:
    ax2.plot(years, smooth3(cites, 3), color=SITE_COLORS[site], linewidth=3.0,
             label=f'{site} — {label_sum:,} citas', alpha=0.95)
    ax2.fill_between(years, 0, smooth3(cites, 3), color=SITE_COLORS[site], alpha=0.15)

ax2.set_xlabel('Año', fontsize=14, color='#e0e0e8')
ax2.set_ylabel('Citas recibidas (suavizado)', fontsize=14, color='#e0e0e8')
ax2.set_title('IA-UNAM: citas acumuladas por año y sede',
              fontsize=16, color='#e0e0e8', pad=12, fontweight='bold')
ax2.set_xlim(1995, 2027)
ax2.legend(fontsize=12, loc='upper left', frameon=True, facecolor='#111122',
           edgecolor='#5a5a7a', labelcolor='#e0e0e8')
ax2.spines['top'].set_visible(False)
ax2.spines['right'].set_visible(False)
ax2.spines['left'].set_color('#5a5a7a')
ax2.spines['bottom'].set_color('#5a5a7a')
ax2.tick_params(axis='both', labelsize=12)
ax2.grid(True, alpha=0.2, color='#3a3a5a', linestyle=':', axis='y')

fig.suptitle("IA-UNAM: actividad científica por sede (1995–2026)",
             fontsize=19, color='#e0e0e8', y=0.995, fontweight='bold')
plt.tight_layout(rect=[0, 0, 1, 0.97])
plt.savefig('/home/claude/charts/sites_activity.png', bbox_inches='tight',
            facecolor='#000000', dpi=140)
plt.close()
print("Saved: sites_activity.png")

print("\nAll figures regenerated with larger fonts.")
