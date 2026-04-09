import { Hono } from 'hono'
import type { Env } from '../index'

export const analyticsRoute = new Hono<{ Bindings: Env }>()

// Secret key check — set ANALYTICS_KEY in your Cloudflare env vars
function authorized(c: { req: { query: (key: string) => string | undefined }; env: Env }): boolean {
  const key = c.req.query('key')
  return !!c.env.ANALYTICS_KEY && key === c.env.ANALYTICS_KEY
}

analyticsRoute.get('/analytics', async (c) => {
  if (!authorized(c)) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  const db = c.env.DB
  if (!db) {
    return c.json({ error: 'Database not configured' }, 500)
  }

  const days = parseInt(c.req.query('days') ?? '30', 10)
  const since = new Date(Date.now() - days * 86400_000).toISOString()

  const [
    totalSessions,
    totalMessages,
    recentQuestions,
    toolUsage,
    dailyActivity,
  ] = await Promise.all([
    // Total unique chat sessions
    db
      .prepare(
        'SELECT COUNT(*) as count FROM chat_sessions WHERE created_at >= ?',
      )
      .bind(since)
      .first<{ count: number }>(),

    // Total messages
    db
      .prepare(
        'SELECT COUNT(*) as count FROM chat_messages WHERE created_at >= ?',
      )
      .bind(since)
      .first<{ count: number }>(),

    // Recent questions + answers (last 50)
    db
      .prepare(
        `SELECT
          m1.content as question,
          m2.content as answer,
          m2.tools_used,
          m1.created_at
        FROM chat_messages m1
        JOIN chat_messages m2 ON m1.session_id = m2.session_id AND m2.role = 'assistant'
        WHERE m1.role = 'user' AND m1.created_at >= ?
        ORDER BY m1.created_at DESC
        LIMIT 50`,
      )
      .bind(since)
      .all(),

    // Tool usage breakdown
    db
      .prepare(
        `SELECT tools_used, COUNT(*) as count
        FROM chat_messages
        WHERE tools_used IS NOT NULL AND created_at >= ?
        GROUP BY tools_used
        ORDER BY count DESC`,
      )
      .bind(since)
      .all(),

    // Daily activity (sessions per day)
    db
      .prepare(
        `SELECT DATE(created_at) as day, COUNT(*) as sessions
        FROM chat_sessions
        WHERE created_at >= ?
        GROUP BY DATE(created_at)
        ORDER BY day DESC`,
      )
      .bind(since)
      .all(),
  ])

  return c.json({
    period: `last ${days} days`,
    summary: {
      total_sessions: totalSessions?.count ?? 0,
      total_messages: totalMessages?.count ?? 0,
    },
    daily_activity: dailyActivity.results,
    recent_conversations: recentQuestions.results,
    tool_usage: toolUsage.results,
  })
})
