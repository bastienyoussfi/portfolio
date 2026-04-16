import type { Context, Next } from 'hono'
import type { Env } from './lib/types'

const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
}

function getContentType(path: string): string {
  const ext = path.match(/\.[^.]+$/)?.[0] ?? ''
  return MIME_TYPES[ext] ?? 'application/octet-stream'
}

export async function serveStaticAssets(
  c: Context<{ Bindings: Env }>,
  next: Next,
) {
  const url = new URL(c.req.url)

  // API routes pass through
  if (url.pathname.startsWith('/api/')) return next()

  const kv = c.env.STATIC_ASSETS
  if (!kv) return next()

  const path = url.pathname === '/' ? '/index.html' : url.pathname
  const asset = await kv.get(path, 'arrayBuffer')

  if (asset) {
    return new Response(asset, {
      headers: {
        'Content-Type': getContentType(path),
        'Cache-Control': 'public, max-age=3600',
      },
    })
  }

  // SPA fallback — serve index.html for client-side routing
  const indexHtml = await kv.get('/index.html', 'text')
  if (indexHtml) {
    return new Response(indexHtml, {
      headers: { 'Content-Type': 'text/html' },
    })
  }

  return next()
}
