import pytest
from ia_unam_bibliometrics.metrics import conflicting_citation_counts, dedupe_by_bibcode, gini, h_index
from ia_unam_bibliometrics.rankings import ranking_intersection


def test_h_index():
    assert h_index([10, 8, 5, 4, 3]) == 4
    assert h_index([]) == 0


def test_gini_bounds():
    assert gini([1, 1, 1, 1]) == pytest.approx(0.0)
    assert gini([0, 0, 0, 10]) == pytest.approx(0.75)


def test_dedupe_and_conflicts():
    rows = [{"bibcode": "A", "citation_count": 1}, {"bibcode": "A", "citation_count": 2}, {"bibcode": "B", "citation_count": 3}]
    assert len(dedupe_by_bibcode(rows)) == 2
    assert conflicting_citation_counts(rows) == {"A": [1, 2]}


def test_intersection():
    assert ranking_intersection([1, 2, 3], [2, 3, 4]) == {2, 3}
