import { getAgentSlug } from '@/utils/subdomain'
import Gallery from '@/pages/Gallery'
import Chat from '@/pages/Chat'

export default function App() {
  const agentSlug = getAgentSlug()

  if (!agentSlug) {
    return <Gallery />
  }

  return <Chat agentSlug={agentSlug} />
}
