#!/usr/bin/env python3
"""
Pipeline de extracción de datos para las figuras del informe IA-UNAM.
Lee los archivos de entrada (inferred_all_per_author.txt, inferred_summary_per_author.csv)
y genera tres archivos JSON intermedios:
  - coauth_data.json   : red de coautorías del top-20 por periodo
  - topics_data.json   : casos científicos y evolución temporal
  - site_data.json     : actividad por sede (CU / Ensenada / Morelia / SPM)

Estos JSON son consumidos por el script 02_make_figures.py.

Uso:
    python 01_extract_data.py

Ajustar las rutas INPUT_DIR y OUTPUT_DIR al inicio del script.
"""
import csv
import json
import re
from collections import defaultdict
from itertools import combinations

# ────────────────────────────────────────────────────────────────────
# CONFIGURACIÓN
# ────────────────────────────────────────────────────────────────────
INPUT_DIR  = '/mnt/user-data/uploads'   # donde están los txt/csv de entrada
OUTPUT_DIR = '/home/claude'             # donde guardar los JSON intermedios


# ────────────────────────────────────────────────────────────────────
# CARGA DE DATOS
# ────────────────────────────────────────────────────────────────────
def load_records():
    """Carga inferred_all_per_author.txt y filtra a investigadores IA-UNAM."""
    with open(f'{INPUT_DIR}/inferred_all_per_author.txt') as f:
        reader = csv.DictReader(f, delimiter='|')
        return [r for r in reader if r['is_ia_unam_researcher'] == 'True']


def load_authors_summary():
    """Carga inferred_summary_per_author.csv y devuelve lista ordenada por citas."""
    authors = []
    with open(f'{INPUT_DIR}/inferred_summary_per_author.csv') as f:
        reader = csv.DictReader(f)
        for row in reader:
            n = int(row['n_total_assigned'])
            c = int(row['citations_total_assigned'])
            if n > 0:
                authors.append({
                    'key':  row['author'],
                    'name': row['author'].replace('_', ' '),
                    'n':    n,
                    'c':    c,
                })
    authors.sort(key=lambda x: -x['c'])
    return authors


# ────────────────────────────────────────────────────────────────────
# 1. COAUTHORSHIP NETWORK (top-20 por periodo)
# ────────────────────────────────────────────────────────────────────
def build_coauth_data():
    records = load_records()
    authors = load_authors_summary()
    top20   = authors[:20]
    top20_keys = set(a['key'] for a in top20)

    paper_top20_authors = defaultdict(set)
    paper_year = {}
    for r in records:
        if r['author'] in top20_keys:
            paper_top20_authors[r['bibcode']].add(r['author'])
        paper_year[r['bibcode']] = int(r['bibcode'][:4]) if r['bibcode'][:4].isdigit() else 0

    def period_of(y):
        if y < 1990: return 'Antes de 1990'
        if y < 2003: return '1990-2003'
        if y < 2013: return '2003-2013'
        return '2013-2026'

    pair_counts_all = defaultdict(int)
    pair_counts_by_period = {
        'Antes de 1990': defaultdict(int),
        '1990-2003':     defaultdict(int),
        '2003-2013':     defaultdict(int),
        '2013-2026':     defaultdict(int),
    }

    for bib, aset in paper_top20_authors.items():
        if len(aset) >= 2:
            for a, b in combinations(sorted(aset), 2):
                pair_counts_all[(a, b)] += 1
                per = period_of(paper_year.get(bib, 0))
                pair_counts_by_period[per][(a, b)] += 1

    data = {
        'top20': top20,
        'pairs_all':    [{'a': k[0], 'b': k[1], 'count': v}
                         for k, v in pair_counts_all.items()],
        'pairs_by_period': {
            per: [{'a': k[0], 'b': k[1], 'count': v} for k, v in d.items()]
            for per, d in pair_counts_by_period.items()
        },
    }
    with open(f'{OUTPUT_DIR}/coauth_data.json', 'w') as f:
        json.dump(data, f)
    print(f"Saved {OUTPUT_DIR}/coauth_data.json  "
          f"({len(pair_counts_all)} unique pairs, "
          f"{sum(pair_counts_all.values())} total co-authorships)")


# ────────────────────────────────────────────────────────────────────
# 2. SCIENCE-CASE TOPICS
# ────────────────────────────────────────────────────────────────────
# Mapeo investigador → línea temática. Este mapa se construyó manualmente
# a partir de la producción histórica observada del IA-UNAM.
RESEARCHER_TOPIC = {
    # IFS / galaxies (CALIFA, MaNGA)
    'Sánchez,_Sebástion_F.': 'IFS / galaxias',
    'Cano-Díaz,_Mariana': 'IFS / galaxias',
    'Barrera-Ballesteros,_Jorge_K.': 'IFS / galaxias',
    'Ibarra-Medel,_Héctor_Javier': 'IFS / galaxias',
    'Hernández-Toledo,_Héctor': 'IFS / galaxias',
    'Vázquez-Mata,_José_Antonio': 'IFS / galaxias',
    'Lacerna,_Ivan': 'IFS / galaxias',
    'Aquino-Ortíz,_Erik': 'IFS / galaxias',
    'Sánchez-Menguiano,_L.': 'IFS / galaxias',
    'López-Cobá,_Carlos': 'IFS / galaxias',
    'Garma_Oehmichen,_Luis_Alberto': 'IFS / galaxias',
    'Camps-Fariña,_Artemi': 'IFS / galaxias',
    'Lacerda,_Eduardo_A._D.': 'IFS / galaxias',
    'Mejía-Narváez,_A.': 'IFS / galaxias',
    'Espinosa-Ponce,_C.': 'IFS / galaxias',
    'Lugo-Aranda,_A._Z.': 'IFS / galaxias',

    # AGN / X-ray
    'Miyaji,_Takamitsu': 'AGN / Rayos X',
    'Krongold,_Yair': 'AGN / Rayos X',
    'Benítez,_Erika': 'AGN / Rayos X',
    'Longinotti,_Anna_Lia': 'AGN / Rayos X',
    'Dultzin,_Deborah': 'AGN / Rayos X',
    'Dultzin-Hacyan,_Deborah': 'AGN / Rayos X',
    'Negrete,_Castalia_Alenka': 'AGN / Rayos X',
    'Martínez-Aldama,_Mary_Loli': 'AGN / Rayos X',
    'Coronado,_Y.': 'AGN / Rayos X',
    'de_Diego,_José_A.': 'AGN / Rayos X',
    'Chavushyan,_V._H.': 'AGN / Rayos X',
    'Sorcia,_Marco': 'AGN / Rayos X',

    # Compact objects, GRB, transients
    'Lee,_William_H.': 'Compactos / GRB',
    'Page,_Dany': 'Compactos / GRB',
    'Fraija,_Nissim': 'Compactos / GRB',
    'Suárez,_Genaro': 'Compactos / GRB',
    'De_Colle,_Fabio': 'Compactos / GRB',
    'de_Colle,_Fabio': 'Compactos / GRB',
    'Cavecchi,_Yuri': 'Compactos / GRB',
    'Beznogov,_Mikhail_V.': 'Compactos / GRB',
    'Becerra,_R._L.': 'Compactos / GRB',
    'Espíritu,_José_N.': 'Compactos / GRB',
    'Aguilar-Ruiz,_E.': 'Compactos / GRB',
    'Moreno_Méndez,_Enrique': 'Compactos / GRB',
    'Tejeda,_Emilio': 'Compactos / GRB',
    'Cruz-Osorio,_Alejandro': 'Compactos / GRB',
    'López-Cámara,_Diego': 'Compactos / GRB',
    'Nava-Callejas,_Martín': 'Compactos / GRB',

    # HAWC / High energies
    'González,_María._Magdalena': 'HAWC / γ-ray',
    'González,_María_Magdalena': 'HAWC / γ-ray',
    'Sacahui,_J._R.': 'HAWC / γ-ray',
    'Salesa_Greus,_F.': 'HAWC / γ-ray',
    'Patricelli,_B.': 'HAWC / γ-ray',

    # Cosmology / galaxy-halo
    'Ávila-Reese,_Vladimir': 'Cosmología',
    'Rodríguez-Puebla,_Aldo': 'Cosmología',
    'Valenzuela,_Octavio': 'Cosmología',
    'Hernández,_Xavier': 'Cosmología',
    'Hernandez,_Xavier': 'Cosmología',
    'Colín,_Pedro': 'Cosmología',
    'Calette,_A._R.': 'Cosmología',
    'Cabrera,_J._I.': 'Cosmología',
    'Magaña,_Juan': 'Cosmología',
    'Jaime,_Luisa_G.': 'Cosmología',
    'Hidalgo,_J._C.': 'Cosmología',
    'Fernández-Alvar,_Emma': 'Cosmología',
    'Ballesteros-Paredes,_Javier': 'ISM / hidrodinámica',
    'Vázquez-Semadeni,_Enrique': 'ISM / hidrodinámica',
    'García-Segura,_Guillermo': 'ISM / hidrodinámica',
    'Velázquez,_P._F.': 'ISM / hidrodinámica',

    # Nebular physics / abundances
    'Peimbert,_Manuel': 'Física nebular',
    'Peimbert,_Antonio': 'Física nebular',
    'Torres-Peimbert,_Silvia': 'Física nebular',
    'Morisset,_Christophe': 'Física nebular',
    'Delgado-Inglada,_Gloria': 'Física nebular',
    'Carigi,_Leticia': 'Física nebular',
    'Luridiana,_Valentina': 'Física nebular',
    'García-Rojas,_J.': 'Física nebular',
    'Méndez-Delgado,_J._E.': 'Física nebular',
    'Esteban,_C.': 'Física nebular',
    'Peña,_Miriam': 'Física nebular',
    'Richer,_Michael_G.': 'Física nebular',
    'Sabin,_L.': 'Física nebular',
    'Valerdi,_Mabel': 'Física nebular',

    # Star formation, radio, ISM
    'Rodríguez,_Luis_F.': 'Formación estelar / Radio',
    'Loinard,_L.': 'Formación estelar / Radio',
    'Cantó,_Jorge': 'Formación estelar / Radio',
    'Cantö,_Jorge': 'Formación estelar / Radio',
    'Canto,_J.': 'Formación estelar / Radio',
    'Raga,_Alejandro_C.': 'Formación estelar / Radio',
    'Lizano,_Susana': 'Formación estelar / Radio',
    "D'Alessio,_Paola": 'Formación estelar / Radio',
    'Curiel,_Salvador': 'Formación estelar / Radio',
    'Henney,_William': 'Formación estelar / Radio',
    'Trinidad,_Miguel_A.': 'Formación estelar / Radio',
    'Reyes-Ruiz,_Mauricio': 'Formación estelar / Radio',
    'Wilkin,_Francis_P.': 'Formación estelar / Radio',
    'Rodríguez-González,_A.': 'Formación estelar / Radio',
    'Fernández-López,_M.': 'Formación estelar / Radio',
    'Sanchez-Bermudez,_J.': 'Formación estelar / Radio',
    'Anglada,_G.': 'Formación estelar / Radio',
    'Carrasco-González,_C.': 'Formación estelar / Radio',
    'Tapia,_Mauricio': 'Formación estelar / Radio',
    'Roman-Lopes,_A.': 'Formación estelar / Radio',
    'Roman-Lopes,_Alexandre': 'Formación estelar / Radio',

    # Stars / binaries / variables
    'Allen,_Christine': 'Estrellas / binarias',
    'Arellano_Ferro,_Armando': 'Estrellas / binarias',
    'Hiriart,_David': 'Estrellas / binarias',
    'Tovmassian,_Gaghik': 'Estrellas / binarias',
    'Tovmassian,_Gagik': 'Estrellas / binarias',
    'Zharikov,_Sergey_V.': 'Estrellas / binarias',
    'Zharikov,_Sergey': 'Estrellas / binarias',
    'Echevarría,_Juan': 'Estrellas / binarias',
    'Costero,_Rafael': 'Estrellas / binarias',
    'Schuster,_W._J.': 'Estrellas / binarias',
    'Peña,_J._H.': 'Estrellas / binarias',
    'Pena,_J._H.': 'Estrellas / binarias',
    'Castro-Chacón,_J._H.': 'Estrellas / binarias',
    'Gómez_Maqueo_Chew,_Yilen': 'Estrellas / binarias',
    'Suárez,_Genaro': 'Estrellas / binarias',
    'Petrucci,_R.': 'Estrellas / binarias',
    'Michel,_Raúl': 'Estrellas / binarias',
    'Michel,_Raul': 'Estrellas / binarias',
    'Kirichenko,_A._Yu': 'Estrellas / binarias',
    'Hernández_Santisteban,_J._V.': 'Estrellas / binarias',
    'González-Buitrago,_D._H.': 'Estrellas / binarias',
    'Cruz-González,_Irene': 'Estrellas / binarias',
    'Roman-Garza,_J.': 'Estrellas / binarias',
    'Botello,_Marissa_K.': 'Estrellas / binarias',

    # Clusters & populations
    'Román-Zúñiga,_Carlos_G.': 'Cúmulos / poblaciones',
    'Hernández,_Jesús': 'Cúmulos / poblaciones',
    'Mateu,_Cecilia': 'Cúmulos / poblaciones',
    'Pichardo,_Bárbara': 'Cúmulos / poblaciones',
    'Pérez-Villegas,_A.': 'Cúmulos / poblaciones',
    'Moreno,_Edmundo': 'Cúmulos / poblaciones',

    # Galactic dynamics
    'Rosado,_Margarita': 'Dinámica galáctica',
    'Sánchez-Cruces,_M.': 'Dinámica galáctica',
    'Fuentes-Carrera,_Isaura': 'Dinámica galáctica',
    'Mendoza,_Sergio': 'Dinámica galáctica',
    'Aceves,_Héctor': 'Dinámica galáctica',
    'Bernal,_Cristian_G.': 'Dinámica galáctica',
}

MAIN_TOPICS = [
    'IFS / galaxias', 'AGN / Rayos X', 'Compactos / GRB', 'Cosmología',
    'Física nebular', 'Formación estelar / Radio', 'ISM / hidrodinámica',
    'Estrellas / binarias', 'HAWC / γ-ray', 'Cúmulos / poblaciones',
    'Dinámica galáctica',
]

def build_topics_data():
    records = load_records()
    paper_topics = defaultdict(set)
    for r in records:
        if r['author'] in RESEARCHER_TOPIC:
            paper_topics[r['bibcode']].add(RESEARCHER_TOPIC[r['author']])

    papers = {}
    for r in records:
        bib = r['bibcode']
        if bib not in papers:
            papers[bib] = {
                'year':  int(bib[:4]) if bib[:4].isdigit() else 0,
                'cites': int(r['citation_count']) if r['citation_count'].isdigit() else 0,
            }

    years = list(range(1990, 2027))
    topic_year = defaultdict(lambda: defaultdict(int))
    topic_counts = defaultdict(int)
    topic_cites = defaultdict(int)

    for bib, topics in paper_topics.items():
        y = papers[bib]['year']
        if not (1990 <= y <= 2026):
            continue
        for t in topics:
            topic_counts[t] += 1
            topic_cites[t]  += papers[bib]['cites']
            topic_year[t][y] += 1

    data = {
        'years':  years,
        'topics': {t: [topic_year[t].get(y, 0) for y in years] for t in topic_counts},
        'topic_totals_papers': dict(topic_counts),
        'topic_totals_cites':  dict(topic_cites),
    }
    with open(f'{OUTPUT_DIR}/topics_data.json', 'w') as f:
        json.dump(data, f)
    print(f"Saved {OUTPUT_DIR}/topics_data.json  ({len(topic_counts)} topics)")


# ────────────────────────────────────────────────────────────────────
# 3. SITE ACTIVITY (CU / Ensenada / Morelia / SPM)
# ────────────────────────────────────────────────────────────────────
def classify_site(aff_text):
    """Devuelve el conjunto de sedes detectadas en una afiliación IA-UNAM."""
    sites = set()
    al = aff_text.lower()

    # SPM (San Pedro Mártir)
    if ('san pedro mártir' in al or 'san pedro martir' in al or
        'spm' in al or 'oan-spm' in al):
        sites.add('SPM')

    # Ensenada
    if ('ensenada' in al or '22800' in aff_text or
        '22860' in aff_text or '22830' in aff_text):
        sites.add('Ensenada')

    # Morelia
    if ('morelia' in al or 'michoacán' in al or 'michoacan' in al or
        '58089' in aff_text or '58090' in aff_text or '58190' in aff_text):
        sites.add('Morelia')

    # CU (Ciudad Universitaria, CDMX)
    if ('70-264' in aff_text or '70264' in aff_text or '70-543' in aff_text or
        'ciudad universitaria' in al or 'cd. universitaria' in al or
        'cdmx' in al or 'd.f.' in al or 'mexico city' in al or
        'ciudad de méxico' in al or 'ciudad de mexico' in al):
        sites.add('CU')

    # Si no se detectó nada, por defecto CU
    if not sites:
        sites.add('CU')

    return sites


def build_site_data():
    records = load_records()
    papers = {}
    for r in records:
        bib = r['bibcode']
        if bib not in papers:
            papers[bib] = {
                'year':     int(bib[:4]) if bib[:4].isdigit() else 0,
                'cites':    int(r['citation_count']) if r['citation_count'].isdigit() else 0,
                'aff_text': r['matched_affiliations'],
            }

    site_year_papers = defaultdict(lambda: defaultdict(int))
    site_year_cites  = defaultdict(lambda: defaultdict(int))

    for bib, d in papers.items():
        if d['year'] < 1990 or d['year'] > 2026:
            continue
        for s in classify_site(d['aff_text']):
            site_year_papers[s][d['year']] += 1
            site_year_cites[s][d['year']]  += d['cites']

    years = list(range(1990, 2027))
    data = {
        'years': years,
        'sites': {
            s: [site_year_papers[s].get(y, 0) for y in years]
            for s in ['CU', 'Ensenada', 'Morelia', 'SPM']
        },
        'cites_by_site_year': {
            s: [site_year_cites[s].get(y, 0) for y in years]
            for s in ['CU', 'Ensenada', 'Morelia', 'SPM']
        },
    }
    with open(f'{OUTPUT_DIR}/site_data.json', 'w') as f:
        json.dump(data, f)
    print(f"Saved {OUTPUT_DIR}/site_data.json")
    for s in ['CU', 'Ensenada', 'Morelia', 'SPM']:
        n = sum(site_year_papers[s].values())
        c = sum(site_year_cites[s].values())
        print(f"    {s}: {n:>4} papers, {c:>7,} cites")


# ────────────────────────────────────────────────────────────────────
# MAIN
# ────────────────────────────────────────────────────────────────────
if __name__ == '__main__':
    print("Extrayendo datos de red de coautorías…")
    build_coauth_data()
    print()
    print("Extrayendo datos de casos científicos…")
    build_topics_data()
    print()
    print("Extrayendo datos de sedes…")
    build_site_data()
    print()
    print("Pipeline completado.")
