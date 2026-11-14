import assert from 'node:assert/strict';
import { readFile, access, readdir } from 'node:fs/promises';
import path from 'node:path';

const base = process.env.VITE_BASE_PATH || '/';
const output = path.resolve('dist');
const html = await readFile(path.join(output, 'index.html'), 'utf8');
const manifest = JSON.parse(await readFile(path.join(output, 'manifest.webmanifest'), 'utf8'));
assert.equal(manifest.start_url, base);
assert.equal(manifest.scope, base);
assert.equal(manifest.display, 'standalone');
const checked = new Set();
async function verify(url, relative = '') {
  if (/^(data:|#)/.test(url)) return;
  assert(!/^https?:/.test(url), `Recurso externo inesperado: ${url}`);
  const absolute = new URL(url, `https://example.test${base}${relative}`).pathname;
  assert(absolute.startsWith(base), `Recurso fora do prefixo: ${absolute}`);
  const file = path.resolve(output, absolute.slice(base.length));
  assert(file.startsWith(`${output}${path.sep}`), 'Caminho fora do build.');
  await access(file);
  checked.add(absolute);
}
for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) await verify(match[1]);
for (const icon of manifest.icons) await verify(icon.src);
for (const file of await readdir(path.join(output, 'assets'))) {
  if (file.endsWith('.css')) {
    const css = await readFile(path.join(output, 'assets', file), 'utf8');
    for (const match of css.matchAll(/url\(["']?([^"')]+)["']?\)/g)) await verify(match[1], `assets/${file}`);
  }
}
const worker = await readFile(path.join(output, 'sw.js'), 'utf8');
for (const asset of ['coast.svg', 'lighthouse.svg', 'coffee.svg', 'studio.svg', 'ferry.svg', 'dunes.svg']) {
  assert(worker.includes(`assets/${asset}`), `${asset} ausente do precache.`);
}
for (const forbidden of ['STORY_BIBLE.md', 'docs', '.env', 'src']) {
  assert(!(await readdir(output)).includes(forbidden), `${forbidden} distribuído inadvertidamente.`);
}
console.log(`Build estático validado em ${base}: ${checked.size} caminhos, ícones e seis ilustrações no precache. Offline real exige navegador.`);
