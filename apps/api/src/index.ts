import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { chatRoute } from './routes/chat'

export interface Env {
  ANTHROPIC_API_KEY: string
  RATE_LIMIT_KV?: KVNamespace
}

const app = new Hono<{ Bindings: Env }>()

app.use('/api/*', cors({
  origin: ['http://localhost:5173', 'http://localhost:4173'],
  allowMethods: ['POST', 'OPTIONS'],
  allowHeaders: ['Content-Type'],
}))

app.route('/api', chatRoute)

app.get('/', (c) => c.text('Portfolio API'))

export default app
