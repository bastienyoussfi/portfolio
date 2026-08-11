import { content } from '../data/content.js'
import { seo } from '../data/seo.js'
import { listEntries } from './collections.js'
import { SITE, absoluteUrl, LOCALES } from './i18n.js'

/**
 * Builds /llms.txt for a locale, in the convention proposed at llmstxt.org: a
 * plain-markdown summary an assistant can read in one fetch instead of
 * inferring the facts from styled HTML.
 *
 * The `Facts` block is deliberately written as short standalone claims — the
 * form an answer engine can lift and attribute without rewriting. The same
 * sentences are rendered on the home page by Facts.astro; an assistant that
 * never fetches this file still finds them.
 */
const HEADINGS = {
  en: { facts: 'Facts', work: 'Selected work', writing: 'Writing', places: 'Places', contact: 'Contact', langs: 'Languages', none: 'Nothing published yet.' },
  fr: { facts: 'Faits', work: 'Travaux sélectionnés', writing: 'Écrits', places: 'Endroits', contact: 'Contact', langs: 'Langues', none: 'Rien de publié pour l’instant.' },
}

export async function llmsTxt(lang) {
  const t = content[lang]
  const s = seo[lang]
  const h = HEADINGS[lang]

  const posts = await listEntries('writing', lang)
  const places = await listEntries('places', lang)

  const lines = [
    '# Bastien Youssfi',
    '',
    `> ${s.home.description}`,
    '',
    `## ${h.facts}`,
    '',
    ...s.facts.map((fact) => `- ${fact}`),
    '',
    `## ${t.services.label}`,
    '',
    ...t.services.items.map((item) => `- **${item.title}** — ${item.detail} (${item.meta})`),
    '',
    `## ${h.work}`,
    '',
    ...t.work.items.map(
      (item) =>
        `- [${item.title}](${absoluteUrl(lang, `/projects/${item.id}`)}) — ${item.sector}, ${t.work.statusLabels[item.status]}. ${item.caseStudy?.summary ?? ''}`.trim(),
    ),
    '',
    `## ${h.writing}`,
    '',
    ...(posts.length
      ? posts.map(
          (post) =>
            `- [${post.data.title}](${absoluteUrl(lang, `/writing/${post.slug}`)}) — ${post.data.date.toISOString().slice(0, 10)}${post.data.summary ? `. ${post.data.summary}` : ''}`,
        )
      : [`- ${h.none}`]),
    '',
    `## ${h.places}`,
    '',
    ...(places.length
      ? places.map(
          (place) =>
            `- [${place.data.title}](${absoluteUrl(lang, `/places/${place.slug}`)})${place.data.country ? ` — ${place.data.country}` : ''}`,
        )
      : [`- ${h.none}`]),
    '',
    `## ${h.contact}`,
    '',
    `- Email: ${t.shared.email}`,
    ...t.shared.socials.map((social) => `- ${social.name}: ${social.url}`),
    '',
    `## ${h.langs}`,
    '',
    ...LOCALES.map((code) => `- ${code.toUpperCase()}: ${absoluteUrl(code, '/')}`),
    '',
    `Full sitemap: ${SITE}/sitemap-index.xml`,
    '',
  ]

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
