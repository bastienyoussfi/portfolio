import rss from '@astrojs/rss'
import { content } from '../data/content.js'
import { seo } from '../data/seo.js'
import { listEntries } from '../lib/collections.js'
import { SITE, localePath } from '../lib/i18n.js'

export async function GET(context) {
  const posts = await listEntries('writing', 'en')

  return rss({
    title: `${content.en.shared.name} — ${content.en.writing.label}`,
    description: seo.en.writing.description,
    site: context.site ?? SITE,
    trailingSlash: false,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.summary ?? '',
      pubDate: post.data.date,
      link: localePath('en', `/writing/${post.slug}`),
    })),
    customData: '<language>en</language>',
  })
}
