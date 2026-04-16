import { useRef, useEffect } from 'react'
import { useAgent } from '@/hooks/useAgent'
import { useChat } from '@/hooks/useChat'
import AgentHeader from '@/components/AgentHeader'
import ChatInput from '@/components/ChatInput'
import Message from '@/components/ChatMessage'
import ThemeProvider from '@/components/ThemeProvider'

interface Props {
  agentSlug: string
}

export default function Chat({ agentSlug }: Props) {
  const { agent, loading, error } = useAgent(agentSlug)
  const { messages, isLoading, error: chatError, hasInteracted, sendMessage, reset } = useChat(agentSlug)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (loading) {
    return (
      <div className="page" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div className="typing-indicator">
          <div className="typing-indicator__dots">
            <div className="typing-indicator__dot" />
            <div className="typing-indicator__dot" />
            <div className="typing-indicator__dot" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !agent) {
    return (
      <div className="page" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-3)', fontSize: 14 }}>Agent not found</p>
      </div>
    )
  }

  return (
    <ThemeProvider theme={agent.theme}>
      <div className="page">
        <div style={{ paddingTop: 'var(--page-pt)' }}>
          <AgentHeader agent={agent} />
        </div>

        <div className="chat-area">
          <div className="chat-messages">
            {!hasInteracted && (
              <div className="chat-greeting">
                <div className="chat-greeting__name">{agent.name}</div>
                <div className="chat-greeting__text">{agent.greeting}</div>
                {agent.suggestedQuestions && agent.suggestedQuestions.length > 0 && (
                  <div className="chat-greeting__suggestions">
                    {agent.suggestedQuestions.map((q, i) => (
                      <button
                        key={i}
                        className="prompt-pill"
                        onClick={() => sendMessage(q)}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {messages.map((msg) => (
              <Message key={msg.id} msg={msg} />
            ))}

            {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
              <div className="typing-indicator">
                <div className="typing-indicator__dots">
                  <div className="typing-indicator__dot" />
                  <div className="typing-indicator__dot" />
                  <div className="typing-indicator__dot" />
                </div>
              </div>
            )}

            {chatError && (
              <div className="chat-error">{chatError}</div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <ChatInput
            placeholder={agent.placeholder}
            onSend={sendMessage}
            onReset={reset}
            disabled={isLoading}
            hasInteracted={hasInteracted}
          />
          <div className="chat-disclaimer">
            AI can make mistakes. Verify important information.
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}
