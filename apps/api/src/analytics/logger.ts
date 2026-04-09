interface ChatLogEntry {
  ip: string
  userAgent: string
  userMessage: string
  assistantMessage: string
  toolsUsed: string[]
}

// Simple hash to anonymize IPs (no raw IPs stored)
async function hashIP(ip: string): Promise<string> {
  const data = new TextEncoder().encode(ip)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash))
    .slice(0, 8)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function logChat(db: D1Database, entry: ChatLogEntry) {
  const ipHash = await hashIP(entry.ip)
  const sessionId = crypto.randomUUID()

  await db.batch([
    db
      .prepare(
        'INSERT INTO chat_sessions (id, ip_hash, user_agent) VALUES (?, ?, ?)',
      )
      .bind(sessionId, ipHash, entry.userAgent),
    db
      .prepare(
        'INSERT INTO chat_messages (session_id, role, content, tools_used) VALUES (?, ?, ?, ?)',
      )
      .bind(sessionId, 'user', entry.userMessage, null),
    db
      .prepare(
        'INSERT INTO chat_messages (session_id, role, content, tools_used) VALUES (?, ?, ?, ?)',
      )
      .bind(
        sessionId,
        'assistant',
        entry.assistantMessage,
        entry.toolsUsed.length > 0
          ? JSON.stringify(entry.toolsUsed)
          : null,
      ),
  ])
}
