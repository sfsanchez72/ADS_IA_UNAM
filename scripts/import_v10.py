#!/usr/bin/env python3
"""Extract the v10 ZIP into archive/v10/ (never overwriting) and write a SHA-256 inventory.

Usage: python scripts/import_v10.py IA_UNAM_v10_paquete_COMPLETO.zip [IA_UNAM_Informe_v10_completo.docx]
"""
import csv, hashlib, shutil, sys, zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / "archive" / "v10"


def sha256(p):
    h = hashlib.sha256()
    with open(p, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def main(argv):
    if not argv:
        sys.exit(__doc__)
    z = Path(argv[0])
    with zipfile.ZipFile(z) as zf:
        for info in zf.infolist():
            target = (DEST / info.filename).resolve()
            if DEST.resolve() not in target.parents and target != DEST.resolve():
                sys.exit(f"unsafe path in zip: {info.filename}")
            if info.is_dir():
                continue
            if target.exists():
                sys.exit(f"refusing to overwrite {target}")
            target.parent.mkdir(parents=True, exist_ok=True)
            with zf.open(info) as src, open(target, "wb") as out:
                shutil.copyfileobj(src, out)
    if len(argv) > 1:
        d = DEST / Path(argv[1]).name
        if d.exists():
            sys.exit(f"refusing to overwrite {d}")
        shutil.copy2(argv[1], d)
    out = ROOT / "data" / "metadata" / "v10_inventory.csv"
    with open(out, "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["path", "size_bytes", "sha256"])
        for p in sorted(DEST.rglob("*")):
            if p.is_file() and p.name != ".gitkeep":
                w.writerow([p.relative_to(DEST).as_posix(), p.stat().st_size, sha256(p)])
    print("inventory written to", out)


if __name__ == "__main__":
    main(sys.argv[1:])
