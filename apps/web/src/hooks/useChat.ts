import { useReducer, useCallback, useRef } from 'react'
import type { ChatState, ChatAction, ChatMessage } from '@/types/chat'
import { parseSSE } from '@/utils/sse'

const initialState: ChatState = {
  messages: [],
  isLoading: false,
  error: null,
  hasInteracted: false,
}

function updateLastAssistant(
  state: ChatState,
  updater: (msg: ChatMessage) => ChatMessage,
): ChatState {
  const last = state.messages[state.messages.length - 1]
  if (last?.role !== 'assistant') return state
  const msgs = state.messages.slice(0, -1)
  msgs.push(updater(last))
  return { ...state, messages: msgs }
}

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'ADD_USER_MESSAGE':
      return {
        ...state,
        hasInteracted: true,
        error: null,
        messages: [
          ...state.messages,
          {
            id: crypto.randomUUID(),
            role: 'user',
            content: action.content,
            timestamp: Date.now(),
          },
        ],
      }

    case 'START_ASSISTANT_MESSAGE':
      return {
        ...state,
        isLoading: true,
        messages: [
          ...state.messages,
          {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: '',
            thinking: '',
            isThinking: false,
            toolCalls: [],
            isStreaming: true,
            timestamp: Date.now(),
          },
        ],
      }

    case 'SET_THINKING':
      return updateLastAssistant(state, (m) => ({ ...m, isThinking: action.isThinking }))

    case 'APPEND_THINKING':
      return updateLastAssistant(state, (m) => ({ ...m, thinking: (m.thinking ?? '') + action.text }))

    case 'ADD_TOOL_CALL':
      return updateLastAssistant(state, (m) => ({
        ...m,
        toolCalls: [...(m.toolCalls ?? []), { id: action.id, name: action.name, input: {}, status: 'pending' as const }],
      }))

    case 'UPDATE_TOOL_CALL':
      return updateLastAssistant(state, (m) => ({
        ...m,
        toolCalls: (m.toolCalls ?? []).map((tc) =>
          tc.id === action.id ? { ...tc, input: action.input, status: 'executing' as const } : tc,
        ),
      }))

    case 'TOOL_RESULT':
      return updateLastAssistant(state, (m) => ({
        ...m,
        toolCalls: (m.toolCalls ?? []).map((tc) =>
          tc.id === action.toolUseId ? { ...tc, result: action.result, status: 'complete' as const } : tc,
        ),
      }))

    case 'APPEND_TEXT':
      return updateLastAssistant(state, (m) => ({ ...m, content: m.content + action.text }))

    case 'FINISH': {
      const updated = updateLastAssistant(state, (m) => ({ ...m, isStreaming: false }))
      return { ...updated, isLoading: false }
    }

    case 'SET_ERROR': {
      const updated = updateLastAssistant(state, (m) => ({ ...m, isStreaming: false }))
      return { ...updated, isLoading: false, error: action.message }
    }

    default:
      return state
  }
}

function buildApiMessages(
  messages: ChatMessage[],
): Array<{ role: string; content: string }> {
  return messages
    .filter((m) => m.role === 'user' || (m.role === 'assistant' && m.content))
    .map((m) => ({
      role: m.role,
      content: m.content,
    }))
}

export function useChat() {
  const [state, dispatch] = useReducer(chatReducer, initialState)
  const messagesRef = useRef(state.messages)
  messagesRef.current = state.messages

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return

      dispatch({ type: 'ADD_USER_MESSAGE', content })
      dispatch({ type: 'START_ASSISTANT_MESSAGE' })

      try {
        const apiMessages = [
          ...buildApiMessages(messagesRef.current),
          { role: 'user', content },
        ]

        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: apiMessages }),
        })

        if (!response.ok) {
          const err = await response.json()
          dispatch({
            type: 'SET_ERROR',
            message:
              (err as { error?: string }).error ??
              `Error: ${response.status}`,
          })
          return
        }

        const reader = response.body!.getReader()
        let finished = false

        for await (const { event, data } of parseSSE(reader)) {
          switch (event) {
            case 'thinking_start':
              dispatch({ type: 'SET_THINKING', isThinking: true })
              break
            case 'thinking_delta':
              dispatch({
                type: 'APPEND_THINKING',
                text: data.text as string,
              })
              break
            case 'thinking_end':
              dispatch({ type: 'SET_THINKING', isThinking: false })
              break
            case 'tool_use_start':
              dispatch({
                type: 'ADD_TOOL_CALL',
                id: data.id as string,
                name: data.name as string,
              })
              break
            case 'tool_use_end':
              dispatch({
                type: 'UPDATE_TOOL_CALL',
                id: data.id as string,
                input: data.input as Record<string, unknown>,
              })
              break
            case 'tool_result':
              dispatch({
                type: 'TOOL_RESULT',
                toolUseId: data.tool_use_id as string,
                result: data.result,
              })
              break
            case 'text_delta':
              dispatch({
                type: 'APPEND_TEXT',
                text: data.text as string,
              })
              break
            case 'done':
              dispatch({ type: 'FINISH' })
              finished = true
              break
            case 'error':
              dispatch({
                type: 'SET_ERROR',
                message: data.message as string,
              })
              finished = true
              break
          }
        }

        if (!finished) dispatch({ type: 'FINISH' })
      } catch (err) {
        dispatch({
          type: 'SET_ERROR',
          message: 'Failed to connect. Please try again.',
        })
      }
    },
    [],
  )

  return {
    messages: state.messages,
    isLoading: state.isLoading,
    error: state.error,
    hasInteracted: state.hasInteracted,
    sendMessage,
  }
}
