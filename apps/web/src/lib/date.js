const LOCALES = { fr: 'fr-FR', en: 'en-US' }

/** "août 2026" / "Aug 2026" — for list rows. */
export function formatMonth(iso, lang) {
  return new Intl.DateTimeFormat(LOCALES[lang] ?? 'en-US', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(iso))
}

/** "1 août 2026" / "August 1, 2026" — for the article header. */
export function formatLong(iso, lang) {
  return new Intl.DateTimeFormat(LOCALES[lang] ?? 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(iso))
}
