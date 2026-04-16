export function getAgentSlug(): string | null {
  const pathname = window.location.pathname

  // Dev mode fallback: ?agent= query param
  const querySlug = new URLSearchParams(window.location.search).get('agent')
  if (querySlug) return querySlug

  // Path-based routing: /bounty → "bounty"
  const slug = pathname.split('/')[1]
  if (slug && slug !== '') return slug

  return null
}
