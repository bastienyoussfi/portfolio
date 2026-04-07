import { useRef, useEffect, useCallback, useState } from 'react'
import { useChat } from '@/hooks/useChat'
import { useAnimatedProgress, type Phase } from '@/hooks/useAnimatedProgress'
import { bio, contact } from '@/data'
import Message from './Message'
import GhostMascot from '@/components/ui/GhostMascot'

/* ── SVG Icons for chips (14×14, stroke, currentColor) ── */
const FolderIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
)

const ZapIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
)

const BuildingIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
    <path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M8 10h.01M16 10h.01M12 10h.01M8 14h.01M16 14h.01M12 14h.01" />
  </svg>
)

const MailIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M22 7l-10 7L2 7" />
  </svg>
)

const ArrowIcon = (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 17L17 7M7 7h10v10" />
  </svg>
)

const PROMPTS = [
  { text: 'His projects', icon: FolderIcon },
  { text: 'Tech stack', icon: ZapIcon },
  { text: 'Experience', icon: BuildingIcon },
  { text: 'Get in touch', icon: MailIcon },
]

const PROMPT_MESSAGES: Record<string, string> = {
  'His projects': 'What projects has Bastien worked on?',
  'Tech stack': "What's his tech stack?",
  'Experience': 'Tell me about his experience',
  'Get in touch': 'How can I get in touch?',
}

const sendIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default function ChatHero() {
  const { messages, isLoading, error, hasInteracted, sendMessage } = useChat()
  const messagesRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)

  const [phase, setPhase] = useState<Phase>('hero')
  const [userDismissed, setUserDismissed] = useState(false)
  const progress = useAnimatedProgress(phase, 850)
  const isActive = phase !== 'hero'
  const collapseTimer = useRef<ReturnType<typeof setTimeout>>(null)
  const goHomeTimer = useRef<ReturnType<typeof setTimeout>>(null)

  const [sizes, setSizes] = useState({
    titleStart: 52, titleEnd: 18, padStart: 24, padEnd: 14,
  })

  useEffect(() => {
    let rafId = 0
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
    const onResize = () => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(rafId)
    }
  }, [])

  useEffect(() => {
    if (hasInteracted && phase === 'hero' && !userDismissed) {
      setPhase('transitioning')
      collapseTimer.current = setTimeout(() => setPhase('chat'), 900)
    }
  }, [hasInteracted, phase, userDismissed])

  const prevMessageCount = useRef(messages.length)
  useEffect(() => {
    if (messages.length > prevMessageCount.current && userDismissed) {
      setUserDismissed(false)
    }
    prevMessageCount.current = messages.length
  }, [messages.length, userDismissed])

  useEffect(() => {
    return () => {
      if (collapseTimer.current) clearTimeout(collapseTimer.current)
      if (goHomeTimer.current) clearTimeout(goHomeTimer.current)
    }
  }, [])

  const handleGoHome = useCallback(() => {
    if (phase !== 'chat') return
    setUserDismissed(true)
    setPhase('expanding')
    goHomeTimer.current = setTimeout(() => setPhase('hero'), 900)
  }, [phase])

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
  const showBorder = progress > 0.6
  const titleAlign = progress > 0.5 ? 'center' : ('left' as const)

  const lastMsg = messages[messages.length - 1]
  const shouldType = isLoading && lastMsg?.role === 'assistant' &&
    !lastMsg.content && !lastMsg.isThinking && !(lastMsg.toolCalls?.length)

  const [typingPhase, setTypingPhase] = useState<'hidden' | 'visible' | 'exiting'>('hidden')
  const visibleSinceRef = useRef(0)

  useEffect(() => {
    let delay: ReturnType<typeof setTimeout>
    let exit: ReturnType<typeof setTimeout>

    if (shouldType && typingPhase === 'hidden') {
      setTypingPhase('visible')
      visibleSinceRef.current = Date.now()
    } else if (!shouldType && typingPhase === 'visible') {
      const elapsed = Date.now() - visibleSinceRef.current
      const remaining = Math.max(0, 200 - elapsed)
      delay = setTimeout(() => {
        setTypingPhase('exiting')
        exit = setTimeout(() => setTypingPhase('hidden'), 300)
      }, remaining)
    }

    return () => {
      clearTimeout(delay)
      clearTimeout(exit)
    }
  }, [shouldType, typingPhase])

  return (
    <div
      ref={heroRef}
      className={`hero ${showBorder ? 'hero--collapsed' : ''}`}
      style={{ paddingTop: headerPadTop }}
    >
      <h1
        className={`hero__heading ${phase === 'chat' ? 'hero__heading--hidden' : ''}`}
        style={{ fontSize: titleSize, textAlign: titleAlign }}
      >
        Hi, I'm <strong>{bio.name}.</strong>
      </h1>

      <div className={`hero-group ${isActive ? 'hero-group--collapsed' : ''}`}>
        <div className="hero__subtitle-wrap">
          <p className="hero__role">{bio.title}.</p>
        </div>

        <div className="hero__cta-wrap">
          <div className="hero__actions">
            <a href={`mailto:${contact.email}`} className="hero__cta">
              Get in Touch
              {ArrowIcon}
            </a>
            <span className="hero__supporting">
              Feel free to explore my portfolio and reach out — I'd love to connect!
            </span>
          </div>
        </div>

      </div>

      <div className={`chat-messages-area ${isActive ? 'chat-messages-area--visible' : ''}`}>
        <div className="chat-messages" ref={messagesRef} role="log" aria-live="polite">
          {messages.map((m, i) => {
            const isEmpty = m.role === 'assistant' && !m.content && !m.thinking && !m.toolCalls?.length
            if (isEmpty && typingPhase !== 'hidden' && i === messages.length - 1) return null
            return <Message key={m.id} msg={m} onSendMessage={sendMessage} />
          })}

          {typingPhase !== 'hidden' && (
            <div className={`typing-indicator typing-indicator--${typingPhase}`}>
              <div className="typing-indicator__dots">
                <div className="typing-indicator__dot" />
                <div className="typing-indicator__dot" />
                <div className="typing-indicator__dot" />
              </div>
            </div>
          )}

          {lastMsg?.role === 'assistant' && (
            <div className="chat-mascot">
              <GhostMascot scale={2} />
            </div>
          )}
        </div>
      </div>

      {error && <div className="chat-error">{error}</div>}

      <div className={`chat-center ${isActive ? 'chat-center--active' : ''}`}>
        <div className="chat-idle__cat">
          <GhostMascot scale={2} />
        </div>

        <div className={`chat-input ${!isActive ? 'chat-input--centered' : ''}`}>
          <div className="chat-input__field">
            <textarea
              ref={textareaRef}
              className="chat-input__textarea"
              rows={1}
              placeholder={`Ask Bounty about ${bio.name.split(' ')[0]}…`}
              onKeyDown={handleKeyDown}
              onInput={handleInput}
              disabled={isLoading}
            />
            <button className="chat-input__send" onClick={handleSend} disabled={isLoading} aria-label="Send message">
              {sendIcon}
            </button>
          </div>
        </div>

        <div className="chat-idle__prompts">
          {PROMPTS.map((p, i) => (
            <button
              key={p.text}
              className="prompt-pill"
              style={{ animationDelay: `${i * 60}ms` }}
              onClick={() => sendMessage(PROMPT_MESSAGES[p.text] ?? p.text)}
            >
              {p.icon}
              {p.text}
            </button>
          ))}
        </div>

        {phase === 'chat' && (
          <button className="chat-reset" onClick={handleGoHome}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
            </svg>
            Reset chat
          </button>
        )}
      </div>
    </div>
  )
}
