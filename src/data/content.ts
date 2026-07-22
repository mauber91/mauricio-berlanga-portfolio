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
  github?: string
  demo?: string
  paper?: string
  visual: 'retrieval' | 'forecast' | 'orchestration'
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
  { label: 'GitHub', href: '#contact', display: 'github.com/username', placeholder: true },
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
    visual: 'forecast',
  },
  {
    title: 'Cloud-Orchestrated Local AI Systems',
    description:
      'An exploratory architecture where a powerful cloud model orchestrates work and delegates suitable tasks to smaller, hardware-aware local models.',
    technologies: ['Model Routing', 'Local LLMs', 'Agents', 'Inference', 'Orchestration'],
    status: 'Exploratory',
    featured: true,
    insight:
      'Investigating tradeoffs across inference cost, privacy, cloud-token consumption, latency, and device capability.',
    visual: 'orchestration',
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

export const writing = [
  { title: 'Measuring What a Retrieval Pipeline Actually Improves', topic: 'RAG & retrieval', status: 'Coming soon' },
  { title: 'Notes on Cloud-Orchestrated Local Models', topic: 'Local AI', status: 'Coming soon' },
  { title: 'When the Baseline Wins', topic: 'Machine learning', status: 'Coming soon' },
]
