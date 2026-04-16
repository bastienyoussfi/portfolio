import fs from 'fs'
import path from 'path'

const slug = process.argv[2]

if (!slug) {
  console.error('Usage: pnpm new-agent <slug>')
  console.error('Example: pnpm new-agent my-agent')
  process.exit(1)
}

if (!/^[a-z0-9-]+$/.test(slug)) {
  console.error('Slug must be lowercase alphanumeric with hyphens only.')
  process.exit(1)
}

const agentsDir = path.resolve(import.meta.dirname, '..', 'agents')
const templateDir = path.join(agentsDir, '_template')
const targetDir = path.join(agentsDir, slug)

if (fs.existsSync(targetDir)) {
  console.error(`Agent "${slug}" already exists at ${targetDir}`)
  process.exit(1)
}

function copyDir(src: string, dest: string) {
  fs.mkdirSync(dest, { recursive: true })

  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath)
    } else {
      let content = fs.readFileSync(srcPath, 'utf-8')
      content = content.replace(/AGENT_SLUG/g, slug)
      fs.writeFileSync(destPath, content)
    }
  }
}

copyDir(templateDir, targetDir)

console.log(`Agent "${slug}" created at ${targetDir}`)
console.log('')
console.log('Next steps:')
console.log(`  1. Edit agents/${slug}/agent.config.ts`)
console.log(`  2. Add tools in agents/${slug}/tools/`)
console.log('  3. Run: pnpm build:registry')
console.log('  4. Run: pnpm dev')
console.log(`  5. Open: http://localhost:5174?agent=${slug}`)
