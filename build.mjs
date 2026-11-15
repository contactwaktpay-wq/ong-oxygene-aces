// Construit le site statique dans ./site (icônes Lucide intégrées en SVG, CSS Tailwind compilé, polices locales)
// Usage : node build.mjs   (nécessite node_modules : tailwindcss, @tailwindcss/cli, lucide-static, @fontsource/*)
import fs from 'node:fs'; import path from 'node:path'; import { execSync } from 'node:child_process';
const ROOT = path.dirname(new URL(import.meta.url).pathname);
const NM = process.env.NM || path.join(ROOT, 'node_modules');
const OUT = path.join(ROOT, 'docs');
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, 'assets/fonts'), { recursive: true });
let html = fs.readFileSync(path.join(ROOT, 'src/index.html'), 'utf8');
const missing = new Set();
html = html.replace(/<i data-lucide="([a-z0-9-]+)"([^>]*)><\/i>/g, (m, name, attrs) => {
  const f = path.join(NM, 'lucide-static/icons', name + '.svg');
  if (!fs.existsSync(f)) { missing.add(name); return m; }
  let svg = fs.readFileSync(f, 'utf8').replace(/<!--[\s\S]*?-->/g, '').replace(/\s*\n\s*/g, ' ').trim();
  const cls = (attrs.match(/class="([^"]*)"/) || [, ''])[1];
  svg = svg.replace(/class="[^"]*"/, '').replace('<svg', `<svg aria-hidden="true" class="lucide ${cls}"`);
  return svg;
});
if (missing.size) { console.error('Icônes introuvables :', [...missing]); process.exit(1); }
fs.writeFileSync(path.join(ROOT, 'src/.built.html'), html);
fs.writeFileSync(path.join(OUT, 'index.html'), html);
fs.copyFileSync(path.join(ROOT, 'src/site.js'), path.join(OUT, 'assets/site.js'));
for (const [pkg, ws] of [['inter', [400, 500, 600, 700, 800]], ['fraunces', [700, 900]]])
  for (const w of ws) { const n = `${pkg}-latin-${w}-normal.woff2`; fs.copyFileSync(path.join(NM, `@fontsource/${pkg}/files`, n), path.join(OUT, 'assets/fonts', n)); }
fs.cpSync(path.join(ROOT, 'images'), path.join(OUT, 'images'), { recursive: true });
for (const f of ['_headers', 'robots.txt', '404.html']) if (fs.existsSync(path.join(ROOT, 'src', f))) fs.copyFileSync(path.join(ROOT, 'src', f), path.join(OUT, f));
// CSS : les polices sont référencées depuis assets/ (fonts/…)
const css = fs.readFileSync(path.join(ROOT, 'src/input.css'), 'utf8').replace('"./index.html"', '"./.built.html"');
fs.writeFileSync(path.join(ROOT, 'src/.input.css'), css);
execSync(`${path.join(NM, '.bin/tailwindcss')} -i src/.input.css -o docs/assets/site.css --minify`, { cwd: ROOT, stdio: 'inherit' });
fs.rmSync(path.join(ROOT, 'src/.input.css')); fs.rmSync(path.join(ROOT, 'src/.built.html'));
fs.writeFileSync(path.join(OUT, '.nojekyll'), '');
console.log('OK →', OUT);
