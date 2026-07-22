export type SocialLink = {
  label: string
  href: string
  display: string
  placeholder?: boolean
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
  visual: 'retrieval' | 'forecast' | 'orchestration'
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
  title: 'Senior Software Engineer · AI / ML Engineer',
  employer: 'Walmart Global Tech',
  location: 'Location · add city',
  email: 'your.email@example.com',
  resumePath: '/resume/mauricio-berlanga-resume.pdf',
  resumeAvailable: false,
  summary:
    'I build production software and intelligent systems, combining eight years of software engineering with graduate-level work in machine learning, reinforcement learning, and modern AI systems.',
}

export const socialLinks: SocialLink[] = [
  { label: 'GitHub', href: 'https://github.com/mauber91', display: 'github.com/mauber91' },
  { label: 'LinkedIn', href: '#contact', display: 'linkedin.com/in/username', placeholder: true },
  { label: 'Email', href: `mailto:${personal.email}`, display: personal.email, placeholder: true },
]

export const experience = [
  {
    company: 'Walmart Global Tech',
    role: 'Senior Software Engineer',
    period: '≈5 years · exact dates to add',
    description:
      'Engineering large-scale frontend and enterprise systems, with a focus on architecture, maintainability, API integration, and production reliability.',
    focus: [
      'React architecture',
      'Modular frontends',
      'Nx monorepos',
      'System design',
      'Cross-team engineering',
      'Production reliability',
    ],
    placeholder: true,
  },
  {
    company: 'Previous engineering experience',
    role: 'Software Engineer',
    period: '≈3 years · company and dates to add',
    description:
      'Earlier software engineering work contributing to approximately eight years of total professional experience.',
    focus: ['Frontend systems', 'Web applications', 'API integration'],
    placeholder: true,
  },
]

export const education = [
  {
    institution: 'Stanford University',
    program: 'Graduate-level Artificial Intelligence / Machine Learning coursework',
    note: 'Advanced coursework — not presented as a master’s degree',
    courses: [
      ['CS229', 'Machine Learning'],
      ['CS234', 'Reinforcement Learning'],
      ['CS224R', 'Deep Reinforcement Learning'],
    ],
  },
  {
    institution: 'University name · add institution',
    program: 'Bachelor’s / undergraduate degree in Information Systems Engineering',
    note: 'Mexico · dates to add',
    courses: [],
    placeholder: true,
  },
]

export const projects: Project[] = [
  {
    title: 'Intelligent Code Search / RAG Pipeline',
    description:
      'A retrieval system for navigating and understanding large codebases using embeddings, semantic search, reranking, and LLM-generated file summaries.',
    technologies: ['RAG', 'Embeddings', 'Reranking', 'LLMs', 'Semantic Search'],
    status: 'Built',
    featured: true,
    insight:
      'Iterated on retrieval quality through ranking heuristics, reranker score boosting, weight tuning, and comparative evaluation.',
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
      'A cost-sensitive contextual-bandit study of when to keep a local model’s code and when to escalate to a stronger API model using executable test feedback.',
    technologies: ['Contextual Bandits', 'LLM Routing', 'LoRA', 'PyTorch', 'EvalPlus'],
    status: 'Study',
    featured: true,
    insight:
      'A verifier-aware cheap-then-escalate policy reached strong hidden-test performance at a fraction of full API cost; the learned router was competitive, but calibration and random seeds still mattered.',
    article: '/writing/verifier-aware-model-routing/',
    github: 'https://github.com/mauber91/cs224R',
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
  { title: 'Software Engineering', skills: ['TypeScript', 'JavaScript', 'Python'] },
  { title: 'Frontend Systems', skills: ['React', 'Nx', 'Vite', 'Webpack', 'Rspack', 'Module Federation'] },
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
