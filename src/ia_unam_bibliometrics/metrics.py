"""Generic, data-schema-independent bibliometric indicators."""
from typing import Dict, Iterable, List, Sequence, Tuple


def h_index(citations: Iterable[int]) -> int:
    h = 0
    for i, c in enumerate(sorted(citations, reverse=True), start=1):
        if c >= i:
            h = i
        else:
            break
    return h


def dedupe_by_bibcode(rows: Iterable[Dict]) -> Dict[str, Dict]:
    """Keep the first record per bibcode (institutional counting).

    Conflicting ``citation_count`` values are not resolved here; use
    :func:`conflicting_citation_counts` to report them.
    """
    out: Dict[str, Dict] = {}
    for r in rows:
        out.setdefault(r["bibcode"], r)
    return out


def conflicting_citation_counts(rows: Iterable[Dict]) -> Dict[str, List[int]]:
    seen: Dict[str, set] = {}
    for r in rows:
        seen.setdefault(r["bibcode"], set()).add(int(r["citation_count"]))
    return {b: sorted(v) for b, v in seen.items() if len(v) > 1}


def gini(values: Sequence[float]) -> float:
    """Gini coefficient from the Lorenz curve including the origin (0, 0)."""
    xs = sorted(values)
    total = sum(xs)
    n = len(xs)
    if n == 0 or total == 0:
        return 0.0
    cum = [0.0]
    for x in xs:
        cum.append(cum[-1] + x / total)
    area = sum((cum[i] + cum[i + 1]) / 2 for i in range(n)) / n
    return 1 - 2 * area
