import { SITE } from '../lib/i18n.js'

/**
 * Answer-engine crawlers are named explicitly rather than left to the wildcard.
 * Several of them (GPTBot, ClaudeBot, PerplexityBot) are checked by operators
 * looking for an *explicit* allow, and an unnamed bot is the first thing a
 * cautious crawler backs away from.
 */
const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-User',
  'Claude-SearchBot',
  'anthropic-ai',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot',
  'Applebot-Extended',
  'Bingbot',
  'CCBot',
  'Meta-ExternalAgent',
  'cohere-ai',
]

export function GET() {
  const body = [
    'User-agent: *',
    'Allow: /',
    '',
    ...AI_CRAWLERS.flatMap((agent) => [`User-agent: ${agent}`, 'Allow: /', '']),
    `Sitemap: ${SITE}/sitemap-index.xml`,
    '',
    // No registered directive exists for llms.txt, so these stay comments: a
    // crawler looking for the file finds the path, every parser ignores them.
    `# llms.txt: ${SITE}/llms.txt`,
    `# llms.txt (fr): ${SITE}/fr/llms.txt`,
    '',
  ].join('\n')

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
