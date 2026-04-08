import { useRef, useEffect, useCallback, useState, useLayoutEffect } from 'react'
import { useChat } from '@/hooks/useChat'
import { useAnimatedProgress, type Phase } from '@/hooks/useAnimatedProgress'
import { useContactModal } from '@/hooks/useContactModal'
import { bio } from '@/data'
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
  const { messages, isLoading, error, hasInteracted, sendMessage, reset } = useChat()
  const { open: openContact } = useContactModal()
  const messagesRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)

  const [phase, setPhase] = useState<Phase>('hero')
  const [userDismissed, setUserDismissed] = useState(false)
  const progress = useAnimatedProgress(phase, 850)
  const isActive = phase !== 'hero'

  /* ── Measure heading natural height for smooth collapse ── */
  const [headingHeight, setHeadingHeight] = useState(0)

  useLayoutEffect(() => {
    const el = headingRef.current
    if (!el) return
    const measure = () => {
      // Only measure when not animating to avoid feedback loops
      if (progress === 0) {
        setHeadingHeight(el.scrollHeight)
      }
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [progress === 0]) // eslint-disable-line react-hooks/exhaustive-deps

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
      setPhase('chat')
    }
  }, [hasInteracted, phase, userDismissed])

  const prevMessageCount = useRef(messages.length)
  useEffect(() => {
    if (messages.length > prevMessageCount.current && userDismissed) {
      setUserDismissed(false)
    }
    prevMessageCount.current = messages.length
  }, [messages.length, userDismissed])

  const handleGoHome = useCallback(() => {
    if (phase !== 'chat') return
    setUserDismissed(true)
    setPhase('hero')
    reset()
  }, [phase, reset])

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

  /* ── Progress-driven interpolations ── */
  const titleSize = sizes.titleStart - progress * (sizes.titleStart - sizes.titleEnd)
  const headerPadTop = sizes.padStart - progress * (sizes.padStart - sizes.padEnd)
  const titleAlign = progress > 0.5 ? 'center' : ('left' as const)

  // Heading collapses smoothly via measured height
  const headingOpacity = Math.max(0, 1 - progress * 1.5)
  const headingH = progress > 0
    ? headingHeight * (1 - progress)
    : 'auto'
  const headingMb = 6 * (1 - progress)

  // Hero group fades out in the first half of progress
  const heroGroupOpacity = Math.max(0, 1 - progress * 2)
  const heroGroupMaxH = 500 * (1 - progress)

  // Messages area fades in during the second half
  const messagesOpacity = progress
  const messagesTranslateY = 20 * (1 - progress)
  const messagesFlex = progress

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
      className="hero"
      style={{
        paddingTop: headerPadTop,
      }}
    >

      <h1
        ref={headingRef}
        className="hero__heading"
        style={{
          fontSize: titleSize,
          textAlign: titleAlign,
          height: headingH,
          marginBottom: headingMb,
          overflow: progress > 0 ? 'hidden' : 'visible',
          opacity: headingOpacity,
        }}
      >
        Hi, I'm <strong>{bio.name}.</strong>
      </h1>

      <div
        className="hero-group"
        style={{
          maxHeight: heroGroupMaxH,
          overflow: 'hidden',
          opacity: heroGroupOpacity,
          pointerEvents: progress > 0.3 ? 'none' : 'auto',
        }}
      >
        <div className="hero__subtitle-wrap">
          <p className="hero__role">{bio.title}.</p>
        </div>

        <div className="hero__cta-wrap">
          <div className="hero__actions">
            <button onClick={openContact} className="hero__cta">
              Get in Touch
              {ArrowIcon}
            </button>
            <span className="hero__supporting">
              Feel free to explore my portfolio and reach out — I'd love to connect!
            </span>
          </div>
        </div>

      </div>

      <div
        className="chat-messages-area"
        style={{
          flex: messagesFlex,
          opacity: messagesOpacity,
          transform: `translateY(${messagesTranslateY}px)`,
        }}
      >
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
        </div>
      </div>

      {error && <div className="chat-error">{error}</div>}

      <div className={`chat-center ${isActive ? 'chat-center--active' : ''}`}>
        {/* Hero mode mascot — centered above input */}
        {!isActive && (
          <div className="chat-idle__cat">
            <GhostMascot scale={2} />
          </div>
        )}

        <div className={`chat-input ${!isActive ? 'chat-input--centered' : ''}`}>
          <div className="chat-input__field">
            {/* Chat mode mascot — inside input, left side */}
            {isActive && (
              <div className="chat-input__mascot">
                <GhostMascot scale={0.8} />
              </div>
            )}
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
            {phase === 'chat' && (
              <button className="chat-input__reset" onClick={handleGoHome} aria-label="Reset chat">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="1 4 1 10 7 10" />
                  <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                </svg>
              </button>
            )}
          </div>
        </div>

        <p className="chat-disclaimer">
          Bounty can make mistakes. Double-check important info about Bastien.
        </p>

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
      </div>
    </div>
  )
}
