# Portfolio — Architecture

## Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Frontend | Vite + React + TypeScript + Tailwind CSS | SPA |
| Backend | Hono | Lightweight TypeScript framework |
| AI | Claude API | Tool use + RAG for the chat agent |
| RAG Source | PDF → preprocessed text chunks (JSON/Markdown) | No vector DB — small corpus, keyword/semantic matching via Claude |
| Deployment | Cloudflare (Pages + Workers) | Single platform, free tier |

## Structure

```
portfolio/
├── apps/
│   ├── web/                  # Vite + React frontend
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   └── ...
│   │   ├── index.html
│   │   └── vite.config.ts
│   └── api/                  # Hono backend (Cloudflare Worker)
│       ├── src/
│       │   ├── routes/
│       │   ├── tools/        # Agent tool definitions
│       │   ├── rag/          # Context chunks + retrieval logic
│       │   └── index.ts
│       └── wrangler.toml
├── data/
│   └── context/              # Preprocessed RAG chunks from PDFs
├── package.json
└── turbo.json                # Monorepo orchestration (optional)
```

## Deployment

- **Frontend** → Cloudflare Pages (static build from `apps/web`)
- **Backend** → Cloudflare Workers (deployed from `apps/api`)
- **Cost** → $0 on free tier (100k worker requests/day)

## AI Agent

- Claude API with tool use for the chat hero
- Tools: search projects, get bio/skills info, link to portfolio sections
- RAG: PDFs extracted at build time into text chunks, stored as static JSON in `data/context/`
- Streaming responses via Workers
