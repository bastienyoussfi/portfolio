import type { ChatMessage } from '@/types/chat'
import ThinkingBlock from './ThinkingBlock'
import ToolCallBlock from './ToolCallBlock'
import Markdown from './Markdown'
import StreamingContent from './StreamingContent'
// @ts-expect-error — JSX sprite component, no types
import SpriteCanvas from '@/components/sprite/SpriteCanvas'

function getCatAnimation(msg: ChatMessage): string {
  if (msg.isStreaming || msg.isThinking) return 'play'
  if ((msg.toolCalls?.length ?? 0) > 0 && msg.toolCalls!.some(tc => tc.status !== 'complete')) return 'walk'
  return 'sit'
}

export default function Message({ msg }: { msg: ChatMessage }) {
  if (msg.role === 'user') {
    return (
      <div className="msg-row msg-row--user">
        <div className="msg-bubble msg-bubble--user b1">{msg.content}</div>
      </div>
    )
  }

  const hasThinking = !!msg.thinking
  const hasContent = !!msg.content

  return (
    <div className="msg-row msg-row--assistant">
      <div className="msg-avatar">
        <SpriteCanvas animation={getCatAnimation(msg)} scale={1.5} />
      </div>
      <div className="msg-body">
        {hasThinking && (
          <ThinkingBlock thinking={msg.thinking!} isActive={msg.isThinking ?? false} />
        )}
        {msg.toolCalls?.map((tc) => (
          <ToolCallBlock key={tc.id} tc={tc} />
        ))}
        {hasContent && (
          msg.isStreaming
            ? <StreamingContent content={msg.content} />
            : <Markdown content={msg.content} />
        )}
      </div>
    </div>
  )
}
