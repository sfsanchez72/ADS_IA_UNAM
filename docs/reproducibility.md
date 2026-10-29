# Reproducibility
Python ≥ 3.9, `pytest`; optional numpy/pandas/matplotlib. No ADS token is required or stored; never commit one.

## Not yet reproducible
- Everything depending on the v10 ZIP/DOCX (not available at scaffold time): import, loaders, headline-number tests (440/8563/5053/157152/152/2186), figures, tables, Gini, validation report.
- `ads_queries`, `affiliations`, `author_matching`, `publications`, `coauthorship`, `statistics`, `plotting` modules are explicit stubs.

## Git steps (not executed)
```bash
git checkout -b develop
# after importing v10 and committing:
git tag -a v10.0.0 -m "Historical bibliometric analysis, October 2026"
```
Create the GitHub repository as **private**; use Git LFS only if large files require it.

## Pending for v11
Import v10; inventory; loaders; confirm/refute audit items; recompute Gini; alias resolution; ADS refresh; v10-vs-v11 diff report.
