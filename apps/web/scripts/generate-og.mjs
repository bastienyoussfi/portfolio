/**
 * Generates the static social-card images and the apple-touch icon.
 *
 *   node scripts/generate-og.mjs
 *
 * Run this by hand whenever the wording or the avatar changes; the output is
 * committed to public/ rather than built on every deploy, because it never
 * changes between deploys and rasterising it costs more than serving it.
 *
 * The cards deliberately break the site's one-type-size rule: a social card is
 * read as a ~300px-wide thumbnail in a feed, so the name has to carry at a size
 * the page never uses. Colours still come straight from tokens.css.
 */

import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import sharp from 'sharp'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const pub = join(root, 'public')

/* tokens.css */
const CANVAS = '#fdfdfc'
const INK = '#171717'
const BODY = '#404040'
const MUTED = '#a1a1a1'
const HAIRLINE = '#e5e5e5'
const ACCENT = '#ff4500'

const W = 1200
const H = 630

/** Helvetica ships on every macOS; librsvg resolves it through fontconfig. */
const SANS = "Helvetica Neue, Helvetica, Arial, sans-serif"
const MONO = "Menlo, Courier New, monospace"

const CARDS = {
  en: {
    file: 'og.png',
    role: 'AI Engineer, Paris',
    // Two lines, not three: a third would crowd the domain line at this size.
    lines: [
      'Production AI systems — document extraction, RAG,',
      'agents — built for confidentiality and data sovereignty.',
    ],
  },
  fr: {
    file: 'og-fr.png',
    role: 'Ingénieur IA, Paris',
    lines: [
      'Systèmes IA en production — extraction documentaire,',
      'RAG, agents — confidentialité et souveraineté des données.',
    ],
  },
}

/** Escapes the five XML entities so accented copy can never break the SVG. */
const esc = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function cardSvg({ role, lines }) {
  const body = lines
    .map((line, i) => `<tspan x="88" dy="${i === 0 ? 0 : 44}">${esc(line)}</tspan>`)
    .join('')

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${CANVAS}"/>
  <rect x="0" y="0" width="${W}" height="6" fill="${INK}"/>

  <text x="88" y="312" font-family="${SANS}" font-size="72" font-weight="600"
        letter-spacing="-2.2" fill="${INK}">Bastien Youssfi</text>
  <text x="88" y="364" font-family="${SANS}" font-size="34" font-weight="400"
        letter-spacing="-0.5" fill="${MUTED}">${esc(role)}</text>

  <line x1="88" y1="410" x2="${W - 88}" y2="410" stroke="${HAIRLINE}" stroke-width="1"/>

  <text x="88" y="464" font-family="${SANS}" font-size="28" font-weight="400"
        letter-spacing="-0.4" fill="${BODY}">${body}</text>

  <text x="88" y="${H - 56}" font-family="${MONO}" font-size="24" fill="${MUTED}">bastienyoussfi.com</text>
  <circle cx="${W - 92}" cy="${H - 64}" r="7" fill="${ACCENT}"/>
</svg>`
}

/** The avatar, masked to a circle, ready to composite onto a card. */
async function avatar(size) {
  const mask = Buffer.from(
    `<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#fff"/></svg>`,
  )
  return sharp(join(pub, 'profile.jpg'))
    .resize(size, size, { fit: 'cover' })
    .composite([{ input: mask, blend: 'dest-in' }])
    .png()
    .toBuffer()
}

async function buildCard(lang, card) {
  const face = await avatar(132)
  const png = await sharp(Buffer.from(cardSvg(card)))
    .composite([{ input: face, left: 88, top: 104 }])
    .png({ compressionLevel: 9, palette: true })
    .toBuffer()

  await writeFile(join(pub, card.file), png)
  console.log(`  public/${card.file}  ${W}x${H}  ${(png.length / 1024).toFixed(1)}kB`)
}

async function buildTouchIcon() {
  const svg = await readFile(join(pub, 'favicon.svg'))
  // Apple composites the icon onto its own rounded rect, so this one is drawn
  // edge to edge on the dark square rather than reusing the favicon's radius.
  const png = await sharp(svg, { density: 720 })
    .resize(180, 180)
    .flatten({ background: '#0a0a0a' })
    .png({ compressionLevel: 9 })
    .toBuffer()

  await writeFile(join(pub, 'apple-touch-icon.png'), png)
  console.log(`  public/apple-touch-icon.png  180x180  ${(png.length / 1024).toFixed(1)}kB`)
}

console.log('Generating social cards…')
for (const [lang, card] of Object.entries(CARDS)) await buildCard(lang, card)
await buildTouchIcon()
console.log('Done.')
