#!/usr/bin/env python3
"""Verify archive/v10 against data/metadata/v10_inventory.csv. Exit 1 on mismatch."""
import csv, hashlib, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
inv = ROOT / "data" / "metadata" / "v10_inventory.csv"
if not inv.exists():
    sys.exit("inventory missing: v10 not imported yet")
bad = 0
with open(inv) as f:
    for r in csv.DictReader(f):
        p = ROOT / "archive" / "v10" / r["path"]
        if not p.is_file() or p.stat().st_size != int(r["size_bytes"]) or hashlib.sha256(p.read_bytes()).hexdigest() != r["sha256"]:
            print("MISMATCH", r["path"]); bad += 1
print("OK" if not bad else f"{bad} mismatches")
sys.exit(1 if bad else 0)
