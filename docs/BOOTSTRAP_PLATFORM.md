# Agents Platform — Bootstrap Specification

## Overview

Build a **multi-agent platform** hosted entirely on Cloudflare (Workers + Pages + KV + Vectorize). The platform serves two purposes:

1. **Gallery page** at `agents.bastienyoussfi.dev` — a public showcase listing all visible agents
2. **Individual agent chat UIs** at `{slug}.agents.bastienyoussfi.dev` — each agent gets its own subdomain with a unique identity, tools, and chat experience

Adding a new agent = copy `agents/_template/`, edit the config, deploy. Zero frontend or backend changes required.

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│                   Cloudflare Edge                │
│          DNS wildcard *.agents.bastienyoussfi.dev│
├─────────────────────────────────────────────────┤
│                                                  │
│   ┌──────────────┐      ┌─────────────────────┐ │
│   │  CF Pages     │      │  CF Worker           │ │
│   │  React SPA    │◄────►│  Agent Router + API  │ │
│   │  (Vite build) │      │  (Hono on Workers)   │ │
│   └──────────────┘      └────────┬────────────┘ │
│                                   │              │
└───────────────────────────────────┼──────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
              ┌─────▼─────┐  ┌─────▼─────┐  ┌─────▼─────┐
              │ LLM APIs  │  │ Vectorize │  │  KV / D1  │
              │ Claude     │  │ RAG per   │  │ Config    │
              │ Mistral    │  │ agent     │  │ cache,    │
              │ etc.       │  │           │  │ conv logs │
              └───────────┘  └───────────┘  └───────────┘
```

### Routing logic (Worker)

```
Request comes in → read Host header
  ├── "agents.bastienyoussfi.dev"     → serve gallery (list all public agents)
  ├── "{slug}.agents.bastienyoussfi.dev" → extract slug → load agent config → serve chat API
  └── unknown                          → 404
```

The **Worker serves both the API endpoints AND the frontend assets** (stored in KV or R2). This avoids the Pages wildcard subdomain limitation on free tier.

---

## Monorepo Structure

```
agents-platform/
├── README.md
├── package.json                    # Workspace root (pnpm workspaces)
├── pnpm-workspace.yaml
├── wrangler.toml                   # Worker config (KV bindings, Vectorize, env vars)
│
├── worker/                         # Cloudflare Worker (backend)
│   ├── src/
│   │   ├── index.ts                # Entry: Hono app, routing by Host header
│   │   ├── router.ts               # Maps subdomain slug → agent config
│   │   ├── chat.ts                 # POST /api/chat — streaming LLM + tool execution
│   │   ├── gallery.ts              # GET /api/agents — returns list of public agents
│   │   ├── agents/                 # Agent registry (auto-discovered at build time)
│   │   │   └── index.ts            # Scans agents/ dir, exports registry map
│   │   ├── tools/                  # Shared tool runtime
│   │   │   ├── registry.ts         # Tool type definitions + dynamic loader
│   │   │   └── executor.ts         # Executes tool calls from LLM responses
│   │   └── lib/
│   │       ├── llm.ts              # LLM client abstraction (Claude, Mistral, etc.)
│   │       ├── streaming.ts        # SSE streaming helper for chat responses
│   │       └── types.ts            # Shared TypeScript types
│   ├── tsconfig.json
│   └── package.json
│
├── frontend/                       # React SPA (Vite)
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx                 # Reads subdomain → gallery or chat mode
│   │   ├── hooks/
│   │   │   ├── useAgent.ts         # Fetches agent config from /api/agent
│   │   │   └── useChat.ts          # SSE streaming hook for /api/chat
│   │   ├── pages/
│   │   │   ├── Gallery.tsx         # "Meet my agents" — card grid
│   │   │   └── Chat.tsx            # Agent chat interface
│   │   ├── components/
│   │   │   ├── ChatMessage.tsx     # Message bubble (user/assistant/tool)
│   │   │   ├── ChatInput.tsx       # Input bar with send button
│   │   │   ├── AgentCard.tsx       # Card for gallery view
│   │   │   ├── AgentHeader.tsx     # Agent name, avatar, tagline in chat view
│   │   │   ├── ToolCallDisplay.tsx # Visual indicator when agent uses a tool
│   │   │   └── ThemeProvider.tsx   # Injects agent's theme colors as CSS vars
│   │   └── styles/
│   │       ├── tokens.css          # Portfolio design system (copy from portfolio repo)
│   │       ├── globals.css         # Imports tokens.css, platform base styles
│   │       └── components.css      # Component styles using token vars
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── package.json
│
├── agents/                         # Agent definitions (the hot-swappable part)
│   ├── _template/                  # Copy this to create a new agent
│   │   ├── agent.config.ts         # Identity, prompt, theme, tool list
│   │   └── tools/                  # Agent-specific tool implementations
│   │       └── example.ts          # Example tool with schema
│   │
│   ├── bounty/                     # Portfolio agent (migrated from current site)
│   │   ├── agent.config.ts
│   │   └── tools/
│   │       ├── rag-search.ts       # Search portfolio knowledge base via Vectorize
│   │       └── project-lookup.ts   # Retrieve project details
│   │
│   └── legal-demo/                 # Demo for law firm prospect
│       ├── agent.config.ts
│       └── tools/
│           └── knowledge-search.ts # Search legal knowledge base
│
├── shared/                         # Shared types and utilities
│   ├── types/
│   │   ├── agent.ts                # AgentConfig type definition
│   │   ├── tool.ts                 # Tool schema + handler types
│   │   └── chat.ts                 # Message, Conversation types
│   └── package.json
│
└── scripts/
    ├── build.ts                    # Build frontend → upload to KV as static assets
    └── new-agent.ts                # CLI: pnpm new-agent <slug> — scaffolds from _template
```

---

## Agent Config Schema

Each agent is fully defined by a single `agent.config.ts` file:

```typescript
// shared/types/agent.ts

export interface AgentConfig {
  // Identity
  slug: string;              // URL-safe, used as subdomain: "bounty" → bounty.agents.bastienyoussfi.dev
  name: string;              // Display name: "Bounty"
  tagline: string;           // Short description: "Your AI portfolio guide"
  description: string;       // Longer description for gallery card
  avatar: string;            // Path to avatar image or emoji fallback

  // LLM
  model: string;             // "claude-sonnet-4-20250514" | "mistral-large-latest" | etc.
  provider: "anthropic" | "mistral" | "openai";
  systemPrompt: string;      // The agent's personality and instructions
  temperature?: number;      // Default: 0.7
  maxTokens?: number;        // Default: 4096

  // Tools
  tools: string[];           // List of tool IDs to load: ["rag_search", "project_lookup"]

  // Theme — extends the portfolio's tokens.css design system.
  // The platform ships with tokens.css as the base (DM Sans, Newsreader, all surfaces/shadows/radii).
  // Agent themes ONLY override the accent color and optionally fonts.
  // Everything else (--bg, --card, --text-*, --sep, --fill-*, --shadow-*, --r-*, --dur-*)
  // is inherited from tokens.css and auto-switches via [data-theme="dark"].
  theme: {
    accent: string;          // Maps to --blue by default. Agent can override: "#4a7cff"
    accentLight: string;     // Maps to --blue-light. Semi-transparent bg: "rgba(74, 124, 255, 0.08)"
    fontDisplay?: string;    // Override --font-serif for display headings (default: Newsreader)
    fontBody?: string;       // Override --font-body (default: DM Sans)
  };

  // Chat UI behavior
  greeting: string;          // First message shown: "Hey! I'm Bounty..."
  placeholder: string;       // Input placeholder: "Ask me about Bastien's projects..."
  suggestedQuestions?: string[]; // Quick-start buttons shown below greeting

  // Visibility
  visibility: "public" | "unlisted";  // "public" = shown in gallery, "unlisted" = subdomain only
  status?: "live" | "demo" | "wip";   // Badge shown in gallery

  // Optional metadata
  externalUrl?: string;      // Link to full product if agent is a demo
  tags?: string[];           // For gallery filtering: ["ai", "legal", "portfolio"]
}
```

### Example: Bounty config

```typescript
// agents/bounty/agent.config.ts
import { AgentConfig } from "../../shared/types/agent";

const config: AgentConfig = {
  slug: "bounty",
  name: "Bounty",
  tagline: "Your AI portfolio guide",
  description: "A pixel cat who knows everything about Bastien's projects, stack, and experience. Powered by RAG over the full portfolio.",
  avatar: "/agents/bounty/avatar.svg",

  model: "claude-sonnet-4-20250514",
  provider: "anthropic",
  systemPrompt: `You are Bounty, a friendly pixel cat assistant on Bastien Youssfi's portfolio website.
You help visitors learn about Bastien's projects, technical skills, and experience.
You have access to a knowledge base about his work — use the rag_search tool to find relevant information before answering.
Keep responses concise and friendly. Use a casual but professional tone.
If you don't know something, say so honestly.`,
  temperature: 0.7,
  maxTokens: 2048,

  tools: ["rag_search", "project_lookup"],

  theme: {
    accent: "#4a7cff",
    accentLight: "rgba(74, 124, 255, 0.08)",
    fontDisplay: "Playfair Display",
    // fontBody defaults to DM Sans from tokens.css
  },

  greeting: "Hey! I'm Bounty 🐱 Ask me anything about Bastien's work, projects, or tech stack.",
  placeholder: "Ask about projects, experience, tech stack...",
  suggestedQuestions: [
    "What projects has Bastien built?",
    "What's his tech stack?",
    "Tell me about Auditex",
    "What AI experience does he have?",
  ],

  visibility: "public",
  status: "live",
  tags: ["portfolio", "ai", "rag"],
};

export default config;
```

---

## Tool System

Tools follow a standardized schema so they're interchangeable across agents.

```typescript
// shared/types/tool.ts

export interface ToolDefinition {
  id: string;                        // Unique ID: "rag_search"
  name: string;                      // Display name for LLM: "search_knowledge_base"
  description: string;               // LLM-facing description
  parameters: Record<string, any>;   // JSON Schema for parameters
  handler: (params: any, context: ToolContext) => Promise<any>;
}

export interface ToolContext {
  agentSlug: string;
  env: CloudflareEnv;                // Access to KV, Vectorize, D1 bindings
  conversationId?: string;
}
```

### Example tool implementation

```typescript
// agents/bounty/tools/rag-search.ts
import { ToolDefinition } from "../../../shared/types/tool";

const ragSearch: ToolDefinition = {
  id: "rag_search",
  name: "search_knowledge_base",
  description: "Search the portfolio knowledge base for information about projects, skills, experience, and background. Use this before answering any factual question.",
  parameters: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description: "Search query to find relevant information",
      },
    },
    required: ["query"],
  },
  handler: async (params, context) => {
    const { env, agentSlug } = context;
    const index = env.VECTORIZE;

    // Generate embedding for query (use a small model or pre-computed)
    const embedding = await generateEmbedding(params.query, env);

    // Search Vectorize index scoped to this agent
    const results = await index.query(embedding, {
      topK: 5,
      namespace: agentSlug,
    });

    return {
      results: results.matches.map((m) => ({
        text: m.metadata?.text,
        score: m.score,
        source: m.metadata?.source,
      })),
    };
  },
};

export default ragSearch;
```

### Tool registration

Tools are auto-discovered at build time. Each agent's `tools/` directory is scanned, and combined with any shared tools:

```typescript
// worker/src/tools/registry.ts

// Shared tools available to all agents
import sharedTools from "./shared/index";

// Agent-specific tools are imported dynamically based on agent config
export async function loadToolsForAgent(
  agentConfig: AgentConfig
): Promise<ToolDefinition[]> {
  const tools: ToolDefinition[] = [];

  for (const toolId of agentConfig.tools) {
    // Check agent-specific tools first, then shared
    const tool = agentConfig._tools?.[toolId] ?? sharedTools[toolId];
    if (tool) tools.push(tool);
  }

  return tools;
}
```

---

## Worker Implementation Details

### Entry point with Hono

```typescript
// worker/src/index.ts
import { Hono } from "hono";
import { cors } from "hono/cors";
import { streamSSE } from "hono/streaming";
import { resolveAgent } from "./router";
import { handleChat } from "./chat";
import { getPublicAgents } from "./gallery";

type Bindings = {
  AGENTS_KV: KVNamespace;
  VECTORIZE: VectorizeIndex;
  ANTHROPIC_API_KEY: string;
  MISTRAL_API_KEY: string;
  STATIC_ASSETS: KVNamespace;  // Frontend build output stored here
};

const app = new Hono<{ Bindings: Bindings }>();

app.use("*", cors());

// Serve static frontend assets
app.get("/*", async (c, next) => {
  const url = new URL(c.req.url);

  // API routes pass through
  if (url.pathname.startsWith("/api/")) return next();

  // Try to serve static asset from KV
  let path = url.pathname === "/" ? "/index.html" : url.pathname;
  const asset = await c.env.STATIC_ASSETS.get(path, "arrayBuffer");

  if (asset) {
    const contentType = getContentType(path);
    return new Response(asset, {
      headers: { "Content-Type": contentType, "Cache-Control": "public, max-age=3600" },
    });
  }

  // SPA fallback — serve index.html for client-side routing
  const indexHtml = await c.env.STATIC_ASSETS.get("/index.html", "text");
  return new Response(indexHtml, {
    headers: { "Content-Type": "text/html" },
  });
});

// API: Get current agent config (frontend calls this on load)
app.get("/api/agent", async (c) => {
  const agent = resolveAgent(c.req.header("host") || "");
  if (!agent) return c.json({ error: "Agent not found" }, 404);

  // Return public config (no system prompt or secrets)
  return c.json({
    slug: agent.slug,
    name: agent.name,
    tagline: agent.tagline,
    description: agent.description,
    avatar: agent.avatar,
    theme: agent.theme,
    greeting: agent.greeting,
    placeholder: agent.placeholder,
    suggestedQuestions: agent.suggestedQuestions,
    status: agent.status,
  });
});

// API: List all public agents (for gallery)
app.get("/api/agents", async (c) => {
  return c.json(getPublicAgents());
});

// API: Chat endpoint with SSE streaming
app.post("/api/chat", async (c) => {
  const agent = resolveAgent(c.req.header("host") || "");
  if (!agent) return c.json({ error: "Agent not found" }, 404);

  const body = await c.req.json();

  return streamSSE(c, async (stream) => {
    await handleChat(agent, body.messages, stream, c.env);
  });
});

export default app;
```

### Chat handler with tool loop

```typescript
// worker/src/chat.ts

export async function handleChat(
  agent: AgentConfig,
  messages: Message[],
  stream: SSEStream,
  env: Bindings
) {
  const tools = await loadToolsForAgent(agent);
  const llmClient = createLLMClient(agent.provider, env);

  // Convert tools to LLM-compatible format
  const toolSchemas = tools.map((t) => ({
    name: t.name,
    description: t.description,
    input_schema: t.parameters,
  }));

  let currentMessages = [
    { role: "system", content: agent.systemPrompt },
    ...messages,
  ];

  // Agentic loop: keep calling LLM until no more tool calls
  while (true) {
    const response = await llmClient.stream({
      model: agent.model,
      messages: currentMessages,
      tools: toolSchemas.length > 0 ? toolSchemas : undefined,
      max_tokens: agent.maxTokens || 4096,
      temperature: agent.temperature || 0.7,
    });

    let hasToolUse = false;
    let toolResults: any[] = [];

    for await (const event of response) {
      if (event.type === "content_block_delta") {
        if (event.delta.type === "text_delta") {
          await stream.writeSSE({
            event: "text",
            data: event.delta.text,
          });
        }
      }

      if (event.type === "content_block_start" && event.content_block.type === "tool_use") {
        hasToolUse = true;
        await stream.writeSSE({
          event: "tool_start",
          data: JSON.stringify({ name: event.content_block.name }),
        });
      }

      if (event.type === "message_delta" && event.delta.stop_reason === "tool_use") {
        // Execute tool calls
        for (const toolCall of extractToolCalls(response)) {
          const tool = tools.find((t) => t.name === toolCall.name);
          if (tool) {
            const result = await tool.handler(toolCall.input, {
              agentSlug: agent.slug,
              env,
            });
            toolResults.push({
              type: "tool_result",
              tool_use_id: toolCall.id,
              content: JSON.stringify(result),
            });
            await stream.writeSSE({
              event: "tool_result",
              data: JSON.stringify({ name: toolCall.name, result }),
            });
          }
        }
      }
    }

    if (!hasToolUse) break;

    // Add assistant message + tool results, loop again
    currentMessages.push({ role: "assistant", content: response.content });
    currentMessages.push(...toolResults.map((r) => ({ role: "user", content: [r] })));
  }

  await stream.writeSSE({ event: "done", data: "" });
}
```

---

## Frontend Implementation Details

### Tech stack

- **Vite + React 19 + TypeScript strict**
- **Tailwind CSS 4** for utility classes (configured to respect tokens.css variables)
- **tokens.css** — the portfolio's design system, used as-is. Provides all surfaces, text colors, shadows, radii, motion curves, and light/dark mode via `[data-theme="dark"]`. Fonts: DM Sans (body) + Newsreader (serif/display).
- **CSS variables** for agent-specific accent overrides (only `--blue` and `--blue-light` are overridden per agent)
- **No component library** — keep it minimal, custom components using token vars only

### Routing logic (client-side)

```typescript
// frontend/src/App.tsx

function App() {
  const hostname = window.location.hostname;
  const isGallery = hostname === "agents.bastienyoussfi.dev" || hostname === "localhost";

  // Extract agent slug from subdomain
  // "bounty.agents.bastienyoussfi.dev" → "bounty"
  // "localhost" with ?agent=bounty → "bounty" (dev mode)
  const agentSlug = isGallery
    ? null
    : hostname.split(".")[0] || new URLSearchParams(window.location.search).get("agent");

  if (isGallery || !agentSlug) {
    return <Gallery />;
  }

  return <Chat agentSlug={agentSlug} />;
}
```

### Chat hook with SSE

```typescript
// frontend/src/hooks/useChat.ts

export function useChat(agentSlug: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  const sendMessage = async (content: string) => {
    const userMsg: Message = { role: "user", content };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsStreaming(true);

    let assistantContent = "";

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: updatedMessages }),
    });

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    // Parse SSE stream
    while (reader) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          // Handle text, tool_start, tool_result, done events
          // Update messages state incrementally
        }
      }
    }

    setIsStreaming(false);
  };

  return { messages, sendMessage, isStreaming };
}
```

### Theme injection

The platform uses the portfolio's `tokens.css` as its base design system. This gives you light/dark mode, all surfaces, shadows, typography, radii, and motion curves for free. Agent configs only override the accent color and optionally fonts.

```typescript
// frontend/src/components/ThemeProvider.tsx

/**
 * tokens.css is imported globally in main.tsx.
 * This provider only applies agent-specific overrides on top.
 * Dark mode is handled via [data-theme="dark"] on <html>, matching the portfolio.
 */
export function ThemeProvider({ theme, children }) {
  useEffect(() => {
    const root = document.documentElement;

    // Override accent (replaces --blue / --blue-light from tokens.css)
    root.style.setProperty("--blue", theme.accent);
    root.style.setProperty("--blue-light", theme.accentLight);

    // Optional font overrides
    if (theme.fontDisplay) {
      const link = document.createElement("link");
      link.href = `https://fonts.googleapis.com/css2?family=${theme.fontDisplay.replace(/ /g, "+")}&display=swap`;
      link.rel = "stylesheet";
      document.head.appendChild(link);
      root.style.setProperty("--font-serif", `"${theme.fontDisplay}", Georgia, serif`);
    }
    if (theme.fontBody) {
      const link = document.createElement("link");
      link.href = `https://fonts.googleapis.com/css2?family=${theme.fontBody.replace(/ /g, "+")}&display=swap`;
      link.rel = "stylesheet";
      document.head.appendChild(link);
      root.style.setProperty("--font-body", `"${theme.fontBody}", -apple-system, BlinkMacSystemFont, sans-serif`);
    }

    // Detect system dark mode and set data-theme accordingly
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.setAttribute("data-theme", prefersDark ? "dark" : "light");

    return () => {
      // Cleanup: reset to token defaults on unmount
      root.style.removeProperty("--blue");
      root.style.removeProperty("--blue-light");
      root.style.removeProperty("--font-serif");
      root.style.removeProperty("--font-body");
    };
  }, [theme]);

  return <div className="agent-themed">{children}</div>;
}
```

### Gallery page design

The gallery at `agents.bastienyoussfi.dev` uses the portfolio's design system natively:

- **Background**: `var(--bg)` with content constrained to `var(--max-w)` (920px) + `var(--page-px)` padding
- **Header**: "Meet my agents" in `var(--font-serif)` (Newsreader), intro paragraph in `var(--text-2)` / `var(--font-body)` (DM Sans)
- **Agent cards** in a responsive grid (2-3 columns, `var(--grid-gap)` = 12px gap)
- Each card: `var(--card)` background, `var(--shadow)` default → `var(--shadow-hover)` on hover, `var(--r)` (16px) border-radius
- Card content: avatar, name (`var(--text-1)`), tagline (`var(--text-3)`), status badge using accent colors (`var(--green-light)` bg + `var(--green)` text for "live", `var(--orange-light)` + `var(--orange)` for "demo", `var(--text-4)` for "wip")
- Badge/tag styling: `var(--shadow-tag)`, `var(--r-xs)` (8px) radius
- Hover transition: `var(--dur-hover)` (0.35s) with `var(--ease-out)`
- Card stagger entrance animation: use `var(--stagger)` (40ms) delay between cards, `var(--dur-rise)` (0.45s) duration
- Click → navigates to `{slug}.agents.bastienyoussfi.dev`
- Footer with link back to `bastienyoussfi.dev`, styled in `var(--text-3)`

### Chat page design

The chat page uses the same tokens.css foundation, with the agent's accent color as the only visual differentiator:

- **Background**: `var(--bg)` (light: #fafafa, dark: #111113) — NOT a forced dark theme
- **Header bar**: `var(--card)` bg with `var(--shadow)`, agent avatar + name in `var(--font-serif)` + tagline in `var(--text-3)`, `var(--r)` corners
- **Assistant messages**: `var(--card)` bg, `var(--shadow)`, `var(--r-inner)` (12px) radius, text in `var(--text-1)`, `var(--font-body)` (DM Sans)
- **User messages**: `var(--bubble-user-bg)` (inverted: dark text-1 in light mode, light f5f5f7 in dark mode), `var(--bubble-user-color)`, `var(--bubble-user-shadow)`, `var(--r-inner)` radius
- **Tool call indicators**: `var(--well)` bg with `var(--shadow-well)`, `var(--r-sm)` (10px) radius, tool name in `var(--text-3)`, monospace font `var(--font-mono)`
- **Streaming tokens**: fade-in with `var(--stream-token-dur)` (0.3s)
- **Typing indicator**: 3 dots using `var(--typing-dot-size)` (6px), `var(--typing-dot-color)` (text-4)
- **Input bar**: `var(--card)` bg, `var(--shadow-chat)`, `var(--r)` radius. Focus state: `var(--border-focus)` border. Send button: agent's `var(--blue)` (accent override) bg, `var(--on-primary)` text
- **Suggested question buttons**: `var(--fill-1)` bg, `var(--r-xs)` radius, `var(--text-2)` text, hover → `var(--blue-light)` bg + `var(--blue)` text
- **Separator lines**: `var(--sep)` color, `var(--sep-h)` (0.5px) height
- **Press interactions**: `var(--dur-press)` (0.1s) for button presses, `var(--spring)` easing for bouncy interactions
- **Greeting**: Shown on first load using `var(--font-serif)` for the agent name, with suggested questions below as pill buttons

### Design system file structure

```
frontend/src/styles/
├── tokens.css              # COPY of the portfolio's tokens.css (the file provided above)
├── globals.css             # Imports tokens.css, adds platform-specific base styles
└── components.css          # Optional: component-specific styles using token vars
```

```css
/* globals.css */
@import './tokens.css';

/* Platform base */
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  font-family: var(--font-body);
  color: var(--text-1);
  background: var(--bg);
  -webkit-font-smoothing: antialiased;
}
h1, h2, h3 { font-family: var(--font-serif); }
```

---

## Dev Environment

### Local development

```bash
# Install dependencies
pnpm install

# Run Worker locally (Miniflare)
pnpm --filter worker dev
# → http://localhost:8787

# Run frontend dev server (Vite)
pnpm --filter frontend dev
# → http://localhost:5173?agent=bounty  (dev mode: use query param)

# Or run both with concurrently
pnpm dev
```

### Environment variables (wrangler.toml)

```toml
name = "agents-platform"
main = "worker/src/index.ts"
compatibility_date = "2024-12-01"

[vars]
PLATFORM_DOMAIN = "agents.bastienyoussfi.dev"

# Secrets (set via `wrangler secret put`)
# ANTHROPIC_API_KEY
# MISTRAL_API_KEY

[[kv_namespaces]]
binding = "STATIC_ASSETS"
id = "xxx"

[[kv_namespaces]]
binding = "AGENTS_KV"
id = "xxx"

[[vectorize]]
binding = "VECTORIZE"
index_name = "agents-knowledge"
```

### Deployment

```bash
# Build frontend → upload to KV
pnpm build:frontend
pnpm upload:assets

# Deploy Worker
pnpm deploy
# → wrangler deploy
```

### DNS setup (Cloudflare dashboard)

```
Type  Name                 Content           Proxy
CNAME agents               workers.dev URL   Proxied
CNAME *.agents             workers.dev URL   Proxied
```

---

## Adding a New Agent — Step by Step

```bash
# 1. Scaffold from template
pnpm new-agent my-new-agent
# Creates agents/my-new-agent/ with agent.config.ts and tools/ directory

# 2. Edit the config
# Open agents/my-new-agent/agent.config.ts
# Set: name, tagline, systemPrompt, theme, tools list, greeting

# 3. Add tools (optional)
# Create files in agents/my-new-agent/tools/
# Each tool exports a ToolDefinition

# 4. Deploy
pnpm deploy
# Agent is live at my-new-agent.agents.bastienyoussfi.dev

# 5. Set visibility
# In agent.config.ts: visibility: "public" to show in gallery
#                     visibility: "unlisted" for private demos
```

---

## Implementation Priority

### Phase 1 — Core (ship this first)
1. Monorepo setup (pnpm workspaces, TypeScript, wrangler.toml)
2. Worker with Hono: Host-header routing, `/api/agent`, `/api/agents`, `/api/chat`
3. Agent config schema + `_template/` scaffold
4. LLM client abstraction (Anthropic SDK first, Mistral later)
5. SSE streaming chat endpoint with tool execution loop
6. Frontend: `useAgent` + `useChat` hooks, `ThemeProvider`
7. Frontend: Chat page with messages, input, greeting, suggested questions
8. Frontend: Gallery page with agent cards
9. Static asset serving from KV
10. `new-agent` CLI script
11. Deploy pipeline: build → upload assets → wrangler deploy

### Phase 2 — Polish
- Tool call visualization in chat UI (collapsible, shows tool name + result summary)
- Agent avatar display with fallback to emoji/initials
- OG meta tags per agent (Worker injects into HTML before serving)
- Conversation persistence in D1 (optional, per-agent toggle)
- Rate limiting per agent (KV-based counter)
- Analytics: track messages per agent per day

### Phase 3 — Scale
- Migrate Bounty from current Cloudflare Workers setup into the platform
- Add Vectorize RAG pipeline (embed + upload CLI per agent)
- Shared tool library (web_search, calculator, etc.)
- Agent-to-agent handoff (one agent can redirect to another)
- Admin dashboard (optional, for managing agents without code)

---

## Key Technical Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Backend framework | Hono on Workers | Lightweight, Workers-native, great DX |
| Frontend framework | React 19 + Vite | Already in your stack, fast builds |
| Styling | tokens.css + Tailwind 4 | Portfolio's design system as base, Tailwind for layout utilities, agent accent via CSS var override |
| Asset serving | KV namespace | Avoids Pages wildcard limitation on free tier |
| Streaming | SSE via Hono | Simple, works everywhere, no WebSocket complexity |
| Tool format | JSON Schema params + async handler | Compatible with Claude tool_use format |
| Agent discovery | Build-time scan of agents/ dir | No runtime file system access on Workers |
| State | Stateless by default | No DB needed for MVP. D1 optional for conv logs later |

---

## Constraints & Gotchas

- **Workers free tier**: 100k req/day, 10ms CPU. Streaming LLM calls may need Workers Paid ($5/mo) for 30s CPU limit. Start free, upgrade when you hit limits.
- **No file system on Workers**: Agent configs must be bundled at build time, not loaded dynamically from disk. The build script scans `agents/` and generates a registry module.
- **KV eventual consistency**: Static assets served from KV may take up to 60s to propagate after deploy. Not an issue in practice.
- **Vectorize**: Free tier = 5M operations/month. Sufficient for demos. Each agent gets its own namespace in the same index.
- **CORS**: Worker must set CORS headers. Already handled by Hono middleware.
- **Wildcard subdomains**: Cloudflare supports wildcard CNAME records on proxied domains. The Worker handles the routing, not Cloudflare Pages.