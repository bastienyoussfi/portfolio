import welcome from './welcome.md?raw'
import openai from './openai.md?raw'
import operatingSystems from './operating-systems.md?raw'
import docker from './docker.md?raw'
import proxies from './proxies.md?raw'
import cache from './cache.md?raw'

const blogContent: Record<string, string> = {
  welcome,
  openai,
  'operating-systems': operatingSystems,
  docker,
  proxies,
  cache,
}

export default blogContent
