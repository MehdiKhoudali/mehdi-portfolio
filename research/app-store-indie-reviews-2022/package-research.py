from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED

root = Path(__file__).resolve().parent
archive = root / 'indie-app-review-research.zip'
with ZipFile(archive, 'w', ZIP_DEFLATED, compresslevel=9) as out:
    for item in sorted(root.rglob('*')):
        if item.is_file() and item.suffix != '.zip' and item.name != 'research-notes.notion.md':
            out.write(item, item.relative_to(root).as_posix())
    for name in ('collect.mjs', 'verify.mjs', 'collect.test.mjs'):
        out.write(root.parent / 'app-store-indie-reviews' / name, 'shared-scripts/' + name)
print(archive)
print(f'{archive.stat().st_size:,} bytes')
