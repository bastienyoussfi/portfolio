const FOLLOWUP_MAP: Record<string, string[]> = {
  search_projects: [
    "What's his tech stack?",
    'Tell me about his experience',
    'How can I contact him?',
  ],
  get_skills: [
    'Show me his projects',
    'Tell me about his experience',
    'Get in touch',
  ],
  get_experience: [
    'What projects has he built?',
    "What's his tech stack?",
    'How to contact him?',
  ],
  get_contact: [
    'Show me his projects',
    'What are his skills?',
    'Tell me about his experience',
  ],
}

export default function FollowUpButtons({
  toolName,
  onSelect,
}: {
  toolName: string
  onSelect: (text: string) => void
}) {
  const suggestions = FOLLOWUP_MAP[toolName]
  if (!suggestions) return null

  return (
    <div className="followup-row">
      {suggestions.map((text, i) => (
        <button
          key={text}
          className="followup"
          style={{ animationDelay: `${350 + i * 60}ms` }}
          onClick={() => onSelect(text)}
        >
          &rarr; {text}
        </button>
      ))}
    </div>
  )
}
