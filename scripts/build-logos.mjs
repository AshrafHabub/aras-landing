import { readFile, mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import decodeJxl, { init as initJxl } from "@jsquash/jxl/decode.js";

const root = path.resolve(import.meta.dirname, "..");
const outDir = path.join(root, "public", "assets", "logos");
await mkdir(outDir, { recursive: true });

function grayToAlpha(data) {
  const out = Buffer.alloc(data.length);
  for (let i = 0; i < data.length; i += 4) {
    const luma = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
    let alpha = 0;
    if (luma <= 90) alpha = 255;
    else if (luma < 245) alpha = Math.round(((245 - luma) / (245 - 90)) * 255);
    out[i + 3] = alpha;
  }
  return out;
}

function blackFromAlpha(data) {
  const out = Buffer.from(data);
  for (let i = 0; i < out.length; i += 4) out[i] = out[i + 1] = out[i + 2] = 0;
  return out;
}

function knockoutWhite(data) {
  const out = Buffer.from(data);
  for (let i = 0; i < out.length; i += 4) {
    const r = out[i];
    const g = out[i + 1];
    const b = out[i + 2];
    const sat = Math.max(r, g, b) - Math.min(r, g, b);
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    if (sat < 22 && luma > 200) {
      out[i] = out[i + 1] = out[i + 2] = 48;
      out[i + 3] = luma >= 250 ? 0 : Math.round(((250 - luma) / 50) * 255);
    }
  }
  return out;
}

function creamInk(data) {
  const out = Buffer.from(data);
  for (let i = 0; i < out.length; i += 4) {
    if (out[i + 3] === 0) continue;
    const sat = Math.max(out[i], out[i + 1], out[i + 2]) - Math.min(out[i], out[i + 1], out[i + 2]);
    if (sat < 28) {
      out[i] = 245;
      out[i + 1] = 243;
      out[i + 2] = 239;
    }
  }
  return out;
}

async function writePng(name, data, width, height, maxWidth) {
  let pipeline = sharp(Buffer.from(data), { raw: { width, height, channels: 4 } }).trim({ threshold: 1 });
  if (maxWidth) pipeline = pipeline.resize({ width: maxWidth, withoutEnlargement: true });
  const file = path.join(outDir, name);
  const info = await pipeline.png({ compressionLevel: 9 }).toFile(file);
  console.log(name, `${info.width}x${info.height}`, `${info.size} bytes`);
}

const kaufmann = await sharp(path.join(root, "assets", "986f4a7a-0432-453c-be6e-e8fd5f9f20ec.jpg"))
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
await writePng(
  "kaufmann.png",
  grayToAlpha(kaufmann.data),
  kaufmann.info.width,
  kaufmann.info.height,
  900,
);

const dekaufmann = await sharp(path.join(root, "assets", "dekaufmann-logo-black.webp"))
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
await writePng(
  "dekaufmann.png",
  blackFromAlpha(dekaufmann.data),
  dekaufmann.info.width,
  dekaufmann.info.height,
);

const aras = await sharp(path.join(root, "assets", "aras.webp"))
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
for (let i = 0; i < aras.data.length; i += 4) {
  if ((i / 4) % aras.info.width < 120) aras.data[i] = aras.data[i + 1] = aras.data[i + 2] = 255;
}
const arasCut = knockoutWhite(aras.data);
await writePng("aras.png", arasCut, aras.info.width, aras.info.height);
await writePng("aras-ondark.png", creamInk(arasCut), aras.info.width, aras.info.height);

const wasm = await readFile(
  path.join(root, "node_modules", "@jsquash", "jxl", "codec", "dec", "jxl_dec.wasm"),
);
await initJxl(undefined, { wasmBinary: wasm });
const jxl = await readFile(path.join(root, "assets", "desquishy-logo-schwarz-v1.jxl"));
const image = await decodeJxl(jxl.buffer.slice(jxl.byteOffset, jxl.byteOffset + jxl.byteLength));
await writePng("desquishy.png", blackFromAlpha(image.data), image.width, image.height);

for (const [file, name] of [
  ["tap-icon.png", "tap.png"],
  ["scroll icon.jpg", "scroll.png"],
]) {
  const icon = await sharp(path.join(root, "assets", file))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  await writePng(name, grayToAlpha(icon.data), icon.info.width, icon.info.height, 256);
}
