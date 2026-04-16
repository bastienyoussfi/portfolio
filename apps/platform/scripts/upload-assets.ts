import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

const distDir = path.resolve(import.meta.dirname, '..', 'dist', 'frontend')

if (!fs.existsSync(distDir)) {
  console.error('No dist/frontend/ found. Run `pnpm build:frontend` first.')
  process.exit(1)
}

const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
}

function walk(dir: string, base: string = ''): Array<{ filePath: string; key: string }> {
  const entries: Array<{ filePath: string; key: string }> = []

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name)
    const key = `${base}/${entry.name}`

    if (entry.isDirectory()) {
      entries.push(...walk(fullPath, key))
    } else {
      entries.push({ filePath: fullPath, key })
    }
  }

  return entries
}

const files = walk(distDir)
console.log(`Uploading ${files.length} files to STATIC_ASSETS KV...`)

for (const { filePath, key } of files) {
  const ext = path.extname(key)
  const contentType = MIME_TYPES[ext] ?? 'application/octet-stream'

  try {
    execSync(
      `wrangler kv:key put --binding=STATIC_ASSETS "${key}" --path="${filePath}" --metadata='{"contentType":"${contentType}"}'`,
      { stdio: 'pipe' },
    )
    console.log(`  ${key}`)
  } catch (err) {
    console.error(`  FAILED: ${key}`, String(err))
  }
}

console.log('Done.')
