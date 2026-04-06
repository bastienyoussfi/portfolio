import type { Context, Next } from 'hono'
import type { Env } from '../index'

interface RateLimitEntry {
  count: number
  resetAt: number
}

const MAX_REQUESTS = 10
const WINDOW_MS = 3600_000 // 1 hour

// In-memory fallback when KV is not configured
const memoryStore = new Map<string, RateLimitEntry>()

export async function rateLimit(
  c: Context<{ Bindings: Env }>,
  next: Next,
) {
  const ip = c.req.header('cf-connecting-ip') ?? c.req.header('x-forwarded-for') ?? 'unknown'
  const key = `rate:${ip}`
  const kv = c.env.RATE_LIMIT_KV

  let entry: RateLimitEntry

  if (kv) {
    entry = (await kv.get(key, 'json')) ?? {
      count: 0,
      resetAt: Date.now() + WINDOW_MS,
    }
  } else {
    entry = memoryStore.get(key) ?? {
      count: 0,
      resetAt: Date.now() + WINDOW_MS,
    }
  }

  if (Date.now() > entry.resetAt) {
    entry = { count: 0, resetAt: Date.now() + WINDOW_MS }
  }

  if (entry.count >= MAX_REQUESTS) {
    return c.json(
      {
        error: 'Rate limit exceeded. Please try again later.',
        resetAt: entry.resetAt,
      },
      429,
    )
  }

  entry.count++

  if (kv) {
    await kv.put(key, JSON.stringify(entry), { expirationTtl: 3600 })
  } else {
    memoryStore.set(key, entry)
  }

  await next()
}
