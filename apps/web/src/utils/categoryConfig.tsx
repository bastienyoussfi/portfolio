import type { ReactNode } from 'react'

export interface CategoryStyle {
  icon: ReactNode
  bg: string
  color: string
  iconLg: ReactNode
}

function makeConfig(
  color: string,
  bg: string,
  pathD: string,
): CategoryStyle {
  return {
    color,
    bg,
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d={pathD} />
      </svg>
    ),
    iconLg: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5">
        <path d={pathD} />
      </svg>
    ),
  }
}

const aiPath = 'M12 3v1m0 16v1m-7.07-2.93l.71-.71m12.73-12.73l.7-.7M3 12h1m16 0h1m-2.93 7.07l-.71-.71M5.64 5.64l-.7-.7'
const webPath = 'M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z'
const mobilePath = 'M5 2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM12 18h.01'
const osPath = 'M6 3v12M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 9a9 9 0 0 1-9 9'
const defaultPath = 'M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z'

export const categoryConfig: Record<string, CategoryStyle> = {
  ai: {
    ...makeConfig('var(--purple)', 'var(--purple-light)', aiPath),
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--purple)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d={aiPath} />
        <circle cx="12" cy="12" r="4" />
      </svg>
    ),
    iconLg: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--purple)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5">
        <path d={aiPath} />
        <circle cx="12" cy="12" r="4" />
      </svg>
    ),
  },
  web: {
    ...makeConfig('var(--blue)', 'var(--blue-light)', webPath),
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d={webPath} />
      </svg>
    ),
    iconLg: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5">
        <circle cx="12" cy="12" r="10" />
        <path d={webPath} />
      </svg>
    ),
  },
  mobile: makeConfig('var(--green)', 'var(--green-light)', mobilePath),
  'open-source': makeConfig('var(--orange)', 'var(--orange-light)', osPath),
}

export const defaultCategoryConfig: CategoryStyle = makeConfig('var(--indigo)', 'var(--indigo-light)', defaultPath)
