/**
 * Locale routing. English is the default and lives at the root; French sits
 * under /fr. Every URL the site emits — links, canonicals, hreflang, sitemap,
 * RSS — goes through the helpers here so the two never drift apart.
 */

export const SITE = 'https://bastienyoussfi.com'

export const LOCALES = ['en', 'fr']
export const DEFAULT_LOCALE = 'en'

/** BCP-47 tags for <html lang> and hreflang. */
export const HTML_LANG = { en: 'en', fr: 'fr' }

/** Open Graph wants the underscored form. */
export const OG_LOCALE = { en: 'en_US', fr: 'fr_FR' }

/**
 * Root-relative path for `page` in `lang`.
 * localePath('en', '/places') -> '/places'
 * localePath('fr', '/places') -> '/fr/places'
 */
export function localePath(lang, page = '/') {
  const clean = page === '/' ? '' : `/${page.replace(/^\/|\/$/g, '')}`
  if (lang === DEFAULT_LOCALE) return clean || '/'
  return `/${lang}${clean}`
}

/** Absolute URL for `page` in `lang`. */
export function absoluteUrl(lang, page = '/') {
  return new URL(localePath(lang, page), SITE).href
}

/**
 * Every locale variant of `page`, for the hreflang block and the FR/EN toggle.
 *
 * `langs` is the set of locales the page actually exists in. It defaults to all
 * of them because most routes are built for both, but content-driven pages must
 * pass the real set: a post with no French version would otherwise advertise an
 * hreflang pointing at a 404, which invalidates the whole cluster for Google.
 */
export function alternates(page = '/', langs = LOCALES) {
  return LOCALES.filter((lang) => langs.includes(lang)).map((lang) => ({
    lang,
    hreflang: HTML_LANG[lang],
    path: localePath(lang, page),
    href: absoluteUrl(lang, page),
  }))
}

/**
 * Strips the locale prefix off a live pathname, giving the locale-neutral page
 * key that `alternates()` expects. '/fr/places/paris' -> '/places/paris'
 */
export function pageKey(pathname) {
  const stripped = pathname.replace(/^\/(fr)(?=\/|$)/, '')
  return stripped === '' ? '/' : stripped.replace(/\/$/, '') || '/'
}
