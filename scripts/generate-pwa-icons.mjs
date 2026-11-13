// Rasterize the existing brand asset with a provided Sharp installation.
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const { default: sharp } = await import(process.env.EDUAIHUB_SHARP_MODULE
  ? pathToFileURL(path.resolve(process.env.EDUAIHUB_SHARP_MODULE)).href : 'sharp');
const svg = await fs.readFile('public/icon.svg');
await fs.mkdir('public/icons', { recursive: true });
for (const size of [192, 512, 180]) {
  await sharp(svg).resize(size, size).png().toFile(`public/icons/${size === 180 ? 'apple-touch-180' : `icon-${size}`}.png`);
}
// Inset the full artwork into the central safe area, with opaque bleed.
const inset = await sharp(svg).resize(358, 358).png().toBuffer();
await sharp({ create: { width: 512, height: 512, channels: 4, background: '#172554' } })
  .composite([{ input: inset, left: 77, top: 77 }]).png().toFile('public/icons/maskable-512.png');
console.log('PASS generated 4 brand-derived PNG icons');
