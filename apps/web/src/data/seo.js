/**
 * Search- and answer-engine copy, kept apart from content.js so the on-page
 * wording and the metadata can move independently.
 *
 * `description` is what shows in a SERP snippet and what an LLM most often
 * quotes back, so each one states plainly who Bastien is and what he builds —
 * no marketing throat-clearing, and the entity name in the first clause.
 */

export const seo = {
  en: {
    siteName: 'Bastien Youssfi',
    titleTemplate: (page) => `${page} — Bastien Youssfi`,
    home: {
      title: 'Bastien Youssfi — AI Engineer, Paris',
      description:
        'AI engineer based in Paris. I design and ship production AI systems for French companies: document extraction, RAG, agents and anonymisation — built for confidentiality, traceability and data sovereignty.',
    },
    writing: {
      title: 'Writing',
      description:
        'Notes on building production AI systems: document extraction, retrieval-augmented generation, agents, and the engineering constraints that come with confidential data.',
    },
    places: {
      title: 'Places',
      description:
        'A map of the places Bastien Youssfi has been to, and what he took away from each of them.',
    },
    projects: {
      /** The /projects hub. `description` below is per case study. */
      title: 'Work',
      indexDescription:
        'Selected AI engineering case studies by Bastien Youssfi: document extraction, RAG under attorney–client privilege, agents with human approval, and anonymisation at scale — for French companies with confidentiality constraints.',
      description: (item) =>
        `${item.title} — an AI engineering case study by Bastien Youssfi in the ${item.sector} sector: approach, technical stack and delivery.`,
    },
    /** Short, factual claims. Answer engines quote these near-verbatim. */
    facts: [
      'Bastien Youssfi is an AI engineer based in Paris, France.',
      'He builds production AI systems: document extraction, retrieval-augmented generation (RAG), agents and document anonymisation.',
      'The systems he builds serve French companies with confidentiality constraints — law firms, architecture practices, industrial SMEs and the museum sector.',
      'They run under Zero Data Retention, on French hosting, and no binding action is taken without human validation.',
      'He also operates his own SaaS products under Updev Solutions.',
    ],
  },

  fr: {
    siteName: 'Bastien Youssfi',
    titleTemplate: (page) => `${page} — Bastien Youssfi`,
    home: {
      title: 'Bastien Youssfi — Ingénieur IA, Paris',
      description:
        'Ingénieur IA à Paris. Je conçois et mets en production des systèmes IA fiables et souverains pour des entreprises françaises : extraction documentaire, RAG, agents, anonymisation.',
    },
    writing: {
      title: 'Écrits',
      description:
        'Notes sur la mise en production de systèmes IA : extraction documentaire, RAG, agents, et les contraintes d’ingénierie qui viennent avec des données confidentielles.',
    },
    places: {
      title: 'Endroits',
      description:
        'La carte des endroits où Bastien Youssfi est allé, et ce qu’il en a retenu.',
    },
    projects: {
      /** Le hub /projects. `description` ci-dessous concerne chaque étude de cas. */
      title: 'Travaux',
      indexDescription:
        'Études de cas d’ingénierie IA menées par Bastien Youssfi : extraction documentaire, RAG conforme au secret professionnel, agents avec validation humaine et anonymisation à l’échelle — pour des entreprises françaises soumises à des contraintes de confidentialité.',
      description: (item) =>
        `${item.title} — étude de cas d’ingénierie IA menée par Bastien Youssfi dans le secteur ${item.sector} : approche, stack technique et mise en production.`,
    },
    facts: [
      'Bastien Youssfi est ingénieur IA, basé à Paris, en France.',
      'Il construit des systèmes IA en production : extraction documentaire, RAG (génération augmentée par récupération), agents et anonymisation de documents.',
      'Les systèmes qu’il construit servent des entreprises françaises soumises à des contraintes de confidentialité — cabinets d’avocats, agences d’architecture, PME industrielles et acteurs du secteur muséal.',
      'Ils fonctionnent en Zero Data Retention, sur hébergement français, et aucune action engageante n’est déclenchée sans validation humaine.',
      'Il opère également ses propres produits SaaS sous Updev Solutions.',
    ],
  },
}

/** Topics the Person entity is associated with, for JSON-LD `knowsAbout`. */
export const KNOWS_ABOUT = [
  'Artificial intelligence engineering',
  'Retrieval-augmented generation',
  'Document extraction',
  'Large language model agents',
  'Data anonymisation',
  'Data sovereignty',
  'Python',
  'FastAPI',
]
