import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Mail, ArrowUpRight, Clock } from 'lucide-react'
import { contact } from '@/data'
import { useContactModal } from '@/hooks/useContactModal'

function GithubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function LinkedinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z" />
    </svg>
  )
}

const socials = [
  {
    name: 'GitHub',
    href: contact.github,
    handle: '@' + contact.github.split('github.com/')[1],
    icon: GithubIcon,
    colorClass: 'contact-modal__social-icon--github',
  },
  {
    name: 'X',
    href: contact.twitter,
    handle: '@' + contact.twitter.split('x.com/')[1],
    icon: XIcon,
    colorClass: 'contact-modal__social-icon--x',
  },
  {
    name: 'LinkedIn',
    href: contact.linkedin,
    handle: contact.linkedin.split('linkedin.com')[1],
    icon: LinkedinIcon,
    colorClass: 'contact-modal__social-icon--linkedin',
  },
]

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

const panelVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring' as const, damping: 25, stiffness: 300 },
  },
  exit: {
    opacity: 0,
    y: 12,
    scale: 0.98,
    transition: { duration: 0.2, ease: [0.25, 1, 0.5, 1] as const },
  },
}

const socialsContainerVariants = {
  visible: { transition: { staggerChildren: 0.06 } },
}

const socialCardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 1, 0.5, 1] as const } },
}

export default function ContactModal() {
  const { isOpen, close } = useContactModal()
  const closeRef = useRef<HTMLButtonElement>(null)

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      // Focus close button on open
      requestAnimationFrame(() => closeRef.current?.focus())
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Escape to close
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, close])

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="contact-modal__backdrop"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] as const }}
            onClick={close}
          />
          <motion.div
            className="contact-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-modal-title"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => {
              if (e.target === e.currentTarget) close()
            }}
          >
            <div className="contact-modal__panel">
              {/* Header */}
              <div className="contact-modal__header">
                <h2 id="contact-modal-title" className="contact-modal__title">
                  Let's <em>connect</em>
                </h2>
                <button
                  ref={closeRef}
                  className="contact-modal__close"
                  onClick={close}
                  aria-label="Close"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Availability */}
              <div className="contact-modal__status">
                <span className="contact-modal__status-dot" />
                <span className="contact-modal__status-label">Available</span>
                <span className="contact-modal__timezone">
                  <Clock size={12} />
                  {contact.timezone.replace('/', ' / ')}
                </span>
              </div>
              <p className="contact-modal__note">{contact.availabilityNote}</p>

              {/* Email CTA */}
              <a href={`mailto:${contact.email}`} className="contact-modal__email">
                <Mail size={18} />
                <span className="contact-modal__email-label">{contact.email}</span>
                <ArrowUpRight size={16} className="contact-modal__email-arrow" />
              </a>

              {/* Separator */}
              <div className="contact-modal__sep" />

              {/* Social cards */}
              <motion.div
                className="contact-modal__socials"
                variants={socialsContainerVariants}
                initial="hidden"
                animate="visible"
              >
                {socials.map((s) => (
                  <motion.a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-modal__social-card"
                    variants={socialCardVariants}
                  >
                    <span className={`contact-modal__social-icon ${s.colorClass}`}>
                      <s.icon />
                    </span>
                    <span className="contact-modal__social-name">{s.name}</span>
                    <span className="contact-modal__social-handle">{s.handle}</span>
                  </motion.a>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  )
}
