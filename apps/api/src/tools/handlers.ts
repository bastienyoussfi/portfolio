import projects from '../../../../data/context/projects.json'
import skills from '../../../../data/context/skills.json'
import experience from '../../../../data/context/experience.json'
import contact from '../../../../data/context/contact.json'
import bio from '../../../../data/context/bio.json'

export function executeTool(
  name: string,
  input: Record<string, unknown>,
): unknown {
  switch (name) {
    case 'search_projects':
      return searchProjects(
        input.query as string,
        input.category as string | undefined,
      )
    case 'get_skills':
      return getSkills(input.category as string | undefined)
    case 'get_experience':
      return getExperience(input.type as string | undefined)
    case 'get_contact':
      return getContact()
    default:
      return { error: `Unknown tool: ${name}` }
  }
}

function searchProjects(query: string, category?: string) {
  const q = query.toLowerCase()
  let results = projects.filter((p) => {
    const matchesText =
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.technologies.some((t) => t.toLowerCase().includes(q))
    const matchesCategory =
      !category || category === 'all' || p.category === category
    return matchesText && matchesCategory
  })

  if (results.length === 0) {
    results = projects
  }

  return {
    count: results.length,
    projects: results.map((p) => ({
      title: p.title,
      description: p.description,
      category: p.category,
      technologies: p.technologies,
      status: p.status,
      year: p.year,
      metrics: p.metrics,
      links: p.links,
    })),
  }
}

function getSkills(category?: string) {
  if (!category || category === 'all') {
    return { categories: skills }
  }

  const filtered = skills.filter(
    (s) => s.category.toLowerCase().replace(/\s+/g, '-') === category,
  )
  return { categories: filtered.length > 0 ? filtered : skills }
}

function getExperience(type?: string) {
  if (!type || type === 'all') {
    return { experience }
  }

  return {
    experience: experience.filter((e) => e.type === type),
  }
}

function getContact() {
  return {
    ...contact,
    bio: {
      name: bio.name,
      title: bio.title,
      location: bio.location,
    },
  }
}
