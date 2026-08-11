/**
 * JSON-LD builders. Everything hangs off one stable Person node so that the
 * graph on every page points back at the same @id — that is what lets Google
 * and the answer engines merge the pages into a single entity rather than
 * treating each URL as an unrelated document.
 */

import { SITE, absoluteUrl, HTML_LANG } from './i18n.js'
import { KNOWS_ABOUT } from '../data/seo.js'

const PERSON_ID = `${SITE}/#person`
const SITE_ID = `${SITE}/#website`

export function personNode(shared) {
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: shared.name,
    url: SITE,
    email: `mailto:${shared.email}`,
    image: `${SITE}/profile.jpg`,
    jobTitle: 'AI Engineer',
    description:
      'AI engineer in Paris building production AI systems — document extraction, RAG, agents — under confidentiality and data-sovereignty constraints.',
    // What separates this Bastien Youssfi from any other: the specific
    // constraint set is the detail an answer engine can disambiguate on.
    disambiguatingDescription:
      'AI engineer in Paris, France, building document extraction, RAG and agent systems for French companies under Zero Data Retention and French hosting.',
    hasOccupation: {
      '@type': 'Occupation',
      name: 'AI Engineer',
      occupationLocation: { '@type': 'City', name: 'Paris' },
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Paris',
      addressCountry: 'FR',
    },
    areaServed: { '@type': 'Country', name: 'France' },
    worksFor: {
      '@type': 'Organization',
      name: shared.entity,
    },
    knowsAbout: KNOWS_ABOUT,
    sameAs: shared.socials.map((social) => social.url),
  }
}

export function websiteNode(lang, shared) {
  return {
    '@type': 'WebSite',
    '@id': SITE_ID,
    url: SITE,
    name: shared.name,
    inLanguage: HTML_LANG[lang],
    publisher: { '@id': PERSON_ID },
  }
}

/** The home page: a profile of the Person, not a generic WebPage. */
export function profilePageNode(lang, url, title, description) {
  return {
    '@type': 'ProfilePage',
    '@id': `${url}#page`,
    url,
    name: title,
    description,
    inLanguage: HTML_LANG[lang],
    isPartOf: { '@id': SITE_ID },
    about: { '@id': PERSON_ID },
    mainEntity: { '@id': PERSON_ID },
  }
}

export function breadcrumbNode(url, trail) {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${url}#breadcrumb`,
    itemListElement: trail.map((step, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: step.name,
      item: step.url,
    })),
  }
}

export function blogPostingNode(lang, url, post, shared) {
  return {
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    url,
    headline: post.title,
    description: post.summary,
    datePublished: post.date.toISOString(),
    dateModified: (post.updated ?? post.date).toISOString(),
    inLanguage: HTML_LANG[lang],
    isPartOf: { '@id': SITE_ID },
    author: { '@id': PERSON_ID },
    publisher: { '@id': PERSON_ID },
    mainEntityOfPage: url,
    ...(post.image ? { image: new URL(post.image, SITE).href } : {}),
  }
}

/**
 * A case study is a piece of work, not an article — Article would misdescribe
 * it. CreativeWork with `about` keeps the sector as a machine-readable fact.
 */
/**
 * `image` must be an already-resolved src, not the /projets/… path held in
 * content.js — that one has no public URL, so passing it through here produced
 * a 404 in the graph. See lib/images.js.
 */
export function caseStudyNode(lang, url, item, description, image) {
  return {
    '@type': 'CreativeWork',
    '@id': `${url}#work`,
    url,
    name: item.title,
    headline: item.title,
    description,
    inLanguage: HTML_LANG[lang],
    isPartOf: { '@id': SITE_ID },
    creator: { '@id': PERSON_ID },
    author: { '@id': PERSON_ID },
    about: item.sector,
    ...(item.caseStudy?.tech?.length ? { keywords: item.caseStudy.tech.join(', ') } : {}),
    ...(image ? { image: new URL(image, SITE).href } : {}),
  }
}

/** Places carry real coordinates — a strong, checkable signal for AI answers. */
export function placeNode(lang, url, place) {
  return {
    '@type': 'Place',
    '@id': `${url}#place`,
    name: place.title,
    ...(place.country ? { address: { '@type': 'PostalAddress', addressCountry: place.country } } : {}),
    geo: {
      '@type': 'GeoCoordinates',
      latitude: place.coords[0],
      longitude: place.coords[1],
    },
  }
}

export function collectionPageNode(lang, url, title, description, items) {
  return {
    '@type': 'CollectionPage',
    '@id': `${url}#page`,
    url,
    name: title,
    description,
    inLanguage: HTML_LANG[lang],
    isPartOf: { '@id': SITE_ID },
    about: { '@id': PERSON_ID },
    ...(items?.length
      ? {
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: items.map((item, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: item.name,
              url: item.url,
            })),
          },
        }
      : {}),
  }
}

/** Wraps the page's nodes into one @graph, which is the form Google prefers. */
export function graph(nodes) {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes.filter(Boolean),
  }
}

export { absoluteUrl }
