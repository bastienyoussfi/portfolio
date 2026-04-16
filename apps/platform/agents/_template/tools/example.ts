import type { ToolDefinition } from '../../../shared/types/tool'

const exampleTool: ToolDefinition = {
  id: 'example',
  name: 'example_tool',
  description: 'An example tool. Replace this with your own.',
  parameters: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'Example input parameter',
      },
    },
    required: ['query'],
  },
  handler: async (params) => {
    return { result: `You said: ${params.query}` }
  },
}

export default exampleTool
