export type ArticleMeta = {
  slug: 'usd-mxn-forecasting' | 'verifier-aware-model-routing'
  path: string
  course: string
  title: string
  description: string
  readTime: string
  tags: string[]
  repository?: string
}

export const articles: ArticleMeta[] = [
  {
    slug: 'usd-mxn-forecasting',
    path: '/writing/usd-mxn-forecasting/',
    course: 'Stanford CS229 · Machine Learning',
    title: 'When the baseline wins: lessons from forecasting USD/MXN',
    description:
      'A technical account of testing linear models, tree ensembles, and a neural network against simple autoregressive baselines on monthly exchange-rate data—and why the negative result mattered.',
    readTime: '11 min read',
    tags: ['Time series', 'Model evaluation', 'XGBoost', 'Negative results'],
  },
  {
    slug: 'verifier-aware-model-routing',
    path: '/writing/verifier-aware-model-routing/',
    course: 'Stanford CS224R · Deep Reinforcement Learning',
    title: 'Routing code generation with verifiers',
    description:
      'A cost-sensitive contextual-bandit study of when to keep a local model’s code and when to escalate to a stronger API model—with executable tests as the routing signal.',
    readTime: '14 min read',
    tags: ['Contextual bandits', 'LLM routing', 'LoRA', 'Evaluation'],
    repository: 'https://github.com/mauber91/cs224R',
  },
]

export function getArticleByPath(pathname: string) {
  const normalized = pathname.endsWith('/') ? pathname : `${pathname}/`
  return articles.find((article) => article.path === normalized)
}
