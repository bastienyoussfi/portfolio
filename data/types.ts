export interface Project {
  id: string
  title: string
  description: string
  longDescription: string
  category: 'web' | 'mobile' | 'ai' | 'open-source'
  technologies: string[]
  role: string
  status: 'live' | 'completed' | 'in-progress'
  year: number
  metrics: Array<{ label: string; value: string }>
  links: { live?: string; github?: string; caseStudy?: string }
  featured: boolean
}

export interface SkillCategory {
  category: string
  skills: Array<{
    name: string
    years: number
    proficiency: 'expert' | 'advanced' | 'intermediate'
    color: string
  }>
}

export interface Experience {
  type: 'work' | 'education'
  title: string
  organization: string
  location: string
  startDate: string
  endDate: string | null
  description: string
  highlights: string[]
  technologies?: string[]
  status: 'current' | 'completed'
}

export interface Contact {
  email: string
  github: string
  linkedin: string
  twitter: string
  availability: 'available' | 'limited' | 'unavailable'
  availabilityNote: string
  timezone: string
  preferredContact: string
}

export interface Bio {
  name: string
  title: string
  summary: string
  location: string
  interests: string[]
}

export interface Testimonial {
  id: string
  quote: string
  author: string
  title: string
  company: string
  rating: number
  avatarColor: string
}

export interface BlogPost {
  id: string
  title: string
  excerpt: string
  date: string
  displayDate: string
  readTimeMinutes: number
  tags: string[]
  url: string
}
