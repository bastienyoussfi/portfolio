import type { ToolDefinition } from '../../../shared/types/tool'
import contact from '../../../../../data/context/contact.json'
import bio from '../../../../../data/context/bio.json'

const getContact: ToolDefinition = {
  id: 'get_contact',
  name: 'get_contact',
  description:
    'Get contact information, social links, availability status, and how to work with the portfolio owner.',
  parameters: {
    type: 'object',
    properties: {},
  },
  handler: async () => {
    return {
      ...contact,
      bio: {
        name: (bio as Record<string, unknown>).name,
        title: (bio as Record<string, unknown>).title,
        location: (bio as Record<string, unknown>).location,
      },
    }
  },
}

export default getContact
