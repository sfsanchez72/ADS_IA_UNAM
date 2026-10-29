# Known issues in v10

Legend: **[Confirmed]** identified in the audit; **[To verify]** hypothesis pending check against the data. Items below come from the audit summary; none have been re-checked here because the v10 data was not available.

## Authors and affiliations
- [To verify] Duplicate author IDs from name variants.
- [To verify] Deborah Dultzin / Dultzin-Hacyan and other aliases need unification or verification.
- [To verify] Records where two authors appear concatenated.
- [Confirmed] Authors with IA-UNAM affiliation differ from staff researchers.
- [Confirmed] The "≥1 first-author article" criterion is limiting.

## Publications
- [To verify] Refereed status must be checked against ADS.
- [Confirmed] Articles, proceedings and abstracts must be distinguished.
- [To verify] `citation_count` may differ between records sharing a bibcode.
- [Confirmed] Institutional indicators must count each bibcode once.

## Statistics
- [Confirmed] Gini must include the Lorenz-curve origin (implemented in `metrics.gini`; v10 value 0.804 not yet recomputed).
- [To verify] Interpretation of the rank–citation exponent.
- [Confirmed] Avoid international comparisons between non-homogeneous populations/metrics.

## Figures and tables
- [Confirmed] Top-20 rankings share **11** authors (correct the reported intersection).
- [To verify] Site assignment depends on record order.
- [Confirmed] Thematic classifications are manual and possibly non-exclusive.

## Reproducibility
- [Pending] Document `assigned_by_year`, `has_explicit_ia`, `assignment_mode`.
- [Pending] Original ADS queries.
- [Pending] Dependencies, absolute paths and missing scripts to be identified.
