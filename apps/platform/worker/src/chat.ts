import type { AgentEntry } from './_registry'
import type { Env } from './lib/types'
import type { ToolDefinition } from '../../shared/types/tool'
import { createLLMStream, parseProviderStream } from './lib/llm'
import { sseEvent } from './lib/streaming'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

function trimMessages(messages: ChatMessage[], maxExchanges: number): ChatMessage[] {
  const maxMessages = maxExchanges * 2
  if (messages.length <= maxMessages) return messages
  return messages.slice(-maxMessages)
}

export async function handleChat(
  agentEntry: AgentEntry,
  userMessages: ChatMessage[],
  env: Env,
): Promise<Response> {
  const { config: agent, tools: toolsMap } = agentEntry

  const apiKey =
    agent.provider === 'anthropic'
      ? env.ANTHROPIC_API_KEY
      : env.MISTRAL_API_KEY

  if (!apiKey) {
    return new Response(
      sseEvent('error', { message: 'API key not configured' }),
      { headers: { 'Content-Type': 'text/event-stream' } },
    )
  }

  const trimmed = trimMessages(userMessages, 10)
  const apiMessages: Array<{ role: string; content: unknown }> = trimmed.map((m) => ({
    role: m.role,
    content: m.content,
  }))

  // Build tool schemas for LLM
  const tools: ToolDefinition[] = []
  for (const toolId of agent.tools) {
    const tool = toolsMap.get(toolId)
    if (tool) tools.push(tool)
  }

  const toolSchemas = tools.map((t) => ({
    name: t.name,
    description: t.description,
    input_schema: t.parameters,
  }))

  const { readable, writable } = new TransformStream()
  const writer = writable.getWriter()
  const encoder = new TextEncoder()

  const write = (event: string, data: unknown) =>
    writer.write(encoder.encode(sseEvent(event, data)))

  const agentLoop = async () => {
    try {
      let currentMessages = [...apiMessages]
      let loopCount = 0
      const maxLoops = 5

      while (loopCount < maxLoops) {
        loopCount++

        const response = await createLLMStream(agent, currentMessages, toolSchemas, env)

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

        for await (const event of parseProviderStream(agent.provider, response)) {
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
              } else if (delta.type === 'text_delta' && delta.text) {
                block.text += delta.text
                await write('text_delta', { text: delta.text })
              } else if (delta.type === 'input_json_delta' && delta.partial_json) {
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
                  // ignore
                }
                block.parsedInput = input

                const tool = tools.find((t) => t.name === block.name)
                if (tool) {
                  try {
                    const result = await tool.handler(input, {
                      agentSlug: agent.slug,
                      env: env as unknown as Record<string, unknown>,
                    })
                    block.result = result
                  } catch (err) {
                    block.result = { error: String(err) }
                  }
                } else {
                  block.result = { error: `Unknown tool: ${block.name}` }
                }

                await write('tool_use_end', {
                  id: block.id,
                  name: block.name,
                  input,
                })

                await write('tool_result', {
                  tool_use_id: block.id,
                  result: block.result,
                })
              }
              break
            }
          }
        }

        if (!hasToolUse) break

        // Build assistant content + tool results for next loop
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

  // Don't block the response
  const ctx = (globalThis as unknown as { ctx?: ExecutionContext }).ctx
  if (ctx) {
    ctx.waitUntil(agentLoop())
  } else {
    // Local dev fallback
    agentLoop()
  }

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
