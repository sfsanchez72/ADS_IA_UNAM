# IA-UNAM-Bibliometrics

Reproducible bibliometric analysis of the Instituto de Astronomía, UNAM (IA-UNAM), based on NASA Astrophysics Data System (ADS) records.

> **Status:** repository scaffold. The v10 package (`IA_UNAM_v10_paquete_COMPLETO.zip`) and report (`IA_UNAM_Informe_v10_completo.docx`) were **not available** when this scaffold was prepared, so `archive/v10/` is empty. Import them with `scripts/import_v10.py` (below). Nothing here has been published as a validated result.

## 1. Objectives
Store and reproduce the analysis of IA-UNAM scientific output and impact: author/affiliation normalisation, individual and institutional metrics, rankings, temporal evolution, collaboration networks, thematic/site distributions, citation statistics, and comparisons. v10 is preserved as a historical reference; corrections go into new versions.

## 2. Scope
Institution: IA-UNAM. Data date: **October 2026**. Temporal coverage: as defined by the v10 data (to be documented from the archive).

## 3. Data provenance
NASA ADS (queries to be added to `docs/ads_queries.md` when the originals are available). Redistribution terms of the data must be verified before making the repository public.

## 4. Selection methodology
See `docs/methodology.md`. v10 selected authors by IA-UNAM affiliation with at least one first-author article; known limitations are in `audits/known_issues.md`.

## 5. Indicators
- **h-index (institutional):** largest *h* such that *h* unique bibcodes have ≥ *h* citations.
- **Institutional citations:** citations summed over unique bibcodes (each counted once).
- **Per-author cumulative citations:** sum over author-paper assignments (double-counts shared papers).
- **Gini:** inequality of citations among authors (v10 value known to need recomputation including the Lorenz origin).

## 6. v10 results (historical, as reported; not a validated, curated institutional population)
| Indicator | v10 |
|---|---:|
| Author identifiers | 440 |
| Author-paper assignments | 8,563 |
| Unique articles | 5,053 |
| Unique institutional citations | 157,152 |
| Institutional h-index | 152 |
| Unique first-author articles | 2,186 |
| Cumulative citations per author | 324,801 |
| Gini | 0.804 |

## 7. Installation
```bash
python -m venv .venv && source .venv/bin/activate
pip install -e ".[dev]"        # add ".[analysis]" for numpy/pandas/matplotlib
```

## 8. Reproduction
```bash
python scripts/import_v10.py IA_UNAM_v10_paquete_COMPLETO.zip IA_UNAM_Informe_v10_completo.docx
python scripts/verify_inventory.py
pytest
```
Figure/table regeneration is **pending** analysis of the original scripts (see `docs/reproducibility.md`).

## 9. Structure
`archive/v10/` originals (immutable) · `data/{raw,processed,aliases,metadata}` · `src/ia_unam_bibliometrics` · `scripts/` · `figures/v10` · `reports/v10` · `audits/` · `tests/` · `docs/`.

## 10. Limitations
See `audits/known_issues.md` (duplicate author IDs, aliases, refereed status, Gini, top-20 intersection = 11, site assignment order-dependence, etc.).

## 11. Original reports
`archive/v10/` (ZIP contents and the Word report, once imported).

## 12. Contributing
Open an issue or PR proposing corrections; never edit `archive/v10/`. Record changes in `CHANGELOG.md` and compare against v10 explicitly.
