export interface ToolCallDisplay {
  id: string
  name: string
  input: Record<string, unknown>
  result?: unknown
  status: 'pending' | 'executing' | 'complete'
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  thinking?: string
  isThinking?: boolean
  toolCalls?: ToolCallDisplay[]
  isStreaming?: boolean
  timestamp: number
}

export interface ChatState {
  messages: ChatMessage[]
  isLoading: boolean
  error: string | null
  hasInteracted: boolean
}

export type ChatAction =
  | { type: 'ADD_USER_MESSAGE'; content: string }
  | { type: 'START_ASSISTANT_MESSAGE' }
  | { type: 'SET_THINKING'; isThinking: boolean }
  | { type: 'APPEND_THINKING'; text: string }
  | { type: 'ADD_TOOL_CALL'; id: string; name: string }
  | { type: 'UPDATE_TOOL_CALL'; id: string; input: Record<string, unknown> }
  | { type: 'TOOL_RESULT'; toolUseId: string; result: unknown }
  | { type: 'APPEND_TEXT'; text: string }
  | { type: 'FINISH' }
  | { type: 'SET_ERROR'; message: string }
  | { type: 'RESET' }
