// pnpm brand:build — deterministic brand derivatives from approved sources.
// - favicon.svg (approved D-mark) -> favicon-48.png, favicon-32.png, favicon.ico
// - favicon.svg @512 -> images/logo-square.png (structured-data square logo)
// - images/apple-touch-icon.png -> apple-touch-icon.png (root convention copy)
// No new artwork: every byte derives from already-approved repo files.
import sharp from 'sharp';
import { readFileSync, writeFileSync, copyFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pub = (...p) => join(root, 'public', ...p);

// Minimal ICO writer: PNG-compressed entries (Vista+ compatible, no BMP code).
function writeIco(pngs, outFile) {
  // pngs: [{size, buf}]
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(pngs.length, 4);
  const dir = Buffer.alloc(16 * pngs.length);
  let offset = 6 + dir.length;
  pngs.forEach((p, i) => {
    const o = i * 16;
    dir[o] = p.size >= 256 ? 0 : p.size; dir[o + 1] = p.size >= 256 ? 0 : p.size;
    dir[o + 2] = 0; dir[o + 3] = 0;
    dir.writeUInt16LE(1, o + 4); dir.writeUInt16LE(32, o + 6);
    dir.writeUInt32LE(p.buf.length, o + 8); dir.writeUInt32LE(offset, o + 12);
    offset += p.buf.length;
  });
  writeFileSync(outFile, Buffer.concat([header, dir, ...pngs.map((p) => p.buf)]));
}

const svg = pub('favicon.svg');
const jobs = [
  ['favicon-48.png', 48],
  ['favicon-32.png', 32],
  ['images/logo-square.png', 512],
];
for (const [name, size] of jobs) {
  const buf = await sharp(svg, { density: 300 }).resize(size, size).png().toBuffer();
  writeFileSync(pub(name), buf);
  console.log(`wrote ${name} ${size}x${size}`);
}
const icoPngs = [];
for (const size of [16, 32, 48]) {
  icoPngs.push({ size, buf: await sharp(svg, { density: 300 }).resize(size, size).png().toBuffer() });
}
writeIco(icoPngs, pub('favicon.ico'));
console.log('wrote favicon.ico (16/32/48 PNG entries)');

// Root apple-touch-icon convention copy (same bytes, stable URL for implicit requests).
copyFileSync(pub('images/apple-touch-icon.png'), pub('apple-touch-icon.png'));
console.log('copied apple-touch-icon.png to root');

// Integrity report
for (const f of ['favicon-48.png', 'favicon-32.png', 'favicon.ico', 'images/logo-square.png', 'apple-touch-icon.png']) {
  const m = await sharp(pub(f).endsWith('.ico') ? pub('favicon-48.png') : pub(f)).metadata();
  console.log(`${f}: ${existsSync(pub(f)) ? 'exists' : 'MISSING'}${f.endsWith('.ico') ? '' : ` ${m.width}x${m.height}`}`);
}
