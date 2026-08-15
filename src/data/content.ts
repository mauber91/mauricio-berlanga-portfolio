export type SocialLink = {
  label: string
  href: string
  display: string
}

export type Project = {
  title: string
  description: string
  technologies: string[]
  status: 'Built' | 'Study' | 'Exploratory'
  featured: boolean
  insight: string
  article?: string
  github?: string
  demo?: string
  paper?: string
  visual: 'retrieval' | 'forecast' | 'routing' | 'orchestration'
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
}

export const personal = {
  name: 'Mauricio Berlanga',
  title: 'Senior Software Engineer · Frontend Platforms & Applied AI',
  employer: 'Walmart Global Tech',
  location: 'Bentonville, Arkansas, United States',
  email: 'mberlanga91@gmail.com',
  summary:
    'Frontend engineering is my foundation. I tend to notice something that could work better, build a version, and measure whether it actually did. Lately that has taken me from product platforms and developer tools into applied AI experiments.',
}

export const socialLinks: SocialLink[] = [
  { label: 'GitHub', href: 'https://github.com/mauber91', display: 'github.com/mauber91' },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/mauricio-berlanga-carrillo-58a62334',
    display: 'linkedin.com/in/mauricio-berlanga-carrillo-58a62334',
  },
  { label: 'Email', href: `mailto:${personal.email}`, display: personal.email },
]

export const experience = [
  {
    company: 'Walmart Global Tech',
    role: 'Senior Software Engineer',
    period: 'Jul 2023 – Present',
    description:
      'Lead frontend architecture for production React/TypeScript applications across Walmart’s Global Sourcing organization. For OneSource, I chose an Nx and Module Federation platform over a heavier internal framework; it let teams release independently and became a shared pattern for later micro-frontend work.',
    focus: [
      'React / TypeScript',
      'Nx monorepos',
      'React Router',
      'Jest',
      'Module Federation',
      'Webpack / Vite',
      'Mentoring',
      'System design',
    ],
  },
  {
    company: 'Walmart',
    role: 'Software Engineer III',
    period: 'Oct 2019 – Jul 2023',
    description:
      'Built internal frontend products and became a cross-team point of contact for difficult React bugs and high-impact refactors. Helped bring multiple React versions and legacy Angular apps together under shared micro-frontend shells, integrated with Java/Spring APIs and production delivery workflows.',
    focus: ['Angular interoperability', 'Micro-frontends', 'Module Federation', 'Java / Spring APIs', 'Docker / Nginx', 'Internal platforms'],
  },
  {
    company: 'TIBCO / Kwan Tecnología',
    role: 'Frontend Software Engineer',
    period: 'Mar 2017 – Nov 2019',
    description:
      'Developed the Angular/TypeScript UI for TIBCO Flogo, an event-driven application builder for microservices, serverless functions, APIs, and connectors; built reusable components and JSON-driven forms with validation.',
    focus: ['Angular / TypeScript', 'Reusable components', 'JSON forms', 'Node.js / Express', 'AWS S3', 'Karma / Jasmine'],
  },
  {
    company: 'GoBus Rutas / Inovap',
    role: 'Co-founder / Software Developer',
    period: 'Mar 2015 – Feb 2017',
    description:
      'Co-founded a public-transit startup with three friends and led Ionic/Angular mobile development with Google Maps/Leaflet, crowdsourced live-bus locations, and an admin route-monitoring tool that grew past 10,000 registered users.',
    focus: ['Ionic / Angular', 'Google Maps / Leaflet', 'Mobile products', 'Laravel', 'PostgreSQL / MySQL', 'AWS'],
  },
  {
    company: 'Edumatics México',
    role: 'Frontend Developer and SEO Analyst',
    period: 'Dec 2015 – Mar 2016',
    description:
      'Developed a responsive website for an education platform and applied technical SEO that brought multiple relevant local searches onto Google’s first page in under three months.',
    focus: ['Frontend development', 'Responsive design', 'Technical SEO', 'Scrum', 'Kanban'],
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
      'An internal retrieval system for a coding agent, built after noticing that code lookup was consuming too much context. It combines embeddings, semantic search, reranking, and generated file summaries for large codebases.',
    technologies: ['RAG', 'Embeddings', 'Reranking', 'LLMs', 'Semantic Search'],
    status: 'Built',
    featured: true,
    insight:
      'Exact-symbol lookup accuracy improved by 5–10% while context-token usage fell 30–40%, showing that retrieval quality and context cost have to be tuned together.',
    visual: 'retrieval',
  },
  {
    title: 'USD/MXN ML Forecasting Study',
    description:
      'An empirical study of whether macroeconomic and financial variables improve exchange-rate forecasting and directional prediction.',
    technologies: ['ElasticNet', 'SVM', 'XGBoost', 'MLP', 'ARIMAX', 'Kalman Filter'],
    status: 'Study',
    featured: true,
    insight:
      'Simple baselines remained difficult to beat—a useful result that reinforced rigorous evaluation in noisy financial time series.',
    article: '/writing/usd-mxn-forecasting/',
    github: 'https://github.com/mauber91/USD_MXN_prediction',
    visual: 'forecast',
  },
  {
    title: 'Verifier-Aware Model Routing for Code Generation',
    description:
      'A cost-sensitive contextual-bandit study of when to keep a local model’s code and when to escalate to a stronger API model, using executable test feedback as a verifier.',
    technologies: ['Contextual Bandits', 'LLM Routing', 'LoRA', 'PyTorch', 'EvalPlus'],
    status: 'Study',
    featured: true,
    insight:
      'The verifier-aware policy reached a 95.8% hidden-test pass rate while escalating 16.9% of tasks. On held-out benchmarks it used 19–23% of normalized API spend with no detected quality loss; learned routing only mattered when it could beat that simple rule consistently.',
    article: '/writing/verifier-aware-model-routing/',
    github: 'https://github.com/mauber91/cs224R',
    visual: 'routing',
  },
  {
    title: 'COLMo: Cloud-Orchestrated Local Models',
    description:
      'An experimental system where a frontier cloud model plans and verifies while locally hosted models handle token-heavy document and code work. Its evaluation harness measures quality, tokens, cost, latency, retries, escalation, and information crossing the cloud boundary.',
    technologies: ['Local LLMs', 'DGX Spark', 'vLLM', 'Verification', 'Privacy Evaluation'],
    status: 'Exploratory',
    featured: true,
    insight:
      'The study measures the real boundary between cost, quality, and privacy—including a cloud-mini control that can falsify the economic case for local workers.',
    article: '/writing/colmo/',
    github: 'https://github.com/mauber91/COLMo',
    visual: 'orchestration',
  },
]

export const githubProjects: GitHubProject[] = [
  {
    title: 'Cost-Aware Model Routing for Code Generation',
    description:
      'A CS224R research project studying contextual-bandit routing and verifier-aware escalation between local and stronger code models, with reproducible evaluation infrastructure for MBPP and LiveCodeBench.',
    technologies: ['Python', 'PyTorch', 'Transformers', 'Contextual Bandits', 'Model Routing'],
    activity: 'Active · Jul 2026',
    category: 'AI research',
    repository: 'cs224R',
    url: 'https://github.com/mauber91/cs224R',
  },
  {
    title: 'World Cup Forecast',
    description:
      'A local-first 2026 tournament forecasting and Monte Carlo simulation platform implementing FIFA tie-break rules, live market inputs, automated data refreshes, and typed match-report extraction.',
    technologies: ['React', 'TypeScript', 'FastAPI', 'scikit-learn', 'Monte Carlo'],
    activity: 'Active · Jun 2026',
    category: 'Full-stack ML',
    repository: 'WC',
    url: 'https://github.com/mauber91/WC',
  },
  {
    title: 'X Bookmarks Reader',
    description:
      'A focused reading workflow that organizes exported X bookmarks into searchable categories, surfaces article insights, prioritizes a reading queue, and tracks completion locally.',
    technologies: ['React', 'TypeScript', 'Vite', 'Content Processing', 'Local Storage'],
    activity: 'Active · Jul 2026',
    category: 'Product engineering',
    repository: 'bookmarks-viewer',
    url: 'https://github.com/mauber91/bookmarks-viewer',
  },
  {
    title: 'World Cup 2026 Heat Impact Atlas',
    description:
      'A self-contained data dashboard exploring heat impact across tournament venues and match schedules through comparative metrics, reference definitions, and embedded charts.',
    technologies: ['JavaScript', 'Chart.js', 'Data Visualization', 'Responsive UI'],
    activity: 'Published · Jun 2026',
    category: 'Data visualization',
    repository: 'worldcup2026-heat-impact-dashboard',
    url: 'https://github.com/mauber91/worldcup2026-heat-impact-dashboard',
  },
  {
    title: 'Football Predictions Leaderboard',
    description:
      'A responsive React application for tracking football prediction rankings, accuracy, points, and aggregate leaderboard statistics across desktop and mobile.',
    technologies: ['React', 'TypeScript', 'Responsive Design', 'Data UI'],
    activity: 'Updated · Jan 2026',
    category: 'Frontend product',
    repository: 'leaderboard',
    url: 'https://github.com/mauber91/leaderboard',
    demo: 'https://leaderboard.football',
  },
  {
    title: 'HandFlow / aetherTouch',
    description:
      'An interactive browser art experiment that maps real-time hand gestures to a 35,000-particle Three.js environment through MediaPipe hand tracking.',
    technologies: ['Three.js', 'MediaPipe', 'WebGL', 'Gesture Interaction'],
    activity: 'Updated · Aug 2025',
    category: 'Creative technology',
    repository: 'aetherTouch',
    url: 'https://github.com/mauber91/aetherTouch',
  },
]

export const skillGroups = [
  { title: 'AI / ML', skills: ['PyTorch', 'ML fundamentals', 'Embeddings', 'RAG', 'Reranking', 'LLM systems', 'Reinforcement learning'] },
  { title: 'Frontend Systems', skills: ['React', 'TypeScript', 'Angular', 'Nx', 'React Router', 'Module Federation', 'Vite', 'Webpack', 'Rspack'] },
  { title: 'Frontend Product Craft', skills: ['Responsive UI', 'Reusable components', 'Jest', 'Playwright', 'Technical SEO', 'API integration', 'Three.js / WebGL'] },
  { title: 'Software Engineering', skills: ['JavaScript', 'Python', 'Java / Spring', 'Node.js / Express'] },
  { title: 'APIs & Infrastructure', skills: ['GraphQL', 'Apollo', 'REST', 'Docker'] },
  { title: 'AI Infrastructure', skills: ['Local LLMs', 'GPU inference', 'Model evaluation', 'Experimentation'] },
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
