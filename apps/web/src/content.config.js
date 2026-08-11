import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

/**
 * Both collections keep the `<slug>.<lang>.md` file convention from the Vite
 * build, so the authoring workflow is unchanged. The id is the filename minus
 * the extension ("paris.fr"); src/lib/collections.js splits it back apart.
 */
const byLang = ({ entry }) => entry.replace(/\.md$/, '')

const writing = defineCollection({
  loader: glob({
    pattern: '*.{fr,en}.md',
    base: './src/content/writing',
    generateId: byLang,
  }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    /** Set when a published post is revised; drives dateModified and lastmod. */
    updated: z.coerce.date().optional(),
    summary: z.string().optional(),
    image: z.string().optional(),
  }),
})

const places = defineCollection({
  loader: glob({
    pattern: '*.{fr,en}.md',
    base: './src/content/places',
    generateId: byLang,
  }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    /** [latitude, longitude] in decimal degrees — drives the map marker. */
    coords: z.tuple([z.number(), z.number()]),
    country: z.string().optional(),
    image: z.string().optional(),
    summary: z.string().optional(),
  }),
})

export const collections = { writing, places }
