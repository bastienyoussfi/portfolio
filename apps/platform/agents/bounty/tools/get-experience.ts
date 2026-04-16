import type { ToolDefinition } from '../../../shared/types/tool'
import experience from '../../../../../data/context/experience.json'

const getExperience: ToolDefinition = {
  id: 'get_experience',
  name: 'get_experience',
  description: 'Get work experience, education, and career timeline.',
  parameters: {
    type: 'object',
    properties: {
      type: {
        type: 'string',
        enum: ['all', 'work', 'education'],
        description: 'Type of experience to retrieve',
      },
    },
  },
  handler: async (params) => {
    const type = params.type as string | undefined

    if (!type || type === 'all') {
      return { experience }
    }

    return {
      experience: (experience as Array<Record<string, unknown>>).filter(
        (e) => e.type === type,
      ),
    }
  },
}

export default getExperience
