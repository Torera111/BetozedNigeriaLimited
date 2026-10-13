"""Create the downloadable source project without dependencies or Site identity."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED

root = Path(__file__).resolve().parents[1]
target = root / 'public' / 'downloads' / 'betozed-react-source.zip'
target.parent.mkdir(parents=True, exist_ok=True)
files = [
    root / name for name in (
        'README.md', 'package.json', 'package-lock.json', 'tsconfig.json',
        'vite.config.ts', 'vitest.config.ts', 'index.html', '.env.example',
        '.gitignore', 'public/favicon.svg',
    )
]
for directory in ('src', 'tests', 'scripts', 'public/images'):
    files.extend(path for path in (root / directory).rglob('*') if path.is_file() and '__pycache__' not in path.parts)
with ZipFile(target, 'w', ZIP_DEFLATED) as archive:
    for path in sorted(files):
        archive.write(path, Path('betozed-react') / path.relative_to(root))
print(f'Source package: {target} ({target.stat().st_size:,} bytes)')
