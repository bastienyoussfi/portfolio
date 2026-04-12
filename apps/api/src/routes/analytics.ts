import { Hono } from 'hono'
import type { Env } from '../index'

export const analyticsRoute = new Hono<{ Bindings: Env }>()

analyticsRoute.get('/analytics', async (c) => {
  const secret = c.req.header('x-analytics-key')
  if (!secret || secret !== c.env.ANALYTICS_KEY) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  if (!c.env.DB) {
    return c.json({ error: 'Database not configured' }, 500)
  }

  const days = Number(c.req.query('days') ?? '7')

  const [total, recent, questions] = await Promise.all([
    c.env.DB.prepare('SELECT COUNT(*) as count FROM chat_logs').first<{ count: number }>(),
    c.env.DB.prepare(
      `SELECT COUNT(*) as count FROM chat_logs WHERE created_at >= datetime('now', '-' || ? || ' days')`
    ).bind(days).first<{ count: number }>(),
    c.env.DB.prepare(
      `SELECT question, created_at FROM chat_logs ORDER BY created_at DESC LIMIT 50`
    ).all<{ question: string; created_at: string }>(),
  ])

  return c.json({
    total: total?.count ?? 0,
    last_n_days: { days, count: recent?.count ?? 0 },
    recent_questions: questions.results,
  })
})
