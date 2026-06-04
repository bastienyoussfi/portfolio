/* =========================================================================
   CONTENT — all editable copy lives here.
   Change text, links, cases or packages without touching components.
   ========================================================================= */

export const brand = {
  name: 'bastien',
  fullName: 'bastien youssfi',
}

export const nav = {
  links: [
    { label: 'Cas clients', href: '#cases' },
    { label: 'Offre', href: '#offer' },
    { label: 'À propos', href: '#about' },
  ],
  cta: { label: 'Réserver un appel', href: '#contact' },
}

export const hero = {
  eyebrow: 'Produits IA en production',
  title: [
    { text: 'Des produits IA qui ' },
    { text: 'tournent vraiment.', highlight: true },
    { text: ' Pas des démos.' },
  ],
  subtitle:
    "Je conçois et déploie des outils IA pour PME et cabinets, intégrés à vos vrais flux de travail, avec des résultats mesurés.",
  primaryCta: { label: 'Réserver un appel', href: '#contact' },
  secondaryCta: { label: 'Voir les cas clients →', href: '#cases' },
  stats: [
    {
      kicker: 'Extraction documentaire',
      value: ['1 sem ', { text: '→', accent: true }, ' 10 min'],
      detail: "Le traitement d'un dossier complet.",
      dark: true,
    },
    {
      kicker: 'Temps rendu',
      value: ['~2 h / jour'],
      detail: "Récupérées par les équipes d'une agence.",
    },
    {
      kicker: 'Fiabilité',
      value: ['> 99 %'],
      detail: "Précision d'extraction en conditions réelles.",
    },
  ],
}

export const problem = {
  heading: "L'IA est partout dans les démos. Beaucoup plus rare en production.",
  paragraphs: [
    "La plupart des entreprises ont testé un outil IA. Peu en ont un qui tourne vraiment, tous les jours, intégré à leurs vrais flux de travail.",
    "Le problème n'est presque jamais le modèle. C'est tout le reste : connecter les bonnes sources de données, gérer les volumes, garder l'humain dans la boucle aux bons endroits, atteindre une fiabilité assez haute pour qu'on puisse s'appuyer dessus sans tout revérifier.",
    [
      "C'est là que j'interviens. Je pars d'un ",
      { text: 'problème métier concret', strong: true },
      " et je livre un produit qui le résout, en production, avec des chiffres pour le prouver.",
    ],
  ],
}

export const cases = {
  title: 'Trois problèmes. Trois produits en production.',
  intro:
    "Chaque cas raconte un type de valeur différent : gagner du temps, ne plus rien perdre, se recentrer sur l'essentiel.",
  items: [
    {
      num: '01',
      context:
        "Cabinet de conseil en optimisation du Crédit Impôt Recherche · données confidentielles",
      title: 'Extraction documentaire automatisée',
      shot: {
        badge: 'Anonymisé',
        title: 'Capture produit — extraction',
        subtitle: 'Interface de dépôt + tableur généré (données fictives).',
      },
      problem:
        "Extraire manuellement les données de centaines de documents — business plans, CV, diplômes, factures — et les consolider dans un tableur. Sur un dossier de 100+ salariés : l'équivalent d'une semaine de travail, répété sur des milliers de documents chaque mois.",
      built:
        "Un pipeline d'extraction structurée : dépôt des documents, traitement en arrière-plan (OCR pour les scans, lecture directe sinon), tableur généré en un clic. Architecture pensée pour le volume — traitement asynchrone par files d'attente, fonctions serverless.",
      result: {
        metric: '1 semaine → ~10 min',
        text: "de manipulation humaine par dossier. Précision > 99 % sur les PDF natifs, ~95 % sur les scans. Le consultant passe de la saisie au contrôle.",
      },
    },
    {
      num: '02',
      context: "Cabinet d'avocats · deux associés",
      title: 'Mémoire projet interrogeable',
      shot: {
        badge: 'Anonymisé',
        title: 'Capture produit — base interrogeable',
        subtitle: 'Recherche en langage naturel sur un dossier (données fictives).',
      },
      problem:
        "Chaque associé gérait des centaines d'e-mails par jour et une dizaine de réunions par semaine. Trop d'information entrante pour tout transmettre aux collaborateurs et garder une vue à jour de chaque dossier. De l'information se perdait, le tri était manuel et permanent.",
      built:
        "Une plateforme qui capitalise automatiquement toutes les sources — e-mails, réunions en visio, réunions en présentiel transcrites. Chaque document est ingéré, classé dans le bon dossier, et rendu interrogeable en langage naturel. Les collaborateurs sont notifiés des nouveautés.",
      result: {
        metric: 'Zéro perte',
        text: "Fin du tri manuel. Chaque dossier reste à jour en continu, et toute la connaissance du cabinet devient une base vivante et interrogeable.",
      },
    },
    {
      num: '03',
      context: "Agence d'architecture haut de gamme · une douzaine de personnes",
      title: 'Agents IA de transmission & de suivi',
      shot: {
        badge: 'Anonymisé',
        title: 'Capture produit — brief généré',
        subtitle: "Brief structuré + échange vocal de l'agent (données fictives).",
      },
      problem:
        "La valeur de l'agence tient à son conseil en rendez-vous, pas à la production de documents. Mais ce qui se disait en rendez-vous se perdait entre les architectes sur le terrain et les chefs de projet. Information diluée, allers-retours évitables, relation client fragilisée.",
      built:
        "Deux agents sur un socle commun. Le premier transforme un rendez-vous en brief structuré pour le chef de projet — il croise transcription et documents, puis interroge l'architecte par vocaux courts. Distinction stricte faits / interprétations, validation humaine obligatoire. Le second génère les points hebdomadaires, côté client et interne.",
      result: {
        metric: '~2 h / jour',
        text: "récupérées (retour de l'agence), surtout pour les associées et les chefs de projet. L'IA élimine la friction, pas l'expertise.",
      },
    },
  ],
}

export const offer = {
  title: 'Comment on travaille ensemble.',
  intro:
    "Trois formats, pensés comme un parcours. On commence petit, je prouve la valeur, et on monte si ça a du sens.",
  packages: [
    {
      step: '01 · Démarrer',
      title: 'Audit & Cadrage IA',
      description:
        "En quelques jours, je diagnostique vos flux, j'identifie les cas d'usage à plus fort retour, et je livre une feuille de route priorisée et chiffrée. À l'issue, vous savez exactement quoi construire — avec ou sans moi.",
      tag: 'Forfait · livrable clair',
    },
    {
      step: '02 · Construire',
      title: 'Sprint Build',
      description:
        "Une fonctionnalité ou un agent IA en production, en deux à trois semaines. Périmètre fixe, prix fixe, démonstration en conditions réelles à la fin. C'est ici que se construit le produit qui tourne vraiment.",
      tag: 'Forfait · résultat livré',
      featured: true,
    },
    {
      step: '03 · Faire vivre',
      title: 'Accompagnement mensuel',
      description:
        "Un volume de jours réservé chaque mois pour itérer, fiabiliser et étendre vos outils IA au rythme de vos besoins. Le format qui inscrit l'IA dans la durée.",
      tag: 'Récurrent · mensuel',
    },
  ],
  flow: ['Le parcours : ', 'Audit', ' → ', 'Sprint', ' → ', 'Accompagnement', ". Vous n'achetez jamais à l'aveugle."],
}

export const about = {
  initials: 'BY',
  name: 'Bastien Youssfi',
  bio: "Développeur freelance spécialisé dans les produits IA en production. Je ne fais pas de démos : je construis des outils qui tournent, intégrés aux vrais flux de mes clients, avec des résultats qu'on peut mesurer. Mon approche tient en une phrase — transformer un problème métier en produit qui marche, vite et proprement.",
  links: [
    { label: 'LinkedIn ↗', href: '#' },
    { label: 'X ↗', href: '#' },
  ],
}

export const finalCta = {
  heading: 'Un problème métier en tête ? Parlons-en.',
  text: "Un appel de 30 minutes, sans engagement. Vous me décrivez votre situation, je vous dis franchement si l'IA peut y apporter quelque chose — et comment.",
  cta: { label: 'Réserver un appel', href: '#' },
}

export const footer = {
  brand: 'bastien youssfi',
  links: [
    { label: 'Cas clients', href: '#cases' },
    { label: 'Offre', href: '#offer' },
    { label: 'LinkedIn', href: '#' },
    { label: 'X', href: '#' },
  ],
}
