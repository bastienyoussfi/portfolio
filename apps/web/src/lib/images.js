/**
 * Resolves the public-style image paths held in content.js and in markdown
 * frontmatter ('/projets/auditex.jpeg') to the imported asset that Astro can
 * optimise. Keeping the data files free of import statements means the copy
 * stays editable by hand.
 *
 * Anything that does not resolve — an image still sitting in public/, or a
 * remote URL — falls through to a plain <img> at the caller, so adding a file
 * the old way still works.
 */
const modules = import.meta.glob('../assets/**/*.{jpeg,jpg,png,webp,avif,gif}', {
  eager: true,
  import: 'default',
})

const byPath = new Map(
  Object.entries(modules).map(([path, asset]) => [path.replace('../assets', ''), asset]),
)

/** @returns {ImageMetadata | null} */
export function asset(src) {
  if (!src) return null
  return byPath.get(src) ?? null
}
