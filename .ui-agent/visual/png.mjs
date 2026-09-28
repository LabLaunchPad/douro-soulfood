// Minimal dependency-free PNG codec (8-bit, non-interlaced, RGB/RGBA) + diff.
// Enough for deterministic screenshot comparison — not a general library.
import { inflateSync, deflateSync } from 'node:zlib';
import { readFileSync, writeFileSync } from 'node:fs';

const crcTable = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();
const crc = (buf) => {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
};
const chunk = (type, data) => {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const td = Buffer.from(type, 'ascii');
  const c = Buffer.alloc(4);
  c.writeUInt32BE(crc(Buffer.concat([td, data])));
  return Buffer.concat([len, td, data, c]);
};

export function decodePng(file) {
  const buf = readFileSync(file);
  let pos = 8;
  let w, h, bitDepth, colorType;
  const idat = [];
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString('ascii', pos + 4, pos + 8);
    const data = buf.subarray(pos + 8, pos + 8 + len);
    if (type === 'IHDR') {
      w = data.readUInt32BE(0); h = data.readUInt32BE(4);
      bitDepth = data[8]; colorType = data[9];
      const interlace = data[12];
      if (bitDepth !== 8 || interlace !== 0 || ![2, 6].includes(colorType)) throw new Error(`unsupported PNG ${file} (depth=${bitDepth} color=${colorType} interlace=${interlace})`);
    } else if (type === 'IDAT') idat.push(data);
    else if (type === 'IEND') break;
    pos += 12 + len;
  }
  const ch = colorType === 6 ? 4 : 3;
  const stride = w * ch;
  const raw = inflateSync(Buffer.concat(idat));
  const px = Buffer.alloc(w * h * ch);
  let p = 0;
  for (let y = 0; y < h; y++) {
    const f = raw[p++];
    for (let x = 0; x < stride; x++) {
      const v = raw[p++];
      const a = x < ch ? 0 : px[y * stride + x - ch];
      const b = y > 0 ? px[(y - 1) * stride + x] : 0;
      const c = x < ch || y === 0 ? 0 : px[(y - 1) * stride + x - ch];
      let r;
      if (f === 0) r = v;
      else if (f === 1) r = (v + a) & 255;
      else if (f === 2) r = (v + b) & 255;
      else if (f === 3) r = (v + ((a + b) >> 1)) & 255;
      else { const pr = a + b - c; const pa = Math.abs(pr - a), pb = Math.abs(pr - b), pc = Math.abs(pr - c); r = (v + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c)) & 255; }
      px[y * stride + x] = r;
    }
  }
  return { w, h, ch, px };
}

export function encodePng(w, h, ch, px) {
  const stride = w * ch;
  const raw = Buffer.alloc(h * (stride + 1));
  for (let y = 0; y < h; y++) { raw[y * (stride + 1)] = 0; px.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride); }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; ihdr[9] = ch === 4 ? 6 : 2;
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
}

export function downscale(img, targetW) {
  if (img.w <= targetW) return img;
  const s = img.w / targetW;
  const w = targetW, h = Math.round(img.h / s);
  const px = Buffer.alloc(w * h * img.ch);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const sx = Math.min(img.w - 1, Math.floor(x * s)), sy = Math.min(img.h - 1, Math.floor(y * s));
    for (let c = 0; c < img.ch; c++) px[(y * w + x) * img.ch + c] = img.px[(sy * img.w + sx) * img.ch + c];
  }
  return { w, h, ch: img.ch, px };
}

// diff(a, b): returns {changedPct, meanDelta, box} + writes red-overlay diff PNG.
// Compares RGB only, tolerance 16/chan; ignores size mismatch beyond overlap.
export function diffPng(fileA, fileB, outFile) {
  const a = decodePng(fileA), b = decodePng(fileB);
  const w = Math.min(a.w, b.w), h = Math.min(a.h, b.h);
  const out = Buffer.alloc(w * h * 3);
  let changed = 0, sum = 0, x0 = w, y0 = h, x1 = 0, y1 = 0;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    let d = 0;
    for (let c = 0; c < 3; c++) d = Math.max(d, Math.abs(a.px[(y * a.w + x) * a.ch + c] - b.px[(y * b.w + x) * b.ch + c]));
    sum += d;
    if (d > 16) {
      changed++;
      if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
      out[(y * w + x) * 3] = 255;
    } else {
      const g = Math.round((a.px[(y * a.w + x) * a.ch] + a.px[(y * a.w + x) * a.ch + 1] + a.px[(y * a.w + x) * a.ch + 2]) / 3);
      out[(y * w + x) * 3] = out[(y * w + x) * 3 + 1] = out[(y * w + x) * 3 + 2] = g;
    }
  }
  if (outFile) writeFileSync(outFile, encodePng(w, h, 3, out));
  return { changedPct: +(100 * changed / (w * h)).toFixed(2), meanDelta: +(sum / (w * h)).toFixed(2), box: changed ? { x0, y0, x1, y1 } : null, size: `${a.w}x${a.h} vs ${b.w}x${b.h}` };
}
