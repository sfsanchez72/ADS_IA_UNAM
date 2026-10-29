"""Ranking helpers."""
from typing import Hashable, Iterable, List, Sequence, Tuple


def top_n(items: Iterable[Tuple[Hashable, float]], n: int = 20) -> List[Hashable]:
    return [k for k, _ in sorted(items, key=lambda kv: kv[1], reverse=True)[:n]]


def ranking_intersection(a: Sequence[Hashable], b: Sequence[Hashable]) -> set:
    """Exact set intersection of two rankings (audit expects 11 for v10 top-20s)."""
    return set(a) & set(b)
