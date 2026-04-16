import type { ToolDefinition } from '../../../shared/types/tool'
import projects from '../../../../../data/context/projects.json'

const searchProjects: ToolDefinition = {
  id: 'search_projects',
  name: 'search_projects',
  description:
    'Search portfolio projects by technology, type, or keyword. Returns matching projects with descriptions, tech stacks, and links.',
  parameters: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'Search term: technology name, project type, or keyword',
      },
      category: {
        type: 'string',
        enum: ['all', 'web', 'mobile', 'ai', 'open-source'],
        description: 'Optional category filter',
      },
    },
    required: ['query'],
  },
  handler: async (params) => {
    const q = (params.query as string).toLowerCase()
    const category = params.category as string | undefined

    let results = (projects as Array<Record<string, unknown>>).filter((p) => {
      const title = (p.title as string).toLowerCase()
      const desc = (p.description as string).toLowerCase()
      const techs = p.technologies as string[]
      const matchesText =
        title.includes(q) ||
        desc.includes(q) ||
        techs.some((t) => t.toLowerCase().includes(q))
      const matchesCategory =
        !category || category === 'all' || p.category === category
      return matchesText && matchesCategory
    })

    if (results.length === 0) {
      results = projects as Array<Record<string, unknown>>
    }

    return {
      count: results.length,
      projects: results.map((p) => ({
        title: p.title,
        description: p.description,
        category: p.category,
        technologies: p.technologies,
        status: p.status,
        year: p.year,
        metrics: p.metrics,
        links: p.links,
      })),
    }
  },
}

export default searchProjects
