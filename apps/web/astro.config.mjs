import { defineConfig, fontProviders } from 'astro/config'
import { satteri } from '@astrojs/markdown-satteri'
import sitemap from '@astrojs/sitemap'
import { lastmodFor } from './src/lib/lastmod.js'

/**
 * The canonical origin. Everything SEO-facing derives from it — canonicals,
 * hreflang, sitemap, RSS, JSON-LD — so this is the single line to change if the
 * domain ever moves.
 */
const SITE = 'https://bastienyoussfi.com'

export default defineConfig({
  site: SITE,

  // English lives at the root, French under /fr. `prefixDefaultLocale: false`
  // keeps `/` free of a locale segment, which is what the existing URLs use.
  i18n: {
    locales: ['en', 'fr'],
    defaultLocale: 'en',
    routing: { prefixDefaultLocale: false },
  },

  // Every canonical, hreflang, sitemap entry and internal link this site emits
  // is slash-free, so the served URLs have to be slash-free too.
  //
  // `format: 'directory'` writes /writing/index.html, and Cloudflare Pages
  // treats /writing/ as the canonical form of that — it 308s /writing to it.
  // The result was a redirect hop on every internal link, and /writing/
  // serving a canonical of /writing that redirected straight back to it.
  //
  // `format: 'file'` writes /writing.html, which Pages serves at /writing with
  // no redirect, and 308s the trailing-slash form to it instead.
  trailingSlash: 'never',
  build: { format: 'file', inlineStylesheets: 'auto' },

  // The site is a handful of small static pages; pulling them into the cache as
  // links enter the viewport makes navigation feel instant.
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },

  integrations: [
    sitemap({
      i18n: { defaultLocale: 'en', locales: { en: 'en', fr: 'fr' } },
      filter: (page) => !page.includes('/404'),
      // Only pages whose date we actually know get one — see lib/lastmod.js.
      serialize(item) {
        const lastmod = lastmodFor(item.url)
        return lastmod ? { ...item, lastmod } : item
      },
    }),
  ],

  // Fonts are fetched and subset at build time, then served from our own origin
  // with metric-matched fallbacks — no Google request at runtime, no CLS.
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Inter',
      cssVariable: '--font-inter',
      weights: ['400 600'],
      styles: ['normal'],
      // `latin` already spans U+0000–00FF plus U+0152–0153, so every accent the
      // French copy uses — including œ — is covered. latin-ext would add ~50kB
      // of preloaded glyphs the site never renders.
      subsets: ['latin'],
      fallbacks: ['-apple-system', 'system-ui', 'Segoe UI', 'Roboto', 'sans-serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'JetBrains Mono',
      cssVariable: '--font-jetbrains',
      weights: ['400 500'],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
    },
  ],

  // Matches how `marked` was configured: GFM on, no smart punctuation (the copy
  // already uses real typographic apostrophes), and no syntax highlighting —
  // Prose.module.css renders code blocks as a plain grey chip with no token
  // colours, which Shiki would fight.
  markdown: {
    syntaxHighlight: false,
    processor: satteri({
      features: { gfm: true, smartPunctuation: false },
    }),
  },
})
