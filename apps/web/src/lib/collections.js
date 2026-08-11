import { getCollection } from 'astro:content'
import { LOCALES } from './i18n.js'

/** "paris.fr" -> { slug: 'paris', lang: 'fr' } */
function split(id) {
  const cut = id.lastIndexOf('.')
  return { slug: id.slice(0, cut), lang: id.slice(cut + 1) }
}

/** Entries of `collection` available in `lang`, newest first. */
export async function listEntries(collection, lang) {
  const all = await getCollection(collection)
  return all
    .map((entry) => ({ entry, ...split(entry.id), data: entry.data }))
    .filter((item) => item.lang === lang)
    .sort((a, b) => b.data.date - a.data.date)
}

/** One entry, or null when that slug has no version in `lang`. */
export async function findEntry(collection, slug, lang) {
  const items = await listEntries(collection, lang)
  return items.find((item) => item.slug === slug) ?? null
}

/**
 * getStaticPaths input for a collection: one route per slug per locale, under
 * the locale that page file serves.
 */
export async function entryPaths(collection, lang) {
  const items = await listEntries(collection, lang)
  return items.map((item) => ({ params: { slug: item.slug }, props: { item } }))
}

/** Every slug that exists in at least one locale — used by the sitemap checks. */
export async function allSlugs(collection) {
  const all = await getCollection(collection)
  return [...new Set(all.map((entry) => split(entry.id).slug))]
}

/**
 * The locales `slug` has a file for, in LOCALES order. Pages feed this to the
 * `langs` prop so hreflang only ever advertises translations that exist — a
 * post published in English alone must not claim a French URL.
 */
export async function entryLocales(collection, slug) {
  const all = await getCollection(collection)
  const found = new Set(
    all
      .map((entry) => split(entry.id))
      .filter((item) => item.slug === slug)
      .map((item) => item.lang),
  )
  return LOCALES.filter((lang) => found.has(lang))
}

export { LOCALES }
