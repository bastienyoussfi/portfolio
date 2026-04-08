export interface Project {
  id: string
  title: string
  description: string
  longDescription?: string
  category: string
  technologies?: string[]
  role?: string
  status?: string
  year: number
  featured?: boolean
  order?: number
  thumbnail?: string
  metrics?: Array<{ label: string; value: string }>
  links?: { live?: string; github?: string }
}
