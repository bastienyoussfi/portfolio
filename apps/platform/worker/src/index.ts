import { Hono } from 'hono'
import { cors } from 'hono/cors'
import type { Env } from './lib/types'
import { resolveAgent, resolveAgentBySlug } from './router'
import { handleChat } from './chat'
import { getPublicAgents } from './gallery'
import { serveStaticAssets } from './static'
import { rateLimit } from './middleware/rateLimit'

const app = new Hono<{ Bindings: Env }>()

app.use(
  '/api/*',
  cors({
    origin: (origin) => {
      if (!origin) return '*'
      if (
        origin.includes('localhost') ||
        origin.includes('agents.bastienyoussfi.com')
      ) {
        return origin
      }
      return ''
    },
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type'],
  }),
)

function getAgent(c: { req: { header: (name: string) => string | undefined; query: (name: string) => string | undefined }; env: Env }) {
  const host = c.req.header('host') ?? ''
  const domain = c.env.PLATFORM_DOMAIN ?? 'agents.bastienyoussfi.com'
  const querySlug = c.req.query('slug')

  let entry = resolveAgent(host, domain)

  if (!entry && querySlug) {
    entry = resolveAgentBySlug(querySlug)
  }

  return entry
}

// API: Get current agent config
app.get('/api/agent', async (c) => {
  const entry = getAgent(c)
  if (!entry) return c.json({ error: 'Agent not found' }, 404)

  const a = entry.config
  return c.json({
    slug: a.slug,
    name: a.name,
    tagline: a.tagline,
    description: a.description,
    avatar: a.avatar,
    theme: a.theme,
    greeting: a.greeting,
    placeholder: a.placeholder,
    suggestedQuestions: a.suggestedQuestions,
    status: a.status,
  })
})

// API: List all public agents
app.get('/api/agents', async (c) => {
  return c.json(getPublicAgents())
})

// API: Chat endpoint
app.post('/api/chat', async (c) => {
  const entry = getAgent(c)
  if (!entry) return c.json({ error: 'Agent not found' }, 404)

  // Rate limit
  const rateLimitResponse = await new Promise<Response | null>((resolve) => {
    rateLimit(c, () => { resolve(null); return Promise.resolve() }, entry.config.slug)
      .then((resp) => { if (resp) resolve(resp as Response) })
  })
  if (rateLimitResponse) return rateLimitResponse

  const body = await c.req.json<{ messages: Array<{ role: 'user' | 'assistant'; content: string }> }>()

  // Store executionCtx for waitUntil
  ;(globalThis as unknown as { ctx?: ExecutionContext }).ctx = c.executionCtx

  return handleChat(entry, body.messages, c.env)
})

// Serve static assets (SPA)
app.use('*', serveStaticAssets)

// Fallback
app.get('/', (c) => c.text('Agents Platform API'))

export default app
