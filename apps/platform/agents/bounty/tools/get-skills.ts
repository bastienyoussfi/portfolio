import type { ToolDefinition } from '../../../shared/types/tool'
import skills from '../../../../../data/context/skills.json'

const getSkills: ToolDefinition = {
  id: 'get_skills',
  name: 'get_skills',
  description:
    'Get technical skills grouped by category (languages, frameworks, tools, platforms) with proficiency levels and years of experience.',
  parameters: {
    type: 'object',
    properties: {
      category: {
        type: 'string',
        enum: ['all', 'languages', 'frameworks', 'ai-tools', 'platforms'],
        description: 'Skill category to retrieve',
      },
    },
  },
  handler: async (params) => {
    const category = params.category as string | undefined

    if (!category || category === 'all') {
      return { categories: skills }
    }

    const filtered = (skills as Array<Record<string, unknown>>).filter(
      (s) =>
        (s.category as string).toLowerCase().replace(/\s+/g, '-') === category,
    )
    return { categories: filtered.length > 0 ? filtered : skills }
  },
}

export default getSkills
