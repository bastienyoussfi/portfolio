export const toolDefinitions = [
  {
    name: 'search_projects',
    description:
      'Search portfolio projects by technology, type, or keyword. Returns matching projects with descriptions, tech stacks, and links.',
    input_schema: {
      type: 'object' as const,
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
  },
  {
    name: 'get_skills',
    description:
      'Get technical skills grouped by category (languages, frameworks, tools, platforms) with proficiency levels and years of experience.',
    input_schema: {
      type: 'object' as const,
      properties: {
        category: {
          type: 'string',
          enum: ['all', 'languages', 'frameworks', 'ai-tools', 'platforms'],
          description: 'Skill category to retrieve',
        },
      },
      required: [],
    },
  },
  {
    name: 'get_experience',
    description:
      'Get work experience, education, and career timeline.',
    input_schema: {
      type: 'object' as const,
      properties: {
        type: {
          type: 'string',
          enum: ['all', 'work', 'education'],
          description: 'Type of experience to retrieve',
        },
      },
      required: [],
    },
  },
  {
    name: 'get_contact',
    description:
      'Get contact information, social links, availability status, and how to work with the portfolio owner.',
    input_schema: {
      type: 'object' as const,
      properties: {},
      required: [],
    },
  },
] as const
