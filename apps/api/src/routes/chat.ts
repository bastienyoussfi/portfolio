import { Hono } from 'hono'
import type { Env } from '../index'
import { rateLimit } from '../middleware/rateLimit'
import { buildSystemPrompt } from '../prompts/system'
import { toolDefinitions } from '../tools/definitions'
import { executeTool } from '../tools/handlers'

export const chatRoute = new Hono<{ Bindings: Env }>()

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface ChatRequest {
  messages: ChatMessage[]
}

// SSE helper
function sseEvent(event: string, data: unknown): string {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`
}

// Trim conversation to last N exchanges to control costs
function trimMessages(messages: ChatMessage[], maxExchanges: number): ChatMessage[] {
  const maxMessages = maxExchanges * 2
  if (messages.length <= maxMessages) return messages
  return messages.slice(-maxMessages)
}

chatRoute.post('/chat', rateLimit, async (c) => {
  const apiKey = c.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return c.json({ error: 'API key not configured' }, 500)
  }

  const body = await c.req.json<ChatRequest>()
  const userMessages = trimMessages(body.messages, 10)

  // Build the messages array for Claude API (convert simple strings to content blocks)
  const apiMessages = userMessages.map((m) => ({
    role: m.role,
    content: m.content,
  }))

  const { readable, writable } = new TransformStream()
  const writer = writable.getWriter()
  const encoder = new TextEncoder()

  const write = (event: string, data: unknown) =>
    writer.write(encoder.encode(sseEvent(event, data)))

  // Run the agentic loop in the background
  const agentLoop = async () => {
    try {
      let currentMessages: Array<{ role: string; content: unknown }> = [...apiMessages]
      let loopCount = 0
      const maxLoops = 5 // Safety: prevent infinite tool loops

      while (loopCount < maxLoops) {
        loopCount++

        // Call Claude API with streaming
        const response = await fetch(
          'https://api.anthropic.com/v1/messages',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': apiKey,
              'anthropic-version': '2023-06-01',
            },
            body: JSON.stringify({
              model: 'claude-sonnet-4-20250514',
              max_tokens: 1024,
              system: buildSystemPrompt(),
              messages: currentMessages,
              tools: toolDefinitions,
              stream: true,
            }),
          },
        )

        if (!response.ok) {
          const err = await response.text()
          await write('error', { message: `API error: ${response.status}` })
          console.error('Claude API error:', err)
          break
        }

        const reader = response.body!.getReader()
        const decoder = new TextDecoder()
        let buffer = ''

        // Track current content blocks
        let hasToolUse = false
        const contentBlocks: Array<{
          type: string
          id?: string
          name?: string
          input?: string
          text?: string
          thinking?: string
          parsedInput?: Record<string, unknown>
          result?: unknown
        }> = []
        let currentBlockIndex = -1

        // Parse the SSE stream from Claude
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() ?? ''

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue
            const data = line.slice(6)
            if (data === '[DONE]') continue

            let event: { type: string; [key: string]: unknown }
            try {
              event = JSON.parse(data)
            } catch {
              continue
            }

            switch (event.type) {
              case 'content_block_start': {
                currentBlockIndex++
                const block = event.content_block as {
                  type: string
                  id?: string
                  name?: string
                }
                contentBlocks[currentBlockIndex] = {
                  type: block.type,
                  id: block.id,
                  name: block.name,
                  input: '',
                  text: '',
                  thinking: '',
                }

                if (block.type === 'thinking') {
                  await write('thinking_start', {})
                } else if (block.type === 'tool_use') {
                  hasToolUse = true
                  await write('tool_use_start', {
                    id: block.id,
                    name: block.name,
                  })
                }
                break
              }

              case 'content_block_delta': {
                const delta = event.delta as {
                  type: string
                  text?: string
                  thinking?: string
                  partial_json?: string
                }
                const block = contentBlocks[currentBlockIndex]
                if (!block) break

                if (delta.type === 'thinking_delta' && delta.thinking) {
                  block.thinking += delta.thinking
                  await write('thinking_delta', { text: delta.thinking })
                } else if (
                  delta.type === 'text_delta' &&
                  delta.text
                ) {
                  block.text += delta.text
                  await write('text_delta', { text: delta.text })
                } else if (
                  delta.type === 'input_json_delta' &&
                  delta.partial_json
                ) {
                  block.input += delta.partial_json
                }
                break
              }

              case 'content_block_stop': {
                const block = contentBlocks[currentBlockIndex]
                if (!block) break

                if (block.type === 'thinking') {
                  await write('thinking_end', {})
                } else if (block.type === 'tool_use') {
                  let input: Record<string, unknown> = {}
                  try {
                    input = JSON.parse(block.input ?? '{}')
                  } catch {
                    // ignore parse errors
                  }
                  block.parsedInput = input

                  const result = executeTool(block.name!, input)
                  block.result = result

                  await write('tool_use_end', {
                    id: block.id,
                    name: block.name,
                    input,
                  })

                  await write('tool_result', {
                    tool_use_id: block.id,
                    result,
                  })
                }
                break
              }
            }
          }
        }

        // If no tool use, we're done
        if (!hasToolUse) {
          break
        }

        // Build the assistant content and tool results for the next turn
        const assistantContent: unknown[] = []
        const toolResults: unknown[] = []
        for (const block of contentBlocks) {
          if (block.type === 'text' && block.text) {
            assistantContent.push({ type: 'text', text: block.text })
          } else if (block.type === 'tool_use') {
            assistantContent.push({
              type: 'tool_use',
              id: block.id,
              name: block.name,
              input: block.parsedInput,
            })
            toolResults.push({
              type: 'tool_result',
              tool_use_id: block.id,
              content: JSON.stringify(block.result),
            })
          }
        }

        // Append to conversation for next loop iteration
        currentMessages = [
          ...currentMessages,
          { role: 'assistant', content: assistantContent },
          { role: 'user', content: toolResults },
        ]
      }

      await write('done', {})
    } catch (err) {
      console.error('Agent loop error:', err)
      await write('error', {
        message: 'Something went wrong. Please try again.',
      })
    } finally {
      await writer.close()
    }
  }

  // Start the agent loop without blocking the response
  c.executionCtx.waitUntil(agentLoop())

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
})
