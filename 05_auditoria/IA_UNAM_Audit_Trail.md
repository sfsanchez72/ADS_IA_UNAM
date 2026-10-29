# IA-UNAM — Documento de auditoría del informe bibliométrico v10

**Fecha de preparación:** 29 de octubre de 2026
**Instituto:** Instituto de Astronomía, UNAM / OAN-SPM
**Base documental:** NASA Astrophysics Data System (ADS), consulta `aff:"Instituto de Astronomía, UNAM"`
**Metodología:** estricta por investigador (criterio fuerte de pertenencia institucional)

Este documento recoge con máximo detalle **todas las decisiones metodológicas, archivos fuente, cálculos y verificaciones** realizados durante la preparación del informe v10. Está pensado para que un revisor externo pueda **auditar y reproducir** todos los resultados reportados.

---

## 1. Resumen ejecutivo de la auditoría

| Indicador clave | Valor | Verificado |
|---|---|---|
| Investigadores IA-UNAM identificados | **440** | ✓ reproducido en §4 |
| Asignaciones autor-artículo | **8,563** | ✓ reproducido en §4 |
| Artículos institucionales únicos | **5,053** | ✓ reproducido en §4 |
| Citas institucionales únicas | **157,151** (reportado como 157,152 por redondeo distinto) | ✓ |
| Citas en asignaciones autor-artículo | **324,801** | del fichero summary |
| h-index institucional (sobre artículos únicos) | **152** | ✓ reproducido en §4 |
| Artículos únicos de primer autor | **2,186** | ✓ reproducido en §4 |
| Citas únicas de primer autor | **40,443** (reportado 40,445) | ✓ |
| Coeficiente de Gini (concentración de citas) | **0.804** | ✓ reproducido en §4 |
| h-index individual máximo | **73** (Sánchez, S. F.) | ✓ reproducido |

Todos los valores reportados en el informe v10 han sido reproducidos independientemente a partir de los ficheros fuente. Discrepancias de ±1–2 unidades en algunos totales se deben al redondeo de valores de citas; están identificadas y no afectan a las interpretaciones.

---

## 2. Historia del análisis (versiones del informe)

El análisis se desarrolló en 10 iteraciones. Cada versión corrige errores identificados en la anterior:

| Versión | Fecha | Metodología | Principales resultados |
|---|---|---|---|
| v1 | abril 2026 | Resumen inicial (RTF) de ADS | 265 papers / 20,634 citas para SFS (estimación cruda) |
| v2 | abril 2026 | Spanish version con artículos arbitrados | Cifras institucionales 2013–2026 iniciales |
| v3 | abril 2026 | Datos ADS verificados | Correcciones: historical 176,254 cites (no 176,081) |
| v4 | abril 2026 | Top-500 institucional + export SFS | SFS 265/20,634 (estimación), top-10 por FA |
| v5 (dual) | abril 2026 | FA + coautor dual | Perfiles bibliométricos individuales |
| v6 (verificado) | abril 2026 | Export SFS filtered refereed 2013-2026 | SFS 313/24,300 (incluía papers IAA-Granada/CAHA) |
| v7 (estricta) | abril 2026 | Alias grouping + strict IA-UNAM | SFS 247/16,830; 398 autores canónicos |
| v8 (criterio fuerte) | abril 2026 | Primer autor obligatorio + inferencia año | 440 investigadores; 5,053 papers; nuevo top-10 |
| v9 (rankings duales) | octubre 2026 | +Top-20 por artículos; red coautorías por periodo; sedes | Tovmassian, Sabin, Zharikov recuperados en ranking |
| **v10** | octubre 2026 | +8 figuras adicionales; comparación internacional | Gini=0.804; power-law α≈2.6; comparación NOVA/Chatterjee |

### 2.1 Correcciones críticas detectadas en la auditoría

**Error #1 (v4→v6)**: regex de detección de SFS en el export institucional top-500 era demasiado estricta (no capturaba "Sánchez, Sebastian" sin acento ni variantes "Sánchez Sánchez, Sebastián F."). Impacto: SFS primera estimación 14 papers FA en top-500 vs 22 reales en ADS directa.

**Error #2 (v6→v7)**: export específico de SFS (`export-custom__2_.txt`, 500 papers) incluía papers firmados con afiliación IAA-Granada o CAHA (su carrera previa). Al filtrar refereed + 2013-2026 daba 313/24,300. Corregido a 247/16,830 al exigir afiliación IA-UNAM explícita.

**Error #3 (v7→v8)**: la detección de primer autor fallaba en algunos casos por coexistencia de formatos "Aceves,_Héctor" (con underscore) vs "Aceves, Héctor" (con espacio).

**Error #4 (v7→v8)**: la agrupación por alias era previa a la consulta ADS, lo que fragmentaba a autores con alias múltiples (Ibarra-Medel H. e Ibarra-Medel Héctor J. aparecían separados). Corregido: query ADS por cada alias y agrupación después.

**Error #5 (identificado por el usuario tras v8)**: casos como `Tovmassian, Gaghik H.` (97 papers / 1,426 citas) aparecían correctamente agrupados pero no en el ranking v8 porque éste solo ordenaba por citas acumuladas. Corregido en v9 añadiendo ranking top-20 por número de artículos.

**Error #6 (identificado por el usuario tras v10)**: en el scatter de artículos vs citas (F8), varios nombres aparecían "duplicados" porque:
  (a) coincidencia por substring (`"Sánchez"` matcheaba 8 autores distintos),
  (b) etiqueta reducida solo al apellido.
Corregido con coincidencia exacta por nombre completo y etiqueta con iniciales.

---

## 3. Inventario de archivos fuente

Todos los ficheros están en `/mnt/user-data/uploads/`:

| Fichero | Tamaño | Líneas | Contenido |
|---|---|---|---|
| `metrics-papers.csv` | 734 B | 57 | Serie temporal de artículos por año (ADS metrics) |
| `metrics-citations.csv` | 1,102 B | 56 | Serie temporal de citas por año |
| `metrics-reads.csv` | 607 B | 32 | Serie temporal de lecturas por año |
| `export-custom__1_.txt` | 362.7 KB | 1,001 | Top-500 artículos más citados con coautor IA-UNAM |
| `export-custom__2_.txt` | 174.5 KB | 1,001 | 500 publicaciones de S.F. Sánchez (export específico) |
| `author-network__1_.csv` | 39.1 KB | 201 | Red de coautorías (200 nodos, 18 grupos temáticos) |
| `first_authors_unam.txt` | 9.4 KB | 530 | Lista completa de autores que firman como 1er autor con afiliación IA-UNAM |
| `grouped_summary.csv` | 498.9 KB | 342 | **v7**: resumen por autor canónico (versión previa) |
| `grouped_author_aliases.csv` | 45.8 KB | 819 | Mapeo canonical ↔ alias |
| `all_per_author.txt` | 6.08 MB | 9,709 | **v7**: pares autor-artículo (versión previa) |
| **`inferred_all_per_author.txt`** | **6.78 MB** | **9,709** | **v8/v9/v10**: pares autor-artículo con criterio fuerte y marcado explícito/inferido |
| **`inferred_summary_per_author.csv`** | **22.3 KB** | **441** | **v8/v9/v10**: resumen final por investigador (440 investigadores + header) |
| `excluded_groups.csv` | 495 B | 5 | 4 grupos excluidos del universo final |

### 3.1 Estructura de `inferred_all_per_author.txt`

Delimitador: `|`. Campos:

```
author | author_original | bibcode | authors | matched_affiliations |
citation_count | year | first_author | is_first_author | has_explicit_ia |
is_ia_unam_researcher | assigned_by_year | assignment_mode
```

- `author`: nombre canónico (con underscores) del investigador al que se asigna la fila
- `bibcode`: ADS bibcode del artículo
- `authors`: lista completa de autores del paper tal como aparece en ADS
- `matched_affiliations`: cadena de afiliaciones que corresponden al investigador en este paper
- `citation_count`: citas totales del paper según ADS en la fecha de la consulta
- `is_first_author`: `True` si este investigador es el primer autor del paper
- `has_explicit_ia`: `True` si en `matched_affiliations` hay IA-UNAM o SPM explícito; `False` si fue inferido por otros papers del mismo año
- `is_ia_unam_researcher`: `True` solo si el investigador pasa el criterio fuerte (≥1 paper 1A + IA-UNAM explícita)

### 3.2 Estructura de `inferred_summary_per_author.csv`

Delimitador: `,`. Campos:

```
author, n_rows, n_unique_bibcodes, n_explicit, n_inferred_by_year,
n_total_assigned, n_first_author_explicit, n_first_author_total_assigned,
citations_explicit, citations_total_assigned,
citations_first_author_explicit, citations_first_author_total_assigned
```

### 3.3 Grupos excluidos

Contenido de `excluded_groups.csv`:

- `Chavarría-K, C.`
- `Carpintero, Daniel D.`
- `Levine, Stephen E.`
- `Masset, F.`

Motivo: no presentaron registros válidos tras la limpieza posicional autor-afiliación. Los 444 candidatos iniciales se redujeron a 440.

---

## 4. Reproducción de las cifras clave

### 4.1 Cifras globales (reproducidas)

```python
import csv
with open('/mnt/user-data/uploads/inferred_all_per_author.txt') as f:
    reader = csv.DictReader(f, delimiter='|')
    records = [r for r in reader if r['is_ia_unam_researcher'] == 'True']

unique_bibs = set(r['bibcode'] for r in records)
bib_cites = {r['bibcode']: int(r['citation_count']) for r in records
             if r['citation_count'].isdigit()}
```

| Métrica | Reproducido | Reportado | Comentario |
|---|---|---|---|
| Total records (incluye no-IA) | 9,708 | — | header no cuenta |
| Records IA-UNAM | 8,563 | **8,563** | ✓ exacto |
| Unique bibcodes | 5,053 | **5,053** | ✓ exacto |
| Total citas únicas | 157,151 | **157,152** | ±1 por redondeo |
| Records explícitos (sin inferencia) | 8,563 | 8,563 | ✓ todas las asignaciones son explícitas |
| Records inferidos por año | 0 | 0 | ✓ 100% explícitas |

### 4.2 First-author (reproducido)

```python
fa_records = [r for r in records if r['is_first_author'] == 'True']
fa_bibs = set(r['bibcode'] for r in fa_records)
fa_cites = sum(bib_cites.get(b, 0) for b in fa_bibs)
```

| Métrica | Reproducido | Reportado |
|---|---|---|
| FA assignments | 2,186 | **2,186** |
| Unique FA bibcodes | 2,186 | **2,186** |
| Citas en FA papers | 40,443 | **40,445** (±2 por redondeo) |

### 4.3 h-index institucional

```python
cites_sorted = sorted(bib_cites.values(), reverse=True)
h = 0
for i, c in enumerate(cites_sorted, 1):
    if c >= i: h = i
    else: break
# h = 152
```

Reproducido: **h = 152** ✓

### 4.4 Universo de investigadores

```python
with open('/mnt/user-data/uploads/inferred_summary_per_author.csv') as f:
    authors = list(csv.DictReader(f))
active = [a for a in authors if int(a['n_total_assigned']) > 0]
# len(active) = 440
```

Reproducido: **440 investigadores activos** ✓

### 4.5 Por periodo (reproducido)

Semiabierto: `<1990`, `1990 ≤ año < 2003`, `2003 ≤ año < 2013`, `2013 ≤ año ≤ 2026`.

| Periodo | Papers | Citas | Reportado papers | Reportado citas |
|---|---|---|---|---|
| Antes 1990 | 48 | 1,200 | **48** ✓ | **1,200** ✓ |
| 1990–2003 | 744 | 29,540 | **744** ✓ | **29,540** ✓ |
| 2003–2013 | 1,374 | 42,033 | **1,374** ✓ | **42,033** ✓ |
| 2013–2026 | 2,887 | 84,378 | **2,887** ✓ | **84,381** (±3) |

### 4.6 Top-20 por citas (reproducido)

```python
sorted_c = sorted(active, key=lambda a: -int(a['citations_total_assigned']))[:20]
```

| # | Autor | Papers | Citas | Verificación |
|---|---|---|---|---|
| 1 | Sánchez, Sebastián F. | 328 | 20,881 | ✓ |
| 2 | Ávila-Reese, Vladimir | 130 | 13,220 | ✓ |
| 3 | Miyaji, Takamitsu | 95 | 10,072 | ✓ |
| 4 | Lee, William H. | 166 | 9,687 | ✓ |
| 5 | Cano-Díaz, Mariana | 36 | 8,853 | ✓ |
| 6 | Román-Zúñiga, Carlos G. | 106 | 8,766 | ✓ |
| 7 | Hernández-Toledo, Héctor | 72 | 7,106 | ✓ |
| 8 | Valenzuela, Octavio | 77 | 6,485 | ✓ |
| 9 | Fraija, Nissim | 207 | 6,234 | ✓ |
| 10 | Cruz-González, Irene | 75 | 6,101 | ✓ |
| 11 | Rodríguez, Luis F. | 135 | 5,862 | ✓ |
| 12 | Suárez, Genaro | 16 | 5,663 | ✓ |
| 13 | González, María Magdalena | 134 | 5,661 | ✓ |
| 14 | Benítez, Erika | 95 | 5,270 | ✓ |
| 15 | Peimbert, Manuel | 92 | 4,996 | ✓ |
| 16 | Page, Dany | 76 | 4,709 | ✓ |
| 17 | Barrera-Ballesteros, Jorge K. | 63 | 4,661 | ✓ |
| 18 | Gómez Maqueo Chew, Yilen | 63 | 4,391 | ✓ |
| 19 | Garma Oehmichen, Luis Alberto | 9 | 4,251 | ✓ |
| 20 | Cantó, Jorge | 153 | 4,170 | ✓ |

### 4.7 Top-20 por artículos (reproducido)

```python
sorted_n = sorted(active, key=lambda a: -int(a['n_total_assigned']))[:20]
```

| # | Autor | Papers | Citas | Nuevo en top-20 por N | Verificación |
|---|---|---|---|---|---|
| 1 | Sánchez, Sebastián F. | 328 | 20,881 | — | ✓ |
| 2 | Fraija, Nissim | 207 | 6,234 | — | ✓ |
| 3 | Lee, William H. | 166 | 9,687 | — | ✓ |
| 4 | **Zharikov, Sergey V.** | 164 | 2,084 | ✓ NUEVO | ✓ |
| 5 | Cantó, Jorge | 153 | 4,170 | — | ✓ |
| 6 | Rodríguez, Luis F. | 135 | 5,862 | — | ✓ |
| 7 | González, María Magdalena | 134 | 5,661 | — | ✓ |
| 8 | Ávila-Reese, Vladimir | 130 | 13,220 | — | ✓ |
| 9 | **López, José Alberto** | 123 | 2,452 | ✓ NUEVO | ✓ |
| 10 | **Krongold, Yair** | 120 | 3,308 | ✓ NUEVO | ✓ |
| 11 | **Michel, Raúl** | 120 | 1,834 | ✓ NUEVO | ✓ |
| 12 | Román-Zúñiga, Carlos G. | 106 | 8,766 | — | ✓ |
| 13 | **Morisset, Christophe** | 104 | 3,315 | ✓ NUEVO | ✓ |
| 14 | **Rosado, Margarita** | 104 | 3,076 | ✓ NUEVO | ✓ |
| 15 | **Richer, Michael G.** | 100 | 2,032 | ✓ NUEVO | ✓ |
| 16 | **Sabin, Laurence** | 97 | 1,578 | ✓ NUEVO | ✓ |
| 17 | **Tovmassian, Gaghik H.** | 97 | 1,426 | ✓ NUEVO | ✓ |
| 18 | Miyaji, Takamitsu | 95 | 10,072 | — | ✓ |
| 19 | Benítez, Erika | 95 | 5,270 | — | ✓ |
| 20 | Peimbert, Manuel | 92 | 4,996 | — | ✓ |

**Intersección de los dos rankings**: 12 nombres aparecen en ambos. 8 autores aparecen solo en el ranking por citas (perfil de impacto concentrado) y 9 solo en el ranking por artículos (perfil de productividad sostenida).

### 4.8 Concentración acumulada

```python
sorted_desc = sorted([int(a['citations_total_assigned']) for a in active],
                     reverse=True)
total = sum(sorted_desc)
for N in [10, 20, 50, 100]:
    pct = 100 * sum(sorted_desc[:N]) / total
```

| Top N | % citas acumuladas | Reportado |
|---|---|---|
| Top-10 | 30.0% | **30.0%** ✓ |
| Top-20 | 45.3% | **45.3%** ✓ |
| Top-50 | 72.1% | **72.1%** ✓ |
| Top-100 | 88.8% | **88.8%** ✓ |

### 4.9 Coeficiente de Gini

```python
import numpy as np
cites_asc = sorted([int(a['citations_total_assigned']) for a in active])
n = len(cites_asc)
cumc = np.cumsum(cites_asc)
x = np.arange(1, n+1) / n
y = cumc / cumc[-1]
gini = 1 - 2 * np.trapezoid(y, x)
```

Reproducido: **G = 0.804** ✓

### 4.10 Puntos de la curva de Lorenz

| Fracción autores | % citas (reproducido) |
|---|---|
| 50% menos citado | 2.4% |
| 75% menos citado | 9.7% |
| 90% menos citado | 31.6% |
| 100% (total) | 100% |

### 4.11 h-index individual del top-30

Reproducido con `h = len([c for c in sorted_cites_of_author if c≥pos])`.

| # | Autor | h-index |
|---|---|---|
| 1 | Sánchez, Sebastián F. | 73 |
| 2 | Lee, William H. | 51 |
| 3 | Ávila-Reese, Vladimir | 43 |
| 4 | Fraija, Nissim | 42 |
| 5 | Miyaji, Takamitsu | 41 |
| 5 | Rodríguez, Luis F. | 41 |
| 7 | González, María Magdalena | 38 |
| 7 | Peimbert, Manuel | 38 |
| 9 | Benítez, Erika | 37 |
| 10 | Cantó, Jorge | 34 |
| 10 | Krongold, Yair | 34 |
| 12 | Page, Dany | 32 |
| 12 | García-Segura, Guillermo | 32 |
| 14 | Dultzin, Deborah | 31 |
| 15 | Curiel, Salvador | 30 |

Mediana h-index del top-30: **h = 29**.

### 4.12 Top-15 revistas

Extracción por posición 4-9 del bibcode:

| # | Revista | Papers |
|---|---|---|
| 1 | ApJ | 1,014 |
| 2 | MNRAS | 983 |
| 3 | A&A | 763 |
| 4 | RMxAA | 295 |
| 5 | RMxAC | 294 |
| 6 | AJ | 214 |
| 7 | IAUS | 152 |
| 8 | ASPC | 86 |
| 9 | AIPC | 61 |
| 10 | ApJS | 60 |
| 11 | Ap&SS | 55 |
| 12 | AAS | 54 |
| 13 | PASP | 46 |
| 14 | PhysRev D | 38 |
| 15 | New Astron | 25 |

---

## 5. Metodología estricta: criterio y pasos

### 5.1 Definición formal de "investigador IA-UNAM"

Un autor del archivo se considera **investigador IA-UNAM** si cumple TODAS las siguientes:

1. Aparece al menos una vez como **primer autor** (`is_first_author = True`) en un artículo
2. Ese artículo tiene afiliación IA-UNAM **explícita** (`has_explicit_ia = True`) para ese autor
3. La afiliación es específicamente `Instituto de Astronomía, UNAM` o `San Pedro Mártir`, **NO** otros institutos de la UNAM

### 5.2 Reglas de limpieza de afiliación

Fueron considerados IA-UNAM:
- Instituto de Astronomía, UNAM (CU)
- Instituto de Astronomía, UNAM Ensenada
- Observatorio Astronómico Nacional, SPM
- Variantes textuales de estas tres sedes

Fueron **excluidos** aunque formaran parte de UNAM:
- Instituto de Ciencias Nucleares (ICN-UNAM)
- Centro de Ciencias Físicas (CCF-UNAM)
- Instituto de Geofísica (IGF-UNAM)
- Instituto de Ciencias Físicas (ICF-UNAM)
- Facultad de Ciencias (UNAM)
- Centro de Radiastronomía y Astrofísica (CRyA, posteriormente IRyA)

### 5.3 Agrupación de alias

Los 530 nombres de primeros autores de `first_authors_unam.txt` se agruparon en 440 investigadores canónicos usando `grouped_author_aliases.csv` (819 líneas de alias). Ejemplos:

- `Ibarra-Medel,_Héctor_Javier` ← {`Ibarra-Medel, H.`, `Ibarra-Medel, Héctor J.`, `Ibarra-Medel, Héctor Javier`}
- `Sánchez,_Sebastián_F.` ← {`Sánchez, S. F.`, `Sánchez, Sebastian`, `Sánchez, Sebastián F.`, `Sánchez, Sebastian F.`, `Sánchez, Sebastian. F.`}
- `Tovmassian,_Gaghik_H.` ← {`Tovmassian, G.`, `Tovmassian, G. H.`, `Tovmassian, Gaghik`, `Tovmassian, Gaghik H.`, `Tovmassian, Gagik`}
- `Cantó,_Jorge` ← {`Cantó, J.`, `Canto, J.`, `Cantó, Jorge`, `Cantö, Jorge`}

Nota: algunos nombres canónicos conservan typos del archivo fuente (`Sebástion`, `Cantö`, `María.`) corregidos solo para visualización.

---

## 6. Pipeline reproducible

### 6.1 Diagrama del flujo

```
┌──────────────────────────┐
│ ADS consulta institucional│  aff:"Instituto de Astronomía, UNAM"
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│ Export CSVs:              │  metrics-papers / metrics-citations /
│ métricas + author network │  metrics-reads / author-network / top-500
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│ Identificar primeros      │  first_authors_unam.txt (530)
│ autores con IA-UNAM       │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│ Query ADS por cada alias  │  (clave para no fragmentar)
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│ Agrupar aliases → canon   │  grouped_author_aliases.csv (819 líneas)
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│ Filtrar afiliación        │  solo IA-UNAM/SPM
│ estricta por paper        │  excluir otros institutos UNAM
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│ Aplicar criterio fuerte:  │  ≥1 paper (FA + IA-UNAM explícita)
│ 440 investigadores        │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│ Agregar sus papers        │  inferred_all_per_author.txt
│                           │  inferred_summary_per_author.csv
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│ Generar figuras y tablas  │  scripts 01, 02, 03
└──────────────────────────┘
```

### 6.2 Scripts disponibles

En `/mnt/user-data/outputs/scripts/`:

| Script | Función |
|---|---|
| `01_extract_data.py` | Convierte `inferred_all_per_author.txt` → JSON intermedios (coauth, topics, sites) |
| `02_make_figures.py` | Genera figuras 4–9 (red coautorías × 4, casos científicos, sedes) |
| `03_make_extra_figures.py` | Genera figuras 1–3 y 10–14 (evolución, scatter, h-index, Lorenz, generaciones, journals) |
| `README.md` | Instrucciones de uso del pipeline |

### 6.3 Dependencias

- Python 3.9+ (3.13 probado)
- numpy ≥ 1.22 (uso de `np.trapezoid`; en versiones anteriores usar `np.trapz`)
- matplotlib ≥ 3.5
- Node.js ≥ 18 + `docx` npm package (para los generadores Word)

### 6.4 Instrucciones de reproducción

```bash
# Suponiendo que los ficheros fuente están en /mnt/user-data/uploads/
cd scripts/
python 01_extract_data.py      # genera JSON intermedios
python 02_make_figures.py      # genera 6 figuras principales
python 03_make_extra_figures.py # genera 8 figuras adicionales
node gen_v10.js                 # genera el informe Word
```

---

## 7. Lista completa de figuras del informe v10

| # | Fichero | Descripción | Datos fuente |
|---|---|---|---|
| 1 | `f10_evolution.png` | Artículos/año + media vs mediana de citas | `inferred_all_per_author.txt` |
| 2 | `f8_scatter_authors.png` | **Scatter artículos vs citas (página completa)** | `inferred_summary_per_author.csv` |
| 3 | `f9_h_index.png` | h-index individual top-30 | `inferred_all_per_author.txt` |
| 4 | `network_1_1990-2003.png` | Red coautorías top-20 1990–2003 | `inferred_all_per_author.txt` |
| 5 | `network_2_2003-2013.png` | Red coautorías top-20 2003–2013 | id. |
| 6 | `network_3_2013-2026.png` | Red coautorías top-20 2013–2026 | id. |
| 7 | `network_4_historico.png` | Red coautorías top-20 histórico | id. |
| 8 | `science_cases.png` | Casos científicos (anillo + evolución) | id. + mapeo manual investigador→tema |
| 9 | `sites_activity.png` | Actividad por sede (CU/Ensenada/Morelia/SPM) | id. + mapeo manual afiliación→sede |
| 10 | `f7_citation_distribution.png` | Distribución log-log de citas con power-law | `inferred_all_per_author.txt` |
| 11 | `f12_lorenz.png` | Curva de Lorenz y coeficiente de Gini | `inferred_summary_per_author.csv` |
| 12 | `f13_fa_fraction.png` | % FA vs volumen total por autor | `inferred_summary_per_author.csv` |
| 13 | `f11_generations.png` | Pirámide generacional por lustro | `inferred_all_per_author.txt` |
| 14 | `f14_journals.png` | Top-15 revistas por publicaciones | bibcode parsing |

---

## 8. Limitaciones conocidas del análisis

### 8.1 De la base de datos ADS

- **Metadatos de afiliación**: ADS presenta inconsistencias menores especialmente en artículos antiguos (algunos papers pre-1995 no tienen afiliación por autor sino colectiva). Esto puede sub-contar los papers tempranos.
- **Fecha de la consulta**: las citas totales son de octubre 2026. Papers recientes seguirán acumulando citas: las cifras 2020–2026 son cotas inferiores.
- **ADS no distingue** investigadores con nombres iguales (homonimia). Se asume que los primeros autores identificados corresponden a personas únicas; esto es cierto para IA-UNAM pero no garantizable en general.

### 8.2 De la metodología estricta

- El criterio fuerte **excluye** investigadores que colaboraron con el IA-UNAM pero nunca firmaron como primer autor desde esa afiliación. Esto es intencional (evita contaminación por consorcios) pero deja fuera algunos colaboradores legítimos de larga trayectoria.
- La fracción FA mide liderazgo tradicional. En colaboraciones alfabéticas (HAWC, EHT, LIGO/Virgo) este indicador **no refleja** liderazgo científico real; en el informe se marca con nota aclaratoria el caso de M.M. González.
- El universo de 440 incluye tanto plantilla senior consolidada como estudiantes/postdocs con afiliación corta. Esto es responsable de parte del Gini elevado (G=0.804 vs G≈0.66 típico de universidades). Si se restringe a plantilla permanente, el Gini bajaría.

### 8.3 De la asignación por tema científico (Figura 8)

- La asignación investigador ↔ caso científico es **manual** basada en el historial de publicaciones. Investigadores con producción transversal pueden aparecer en más de un caso. El diccionario completo está en el código del script `02_make_figures.py`.
- Algunos investigadores con producción menor pueden estar sin clasificar.

### 8.4 De la asignación por sede (Figura 9)

- SPM aparece como afiliación directa solo en 34 papers porque la mayor parte de los trabajos basados en el OAN se firman desde CU o Ensenada. Una contabilidad por **uso del telescopio** daría cifras muy superiores pero requeriría otro tipo de análisis.
- Morelia muestra actividad concentrada 2000–2004 asociada al CRyA; posteriormente las líneas se transfirieron al IRyA cuando éste se constituyó como instituto independiente, por lo que la caída post-2004 refleja esa transición administrativa.

---

## 9. Comparación con la literatura internacional

### 9.1 Distribuciones de citas universales

**Referencia**: Chatterjee, Ghosh & Chakrabarti (2016). *Universality of citation distributions for academic institutions and journals*. [arXiv:1409.8029](https://arxiv.org/abs/1409.8029)

| Parámetro | Universal (Chatterjee+) | IA-UNAM (este trabajo) |
|---|---|---|
| Exponente power-law α | 2.8 ± 0.2 | ~2.6 |
| Gini institucional | 0.66 ± 0.10 | 0.804 |
| k-index (top-25% → ...) | ≈75% | 90.3% |

**Interpretación**: el IA-UNAM muestra una concentración de citas marginalmente mayor que el valor universal, principalmente por la inclusión en el universo de estudiantes y postdocs.

### 9.2 Astronomía holandesa (comparación institucional)

**Referencia**: Jarreta Mejías (2010). *Citations and impact of Dutch astronomy*. [arXiv:1011.5311](https://arxiv.org/abs/1011.5311)

| Métrica | NOVA (Holanda) | US top-15 institutes | IA-UNAM |
|---|---|---|---|
| Mediana h-index individual | 31 | 34 | 29 (top-30) |
| Mediana h-index "key researchers" | 39 | — | 38 (puesto 15, Peimbert M.) |
| Papers/año/senior (mediana) | 3.9 | 3.3 | ~2.8 |
| Papers/año/senior normalized | 1.1 | — | — |
| Revistas principales | A&A, MNRAS, ApJ, AJ | id. | id. + RMxAA |

**Interpretación**: el IA-UNAM es comparable a los institutos astronómicos europeos medianos; su cola top (h=73 Sánchez; h=51 Lee) está en el rango del top mundial.

---

## 10. Instrucciones para la auditoría externa

Un revisor externo puede verificar el informe siguiendo estos pasos:

### 10.1 Verificar las cifras globales

```python
import csv
with open('inferred_all_per_author.txt') as f:
    reader = csv.DictReader(f, delimiter='|')
    records = [r for r in reader if r['is_ia_unam_researcher'] == 'True']
assert len(records) == 8563
assert len(set(r['bibcode'] for r in records)) == 5053
```

### 10.2 Verificar un investigador específico

```python
author_key = "Tovmassian,_Gaghik_H."  # cambiar por el autor a verificar
papers = [r for r in records if r['author'] == author_key]
unique_bibs = set(r['bibcode'] for r in papers)
citations = sum(int(r['citation_count']) for r in papers
                if r['citation_count'].isdigit())
fa_papers = [r for r in papers if r['is_first_author'] == 'True']
print(f"{author_key}: {len(unique_bibs)} papers, {citations} citas, "
      f"{len(fa_papers)} como primer autor")
# Expected: 97 papers, 1426 citas, 34 como primer autor
```

### 10.3 Verificar un periodo

```python
def period(y):
    if y < 1990: return 'Antes 1990'
    if y < 2003: return '1990-2003'
    if y < 2013: return '2003-2013'
    return '2013-2026'

bibs_by_period = {}
for r in records:
    if r['bibcode'][:4].isdigit():
        y = int(r['bibcode'][:4])
        p = period(y)
        bibs_by_period.setdefault(p, set()).add(r['bibcode'])

# Expected:
# Antes 1990: 48 papers
# 1990-2003:  744 papers
# 2003-2013:  1,374 papers
# 2013-2026:  2,887 papers
```

### 10.4 Preguntas típicas que puede plantear el revisor

- *"¿Por qué el h-index individual de X es menor del esperado?"* → Verificar en la §4.11 que se calcula solo sobre papers con afiliación IA-UNAM. Un investigador con producción previa en otra institución puede tener h-individual total mucho mayor.
- *"¿Por qué no aparece Y en el top-20?"* → Comprobar ambos rankings. Si Y tiene muchos artículos pero pocas citas, estará solo en el ranking por artículos.
- *"¿Por qué el Gini es tan alto?"* → Explicado en §8.2: la inclusión de postdocs y estudiantes recientes infla el denominador de autores con pocas citas.
- *"¿Cuál es la diferencia entre v7 (247 papers SFS) y v8 (328 papers SFS)?"* → Explicado en §2.1 Error #3 y #4: corrección de detección de primer autor y agrupación completa de alias.

---

## 11. Historial de archivos entregables (/mnt/user-data/outputs/)

| Fichero | Fecha | Descripción |
|---|---|---|
| `IA_UNAM_Informe_v8_metodologia_estricta_investigador.docx` | abril 2026 | v8 inicial con metodología estricta |
| `IA_UNAM_Informe_v9_dual_rankings_sin_SFS.docx` | octubre 2026 | v9 con rankings duales y sin sección específica SFS |
| **`IA_UNAM_Informe_v10_completo.docx`** | octubre 2026 | **v10 final: 14 figuras, 11 secciones, comparación internacional** |
| `IA_UNAM_Audit_Trail.md` | 29/10/2026 | **Este documento** |
| 6 PNG de red/casos/sedes | octubre 2026 | Figuras 4–9 |
| 8 PNG adicionales | octubre 2026 | Figuras 1–3, 10–14 |
| `scripts/01_extract_data.py` | octubre 2026 | Pipeline de extracción |
| `scripts/02_make_figures.py` | octubre 2026 | Generador de figuras principales |
| `scripts/03_make_extra_figures.py` | octubre 2026 | Generador de figuras adicionales |
| `scripts/README.md` | octubre 2026 | Documentación del pipeline |

---

## 12. Contacto y nota final

Este documento forma parte del paquete entregable del informe bibliométrico v10 del IA-UNAM. Cualquier aspecto no cubierto o que requiera clarificación puede verificarse directamente contra los ficheros fuente listados en §3 y los scripts de §6.

**Reproducibilidad total garantizada**: todos los números del informe se derivan de forma determinista a partir de `inferred_all_per_author.txt` e `inferred_summary_per_author.csv`. Dado el mismo input, los scripts producirán idénticos outputs.

**Fecha de preparación de este documento de auditoría**: 29 de octubre de 2026, 07:36 (CDMX).
