// Copies the web app (index.html, manifest, service worker, icons) into ./www/
// so Capacitor's android build picks it up. Capacitor's `webDir` is set to "www".
import { mkdir, copyFile, readdir, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const WEB_DIR = 'www';
const FILES = [
  'index.html',
  'manifest.json',
  'service-worker.js'
];
const DIRS = ['icons'];

async function copyDir(src, dst) {
  await mkdir(dst, { recursive: true });
  const entries = await readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const s = join(src, entry.name);
    const d = join(dst, entry.name);
    if (entry.isDirectory()) await copyDir(s, d);
    else await copyFile(s, d);
  }
}

async function main() {
  if (existsSync(WEB_DIR)) await rm(WEB_DIR, { recursive: true });
  await mkdir(WEB_DIR, { recursive: true });

  for (const f of FILES) {
    if (existsSync(f)) {
      await copyFile(f, join(WEB_DIR, f));
      console.log(`  ✓ ${f}`);
    } else {
      console.warn(`  ⚠ missing ${f}`);
    }
  }
  for (const d of DIRS) {
    if (existsSync(d)) {
      await copyDir(d, join(WEB_DIR, d));
      console.log(`  ✓ ${d}/`);
    }
  }
  console.log(`\nWeb assets staged in ./${WEB_DIR}/`);
}
main().catch(e => { console.error(e); process.exit(1); });
