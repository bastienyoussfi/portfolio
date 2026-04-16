import { useState, useCallback } from 'react'
import type { ChatMessage } from '@/types/chat'
import ThinkingBlock from './ThinkingBlock'
import ToolCallBlock from './ToolCallBlock'
import Markdown from './Markdown'

const copyIcon = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
)

const checkIcon = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }, [text])

  return (
    <button className="msg-copy" onClick={handleCopy} aria-label="Copy message">
      {copied ? checkIcon : copyIcon}
    </button>
  )
}

export default function Message({ msg }: { msg: ChatMessage }) {
  if (msg.role === 'user') {
    return (
      <div className="msg-row msg-row--user">
        <div className="msg-bubble msg-bubble--user b1">{msg.content}</div>
        <div className="msg-actions msg-actions--user">
          <CopyButton text={msg.content} />
        </div>
      </div>
    )
  }

  const hasThinking = !!msg.thinking
  const hasContent = !!msg.content
  const isComplete = !msg.isStreaming && !msg.isThinking

  return (
    <div className="msg-row msg-row--assistant">
      <div className="msg-body">
        {hasThinking && (
          <ThinkingBlock thinking={msg.thinking!} isActive={msg.isThinking ?? false} />
        )}
        {msg.toolCalls?.map((tc) => (
          <ToolCallBlock key={tc.id} tc={tc} />
        ))}
        {(hasContent || msg.isStreaming) && (
          <Markdown content={msg.content} isStreaming={msg.isStreaming} />
        )}
        {isComplete && hasContent && (
          <div className="msg-actions">
            <CopyButton text={msg.content} />
          </div>
        )}
      </div>
    </div>
  )
}
