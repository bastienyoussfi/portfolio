export interface ToolDefinition {
  id: string
  name: string
  description: string
  parameters: {
    type: 'object'
    properties: Record<string, unknown>
    required?: string[]
  }
  handler: (params: Record<string, unknown>, context: ToolContext) => Promise<unknown>
}

export interface ToolContext {
  agentSlug: string
  env: Record<string, unknown>
  conversationId?: string
}
