import { useEffect } from 'react'
import type { AgentPublicConfig } from '@/hooks/useAgent'

interface Props {
  theme: AgentPublicConfig['theme']
  children: React.ReactNode
}

export default function ThemeProvider({ theme, children }: Props) {
  useEffect(() => {
    const root = document.documentElement

    root.style.setProperty('--blue', theme.accent)
    root.style.setProperty('--blue-light', theme.accentLight)

    if (theme.fontDisplay) {
      const link = document.createElement('link')
      link.href = `https://fonts.googleapis.com/css2?family=${theme.fontDisplay.replace(/ /g, '+')}&display=swap`
      link.rel = 'stylesheet'
      document.head.appendChild(link)
      root.style.setProperty('--font-serif', `"${theme.fontDisplay}", Georgia, serif`)
    }
    if (theme.fontBody) {
      const link = document.createElement('link')
      link.href = `https://fonts.googleapis.com/css2?family=${theme.fontBody.replace(/ /g, '+')}&display=swap`
      link.rel = 'stylesheet'
      document.head.appendChild(link)
      root.style.setProperty('--font-body', `"${theme.fontBody}", -apple-system, BlinkMacSystemFont, sans-serif`)
    }

    return () => {
      root.style.removeProperty('--blue')
      root.style.removeProperty('--blue-light')
      root.style.removeProperty('--font-serif')
      root.style.removeProperty('--font-body')
    }
  }, [theme])

  return <>{children}</>
}
