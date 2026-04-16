import type { AgentConfig } from '../../../shared/types/agent'
import type { Env } from './types'

interface ToolSchema {
  name: string
  description: string
  input_schema: Record<string, unknown>
}

interface LLMMessage {
  role: string
  content: unknown
}

export async function createLLMStream(
  agent: AgentConfig,
  messages: LLMMessage[],
  tools: ToolSchema[],
  env: Env,
): Promise<Response> {
  switch (agent.provider) {
    case 'anthropic':
      return callAnthropic(agent, messages, tools, env)
    case 'mistral':
      return callMistral(agent, messages, tools, env)
    default:
      throw new Error(`Unknown provider: ${agent.provider}`)
  }
}

async function callAnthropic(
  agent: AgentConfig,
  messages: LLMMessage[],
  tools: ToolSchema[],
  env: Env,
): Promise<Response> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: agent.model,
      max_tokens: agent.maxTokens ?? 2048,
      temperature: agent.temperature ?? 0.7,
      system: agent.systemPrompt,
      messages,
      tools: tools.length > 0 ? tools : undefined,
      stream: true,
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Anthropic API error ${response.status}: ${err}`)
  }

  return response
}

async function callMistral(
  agent: AgentConfig,
  messages: LLMMessage[],
  tools: ToolSchema[],
  env: Env,
): Promise<Response> {
  // Convert Anthropic-style messages to OpenAI/Mistral format
  const mistralMessages = messages.map((m) => {
    if (m.role === 'user' && Array.isArray(m.content)) {
      // Tool results need special handling
      const toolResults = (m.content as Array<Record<string, unknown>>).filter(
        (c) => c.type === 'tool_result',
      )
      if (toolResults.length > 0) {
        return toolResults.map((tr) => ({
          role: 'tool' as const,
          tool_call_id: tr.tool_use_id as string,
          content: tr.content as string,
        }))
      }
    }
    if (m.role === 'assistant' && Array.isArray(m.content)) {
      const textParts = (m.content as Array<Record<string, unknown>>)
        .filter((c) => c.type === 'text')
        .map((c) => c.text as string)
        .join('')
      const toolCalls = (m.content as Array<Record<string, unknown>>)
        .filter((c) => c.type === 'tool_use')
        .map((c) => ({
          id: c.id as string,
          type: 'function' as const,
          function: {
            name: c.name as string,
            arguments: JSON.stringify(c.input),
          },
        }))
      return {
        role: 'assistant' as const,
        content: textParts || null,
        tool_calls: toolCalls.length > 0 ? toolCalls : undefined,
      }
    }
    return { role: m.role, content: m.content as string }
  }).flat()

  const mistralTools = tools.map((t) => ({
    type: 'function' as const,
    function: {
      name: t.name,
      description: t.description,
      parameters: t.input_schema,
    },
  }))

  const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.MISTRAL_API_KEY}`,
    },
    body: JSON.stringify({
      model: agent.model,
      messages: [
        { role: 'system', content: agent.systemPrompt },
        ...mistralMessages,
      ],
      tools: mistralTools.length > 0 ? mistralTools : undefined,
      max_tokens: agent.maxTokens ?? 2048,
      temperature: agent.temperature ?? 0.7,
      stream: true,
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Mistral API error ${response.status}: ${err}`)
  }

  return response
}

/**
 * Parse Anthropic SSE stream — yields raw event objects.
 * Used directly by the chat handler.
 */
export async function* parseAnthropicStream(
  response: Response,
): AsyncGenerator<Record<string, unknown>> {
  const reader = response.body!.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

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
      try {
        yield JSON.parse(data)
      } catch {
        // skip malformed
      }
    }
  }
}

/**
 * Parse Mistral/OpenAI SSE stream and yield events in Anthropic-compatible format.
 */
export async function* parseMistralStream(
  response: Response,
): AsyncGenerator<Record<string, unknown>> {
  const reader = response.body!.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let blockIndex = -1
  const activeToolCalls = new Map<number, { id: string; name: string; args: string }>()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue
      const data = line.slice(6).trim()
      if (data === '[DONE]') continue

      let chunk: Record<string, unknown>
      try {
        chunk = JSON.parse(data)
      } catch {
        continue
      }

      const choices = chunk.choices as Array<Record<string, unknown>> | undefined
      if (!choices || choices.length === 0) continue
      const choice = choices[0]!
      const delta = choice.delta as Record<string, unknown> | undefined
      if (!delta) continue

      // Text content
      if (delta.content) {
        if (blockIndex === -1 || activeToolCalls.size > 0) {
          blockIndex++
          yield {
            type: 'content_block_start',
            index: blockIndex,
            content_block: { type: 'text' },
          }
        }
        yield {
          type: 'content_block_delta',
          index: blockIndex,
          delta: { type: 'text_delta', text: delta.content },
        }
      }

      // Tool calls
      const toolCalls = delta.tool_calls as Array<Record<string, unknown>> | undefined
      if (toolCalls) {
        for (const tc of toolCalls) {
          const idx = tc.index as number
          const fn = tc.function as Record<string, unknown> | undefined

          if (!activeToolCalls.has(idx)) {
            blockIndex++
            const id = (tc.id as string) ?? `call_${idx}`
            const name = fn?.name as string ?? ''
            activeToolCalls.set(idx, { id, name, args: '' })
            yield {
              type: 'content_block_start',
              index: blockIndex,
              content_block: { type: 'tool_use', id, name },
            }
          }

          if (fn?.arguments) {
            const existing = activeToolCalls.get(idx)!
            existing.args += fn.arguments as string
            yield {
              type: 'content_block_delta',
              index: blockIndex,
              delta: { type: 'input_json_delta', partial_json: fn.arguments },
            }
          }
        }
      }

      // Finish reason
      const finishReason = choice.finish_reason as string | null
      if (finishReason) {
        // Close any open blocks
        if (activeToolCalls.size > 0) {
          for (const [, _tc] of activeToolCalls) {
            yield { type: 'content_block_stop', index: blockIndex }
          }
          activeToolCalls.clear()
        } else {
          yield { type: 'content_block_stop', index: blockIndex }
        }

        yield {
          type: 'message_delta',
          delta: {
            stop_reason: finishReason === 'tool_calls' ? 'tool_use' : 'end_turn',
          },
        }
      }
    }
  }
}

export function parseProviderStream(
  provider: string,
  response: Response,
): AsyncGenerator<Record<string, unknown>> {
  switch (provider) {
    case 'anthropic':
      return parseAnthropicStream(response)
    case 'mistral':
      return parseMistralStream(response)
    default:
      throw new Error(`Unknown provider: ${provider}`)
  }
}
