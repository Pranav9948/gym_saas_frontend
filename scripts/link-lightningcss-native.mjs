import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pnpmDir = path.join(root, 'node_modules', '.pnpm');

function nativeBinaries() {
  const bins = [];
  if (!fs.existsSync(pnpmDir)) return bins;

  for (const store of fs.readdirSync(pnpmDir)) {
    if (!store.startsWith('lightningcss-') || !store.includes('@')) continue;
    const name = store.slice(0, store.lastIndexOf('@'));
    const pkgDir = path.join(pnpmDir, store, 'node_modules', name);
    if (!fs.existsSync(pkgDir)) continue;
    for (const file of fs.readdirSync(pkgDir)) {
      if (file.endsWith('.node')) {
        bins.push(path.join(pkgDir, file));
      }
    }
  }

  return bins;
}

function lightningcssDirs() {
  const dirs = [];
  if (!fs.existsSync(pnpmDir)) return dirs;

  for (const store of fs.readdirSync(pnpmDir)) {
    const candidate = path.join(pnpmDir, store, 'node_modules', 'lightningcss');
    if (fs.existsSync(path.join(candidate, 'node', 'index.js'))) {
      dirs.push(candidate);
    }
  }

  const hoisted = path.join(root, 'node_modules', 'lightningcss');
  if (fs.existsSync(path.join(hoisted, 'node', 'index.js'))) {
    dirs.push(hoisted);
  }

  return dirs;
}

const bins = nativeBinaries();
const targets = lightningcssDirs();

if (bins.length === 0) {
  console.warn('link-lightningcss-native: no lightningcss-*.node binaries found');
  process.exit(0);
}

for (const dir of targets) {
  for (const bin of bins) {
    const dest = path.join(dir, path.basename(bin));
    fs.copyFileSync(bin, dest);
  }
}

console.log(
  `link-lightningcss-native: copied ${bins.length} binary(ies) into ${targets.length} lightningcss package(s)`,
);
