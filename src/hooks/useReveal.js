import { useEffect, useRef, useState } from 'react'

/**
 * Reveal-on-scroll. Returns a ref to attach to an element and a boolean that
 * flips to true the first time the element scrolls into view.
 *
 * @param {Object} [options]
 * @param {number} [options.threshold=0.12] - visibility ratio that triggers it.
 */
export function useReveal({ threshold = 0.12 } = {}) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    // Respect users who prefer no motion: show immediately.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, visible }
}
