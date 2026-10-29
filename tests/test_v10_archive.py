"""Checks against the original v10 data. Skipped until archive/v10 is populated.

Expected v10 values (documented, NOT forced): 440 author ids, 8563
author-paper assignments, 5053 unique bibcodes, 157152 institutional
citations, h=152, 2186 first-author papers. Loader tests are pending
analysis of the original data layout (see docs/reproducibility.md).
"""
import subprocess, sys
from pathlib import Path
import pytest

ROOT = Path(__file__).resolve().parents[1]
INV = ROOT / "data" / "metadata" / "v10_inventory.csv"

pytestmark = pytest.mark.skipif(not INV.exists(), reason="v10 not imported (no inventory)")


def test_source_integrity():
    r = subprocess.run([sys.executable, str(ROOT / "scripts" / "verify_inventory.py")])
    assert r.returncode == 0


@pytest.mark.skip(reason="Pending: v10 data layout unknown; implement loader, then assert 440/8563/5053/157152/152/2186")
def test_v10_headline_numbers():
    pass
