# IA-UNAM Bibliométrico v10 — Paquete completo de reproducibilidad

**Fecha**: 29 de octubre de 2026
**Contenido**: 36 archivos, 24 MB
**Metodología**: estricta por investigador (criterio fuerte de pertenencia institucional)

Este paquete contiene **TODO lo necesario** para reproducir el análisis bibliométrico del Instituto de Astronomía UNAM (OAN-SPM) desde cero: los datos fuente originales de ADS, los scripts de procesamiento, las 14 figuras generadas, los informes Word, y el documento de auditoría completo.

---

## Estructura del paquete

```
IA_UNAM_v10/
├── README.md                              ← este archivo
├── 01_informes/                           ← Informes Word finales (2 archivos)
│   ├── IA_UNAM_Informe_v10_completo.docx         ← Informe principal (14 figs, 11 secs)
│   └── IA_UNAM_Informe_v9_dual_rankings_sin_SFS.docx  ← versión previa
│
├── 02_datos_fuente/                       ← Datos ADS originales (13 archivos)
│   ├── metrics-papers.csv                 ← Serie anual de artículos
│   ├── metrics-citations.csv              ← Serie anual de citas
│   ├── metrics-reads.csv                  ← Serie anual de lecturas
│   ├── export-custom__1_.txt              ← Top-500 artículos más citados
│   ├── export-custom__2_.txt              ← 500 pubs de S.F. Sánchez
│   ├── author-network__1_.csv             ← Red 200 coautores
│   ├── first_authors_unam.txt             ← 530 primeros autores
│   ├── grouped_author_aliases.csv         ← Mapeo canonical ↔ alias (819 líneas)
│   ├── grouped_summary.csv                ← Resumen v7 (previo)
│   ├── all_per_author.txt                 ← Pares autor-artículo v7 (previo)
│   ├── inferred_all_per_author.txt        ← ★ FICHERO CLAVE: 9,709 líneas, 6.8 MB
│   ├── inferred_summary_per_author.csv    ← ★ FICHERO CLAVE: 440 investigadores
│   └── excluded_groups.csv                ← 4 grupos excluidos
│
├── 03_figuras/                            ← 14 figuras PNG estilo ADS dark
│   ├── f7_citation_distribution.png       ← Fig 10: distribución log-log citas
│   ├── f8_scatter_authors.png             ← Fig 2: scatter 440 investigadores (CENTRAL)
│   ├── f9_h_index.png                     ← Fig 3: h-index top-30
│   ├── f10_evolution.png                  ← Fig 1: evolución anual
│   ├── f11_generations.png                ← Fig 13: pirámide generacional
│   ├── f12_lorenz.png                     ← Fig 11: curva Lorenz + Gini
│   ├── f13_fa_fraction.png                ← Fig 12: % FA vs volumen
│   ├── f14_journals.png                   ← Fig 14: top-15 revistas
│   ├── network_1_1990-2003.png            ← Fig 4: red 1990-2003
│   ├── network_2_2003-2013.png            ← Fig 5: red 2003-2013
│   ├── network_3_2013-2026.png            ← Fig 6: red 2013-2026
│   ├── network_4_historico.png            ← Fig 7: red histórica
│   ├── science_cases.png                  ← Fig 8: casos científicos
│   └── sites_activity.png                 ← Fig 9: actividad por sede
│
├── 04_scripts/                            ← Pipeline completo (6 archivos)
│   ├── README.md                          ← Instrucciones del pipeline
│   ├── 01_extract_data.py                 ← Extrae JSON intermedios
│   ├── 02_make_figures.py                 ← Genera figuras 4-9
│   ├── 03_make_extra_figures.py           ← Genera figuras 1-3 + 10-14
│   ├── gen_v10.js                         ← Genera informe v10 Word (Node.js)
│   └── gen_v9.js                          ← Genera informe v9 Word
│
└── 05_auditoria/
    └── IA_UNAM_Audit_Trail.md             ← 30 KB, 637 líneas; verifica cada cifra
```

---

## Reproducción del análisis desde cero

### Prerrequisitos

```bash
# Python 3.9+ (3.13 probado)
pip install matplotlib numpy

# Node.js 18+ y el paquete docx
npm install docx
```

### Pasos

```bash
cd IA_UNAM_v10/

# Paso 1: ajustar las rutas en los scripts
# En 04_scripts/01_extract_data.py cambiar:
#   INPUT_DIR  = './02_datos_fuente'
#   OUTPUT_DIR = './intermedios'
# En 04_scripts/02_make_figures.py cambiar:
#   DATA_DIR   = './intermedios'
#   CHARTS_DIR = './03_figuras_reproducidas'
# Análogamente en 03_make_extra_figures.py

# Paso 2: extraer datos y generar figuras
mkdir -p intermedios 03_figuras_reproducidas
cd 04_scripts/
python 01_extract_data.py        # → ./intermedios/*.json
python 02_make_figures.py        # → ./03_figuras_reproducidas/network_*.png + science + sites
python 03_make_extra_figures.py  # → ./03_figuras_reproducidas/f*.png

# Paso 3: generar el informe Word (opcional)
node gen_v10.js                  # → ./IA_UNAM_Informe_v10_completo.docx
```

### Verificación

Las cifras clave deben coincidir con las documentadas en `05_auditoria/IA_UNAM_Audit_Trail.md`:

| Métrica | Valor esperado |
|---|---|
| Investigadores IA-UNAM | 440 |
| Artículos únicos institucionales | 5,053 |
| Citas únicas institucionales | 157,152 |
| h-index institucional | 152 |
| Papers de primer autor | 2,186 |
| Coeficiente de Gini | 0.804 |

Si tu reproducción da estos valores, el pipeline funciona correctamente.

---

## Comprobación rápida de integridad (sin ejecutar los scripts)

```python
import csv
with open('02_datos_fuente/inferred_all_per_author.txt') as f:
    reader = csv.DictReader(f, delimiter='|')
    records = [r for r in reader if r['is_ia_unam_researcher'] == 'True']
assert len(records) == 8563, f"ERROR: {len(records)} != 8563"
assert len(set(r['bibcode'] for r in records)) == 5053
print("✓ Integridad verificada: 8,563 asignaciones / 5,053 bibcodes únicos")
```

---

## Qué contiene cada fichero fuente (02_datos_fuente/)

| Fichero | Tamaño | Líneas | Qué contiene |
|---|---|---|---|
| `metrics-papers.csv` | 734 B | 57 | Artículos por año (ADS metrics export) |
| `metrics-citations.csv` | 1.1 KB | 56 | Citas por año |
| `metrics-reads.csv` | 607 B | 32 | Lecturas por año |
| `export-custom__1_.txt` | 363 KB | 1,001 | 500 artículos más citados IA-UNAM |
| `export-custom__2_.txt` | 175 KB | 1,001 | 500 publicaciones S.F. Sánchez |
| `author-network__1_.csv` | 39 KB | 201 | Red de 200 coautores |
| `first_authors_unam.txt` | 9.4 KB | 530 | Primeros autores IA-UNAM |
| `grouped_author_aliases.csv` | 46 KB | 819 | Mapeo canonical ↔ alias |
| `grouped_summary.csv` | 499 KB | 342 | Resumen v7 (previo) |
| `all_per_author.txt` | 6.1 MB | 9,709 | Pares autor-artículo v7 (previo) |
| **`inferred_all_per_author.txt`** | **6.8 MB** | **9,709** | ★ **FICHERO CLAVE**: pares con criterio fuerte v8+ |
| **`inferred_summary_per_author.csv`** | **22 KB** | **441** | ★ **FICHERO CLAVE**: resumen final 440 investigadores |
| `excluded_groups.csv` | 495 B | 5 | 4 grupos excluidos del universo |

Para cada campo de los dos ficheros clave, consulta `05_auditoria/IA_UNAM_Audit_Trail.md` §3.1 y §3.2.

---

## Historia del análisis

El informe v10 es el resultado de **10 iteraciones** con 6 correcciones críticas documentadas. El historial completo está en `05_auditoria/IA_UNAM_Audit_Trail.md` §2.

**Cambios principales**:
- v7 → v8: criterio fuerte de pertenencia (ya no basta coautoría; se requiere primer autor con IA-UNAM explícita)
- v8 → v9: rankings duales (por citas y por artículos); recuperación de Tovmassian, Sabin, Zharikov
- v9 → v10: 8 figuras bibliométricas adicionales + comparación con literatura internacional

---

## Comparación con literatura internacional

El informe contextualiza los resultados con dos referencias:

1. **Chatterjee, Ghosh & Chakrabarti (2016)** — [arXiv:1409.8029](https://arxiv.org/abs/1409.8029)
2. **Jarreta Mejías (2010)** — [arXiv:1011.5311](https://arxiv.org/abs/1011.5311)

Resultados IA-UNAM frente a referencia:
- Power-law α ≈ 2.6 (vs universal 2.8±0.2)
- Gini G = 0.804 (vs típico 0.66)
- h-index mediana top-30 = 29 (vs NOVA = 31)
- h-index máximo = 73 (Sánchez SF)

---

## Contacto

Para dudas o revisión, consultar `05_auditoria/IA_UNAM_Audit_Trail.md`.
