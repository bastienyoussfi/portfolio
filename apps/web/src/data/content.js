/* =============================================================================
   CONTENT — all copy for the site, per language.
   Edit text here only; never inside components.

   The site is a single narrow column, read top to bottom: `intro` (name,
   greeting, the click-to-expand opening line, then paragraphs and contact),
   `services`, `work`, `writing`, `places`, `closing` and `footer`. Each
   project row links to a case study at /projects/:id.

   Blog posts and places do NOT live here — they are markdown files in
   src/content/writing/ and src/content/places/, loaded by their own modules
   in src/data/. Only the section labels are below.

   `intro.reveal` drives the InlineReveal component: `prefix` + `trigger` +
   `original` is the sentence at rest; clicking `trigger` swaps `original` for
   `glue` + `revealed`, which arrives one word at a time. Keep `revealed` to a
   couple of lines — the block animates to its height.

   PLACEHOLDERS to confirm/replace: shared.socials urls, and every `caseStudy`
   block below — the summaries, tech lists, methodology steps and screenshots
   are DRAFTS marked `TODO(bastien): confirm`. Drop real screenshots in
   public/projets/ and point `caseStudy.screenshots[].src` at them.

   Each work item carries an optional `image` (square thumbnail, e.g.
   '/projets/extraction.png'; a grey placeholder shows when it is null) and a
   `caseStudy` object:
     { summary, tech: [...], methodology: [{title, body}], screenshots: [{src, caption}] }
   Anonymized work items follow Bastien's choice: no client names, sector only.
   ============================================================================= */

/* Language-neutral facts shared across FR & EN. */
const shared = {
  name: 'Bastien Youssfi',
  email: 'bastien.youssfi@gmail.com',
  // Square profile picture shown next to the name; grey placeholder when null.
  avatar: '/profile.jpg',
  // TODO(bastien): confirm these handles/URLs.
  socials: [
    { name: 'LinkedIn', icon: 'linkedin', url: 'https://www.linkedin.com/in/bastienyoussfi/' },
    { name: 'X', icon: 'x', url: 'https://x.com/bastienyoussfi' },
    { name: 'GitHub', icon: 'github', url: 'https://github.com/bastienyoussfi' },
  ],
  entity: 'Updev Solutions',
  year: '2026',
}

export const content = {
  /* ===========================================================================
     FRANÇAIS (défaut)
     =========================================================================== */
  fr: {
    shared,
    langLabel: 'FR',
    langSwitchTo: 'Passer en anglais',
    skip: 'Aller au contenu',

    intro: {
      role: 'Ingénieur IA',
      location: 'Paris',
      name: 'Bastien Youssfi',
      greeting: 'Bonjour, hi, ingénieur IA',
      // The opening line hides its own detail: clicking the phrase expands it.
      reveal: {
        prefix: 'Je suis ingénieur IA à Paris, et je construis surtout pour ',
        trigger: 'des entreprises françaises',
        glue: ' :',
        original:
          ', sur des sujets où la confidentialité et la traçabilité comptent autant que le résultat.',
        revealed:
          'cabinets d’avocats, agences d’architecture, PME industrielles et acteurs du secteur muséal.',
      },
      paragraphs: [
        'Je conçois, construis et mets en production des produits IA. Pas des démos — des systèmes qui tiennent : extraction documentaire, RAG, agents, anonymisation.',
        'Zero Data Retention, hébergement français, et jamais d’action engageante sans validation humaine. J’opère aussi mon propre SaaS sous Updev Solutions.',
        'Je construis par passion, et par optimisme : bien faite, cette technologie rend les gens plus capables. Voir une chose marcher pour de vrai reste la meilleure partie.',
      ],
      contact: [
        { text: 'Vous pouvez m’écrire par ' },
        { link: 'email', social: 'email' },
        { text: ', ou voir le reste sur ' },
        { link: 'GitHub', social: 'GitHub' },
        { text: ' et ' },
        { link: 'LinkedIn', social: 'LinkedIn' },
        { text: '.' },
      ],
      emailLabel: 'Email',
    },

    services: {
      label: 'Ce que je construis',
      items: [
        {
          title: 'Extraction documentaire',
          detail: 'PDF et scans en données',
          meta: 'Python · OCR · LLM',
        },
        {
          title: 'RAG & recherche',
          detail: 'Réponses sourcées et vérifiables',
          meta: 'pgvector · LangGraph',
        },
        {
          title: 'Agents',
          detail: 'Outils, garde-fous, validation humaine',
          meta: 'Claude · Function calling',
        },
        {
          title: 'Applications mobiles',
          detail: 'iOS et Android, jusqu’au store',
          meta: 'React Native · Expo',
        },
        {
          title: 'Audit & cadrage',
          detail: 'Cas d’usage et feuille de route',
          meta: 'Données · Cartographie',
        },
      ],
    },

    writing: {
      label: 'Écrits',
      backLabel: 'Index',
      intro:
        'Des notes sur la mise en production de systèmes IA — ce qui tient, ce qui casse, et les contraintes qui viennent avec des données confidentielles.',
      link: 'Tous les écrits',
      backToIndex: 'Écrits',
      empty: 'Rien de publié pour l’instant.',
    },

    places: {
      label: 'Endroits',
      intro: 'Les endroits où je suis allé, et ce que j’en ai retenu.',
      link: 'Voir la carte des endroits où je suis allé',
      backLabel: 'Index',
      backToIndex: 'Endroits',
      empty: 'Rien de publié pour l’instant.',
    },

    /* Faits en troisième personne, repris de seo.js. Voir Facts.astro. */
    facts: {
      label: 'En bref',
    },

    closing:
      'Ce qui guide le travail : fiabilité, traçabilité, souveraineté — et l’idée que le meilleur reste à construire.',

    footer: {
      location: 'Paris, France',
    },

    work: {
      label: 'Travaux sélectionnés',
      year: '2026',
      intro:
        'Des systèmes IA livrés en production pour des entreprises françaises. Les clients ne sont pas nommés — secteur et contraintes seulement.',
      link: 'Tous les travaux',
      backToIndex: 'Travaux',
      statusLabels: {
        live: 'En production',
        shipped: 'Livré',
        discussion: 'En cours',
        early: 'Phase initiale',
      },
      // Shared labels for the case study pages.
      caseStudy: {
        backLabel: 'Retour',
        techLabel: 'Stack technique',
        methodologyLabel: 'Méthodologie',
        screenshotsLabel: 'Aperçus',
        screenshotsEmpty: 'Captures à venir — projet sous accord de confidentialité.',
      },
      items: [
        {
          id: 'extraction',
          image: '/projets/auditex.jpeg',
          status: 'live',
          title: 'SaaS d’extraction documentaire',
          sector: 'Produit maison',
          // TODO(bastien): confirm tout le bloc caseStudy ci-dessous.
          caseStudy: {
            summary:
              'Une plateforme SaaS qui transforme des documents bruts (PDF, scans, e-mails) en données structurées et vérifiables. Conçue, opérée et maintenue en propre sous Updev Solutions, pour des entreprises françaises qui traitent de gros volumes documentaires.',
            tech: ['Python', 'FastAPI', 'React', 'PostgreSQL', 'pgvector', 'Docling / OCR', 'Claude', 'Celery', 'Docker', 'Scaleway (FR)'],
            methodology: [
              {
                title: 'Cadrage',
                body: 'Identification des types de documents, des champs à extraire et des règles métier. Définition des seuils de confiance et du niveau de relecture humaine acceptable.',
              },
              {
                title: 'Pipeline d’extraction',
                body: 'OCR + segmentation, puis extraction structurée par LLM avec schémas typés. Chaque champ est tracé jusqu’à sa source dans le document pour permettre la vérification.',
              },
              {
                title: 'Mise en production',
                body: 'Traitement asynchrone par files, hébergement français, Zero Data Retention. Tableau de bord de suivi des lots, des erreurs et des coûts.',
              },
              {
                title: 'Exploitation',
                body: 'Monitoring des taux d’extraction et dérives, itérations sur les prompts et les schémas, support des utilisateurs en production.',
              },
            ],
            // TODO(bastien): remplacer/compléter par de vraies captures dans public/projets/.
            screenshots: [
              { src: '/projets/auditex.jpeg', caption: 'Interface d’extraction et de revue des documents.' },
            ],
          },
        },
        {
          id: 'rag-legal',
          image: '/projets/horace.jpg',
          status: 'shipped',
          title: 'RAG conforme au secret professionnel',
          sector: 'Cabinet d’avocats',
          caseStudy: {
            summary:
              'Un système de recherche augmentée (RAG) sur les dossiers d’un cabinet d’avocats, construit pour respecter le secret professionnel : isolation stricte des données, traçabilité des sources et aucune fuite vers des tiers.',
            tech: ['Python', 'LangGraph', 'pgvector', 'Embeddings BGE', 'Claude', 'FastAPI', 'Zero Data Retention', 'Hébergement France'],
            methodology: [
              {
                title: 'Contraintes & conformité',
                body: 'Cartographie des exigences de confidentialité et du secret professionnel avant toute ligne de code. Choix d’un hébergement français et d’un mode Zero Data Retention.',
              },
              {
                title: 'Indexation',
                body: 'Découpage sémantique des pièces et mémos, embeddings et stockage vectoriel cloisonné par dossier. Métadonnées pour le filtrage par affaire et par droit d’accès.',
              },
              {
                title: 'Génération sourcée',
                body: 'Réponses systématiquement accompagnées des passages cités. Le modèle ne répond que sur la base des documents récupérés, jamais de mémoire.',
              },
              {
                title: 'Livraison',
                body: 'Mise en production, formation des utilisateurs et garde-fous : aucune action engageante sans validation humaine.',
              },
            ],
            screenshots: [
              { src: '/projets/horace.jpg', caption: 'Recherche conversationnelle avec sources citées.' },
            ],
          },
        },
        {
          id: 'agents',
          image: '/projets/terres.jpeg',
          status: 'discussion',
          title: 'Agents IA mobiles',
          sector: 'Agence d’architecture',
          caseStudy: {
            summary:
              'Des agents IA accessibles depuis le mobile pour une agence d’architecture : préparer des notes de chantier, retrouver de l’information projet et déclencher des actions, le tout avec validation humaine sur les opérations sensibles.',
            tech: ['React Native / Expo', 'FastAPI', 'Claude', 'Function calling', 'Human-in-the-loop', 'PostgreSQL'],
            methodology: [
              {
                title: 'Cas d’usage terrain',
                body: 'Observation des workflows sur chantier et au bureau pour cibler les tâches à fort gain et les points où l’IA doit rester assistée.',
              },
              {
                title: 'Conception des agents',
                body: 'Définition des outils (function calling), des garde-fous et des points de validation. Chaque action engageante passe par une confirmation humaine.',
              },
              {
                title: 'Prototype mobile',
                body: 'Application mobile légère permettant de tester les agents en conditions réelles et d’itérer rapidement sur les prompts et les outils.',
              },
            ],
            screenshots: [
              { src: '/projets/terres.jpeg', caption: 'Agent mobile en contexte projet.' },
            ],
          },
        },
        {
          id: 'anonymization',
          image: null,
          status: 'shipped',
          title: 'Anonymisation de documents à l’échelle',
          sector: 'Juridique',
          caseStudy: {
            summary:
              'Un pipeline d’anonymisation de documents juridiques à grande échelle, pour produire des corpus de formation exploitables sans exposer de données personnelles ni d’informations identifiantes.',
            tech: ['Python', 'spaCy', 'Presidio', 'Reconnaissance d’entités (NER)', 'Règles & regex', 'PostgreSQL', 'Traitement par lots'],
            methodology: [
              {
                title: 'Typologie des données',
                body: 'Inventaire des entités à masquer (noms, adresses, numéros, références d’affaires) et définition des règles de cohérence pour préserver la lisibilité des documents.',
              },
              {
                title: 'Détection hybride',
                body: 'Combinaison de modèles NER et de règles déterministes (regex, dictionnaires) pour maximiser le rappel sur les données sensibles.',
              },
              {
                title: 'Anonymisation cohérente',
                body: 'Substitution stable par pseudonymes : une même entité reçoit le même remplacement dans tout le corpus, pour garder le sens.',
              },
              {
                title: 'Contrôle qualité',
                body: 'Échantillonnage et revue manuelle des sorties, mesure du taux de fuite résiduel, itérations sur les règles.',
              },
            ],
            screenshots: [],
          },
        },
        {
          id: 'audit',
          image: '/projets/promuseum.jpeg',
          status: 'discussion',
          title: 'Audit & transformation par la donnée',
          sector: 'Musées',
          caseStudy: {
            summary:
              'Un audit data & IA pour une PME du secteur muséal : cartographier l’existant, identifier les opportunités à fort impact et tracer une feuille de route de transformation réaliste et priorisée.',
            tech: ['Audit data', 'Python', 'Cartographie des flux', 'Cadrage des cas d’usage', 'Feuille de route', 'Estimation ROI'],
            methodology: [
              {
                title: 'État des lieux',
                body: 'Entretiens, inventaire des données et des outils, identification des frictions et des tâches manuelles répétitives.',
              },
              {
                title: 'Cartographie des opportunités',
                body: 'Recensement des cas d’usage IA possibles, évaluation impact / effort / risque, mise en regard avec les priorités métier.',
              },
              {
                title: 'Feuille de route',
                body: 'Séquencement des chantiers, premiers pilotes à lancer et estimation des gains attendus. Recommandations souveraineté et conformité.',
              },
            ],
            screenshots: [
              { src: '/projets/promuseum.jpeg', caption: 'Restitution de l’audit et de la feuille de route.' },
            ],
          },
        },
        {
          id: 'sovereign-chat',
          image: null,
          status: 'early',
          title: 'Chat IA d’entreprise souverain',
          sector: 'Souveraineté',
          caseStudy: {
            summary:
              'Un assistant conversationnel d’entreprise entièrement souverain : modèle auto-hébergé, données qui ne quittent pas l’infrastructure, contrôle d’accès fin. Projet en phase initiale.',
            tech: ['Mistral (auto-hébergé)', 'vLLM', 'RAG', 'pgvector', 'RBAC', 'On-premise / France', 'FastAPI'],
            methodology: [
              {
                title: 'Exigences de souveraineté',
                body: 'Définition des contraintes d’hébergement, de gouvernance et d’accès : aucune donnée ne sort de l’infrastructure de l’entreprise.',
              },
              {
                title: 'Architecture cible',
                body: 'Modèle open-weight auto-hébergé, couche RAG sur les bases internes, contrôle d’accès par rôle (RBAC) et journalisation.',
              },
              {
                title: 'Pilote',
                body: 'Périmètre initial réduit pour valider la qualité des réponses, la performance et l’adhésion avant un déploiement plus large.',
              },
            ],
            screenshots: [],
          },
        },
      ],
    },
  },

  /* ===========================================================================
     ENGLISH
     =========================================================================== */
  en: {
    shared,
    langLabel: 'EN',
    langSwitchTo: 'Switch to French',
    skip: 'Skip to content',

    intro: {
      role: 'AI Engineer',
      location: 'Paris',
      name: 'Bastien Youssfi',
      greeting: 'Hi, bonjour, AI engineer',
      // The opening line hides its own detail: clicking the phrase expands it.
      reveal: {
        prefix: 'I’m an AI engineer in Paris, and I mostly build for ',
        trigger: 'French companies and firms',
        glue: ':',
        original:
          ', on problems where confidentiality and traceability matter as much as the result.',
        revealed:
          'law firms, architecture studios, industrial SMEs and organisations in the museum sector.',
      },
      paragraphs: [
        'I design, build and ship AI products to production. Not demos — systems that hold up: document extraction, RAG, agents, anonymization.',
        'Zero Data Retention, French hosting, and never a committing action without human approval. I also run my own SaaS under Updev Solutions.',
        'I build out of passion, and out of optimism: done well, this technology makes people more capable. Watching a thing actually work is still the best part.',
      ],
      contact: [
        { text: 'You can reach me by ' },
        { link: 'email', social: 'email' },
        { text: ', or see the rest on ' },
        { link: 'GitHub', social: 'GitHub' },
        { text: ' and ' },
        { link: 'LinkedIn', social: 'LinkedIn' },
        { text: '.' },
      ],
      emailLabel: 'Email',
    },

    services: {
      label: 'What I build',
      items: [
        {
          title: 'Document extraction',
          detail: 'PDFs and scans into structured data',
          meta: 'Python · OCR · LLM',
        },
        {
          title: 'RAG & retrieval',
          detail: 'Sourced answers over your documents',
          meta: 'pgvector · LangGraph',
        },
        {
          title: 'Agents',
          detail: 'Tools, guardrails, human approval',
          meta: 'Claude · Function calling',
        },
        {
          title: 'Mobile apps',
          detail: 'iOS and Android, shipped to the stores',
          meta: 'React Native · Expo',
        },
        {
          title: 'Audit & scoping',
          detail: 'Mapping, use cases, roadmap',
          meta: 'Data · Mapping',
        },
      ],
    },

    writing: {
      label: 'Writing',
      backLabel: 'Index',
      intro:
        'Notes on putting AI systems into production — what holds up, what breaks, and the constraints that come with confidential data.',
      link: 'All writing',
      backToIndex: 'Writing',
      empty: 'Nothing published yet.',
    },

    places: {
      label: 'Places',
      intro: 'Places I have been, and what stayed with me.',
      link: 'See the map of places I have been',
      backLabel: 'Index',
      backToIndex: 'Places',
      empty: 'Nothing published yet.',
    },

    /* Third-person facts, sourced from seo.js. See Facts.astro. */
    facts: {
      label: 'In short',
    },

    closing:
      'What guides the work: reliability, traceability, sovereignty — and the sense that the best of it is still to be built.',

    footer: {
      location: 'Paris, France',
    },

    work: {
      label: 'Selected work',
      year: '2026',
      intro:
        'AI systems shipped to production for French companies. Clients are not named — sector and constraints only.',
      link: 'All work',
      backToIndex: 'Work',
      statusLabels: {
        live: 'Live',
        shipped: 'Shipped',
        discussion: 'In progress',
        early: 'Early',
      },
      // Shared labels for the case study pages.
      caseStudy: {
        backLabel: 'Back',
        techLabel: 'Tech stack',
        methodologyLabel: 'Methodology',
        screenshotsLabel: 'Screenshots',
        screenshotsEmpty: 'Screenshots coming soon — project under NDA.',
      },
      items: [
        {
          id: 'extraction',
          image: '/projets/auditex.jpeg',
          status: 'live',
          title: 'Document-extraction SaaS',
          sector: 'Own product',
          // TODO(bastien): confirm the whole caseStudy block below.
          caseStudy: {
            summary:
              'A SaaS platform that turns raw documents (PDFs, scans, emails) into structured, verifiable data. Designed, operated and maintained in-house under Updev Solutions, for French companies handling high document volumes.',
            tech: ['Python', 'FastAPI', 'React', 'PostgreSQL', 'pgvector', 'Docling / OCR', 'Claude', 'Celery', 'Docker', 'Scaleway (FR)'],
            methodology: [
              {
                title: 'Framing',
                body: 'Identify document types, fields to extract and business rules. Define confidence thresholds and the acceptable level of human review.',
              },
              {
                title: 'Extraction pipeline',
                body: 'OCR + segmentation, then structured LLM extraction against typed schemas. Every field traces back to its source in the document so it can be verified.',
              },
              {
                title: 'Production',
                body: 'Async queue-based processing, French hosting, Zero Data Retention. A dashboard tracks batches, errors and costs.',
              },
              {
                title: 'Operations',
                body: 'Monitor extraction rates and drift, iterate on prompts and schemas, support users in production.',
              },
            ],
            // TODO(bastien): replace/extend with real screenshots in public/projets/.
            screenshots: [
              { src: '/projets/auditex.jpeg', caption: 'Document extraction and review interface.' },
            ],
          },
        },
        {
          id: 'rag-legal',
          image: '/projets/horace.jpg',
          status: 'shipped',
          title: 'RAG built for attorney–client privilege',
          sector: 'Law firm',
          caseStudy: {
            summary:
              'A retrieval-augmented (RAG) system over a law firm’s case files, built to respect attorney–client privilege: strict data isolation, source traceability and no leakage to third parties.',
            tech: ['Python', 'LangGraph', 'pgvector', 'BGE embeddings', 'Claude', 'FastAPI', 'Zero Data Retention', 'French hosting'],
            methodology: [
              {
                title: 'Constraints & compliance',
                body: 'Map confidentiality and privilege requirements before any code. Pick French hosting and a Zero Data Retention mode.',
              },
              {
                title: 'Indexing',
                body: 'Semantic chunking of filings and memos, embeddings and vector storage partitioned per case. Metadata enables filtering by matter and access rights.',
              },
              {
                title: 'Sourced generation',
                body: 'Answers always ship with their cited passages. The model only responds from retrieved documents, never from memory.',
              },
              {
                title: 'Delivery',
                body: 'Production rollout, user training and guardrails: no committing action without human approval.',
              },
            ],
            screenshots: [
              { src: '/projets/horace.jpg', caption: 'Conversational search with cited sources.' },
            ],
          },
        },
        {
          id: 'agents',
          image: '/projets/terres.jpeg',
          status: 'discussion',
          title: 'Mobile AI agents',
          sector: 'Architecture studio',
          caseStudy: {
            summary:
              'AI agents accessible from mobile for an architecture studio: prepare site notes, retrieve project information and trigger actions — all with human approval on sensitive operations.',
            tech: ['React Native / Expo', 'FastAPI', 'Claude', 'Function calling', 'Human-in-the-loop', 'PostgreSQL'],
            methodology: [
              {
                title: 'Field use cases',
                body: 'Observe workflows on site and in the office to target high-value tasks and the points where AI must stay assistive.',
              },
              {
                title: 'Agent design',
                body: 'Define tools (function calling), guardrails and approval points. Every committing action goes through human confirmation.',
              },
              {
                title: 'Mobile prototype',
                body: 'A lightweight mobile app to test the agents in real conditions and iterate quickly on prompts and tools.',
              },
            ],
            screenshots: [
              { src: '/projets/terres.jpeg', caption: 'Mobile agent in a project context.' },
            ],
          },
        },
        {
          id: 'anonymization',
          image: null,
          status: 'shipped',
          title: 'Document anonymization at scale',
          sector: 'Legal · training',
          caseStudy: {
            summary:
              'A large-scale anonymization pipeline for legal documents, producing usable training corpora without exposing personal data or identifying information.',
            tech: ['Python', 'spaCy', 'Presidio', 'Named Entity Recognition', 'Rules & regex', 'PostgreSQL', 'Batch processing'],
            methodology: [
              {
                title: 'Data typology',
                body: 'Inventory the entities to mask (names, addresses, numbers, case references) and define consistency rules that keep documents readable.',
              },
              {
                title: 'Hybrid detection',
                body: 'Combine NER models with deterministic rules (regex, dictionaries) to maximize recall on sensitive data.',
              },
              {
                title: 'Consistent anonymization',
                body: 'Stable pseudonym substitution: the same entity gets the same replacement across the whole corpus, preserving meaning.',
              },
              {
                title: 'Quality control',
                body: 'Sample and manually review outputs, measure residual leakage rate, iterate on the rules.',
              },
            ],
            screenshots: [],
          },
        },
        {
          id: 'audit',
          image: '/projets/promuseum.jpeg',
          status: 'discussion',
          title: 'Data-led AI transformation audit',
          sector: 'Museum sector',
          caseStudy: {
            summary:
              'A data & AI audit for an SME in the museum sector: map the existing landscape, identify high-impact opportunities and lay out a realistic, prioritized transformation roadmap.',
            tech: ['Data audit', 'Python', 'Data-flow mapping', 'Use-case scoping', 'Roadmap', 'ROI estimation'],
            methodology: [
              {
                title: 'Current state',
                body: 'Interviews, inventory of data and tools, identification of friction points and repetitive manual tasks.',
              },
              {
                title: 'Opportunity mapping',
                body: 'List possible AI use cases, score impact / effort / risk, and align them with business priorities.',
              },
              {
                title: 'Roadmap',
                body: 'Sequence the workstreams, pick first pilots to launch and estimate expected gains. Sovereignty and compliance recommendations.',
              },
            ],
            screenshots: [
              { src: '/projets/promuseum.jpeg', caption: 'Audit findings and roadmap readout.' },
            ],
          },
        },
        {
          id: 'sovereign-chat',
          image: null,
          status: 'early',
          title: 'Sovereign enterprise AI chat',
          sector: 'Data governance',
          caseStudy: {
            summary:
              'A fully sovereign enterprise chat assistant: self-hosted model, data that never leaves the infrastructure, fine-grained access control. Project in its early phase.',
            tech: ['Mistral (self-hosted)', 'vLLM', 'RAG', 'pgvector', 'RBAC', 'On-premise / France', 'FastAPI'],
            methodology: [
              {
                title: 'Sovereignty requirements',
                body: 'Define hosting, governance and access constraints: no data leaves the company’s infrastructure.',
              },
              {
                title: 'Target architecture',
                body: 'Self-hosted open-weight model, a RAG layer over internal sources, role-based access control (RBAC) and logging.',
              },
              {
                title: 'Pilot',
                body: 'A small initial scope to validate answer quality, performance and adoption before a wider rollout.',
              },
            ],
            screenshots: [],
          },
        },
      ],
    },
  },
}
