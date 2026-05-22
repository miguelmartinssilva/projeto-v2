const fs = require("fs");
const zlib = require("zlib");
const path = require("path");

const CRC_TABLE = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let j = 0; j < 8; j++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  CRC_TABLE[i] = c;
}
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length, 0);
  const typeB = Buffer.from(type, "ascii");
  const crcBuf = Buffer.concat([typeB, data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(crcBuf), 0);
  return Buffer.concat([len, typeB, data, crc]);
}

function createPNG(w, h, r, g, b) {
  const raw = Buffer.alloc(w * h * 4 + h);
  for (let y = 0; y < h; y++) {
    raw[y * (w * 4 + 1)] = 0;
    for (let x = 0; x < w; x++) {
      const o = y * (w * 4 + 1) + 1 + x * 4;
      raw[o] = r; raw[o+1] = g; raw[o+2] = b; raw[o+3] = 255;
    }
  }
  const compressed = zlib.deflateSync(raw);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  return Buffer.concat([sig, pngChunk("IHDR", ihdr), pngChunk("IDAT", compressed), pngChunk("IEND", Buffer.alloc(0))]);
}

const out = path.join(__dirname, "..", "mm-studio", "public", "icons");
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, "pwa-192x192.png"), createPNG(192, 192, 0, 230, 118));
fs.writeFileSync(path.join(out, "pwa-512x512.png"), createPNG(512, 512, 0, 230, 118));
fs.writeFileSync(path.join(out, "pwa-512x512-maskable.png"), createPNG(512, 512, 0, 230, 118));
console.log("PWA icons generated in public/icons/");
