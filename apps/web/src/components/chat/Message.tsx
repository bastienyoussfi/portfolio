import type { ChatMessage } from '@/types/chat'
import ThinkingBlock from './ThinkingBlock'
import ToolCallBlock from './ToolCallBlock'
import FollowUpButtons from './FollowUpButtons'
import Markdown from './Markdown'

export default function Message({ msg, onSendMessage }: { msg: ChatMessage; onSendMessage?: (text: string) => void }) {
  if (msg.role === 'user') {
    return (
      <div className="msg-row msg-row--user">
        <div className="msg-bubble msg-bubble--user b1">{msg.content}</div>
      </div>
    )
  }

  const hasThinking = !!msg.thinking
  const hasContent = !!msg.content
  const isComplete = !msg.isStreaming && !msg.isThinking
  const completedTools = (msg.toolCalls ?? []).filter(tc => tc.status === 'complete')
  const lastTool = completedTools[completedTools.length - 1]
  const lastToolName = lastTool ? lastTool.name : null

  return (
    <div className="msg-row msg-row--assistant">
      <div className="msg-body">
        {hasThinking && (
          <ThinkingBlock thinking={msg.thinking!} isActive={msg.isThinking ?? false} />
        )}
        {msg.toolCalls?.map((tc) => (
          <ToolCallBlock key={tc.id} tc={tc} compact />
        ))}
        {(hasContent || msg.isStreaming) && (
          <Markdown content={msg.content} isStreaming={msg.isStreaming} />
        )}
        {isComplete && lastToolName && onSendMessage && (
          <FollowUpButtons toolName={lastToolName} onSelect={onSendMessage} />
        )}
      </div>
    </div>
  )
}
