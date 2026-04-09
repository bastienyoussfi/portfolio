import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { chatRoute } from './routes/chat'
import { analyticsRoute } from './routes/analytics'

export interface Env {
  ANTHROPIC_API_KEY: string
  ANALYTICS_KEY: string
  RATE_LIMIT_KV?: KVNamespace
  DB?: D1Database
}

const app = new Hono<{ Bindings: Env }>()

app.use('/api/*', cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:4173',
    'https://bastienyoussfi.com',
    'https://www.bastienyoussfi.com',
  ],
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type'],
}))

app.route('/api', chatRoute)
app.route('/api', analyticsRoute)

app.get('/', (c) => c.text('Portfolio API'))

export default app
