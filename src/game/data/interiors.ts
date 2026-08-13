import type { BuildingId, Point } from './world'
import type { ArticleMeta } from '../../data/articles'
import type { PersonalInterestId } from './interests'

export type InteriorContactPanel = 'email' | 'focus' | 'skills' | 'links' | 'brief'

export type InteriorCaseFileRef =
  | { kind: 'career'; experienceIndexes: number[]; skillGroupTitles?: string[] }
  | { kind: 'education'; educationIndex: number; courseCodes?: string[] }
  | { kind: 'research'; researchThemeIndexes: number[]; courseCodes?: string[]; skillGroupTitles?: string[] }
  | { kind: 'project'; projectIndex: number }
  | { kind: 'article'; slug: ArticleMeta['slug'] }
  | { kind: 'article-index' }
  | { kind: 'github-project'; repository: string }
  | { kind: 'github-index' }
  | { kind: 'contact'; panel: InteriorContactPanel }
  | { kind: 'interest'; interestId: PersonalInterestId }

export type InteriorExhibitKey = `${BuildingId}:${string}`

export type InteriorExhibit = {
  id: string
  index: string
  eyebrow: string
  title: string
  summary: string
  cta: string
  caseFile: InteriorCaseFileRef
  position: Point
}

export type InteriorScene = {
  image: string
  exhibits: InteriorExhibit[]
}

export const interiorScenes: Record<BuildingId, InteriorScene> = {
  foundry: {
    image: '/game/interiors/foundry.webp',
    exhibits: [
      {
        id: 'craft', index: '01', eyebrow: 'Career timeline', title: 'From product builder to architecture lead',
        summary: 'Across 9+ years, Mauricio moved from co-founding a transit product to leading frontend architecture—shipping mobile products, reusable UI systems, micro-frontends, and production React platforms.',
        cta: 'Trace the engineering path', caseFile: { kind: 'career', experienceIndexes: [0, 1, 2, 3, 4] }, position: { x: 25, y: 25 },
      },
      {
        id: 'platform', index: '02', eyebrow: 'Architecture bay', title: 'Frontend platforms at scale',
        summary: 'At Walmart, Mauricio brought multiple React versions and legacy Angular into shared micro-frontend shells; today he leads React/TypeScript foundations with Nx, routing, testing, and Module Federation across Webpack and Vite.',
        cta: 'Inspect platform decisions', caseFile: { kind: 'career', experienceIndexes: [0, 1], skillGroupTitles: ['Frontend Systems', 'APIs & Infrastructure'] }, position: { x: 73, y: 23 },
      },
      {
        id: 'archive', index: '03', eyebrow: 'Schema workshop', title: 'Reusable UI for complex tools',
        summary: 'For TIBCO Flogo, Mauricio built Angular/TypeScript components and validated, JSON-driven forms for configuring microservices, serverless functions, APIs, and connectors.',
        cta: 'Examine component work', caseFile: { kind: 'career', experienceIndexes: [2], skillGroupTitles: ['Frontend Product Craft'] }, position: { x: 23, y: 66 },
      },
      {
        id: 'quality', index: '04', eyebrow: 'Team practice', title: 'Engineering beyond implementation',
        summary: 'System design, Jest, Playwright, reusable components, and mentoring show how Mauricio turns individual delivery into shared patterns that teams can test, explain, and extend.',
        cta: 'Review technical leadership', caseFile: { kind: 'career', experienceIndexes: [0], skillGroupTitles: ['Frontend Product Craft'] }, position: { x: 76, y: 67 },
      },
    ],
  },
  observatory: {
    image: '/game/interiors/observatory.webp',
    exhibits: [
      {
        id: 'optics', index: '01', eyebrow: 'Modeling compass', title: 'Model judgment before novelty',
        summary: 'Mauricio’s machine-learning foundation spans supervised learning, feature design, neural networks, and evaluation, with equal attention to generalization limits and failure modes.',
        cta: 'Review ML foundations', caseFile: { kind: 'research', researchThemeIndexes: [1], skillGroupTitles: ['AI / ML'] }, position: { x: 18, y: 44 },
      },
      {
        id: 'orrery', index: '02', eyebrow: 'Course trajectory', title: 'Graduate AI work in progress',
        summary: 'An in-progress Stanford certificate connects CS229, CS234, and CS224R: machine learning foundations followed by reinforcement learning and deep reinforcement learning.',
        cta: 'Review the course sequence', caseFile: { kind: 'education', educationIndex: 0, courseCodes: ['CS229', 'CS234', 'CS224R'] }, position: { x: 50, y: 25 },
      },
      {
        id: 'archive', index: '03', eyebrow: 'Systems telescope', title: 'Retrieval to orchestration',
        summary: 'Mauricio studies how context is found, ranked, and delegated—from embedding and reranking pipelines to model routing and hardware-aware local/cloud execution.',
        cta: 'Connect the research themes', caseFile: { kind: 'research', researchThemeIndexes: [0, 3], skillGroupTitles: ['AI Infrastructure'] }, position: { x: 78, y: 43 },
      },
      {
        id: 'constellation', index: '04', eyebrow: 'Decision lab', title: 'Sequential decisions to deep RL',
        summary: 'CS234 and CS224R build from sequential decision-making toward modern policy learning, giving Mauricio a rigorous basis for evaluating when reinforcement learning actually helps.',
        cta: 'Follow the RL path', caseFile: { kind: 'research', researchThemeIndexes: [2], courseCodes: ['CS234', 'CS224R'] }, position: { x: 76, y: 70 },
      },
    ],
  },
  lab: {
    image: '/game/interiors/lab.webp',
    exhibits: [
      {
        id: 'retrieval', index: '01', eyebrow: 'Retrieval pipeline', title: 'Ranking codebase context',
        summary: 'Embeddings and semantic search establish candidate context; reranking, score boosts, weight tuning, and comparative evaluation refine which files reach a developer.',
        cta: 'Inspect retrieval decisions', caseFile: { kind: 'project', projectIndex: 0 }, position: { x: 17, y: 28 },
      },
      {
        id: 'core', index: '02', eyebrow: 'Baseline chamber', title: 'When the baseline wins',
        summary: 'A USD/MXN study found no robust directional winner: more sophisticated models struggled against simple autoregressive rules, making the negative result—and its evaluation limits—the useful finding.',
        cta: 'Examine the evidence', caseFile: { kind: 'project', projectIndex: 1 }, position: { x: 50, y: 23 },
      },
      {
        id: 'routing', index: '03', eyebrow: 'Cost–quality bench', title: 'Routing with executable feedback',
        summary: 'Tests gate local code before escalation to a stronger API model. The cheap-then-escalate policy reached strong hidden-test performance at a fraction of full API cost; calibration still mattered.',
        cta: 'Inspect the routing study', caseFile: { kind: 'project', projectIndex: 2 }, position: { x: 81, y: 31 },
      },
      {
        id: 'evaluation', index: '04', eyebrow: 'Falsification rig', title: 'Testing the local/cloud boundary',
        summary: 'COLMo asks whether a cloud supervisor should plan and verify while local models read private documents—and includes a cloud-mini control that can falsify the economic case.',
        cta: 'Review open hypotheses', caseFile: { kind: 'project', projectIndex: 3 }, position: { x: 24, y: 70 },
      },
    ],
  },
  archive: {
    image: '/game/interiors/archive.webp',
    exhibits: [
      {
        id: 'methods', index: '01', eyebrow: 'Evaluation record', title: 'What the winning baseline taught',
        summary: 'The field note explains why raw and balanced accuracy disagreed, separates final evidence from exploratory runs, and keeps the negative forecasting result visible.',
        cta: 'Read methods and limits', caseFile: { kind: 'article', slug: 'usd-mxn-forecasting' }, position: { x: 17, y: 31 },
      },
      {
        id: 'desk', index: '02', eyebrow: 'Routing notebook', title: 'Visible tests, hidden truth',
        summary: 'This write-up separates test feedback used to route code from hidden tests used to judge it, then maps the pass-rate–cost frontier and remaining limitations.',
        cta: 'Read the routing evidence', caseFile: { kind: 'article', slug: 'verifier-aware-model-routing' }, position: { x: 50, y: 22 },
      },
      {
        id: 'evidence', index: '03', eyebrow: 'Protocol draft', title: 'A falsifiable orchestration study',
        summary: 'Before claiming local models win, COLMo defines cloud-only and cloud-mini controls, a verification ablation, and separate cost, quality, and privacy measures.',
        cta: 'Review the study design', caseFile: { kind: 'article', slug: 'colmo' }, position: { x: 72, y: 32 },
      },
      {
        id: 'index', index: '04', eyebrow: 'Technical index', title: 'Field notes with caveats intact',
        summary: 'Three technical notes show how Mauricio frames a question, builds a comparison, and reports negative or still-open results without smoothing away uncertainty.',
        cta: 'Browse the evidence', caseFile: { kind: 'article-index' }, position: { x: 78, y: 68 },
      },
    ],
  },
  station: {
    image: '/game/interiors/station.webp',
    exhibits: [
      {
        id: 'origin', index: '01', eyebrow: 'Founder record', title: 'Shipping through real-world uncertainty',
        summary: 'Mauricio co-founded GoBus and led the mobile product: maps, crowdsourced live-bus locations, and route-monitoring tools that grew beyond 10,000 registered users.',
        cta: 'Review product ownership', caseFile: { kind: 'career', experienceIndexes: [3] }, position: { x: 22, y: 24 },
      },
      {
        id: 'core', index: '02', eyebrow: 'Local-first product', title: 'Turning saved links into a workflow',
        summary: 'X Bookmarks Reader organizes exports into search, categories, a prioritized reading queue, article insights, and local completion tracking—a compact example of product-focused frontend work.',
        cta: 'Inspect the product choices', caseFile: { kind: 'github-project', repository: 'bookmarks-viewer' }, position: { x: 73, y: 24 },
      },
      {
        id: 'blueprint', index: '03', eyebrow: 'Interaction prototype', title: 'Gesture as an interface',
        summary: 'HandFlow maps MediaPipe hand tracking into a 35,000-particle Three.js environment, exploring browser interaction beyond conventional forms and controls.',
        cta: 'Inspect the interaction', caseFile: { kind: 'github-project', repository: 'aetherTouch' }, position: { x: 20, y: 51 },
      },
      {
        id: 'toolwall', index: '04', eyebrow: 'Public workbench', title: 'Source you can inspect',
        summary: 'Public repositories span AI research, full-stack ML, data visualization, frontend products, and creative technology—with implementations available beyond the portfolio summary.',
        cta: 'Review public repositories', caseFile: { kind: 'github-index' }, position: { x: 77, y: 50 },
      },
      {
        id: 'assembly', index: '05', eyebrow: 'Full-stack build', title: 'Forecasting as a product system',
        summary: 'World Cup Forecast combines a React/TypeScript client with FastAPI, scikit-learn, Monte Carlo simulation, FIFA tie-break rules, live inputs, and automated refreshes.',
        cta: 'Inspect the full stack', caseFile: { kind: 'github-project', repository: 'WC' }, position: { x: 75, y: 72 },
      },
    ],
  },
  signal: {
    image: '/game/interiors/signal.webp',
    exhibits: [
      {
        id: 'recording', index: '01', eyebrow: 'Direct contact', title: 'Open an engineering conversation',
        summary: 'Email Mauricio about senior frontend platforms, production web products, applied AI systems, or research engineering—and include the problem that makes the conversation worth having.',
        cta: 'Start an email', caseFile: { kind: 'contact', panel: 'email' }, position: { x: 18, y: 29 },
      },
      {
        id: 'console', index: '02', eyebrow: 'Current trajectory', title: 'Where Mauricio contributes now',
        summary: 'A senior engineer leading React/TypeScript frontend architecture while extending graduate AI work into retrieval, evaluation, model routing, and local/cloud systems.',
        cta: 'Review current focus', caseFile: { kind: 'contact', panel: 'focus' }, position: { x: 50, y: 25 },
      },
      {
        id: 'scope', index: '03', eyebrow: 'Role alignment', title: 'Best-fit technical scope',
        summary: 'The strongest fit sits where frontend systems and product craft meet applied ML or AI infrastructure; the evidence behind each area is available across the district.',
        cta: 'Map skills to the role', caseFile: { kind: 'contact', panel: 'skills' }, position: { x: 79, y: 31 },
      },
      {
        id: 'network', index: '04', eyebrow: 'Evidence channels', title: 'Choose the right trail',
        summary: 'Use LinkedIn for career context, GitHub for implementation evidence, or email for a direct conversation about team and technical fit.',
        cta: 'Open verified links', caseFile: { kind: 'contact', panel: 'links' }, position: { x: 19, y: 67 },
      },
      {
        id: 'lounge', index: '05', eyebrow: 'Conversation brief', title: 'Send context, not ceremony',
        summary: 'A useful first note names the problem, the constraints, and the outcome the team needs—enough context to start with substance.',
        cta: 'Prepare a concise brief', caseFile: { kind: 'contact', panel: 'brief' }, position: { x: 79, y: 68 },
      },
    ],
  },
  conservatory: {
    image: '/game/interiors/conservatory.webp',
    exhibits: [
      {
        id: 'tame-impala', index: '01', eyebrow: 'Production study', title: 'Tame Impala · layered worlds',
        summary: 'A reference point for patient iteration: textures accumulate, repetition evolves, and meticulous studio choices make complexity feel cohesive.',
        cta: 'Study the layered production', caseFile: { kind: 'interest', interestId: 'tame-impala' }, position: { x: 20, y: 30 },
      },
      {
        id: 'fred-again', index: '02', eyebrow: 'Live loop study', title: 'Fred again.. · human loops',
        summary: 'Everyday fragments become immediate, communal music through sampling and live arrangement—technology stays visible without displacing the feeling.',
        cta: 'Study the live loop', caseFile: { kind: 'interest', interestId: 'fred-again' }, position: { x: 80, y: 30 },
      },
      {
        id: 'nature-beach', index: '03', eyebrow: 'Restorative practice', title: 'Nature, water & perspective',
        summary: 'Time near the coast and outdoors creates distance from the screen—the kind of reset that lets ideas settle before the next decision.',
        cta: 'Step into the outdoor note', caseFile: { kind: 'interest', interestId: 'nature-beach' }, position: { x: 50, y: 20 },
      },
      {
        id: 'visual-art', index: '04', eyebrow: 'Visual language', title: 'Art, atmosphere & attention',
        summary: 'Color and composition can establish pace, hierarchy, and emotion before a word is read; looking closely sharpens how Mauricio experiences both art and interfaces.',
        cta: 'Explore the visual note', caseFile: { kind: 'interest', interestId: 'visual-art' }, position: { x: 22, y: 68 },
      },
      {
        id: 'videogames', index: '05', eyebrow: 'Interactive systems', title: 'Videogames as designed worlds',
        summary: 'Rules, feedback, movement, sound, and environmental storytelling converge in games—systems become something a player can understand by exploring.',
        cta: 'Explore the game-design note', caseFile: { kind: 'interest', interestId: 'videogames' }, position: { x: 78, y: 68 },
      },
    ],
  },
}

export function getInteriorExhibitKey(buildingId: BuildingId, exhibitId: string): InteriorExhibitKey {
  return `${buildingId}:${exhibitId}`
}
