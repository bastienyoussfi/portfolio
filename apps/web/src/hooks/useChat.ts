import { useReducer, useCallback } from 'react'
import type { ChatState, ChatAction, ChatMessage } from '@/types/chat'
import { parseSSE } from '@/utils/sse'

const initialState: ChatState = {
  messages: [],
  isLoading: false,
  error: null,
  hasInteracted: false,
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

    case 'SET_THINKING': {
      const msgs = [...state.messages]
      const last = msgs[msgs.length - 1]
      if (last?.role === 'assistant') {
        msgs[msgs.length - 1] = { ...last, isThinking: action.isThinking }
      }
      return { ...state, messages: msgs }
    }

    case 'APPEND_THINKING': {
      const msgs = [...state.messages]
      const last = msgs[msgs.length - 1]
      if (last?.role === 'assistant') {
        msgs[msgs.length - 1] = {
          ...last,
          thinking: (last.thinking ?? '') + action.text,
        }
      }
      return { ...state, messages: msgs }
    }

    case 'ADD_TOOL_CALL': {
      const msgs = [...state.messages]
      const last = msgs[msgs.length - 1]
      if (last?.role === 'assistant') {
        msgs[msgs.length - 1] = {
          ...last,
          toolCalls: [
            ...(last.toolCalls ?? []),
            {
              id: action.id,
              name: action.name,
              input: {},
              status: 'pending',
            },
          ],
        }
      }
      return { ...state, messages: msgs }
    }

    case 'UPDATE_TOOL_CALL': {
      const msgs = [...state.messages]
      const last = msgs[msgs.length - 1]
      if (last?.role === 'assistant') {
        const toolCalls = (last.toolCalls ?? []).map((tc) =>
          tc.id === action.id
            ? { ...tc, input: action.input, status: 'executing' as const }
            : tc,
        )
        msgs[msgs.length - 1] = { ...last, toolCalls }
      }
      return { ...state, messages: msgs }
    }

    case 'TOOL_RESULT': {
      const msgs = [...state.messages]
      const last = msgs[msgs.length - 1]
      if (last?.role === 'assistant') {
        const toolCalls = (last.toolCalls ?? []).map((tc) =>
          tc.id === action.toolUseId
            ? { ...tc, result: action.result, status: 'complete' as const }
            : tc,
        )
        msgs[msgs.length - 1] = { ...last, toolCalls }
      }
      return { ...state, messages: msgs }
    }

    case 'APPEND_TEXT': {
      const msgs = [...state.messages]
      const last = msgs[msgs.length - 1]
      if (last?.role === 'assistant') {
        msgs[msgs.length - 1] = {
          ...last,
          content: last.content + action.text,
        }
      }
      return { ...state, messages: msgs }
    }

    case 'FINISH': {
      const msgs = [...state.messages]
      const last = msgs[msgs.length - 1]
      if (last?.role === 'assistant') {
        msgs[msgs.length - 1] = { ...last, isStreaming: false }
      }
      return { ...state, messages: msgs, isLoading: false }
    }

    case 'SET_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.message,
        messages: state.messages.map((m, i) =>
          i === state.messages.length - 1 && m.role === 'assistant'
            ? { ...m, isStreaming: false }
            : m,
        ),
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

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || state.isLoading) return

      dispatch({ type: 'ADD_USER_MESSAGE', content })
      dispatch({ type: 'START_ASSISTANT_MESSAGE' })

      try {
        const apiMessages = [
          ...buildApiMessages(state.messages),
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
              break
            case 'error':
              dispatch({
                type: 'SET_ERROR',
                message: data.message as string,
              })
              break
          }
        }

        // In case we don't get a done event
        dispatch({ type: 'FINISH' })
      } catch (err) {
        dispatch({
          type: 'SET_ERROR',
          message: 'Failed to connect. Please try again.',
        })
      }
    },
    [state.messages, state.isLoading],
  )

  return {
    messages: state.messages,
    isLoading: state.isLoading,
    error: state.error,
    hasInteracted: state.hasInteracted,
    sendMessage,
  }
}
