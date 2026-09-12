export type SocialLink = {
  label: string
  href: string
  display: string
  description: string
  action: string
}

export type Track = 'ai' | 'frontend' | 'both'

export const trackLabel: Record<Track, string> = {
  ai: 'ML',
  frontend: 'Frontend',
  both: 'Both',
}

export type Project = {
  title: string
  description: string
  technologies: string[]
  status: 'Built' | 'Study' | 'Exploratory'
  featured: boolean
  insight: string
  track: Track
  outcome: string
  outcomeLabel: string
  context: string
  article?: string
  github?: string
  demo?: string
  paper?: string
  visual: 'retrieval' | 'forecast' | 'routing' | 'orchestration'
  image?: string
}

export type GitHubProject = {
  title: string
  description: string
  technologies: string[]
  activity: string
  category: string
  repository: string
  url: string
  demo?: string
  /** Same-origin route (rendered without target="_blank"). */
  local?: boolean
  /** Kept for the interactive CV but omitted from the homepage list because a Selected-work card already covers it. */
  homepageHidden?: boolean
}

export const personal = {
  name: 'Mauricio Berlanga',
  title: 'Senior Software Engineer · Frontend, and lately ML',
  employer: 'Walmart Global Tech',
  location: 'Bentonville, Arkansas, United States',
  email: 'mberlanga91@gmail.com',
  status: 'Walmart Global Tech · Bentonville, AR',
  now: {
    currently: 'Preparation for CS221',
    recentlyShipped: 'onto-ui',
    reading: 'Essential Math for AI from O’Reilly',
    stack: ['LangChain', 'Langfuse', 'Pydantic', 'LangGraph', 'Cloudflare Workers'],
  },
  summary:
    'I started in frontend and still like it. Most of what I have done since follows the same pattern: notice something that could work better, build a version, check whether it did. Over the last couple of years that has pulled me toward applied ML.',
}

export type ProofItem = { track: Track; label: string; value: string; text: string; href: string }

export const proofStrip: ProofItem[] = [
  {
    track: 'ai',
    label: 'ML · Stanford project',
    value: '95.8%',
    text: 'hidden-test pass rate while sending only 17% of tasks to the expensive model',
    href: '/writing/verifier-aware-model-routing/',
  },
  {
    track: 'ai',
    label: 'ML · at Walmart',
    value: '−30–40%',
    text: 'context tokens for an internal coding agent, after adding semantic code retrieval',
    href: '#work',
  },
  {
    track: 'frontend',
    label: 'Frontend · at Walmart',
    value: '1 → many',
    text: 'teams releasing independently on the micro-frontend platform I picked and set up',
    href: '#experience',
  },
  {
    track: 'both',
    label: 'Both · side project',
    value: '3 of 4',
    text: 'World Cup semifinalists in a forecast I froze before the tournament (one sample, not a track record)',
    href: '/writing/world-cup-semifinal-forecast/',
  },
]

export const socialLinks: SocialLink[] = [
  {
    label: 'GitHub',
    href: 'https://github.com/mauber91',
    display: '@mauber91',
    description: 'Code, experiments, and public work.',
    action: 'Browse repositories',
  },
  {
    label: 'LinkedIn',
    // TODO(owner): claim a vanity LinkedIn URL and update href.
    href: 'https://www.linkedin.com/in/mauricio-berlanga-carrillo-58a62334',
    display: 'Mauricio Berlanga',
    description: 'Career history and professional context.',
    action: 'View profile',
  },
  {
    label: 'Email',
    href: `mailto:${personal.email}`,
    display: personal.email,
    description: 'Roles, collaborations, and technical conversations.',
    action: 'Send an email',
  },
  {
    label: 'X',
    href: 'https://x.com/mauriciob91',
    display: '@mauriciob91',
    description: 'Short notes from the work in progress.',
    action: 'Follow along',
  },
]

export type ExperienceItem = {
  company: string
  role: string
  period: string
  description: string
  bullets?: string[]
  tracks?: Track[]
  focus: string[]
}

export const experience: ExperienceItem[] = [
  {
    company: 'Walmart Global Tech',
    role: 'Senior Software Engineer',
    period: 'Jul 2023 – Present',
    description:
      'Frontend architecture for the React/TypeScript apps in Walmart’s Global Sourcing org.',
    bullets: [
      'Picked Nx + Module Federation over the internal framework for OneSource. Teams release on their own schedule now, and later micro-frontend work copied the setup.',
      'Built semantic code retrieval for an internal coding agent: +5–10% on exact-symbol lookups, 30–40% fewer context tokens.',
      'The person other teams ping about hard React bugs. Mentor interns, interview candidates. TODO(owner): add counts.',
    ],
    tracks: ['frontend', 'ai'],
    focus: ['React / TypeScript', 'Nx monorepos', 'Module Federation', 'Webpack / Rspack', 'React Router', 'Jest', 'RAG / Embeddings'],
  },
  {
    company: 'Walmart',
    role: 'Software Engineer III',
    period: 'Oct 2019 – Jul 2023',
    description:
      'Built internal frontend products and became the go-to for awkward React bugs and large refactors.',
    bullets: [
      'Brought multiple React versions and legacy Angular apps together under shared micro-frontend shells.',
      'Integrated frontends with Java/Spring APIs and production delivery workflows (Docker, Nginx).',
    ],
    tracks: ['frontend'],
    focus: ['Angular interoperability', 'Micro-frontends', 'Module Federation', 'Java / Spring APIs', 'Docker / Nginx', 'Internal platforms'],
  },
  {
    company: 'TIBCO / Kwan Tecnología',
    role: 'Frontend Software Engineer',
    period: 'Mar 2017 – Nov 2019',
    description:
      'Angular/TypeScript UI for TIBCO Flogo, a visual builder for event-driven apps and integrations. Mostly reusable components and JSON-driven forms with validation.',
    focus: ['Angular / TypeScript', 'Reusable components', 'JSON forms', 'Node.js / Express', 'AWS S3', 'Karma / Jasmine'],
  },
  {
    company: 'GoBus Rutas / Inovap',
    role: 'Co-founder / Software Developer',
    period: 'Mar 2015 – Feb 2017',
    description:
      'Co-founded a public-transit app with three friends. I built the Ionic/Angular mobile app (maps, crowdsourced live bus locations) and the admin route-monitoring tool. It passed 10,000 registered users.',
    focus: ['Ionic / Angular', 'Google Maps / Leaflet', 'Mobile products', 'Laravel', 'PostgreSQL / MySQL', 'AWS'],
  },
  {
    company: 'Edumatics México',
    role: 'Frontend Developer and SEO Analyst',
    period: 'Dec 2015 – Mar 2016',
    description:
      'Built a responsive site for an education company and did the technical SEO; several local searches reached Google’s first page within three months.',
    focus: ['Frontend development', 'Responsive design', 'Technical SEO'],
  },
]

export const education = [
  {
    institution: 'Stanford University School of Engineering',
    program: 'Graduate Certificate, Artificial Intelligence',
    note: 'Sep 2025 – Apr 2027 · In progress',
    courses: [
      ['CS229', 'Machine Learning'],
      ['CS234', 'Reinforcement Learning'],
      ['CS224R', 'Deep Reinforcement Learning'],
    ],
  },
  {
    institution: 'Universidad Interamericana para el Desarrollo',
    program: 'Bachelor’s Degree, Computer Science',
    note: '2014 – 2017 · Mérida, Yucatán, Mexico',
    courses: [],
  },
]

export const projects: Project[] = [
  {
    title: 'Intelligent Code Search / RAG Pipeline',
    description:
      'Retrieval for an internal coding agent, built after noticing that code lookup was eating most of the context window. Embeddings, semantic search, reranking, and generated file summaries over large codebases.',
    technologies: ['RAG', 'Embeddings', 'Reranking', 'LLMs', 'Semantic Search'],
    status: 'Built',
    featured: true,
    track: 'ai',
    outcome: '+5–10%',
    outcomeLabel: 'exact-symbol lookup accuracy with 30–40% fewer context tokens',
    context: 'Walmart Global Tech',
    insight:
      'Exact-symbol lookups got 5–10% better while context-token usage fell 30–40%. The two had to be tuned together; improving one alone made the other worse.',
    visual: 'retrieval',
  },
  {
    title: 'USD/MXN ML Forecasting Study',
    description:
      'An empirical study of whether macroeconomic and financial variables improve exchange-rate forecasting and directional prediction.',
    technologies: ['ElasticNet', 'SVM', 'XGBoost', 'MLP', 'ARIMAX', 'Kalman Filter'],
    status: 'Study',
    featured: false,
    track: 'ai',
    outcome: 'Baseline wins',
    outcomeLabel: 'a one-lag AR rule kept the best balanced accuracy; nothing I tried beat it reliably',
    context: 'Stanford CS229',
    image: '/articles/usdmxn-card-v2.jpg',
    insight:
      'The simple baseline held. Not the result I wanted, but the evaluation was honest, so it is the result.',
    article: '/writing/usd-mxn-forecasting/',
    github: 'https://github.com/mauber91/USD_MXN_prediction',
    visual: 'forecast',
  },
  {
    title: 'Verifier-Aware Model Routing for Code Generation',
    description:
      'When should you trust a cheap local model’s code and when should you pay for the strong one? A contextual-bandit study that uses executable tests as the verifier.',
    technologies: ['Contextual Bandits', 'LLM Routing', 'LoRA', 'PyTorch', 'EvalPlus'],
    status: 'Study',
    featured: true,
    track: 'ai',
    outcome: '95.8%',
    outcomeLabel: 'pass rate while escalating only 16.9% of tasks to the frontier model',
    context: 'Stanford CS224R',
    image: '/articles/model-routing-card-v2.jpg',
    insight:
      '95.8% hidden-test pass rate while escalating 16.9% of tasks, at 19–23% of the API spend. The uncomfortable finding: a simple verifier rule did most of the work, and the learned router only earned its keep when it beat that rule consistently.',
    article: '/writing/verifier-aware-model-routing/',
    github: 'https://github.com/mauber91/cs224R',
    visual: 'routing',
  },
  {
    title: 'COLMo: Cloud-Orchestrated Local Models',
    description:
      'A cloud model plans and checks; local models on a DGX Spark do the token-heavy reading. The harness measures quality, tokens, cost, latency, retries, escalations, and what information actually crosses the cloud boundary.',
    technologies: ['Local LLMs', 'DGX Spark', 'vLLM', 'Verification', 'Privacy Evaluation'],
    status: 'Exploratory',
    featured: false,
    track: 'ai',
    outcome: 'Work in progress',
    outcomeLabel: 'harness built; includes a control that could prove the whole idea uneconomic',
    context: 'Independent research',
    image: '/articles/colmo-card-v2.jpg',
    insight:
      'I built in a cheap cloud-only control on purpose. If it wins, local workers are not worth the trouble, and I would rather know.',
    article: '/writing/colmo/',
    github: 'https://github.com/mauber91/COLMo',
    visual: 'orchestration',
  },
  {
    title: 'OneSource: choosing Nx + Module Federation over the internal framework',
    description:
      'The decision record for Walmart Global Sourcing’s frontend platform: what we needed, what we looked at, what we left out, and what it has cost to run.',
    technologies: ['React', 'TypeScript', 'Nx', 'Module Federation', 'Webpack / Rspack'],
    status: 'Built',
    featured: true,
    track: 'frontend',
    outcome: 'Independent releases',
    outcomeLabel: 'per team; the setup was copied for later micro-frontend work',
    context: 'Walmart Global Tech',
    insight:
      'The lighter option won because one team could understand the whole thing end to end. That mattered more than features.',
    article: '/writing/onesource-decision-record/',
    visual: 'orchestration',
  },
  {
    title: 'World Cup 2026 forecast: Monte Carlo pipeline + live dashboard',
    description:
      'Team-strength priors, market calibration, and a full-tournament simulator with FIFA tie-break rules, with a React/FastAPI dashboard on top.',
    technologies: ['React', 'TypeScript', 'FastAPI', 'scikit-learn', 'Monte Carlo'],
    status: 'Built',
    featured: true,
    track: 'both',
    outcome: '3 of 4',
    outcomeLabel: 'semifinalists in the forecast I froze before kickoff',
    context: 'Independent',
    insight:
      'The real output is the frozen probability table, not the bracket. And one tournament is one sample; some of this was luck.',
    article: '/writing/world-cup-semifinal-forecast/',
    github: 'https://github.com/mauber91/WC',
    // TODO(owner): add `demo: 'https://...'` if the dashboard is hosted.
    image: '/articles/world-cup-forecast-card-v2.jpg',
    visual: 'forecast',
  },
]

/**
 * Homepage display order for Selected work. The `projects` array order is left
 * stable because the interactive CV addresses projects by index.
 */
export const featuredProjectTitles = [
  'Verifier-Aware Model Routing for Code Generation',
  'Intelligent Code Search / RAG Pipeline',
  'OneSource: choosing Nx + Module Federation over the internal framework',
  'World Cup 2026 forecast: Monte Carlo pipeline + live dashboard',
]

export const featuredProjects: Project[] = featuredProjectTitles.flatMap((title) => {
  const project = projects.find((item) => item.title === title && item.featured)
  return project ? [project] : []
})

/** Rendered first in the homepage "More work" list; kept out of `githubProjects` so the interactive CV does not list itself. */
export const interactiveCvProject: GitHubProject = {
  title: 'The Systems District',
  description:
    'My CV as a small explorable world: seven rooms, a homemade collision engine, sprite animation, and audio that fades in as you walk up to things. Built mostly for fun.',
  technologies: ['React', 'TypeScript', 'DOM rendering', 'Custom collision engine'],
  activity: 'Playable',
  category: 'Interactive experiment',
  repository: 'mauricio-berlanga-portfolio',
  url: '/game/',
  local: true,
}

export const githubProjects: GitHubProject[] = [
  {
    title: 'Cost-Aware Model Routing for Code Generation',
    description:
      'A CS224R research project studying contextual-bandit routing and verifier-aware escalation between local and stronger code models, with reproducible evaluation infrastructure for MBPP and LiveCodeBench.',
    technologies: ['Python', 'PyTorch', 'Transformers', 'Contextual Bandits', 'Model Routing'],
    activity: 'Active',
    category: 'AI research',
    repository: 'cs224R',
    url: 'https://github.com/mauber91/cs224R',
    homepageHidden: true,
  },
  {
    title: 'World Cup Forecast',
    description:
      'A local-first 2026 tournament forecasting and Monte Carlo simulation platform implementing FIFA tie-break rules, live market inputs, automated data refreshes, and typed match-report extraction.',
    technologies: ['React', 'TypeScript', 'FastAPI', 'scikit-learn', 'Monte Carlo'],
    activity: 'Active',
    category: 'Full-stack ML',
    repository: 'WC',
    url: 'https://github.com/mauber91/WC',
    homepageHidden: true,
  },
  {
    title: 'X Bookmarks Reader',
    description:
      'Turns an export of X bookmarks into a categorized, searchable reading queue that lives in local storage.',
    technologies: ['React', 'TypeScript', 'Vite', 'Content Processing', 'Local Storage'],
    activity: 'Active',
    category: 'Product engineering',
    repository: 'bookmarks-viewer',
    url: 'https://github.com/mauber91/bookmarks-viewer',
  },
  {
    title: 'World Cup 2026 Heat Impact Atlas',
    description:
      'A single-page dashboard on heat risk across 2026 World Cup venues and kickoff times.',
    technologies: ['JavaScript', 'Chart.js', 'Data Visualization', 'Responsive UI'],
    activity: 'Published',
    category: 'Data visualization',
    repository: 'worldcup2026-heat-impact-dashboard',
    url: 'https://github.com/mauber91/worldcup2026-heat-impact-dashboard',
  },
  {
    title: 'Football Predictions Leaderboard',
    description:
      'Tracks football prediction rankings: accuracy, points, and leaderboards, on desktop and mobile.',
    technologies: ['React', 'TypeScript', 'Responsive Design', 'Data UI'],
    activity: 'Updated',
    category: 'Frontend product',
    repository: 'leaderboard',
    url: 'https://github.com/mauber91/leaderboard',
    demo: 'https://leaderboard.football',
  },
  {
    title: 'HandFlow / aetherTouch',
    description:
      'Hand gestures (via MediaPipe) driving a 35,000-particle Three.js scene in the browser. Art, not product.',
    technologies: ['Three.js', 'MediaPipe', 'WebGL', 'Gesture Interaction'],
    activity: 'Updated',
    category: 'Creative technology',
    repository: 'aetherTouch',
    url: 'https://github.com/mauber91/aetherTouch',
  },
]

export const skillGroups = [
  {
    title: 'AI / ML systems',
    skills: [
      'PyTorch',
      'Python',
      'RAG & embeddings',
      'Reranking',
      'LLM routing & evaluation',
      'Contextual bandits / RL',
      'vLLM & local inference',
      'Experiment harnesses',
      // TODO(owner): add the vector store and experiment-tracking tool you use, or delete this comment.
    ],
  },
  {
    title: 'Frontend / product',
    skills: [
      'React',
      'TypeScript',
      'Angular',
      'Nx monorepos',
      'Module Federation',
      'Vite / Webpack / Rspack',
      'React Router',
      'Jest / Playwright',
      'Accessibility (WCAG AA)',
      'Performance budgets',
      'Three.js / WebGL',
      'GraphQL / REST',
      'Docker',
    ],
  },
]

export const researchThemes = [
  {
    number: '01',
    title: 'Retrieval & AI systems',
    description:
      'Building and evaluating retrieval pipelines: embeddings, semantic search, reranking, compact model summaries, and the heuristics that connect them.',
    tags: ['RAG', 'ranking', 'evaluation'],
  },
  {
    number: '02',
    title: 'Machine learning',
    description:
      'Supervised learning, regression, classification, neural networks, feature engineering, model evaluation, and the boundaries of generalization.',
    tags: ['modeling', 'generalization', 'failure modes'],
  },
  {
    number: '03',
    title: 'Reinforcement learning',
    description:
      'Graduate-level study of reinforcement learning and deep reinforcement learning, from sequential decision-making to modern policy learning.',
    tags: ['CS234', 'CS224R', 'deep RL'],
  },
  {
    number: '04',
    title: 'Distributed intelligence',
    description:
      'Exploring how cloud reasoning models and smaller local models can cooperate through task delegation, model routing, and hardware-aware execution.',
    tags: ['orchestration', 'local inference', 'agents'],
  },
]
