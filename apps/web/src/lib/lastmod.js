/**
 * Sitemap `lastmod` dates, read straight off the markdown frontmatter.
 *
 * This runs inside astro.config.mjs, which loads before the content layer
 * exists, so it reads the files itself rather than going through
 * getCollection(). The parse is deliberately narrow: the only fields it wants
 * are `date` and `updated`, both plain ISO dates in the collection schema.
 *
 * Pages with no real date get no lastmod at all. A sitemap where every entry
 * claims today is worse than one with no dates — Google learns to ignore the
 * field, and it is the one signal that makes a revised post get recrawled.
 */

import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

/** `<slug>.<lang>.md` */
const FILE = /^(.+)\.(en|fr)\.md$/

function frontmatterDate(file) {
  const text = readFileSync(file, 'utf8')
  const block = text.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!block) return null

  const pick = (key) => block[1].match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))?.[1].trim()
  const raw = pick('updated') ?? pick('date')
  if (!raw) return null

  const date = new Date(raw)
  return Number.isNaN(date.getTime()) ? null : date
}

/** Path (locale-prefixed, no trailing slash) -> Date, for every dated entry. */
function collect() {
  const dates = new Map()

  for (const collection of ['writing', 'places']) {
    const dir = join(root, 'content', collection)
    if (!existsSync(dir)) continue

    for (const name of readdirSync(dir)) {
      const parts = name.match(FILE)
      if (!parts) continue

      const [, slug, lang] = parts
      const date = frontmatterDate(join(dir, name))
      if (!date) continue

      const prefix = lang === 'en' ? '' : `/${lang}`
      dates.set(`${prefix}/${collection}/${slug}`, date)
    }
  }

  return dates
}

const entries = collect()

/** Newest entry in `collection` for `lang`, or null when it has none. */
function newest(collection, lang) {
  const prefix = lang === 'en' ? `/${collection}/` : `/${lang}/${collection}/`
  let latest = null

  for (const [path, date] of entries) {
    if (!path.startsWith(prefix)) continue
    if (!latest || date > latest) latest = date
  }

  return latest
}

/**
 * The hubs and the home page change whenever their newest child does, so they
 * inherit that date. Case studies live in content.js and carry no date, so
 * they get none.
 */
const derived = new Map()
for (const lang of ['en', 'fr']) {
  const prefix = lang === 'en' ? '' : `/${lang}`
  const writing = newest('writing', lang)
  const places = newest('places', lang)

  if (writing) derived.set(`${prefix}/writing`, writing)
  if (places) derived.set(`${prefix}/places`, places)

  const home = [writing, places].filter(Boolean).sort((a, b) => b - a)[0]
  if (home) derived.set(prefix || '/', home)
}

/** @returns {string | undefined} ISO date for a sitemap URL, if we know one. */
export function lastmodFor(url) {
  const path = new URL(url).pathname.replace(/\/$/, '') || '/'
  const date = entries.get(path) ?? derived.get(path)
  return date ? date.toISOString() : undefined
}
