export type ArticleMeta = {
  slug: 'usd-mxn-forecasting' | 'verifier-aware-model-routing' | 'colmo' | 'world-cup-semifinal-forecast' | 'onesource-decision-record'
  path: string
  course: string
  projectType?: string
  title: string
  description: string
  readTime: string
  tags: string[]
  repository?: string
  /** PDF under /public/papers or an external URL. */
  paper?: string
  notebook?: string
  tldr?: { problem: string; method: string; result: string; caveat: string }
  leadImage?: string
  leadImageAlt?: string
  leadImageWidth?: number
  leadImageHeight?: number
  disclosure?: string
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
    tldr: {
      problem: 'Do U.S. financial conditions add directional signal for monthly USD/MXN moves?',
      method: 'Linear models, tree ensembles, an MLP, ARIMAX and a Kalman filter versus autoregressive baselines, with walk-forward evaluation.',
      result: 'XGBoost had the highest raw accuracy (0.600); a one-lag AR rule kept the best balanced accuracy.',
      caveat: 'No robust directional winner; the negative result is the finding.',
    },
    leadImage: '/articles/usdmxn-social.png',
    leadImageAlt:
      'Illustration blending the United States and Mexico, currency imagery, forecasting curves, and machine-learning diagrams',
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
    tldr: {
      problem: 'Route each coding task to a local or frontier model without knowing hidden-test outcomes.',
      method: 'Contextual bandit with a cost-aware reward; a visible-test verifier as the escalation trigger; leakage-safe splits.',
      result: '95.8% hidden-test pass rate while escalating 16.9% of tasks; 19–23% of normalized API spend on held-out benchmarks.',
      caveat: 'Learned routing only beat the simple verifier rule when it did so consistently; REINFORCE variants did not.',
    },
    repository: 'https://github.com/mauber91/cs224R',
    leadImage: '/articles/model-routing-social.png',
    leadImageAlt:
      'A small local model routes a stream of work toward a brighter, more powerful model through a branching decision path',
  },
  {
    slug: 'colmo',
    path: '/writing/colmo/',
    course: 'Independent research · Local / cloud AI systems',
    projectType: 'Research project',
    title: 'Cloud thinks, local reads: building COLMo',
    description:
      'A work-in-progress study of whether a frontier cloud supervisor can delegate token-heavy reading to local models—reducing API cost and document exposure without giving up answer quality.',
    readTime: '12 min read',
    tags: ['LLM systems', 'Local inference', 'Verification', 'Privacy evaluation'],
    tldr: {
      problem: 'Can a frontier cloud model supervise while local models do token-heavy reading, without losing answer quality?',
      method: 'Shared harness over 7 systems and 150 frozen QASPER examples measuring quality, tokens, cost, latency, retries, escalation and canary leakage.',
      result: 'Work in progress; the harness and a cloud-mini control are built, results not yet frozen.',
      caveat: 'The cloud-mini control exists specifically to falsify the economic case for local workers.',
    },
    repository: 'https://github.com/mauber91/COLMo',
    leadImage: '/articles/colmo-social.png',
    leadImageAlt:
      'A cloud intelligence coordinating a network of local computers through luminous information paths',
  },
  {
    slug: 'world-cup-semifinal-forecast',
    path: '/writing/world-cup-semifinal-forecast/',
    course: 'Independent project · Probabilistic forecasting',
    projectType: 'Research project',
    title: 'How a probabilistic model found 3 of 4 World Cup semifinalists',
    description:
      'A methodology-first account of combining team-strength priors, expected goals, market calibration, and full-tournament Monte Carlo simulation to forecast the 2026 World Cup bracket.',
    readTime: '13 min read',
    tags: ['Monte Carlo', 'Probabilistic modeling', 'Elo ratings', 'Calibration'],
    tldr: {
      problem: 'Forecast the 2026 World Cup bracket as probabilities, not picks.',
      method: 'Team-strength priors, expected goals, market calibration, and 10k–1M full-tournament Monte Carlo trials with FIFA tie-break rules.',
      result: 'Three of four eventual semifinalists were in the frozen projection.',
      caveat: 'One tournament is one sample; 3 of 4 is not a 75% accuracy claim.',
    },
    repository: 'https://github.com/mauber91/WC',
    leadImage: '/articles/world-cup-forecast-social.png',
    leadImageAlt:
      'Thousands of faint tournament paths converge into four semifinal nodes, three highlighted in green and one in amber',
    disclosure:
      'This article was generated with AI from the WC source code, model documentation, and frozen simulation metadata. The repository remains the authoritative source for the implemented formulas, rules, and experiment details.',
  },
  {
    slug: 'onesource-decision-record',
    path: '/writing/onesource-decision-record/',
    course: 'Walmart Global Tech · Frontend platform',
    projectType: 'Architecture decision record',
    title: 'Choosing Nx and Module Federation over the internal framework',
    description:
      'An architecture decision record for the OneSource frontend platform: the constraints, the options on the table, what was deliberately left out, and what it cost to run.',
    readTime: '8 min read',
    tags: ['Micro-frontends', 'Nx', 'Module Federation', 'Architecture'],
    tldr: {
      problem: 'Multiple sourcing teams needed to ship React apps independently inside one product shell.',
      method: 'Compared the heavier internal framework against an Nx monorepo with Module Federation on independent deploys, build time, onboarding, and operational cost.',
      result: 'Nx + Module Federation was adopted; teams release independently and the pattern was reused for later micro-frontend work.',
      caveat: 'TODO(owner): one sentence on the real tradeoff you accepted (for example shared-dependency versioning or runtime coupling).',
    },
    disclosure: 'Written by me from project notes; no confidential system details are included.',
  },
]

export function getArticleByPath(pathname: string) {
  const normalized = pathname.endsWith('/') ? pathname : `${pathname}/`
  return articles.find((article) => article.path === normalized)
}
