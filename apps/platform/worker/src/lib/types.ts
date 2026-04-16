export interface Env {
  ANTHROPIC_API_KEY: string
  MISTRAL_API_KEY: string
  PLATFORM_DOMAIN: string
  STATIC_ASSETS?: KVNamespace
  AGENTS_KV?: KVNamespace
  RATE_LIMIT_KV?: KVNamespace
  DB?: D1Database
}
