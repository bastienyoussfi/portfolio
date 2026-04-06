import { useRef, useEffect, useCallback, useState } from 'react'
import { useChat } from '@/hooks/useChat'
import { useAnimatedProgress, type Phase } from '@/hooks/useAnimatedProgress'
import { bio, contact } from '@/data'
import Message from './Message'
// @ts-expect-error — JSX sprite component, no types
import SpriteCanvas from '@/components/sprite/SpriteCanvas'

const PROMPTS = [
  'What projects has Bastien worked on?',
  "What's his tech stack?",
  'Tell me about his experience',
  'How can I get in touch?',
]

export default function ChatHero() {
  const { messages, isLoading, error, hasInteracted, sendMessage } = useChat()
  const messagesRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)

  const [phase, setPhase] = useState<Phase>('hero')
  const progress = useAnimatedProgress(phase, 850)
  const isActive = phase !== 'hero'

  const [sizes, setSizes] = useState({
    titleStart: 52, titleEnd: 18, padStart: 24, padEnd: 14,
  })

  useEffect(() => {
    const update = () => {
      const el = heroRef.current
      if (!el) return
      const cs = getComputedStyle(el)
      setSizes({
        titleStart: parseFloat(cs.getPropertyValue('--hero-title-size')) || 52,
        titleEnd: parseFloat(cs.getPropertyValue('--hero-title-size-chat')) || 18,
        padStart: parseFloat(cs.getPropertyValue('--hero-pad-top')) || 24,
        padEnd: parseFloat(cs.getPropertyValue('--hero-pad-top-chat')) || 14,
      })
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    if (hasInteracted && phase === 'hero') {
      setPhase('transitioning')
      const timer = setTimeout(() => setPhase('chat'), 900)
      return () => clearTimeout(timer)
    }
  }, [hasInteracted, phase])

  const scrollRaf = useRef(0)
  useEffect(() => {
    cancelAnimationFrame(scrollRaf.current)
    scrollRaf.current = requestAnimationFrame(() => {
      const el = messagesRef.current
      if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
    })
  }, [messages, isLoading])

  const handleSend = useCallback(() => {
    const el = textareaRef.current
    if (!el) return
    const v = el.value.trim()
    if (!v || isLoading) return
    sendMessage(v)
    el.value = ''
    el.style.height = 'auto'
  }, [isLoading, sendMessage])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInput = () => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`
  }

  const titleSize = sizes.titleStart - progress * (sizes.titleStart - sizes.titleEnd)
  const headerPadTop = sizes.padStart - progress * (sizes.padStart - sizes.padEnd)
  const subtitleOpacity = Math.max(0, 1 - progress * 2)
  const ctaOpacity = Math.max(0, 1 - progress * 2.5)
  const idleOpacity = Math.max(0, 1 - progress * 2.5)
  const showBorder = progress > 0.6
  const titleAlign = progress > 0.5 ? 'center' : ('left' as const)

  const lastMsg = messages[messages.length - 1]
  const showTyping = isLoading && lastMsg?.role === 'assistant' &&
    !lastMsg.content && !lastMsg.isThinking && !(lastMsg.toolCalls?.length)

  const sendIcon = (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )

  return (
    <div
      ref={heroRef}
      className={`hero ${showBorder ? 'hero--collapsed' : ''}`}
      style={{ paddingTop: headerPadTop }}
    >
      <h1
        className="hero__heading"
        style={{ fontSize: titleSize, textAlign: titleAlign }}
      >
        Hi, I'm <strong>{bio.name}.</strong>
      </h1>

      <div
        className="hero__subtitle-wrap"
        style={{
          maxHeight: subtitleOpacity > 0 ? 60 : 0,
          opacity: subtitleOpacity,
        }}
      >
        <p className="hero__role">{bio.title}.</p>
      </div>

      <div
        className="hero__cta-wrap"
        style={{
          maxHeight: ctaOpacity > 0 ? 80 : 0,
          opacity: ctaOpacity,
        }}
      >
        <div className="hero__actions">
          <a href={`mailto:${contact.email}`} className="hero__cta">Get in Touch</a>
          <span className="hero__supporting">
            Feel free to explore my portfolio and reach out — I'd love to connect!
          </span>
        </div>
      </div>

      <div
        className="chat-idle-wrap"
        style={{
          maxHeight: idleOpacity > 0 ? 250 : 0,
          opacity: idleOpacity,
        }}
      >
        <div className="chat-idle">
          <div className="chat-idle__cat">
            <SpriteCanvas animation="idle" scale={2} />
          </div>
          <div className="chat-idle__prompts">
            {PROMPTS.map((p, i) => (
              <button
                key={p}
                className="prompt-pill"
                style={{ animationDelay: `${i * 60}ms` }}
                onClick={() => sendMessage(p)}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={`chat-messages-area ${isActive ? 'chat-messages-area--visible' : ''}`}>
        <div className="chat-messages" ref={messagesRef} role="log" aria-live="polite">
          {messages.map((m) => <Message key={m.id} msg={m} />)}

          {showTyping && (
            <div className="typing-indicator">
              <div className="typing-indicator__avatar">
                <SpriteCanvas animation="walk" scale={1.5} />
              </div>
              <div className="typing-indicator__dots">
                <div className="typing-indicator__dot" />
                <div className="typing-indicator__dot" />
                <div className="typing-indicator__dot" />
              </div>
            </div>
          )}
        </div>
      </div>

      {error && <div className="chat-error">{error}</div>}

      <div className={`chat-input ${!isActive ? 'chat-input--centered' : ''}`}>
        <div className="chat-input__field">
          <textarea
            ref={textareaRef}
            className="chat-input__textarea"
            rows={1}
            placeholder="Ask Bounty about Bastien…"
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            disabled={isLoading}
          />
        </div>
        <button className="chat-input__send" onClick={handleSend} disabled={isLoading} aria-label="Send message">
          {sendIcon}
        </button>
      </div>
    </div>
  )
}
