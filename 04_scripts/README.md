# Scripts del informe IA-UNAM — figuras por coautoría, casos científicos y sedes

Dos scripts forman el pipeline completo:

## 1. `01_extract_data.py`

Extrae tres conjuntos de datos a partir de los ficheros de entrada:

- `inferred_all_per_author.txt` (pares investigador-artículo)
- `inferred_summary_per_author.csv` (resumen por investigador)

Genera tres archivos JSON intermedios:

- `coauth_data.json` — red de coautorías del top-20 por periodo
- `topics_data.json` — casos científicos con evolución temporal
- `site_data.json`   — actividad por sede (CU / Ensenada / Morelia / SPM) y año

**Ajustar** al inicio del script las rutas:
- `INPUT_DIR`  — donde están los archivos de entrada
- `OUTPUT_DIR` — donde guardar los JSON intermedios

## 2. `02_make_figures.py`

Consume los JSON intermedios y genera las seis figuras finales en `/home/claude/charts/`:

- `network_1_1990-2003.png`       — red de coautorías top-20 en 1990–2003
- `network_2_2003-2013.png`       — red de coautorías top-20 en 2003–2013
- `network_3_2013-2026.png`       — red de coautorías top-20 en 2013–2026
- `network_4_historico.png`       — red de coautorías top-20 histórica completa
- `science_cases.png`             — anillo de casos científicos + evolución temporal
- `sites_activity.png`            — artículos y citas por sede y año

**Ajustar** al inicio del script la ruta `CHARTS_DIR`.

## Ejecución

```bash
python 01_extract_data.py
python 02_make_figures.py
```

## Dependencias

- Python 3.9+
- matplotlib >= 3.5
- numpy

Ningún paquete adicional es necesario (solo `csv` y `json` de la librería estándar para la extracción).

## Estilo visual

Todas las figuras usan tema oscuro estilo NASA ADS (fondo negro, paleta de colores
saturados para distinguir comunidades temáticas). Los tamaños de fuente están
ajustados para lectura cómoda en documentos Word/LaTeX (13–18 pt para etiquetas,
17–20 pt para títulos).
