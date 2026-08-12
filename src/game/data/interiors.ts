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
        id: 'craft', index: '01', eyebrow: 'Fabrication bench', title: 'Product engineering',
        summary: 'Nine-plus years turning ambiguous product problems into dependable interfaces, platforms, and shared systems.',
        cta: 'View career timeline', caseFile: { kind: 'career', experienceIndexes: [0, 1, 2, 3, 4] }, position: { x: 25, y: 25 },
      },
      {
        id: 'platform', index: '02', eyebrow: 'Systems core', title: 'Platform architecture',
        summary: 'React, TypeScript, Nx, Module Federation, tooling, APIs, and release foundations designed for production teams.',
        cta: 'Explore platform work', caseFile: { kind: 'career', experienceIndexes: [0, 1], skillGroupTitles: ['Frontend Systems', 'APIs & Infrastructure'] }, position: { x: 73, y: 23 },
      },
      {
        id: 'archive', index: '03', eyebrow: 'Component vault', title: 'Reusable components & product craft',
        summary: 'Reusable Angular and TypeScript components, JSON-driven forms with validation, and frontend foundations designed for change.',
        cta: 'Inspect reusable systems', caseFile: { kind: 'career', experienceIndexes: [2], skillGroupTitles: ['Frontend Product Craft'] }, position: { x: 23, y: 66 },
      },
      {
        id: 'quality', index: '04', eyebrow: 'Quality station', title: 'Engineering practice',
        summary: 'Mentoring, system design, Jest, Playwright, and reusable components turn individual implementation work into team leverage.',
        cta: 'Review engineering practice', caseFile: { kind: 'career', experienceIndexes: [0], skillGroupTitles: ['Frontend Product Craft'] }, position: { x: 76, y: 67 },
      },
    ],
  },
  observatory: {
    image: '/game/interiors/observatory.webp',
    exhibits: [
      {
        id: 'optics', index: '01', eyebrow: 'Optics bench', title: 'Machine learning foundations',
        summary: 'Supervised learning, regression, classification, neural networks, feature engineering, evaluation, and the boundaries of generalization.',
        cta: 'Explore ML foundations', caseFile: { kind: 'research', researchThemeIndexes: [1], skillGroupTitles: ['AI / ML'] }, position: { x: 18, y: 44 },
      },
      {
        id: 'orrery', index: '02', eyebrow: 'Celestial orrery', title: 'Stanford AI study',
        summary: 'Graduate work across machine learning, reinforcement learning, and deep reinforcement learning.',
        cta: 'View Stanford coursework', caseFile: { kind: 'education', educationIndex: 0, courseCodes: ['CS229', 'CS234', 'CS224R'] }, position: { x: 50, y: 25 },
      },
      {
        id: 'archive', index: '03', eyebrow: 'Research desk', title: 'Questions in motion',
        summary: 'Retrieval pipelines and distributed intelligence connect evaluation, local inference, model routing, orchestration, and agents.',
        cta: 'Map research themes', caseFile: { kind: 'research', researchThemeIndexes: [0, 3], skillGroupTitles: ['AI Infrastructure'] }, position: { x: 78, y: 43 },
      },
      {
        id: 'constellation', index: '04', eyebrow: 'Constellation table', title: 'Reinforcement learning path',
        summary: 'Graduate-level study moves from sequential decision-making to modern policy learning through CS234 and CS224R.',
        cta: 'Trace RL coursework', caseFile: { kind: 'research', researchThemeIndexes: [2], courseCodes: ['CS234', 'CS224R'] }, position: { x: 76, y: 70 },
      },
    ],
  },
  lab: {
    image: '/game/interiors/lab.webp',
    exhibits: [
      {
        id: 'retrieval', index: '01', eyebrow: 'Specimen gallery', title: 'Retrieval systems',
        summary: 'Embeddings, semantic search, reranking, and LLM-generated file summaries make large codebases easier to navigate and understand.',
        cta: 'Explore RAG system', caseFile: { kind: 'project', projectIndex: 0 }, position: { x: 17, y: 28 },
      },
      {
        id: 'core', index: '02', eyebrow: 'Neural lattice', title: 'Forecasting & honest baselines',
        summary: 'An empirical USD/MXN study found that sophisticated forecasting models still struggled to beat simple baselines.',
        cta: 'Open forecasting study', caseFile: { kind: 'project', projectIndex: 1 }, position: { x: 50, y: 23 },
      },
      {
        id: 'routing', index: '03', eyebrow: 'Comparison bench', title: 'Verifier-aware model routing',
        summary: 'A cost-sensitive contextual-bandit study uses executable test feedback to decide when local code should escalate to a stronger API model.',
        cta: 'Explore routing study', caseFile: { kind: 'project', projectIndex: 2 }, position: { x: 81, y: 31 },
      },
      {
        id: 'evaluation', index: '04', eyebrow: 'Robustness rig', title: 'Cloud/local orchestration',
        summary: 'A frontier cloud model plans and verifies while local models read private documents, measuring the boundary between cost, quality, and privacy.',
        cta: 'Explore COLMo', caseFile: { kind: 'project', projectIndex: 3 }, position: { x: 24, y: 70 },
      },
    ],
  },
  archive: {
    image: '/game/interiors/archive.webp',
    exhibits: [
      {
        id: 'methods', index: '01', eyebrow: 'Specimen cabinet', title: 'Methods, not mythology',
        summary: 'Linear models, tree ensembles, and a neural network face simple autoregressive baselines—and the negative result remains visible.',
        cta: 'Read forecasting field note', caseFile: { kind: 'article', slug: 'usd-mxn-forecasting' }, position: { x: 17, y: 31 },
      },
      {
        id: 'desk', index: '02', eyebrow: 'Curator desk', title: 'Routing code generation with verifiers',
        summary: 'Executable tests become the routing signal in a cost-sensitive study of local code generation and stronger API escalation.',
        cta: 'Read routing field note', caseFile: { kind: 'article', slug: 'verifier-aware-model-routing' }, position: { x: 50, y: 22 },
      },
      {
        id: 'evidence', index: '03', eyebrow: 'Evidence table', title: 'Cloud thinks, local reads',
        summary: 'A frontier cloud supervisor delegates token-heavy document reading to local models while the study measures cost, quality, and privacy.',
        cta: 'Read COLMo field note', caseFile: { kind: 'article', slug: 'colmo' }, position: { x: 72, y: 32 },
      },
      {
        id: 'index', index: '04', eyebrow: 'Living index', title: 'A growing body of work',
        summary: 'Browse all three field notes across forecasting, verifier-aware model routing, and cloud-orchestrated local models.',
        cta: 'Browse all field notes', caseFile: { kind: 'article-index' }, position: { x: 78, y: 68 },
      },
    ],
  },
  station: {
    image: '/game/interiors/station.webp',
    exhibits: [
      {
        id: 'origin', index: '01', eyebrow: 'Founder bench', title: 'Product origins',
        summary: 'GoBus combined mobile maps, crowdsourced live-bus locations, and route-monitoring tools for more than 10,000 registered users.',
        cta: 'View GoBus story', caseFile: { kind: 'career', experienceIndexes: [3] }, position: { x: 22, y: 24 },
      },
      {
        id: 'core', index: '02', eyebrow: 'Prototype core', title: 'X Bookmarks Reader',
        summary: 'A focused local-first workflow organizes exported X bookmarks into searchable categories, a reading queue, insights, and completion tracking.',
        cta: 'View X Bookmarks Reader', caseFile: { kind: 'github-project', repository: 'bookmarks-viewer' }, position: { x: 73, y: 24 },
      },
      {
        id: 'blueprint', index: '03', eyebrow: 'Projection table', title: 'Creative technology',
        summary: 'HandFlow maps real-time hand gestures to a 35,000-particle Three.js environment through MediaPipe hand tracking.',
        cta: 'View creative experiment', caseFile: { kind: 'github-project', repository: 'aetherTouch' }, position: { x: 20, y: 51 },
      },
      {
        id: 'toolwall', index: '04', eyebrow: 'Public workbench', title: 'Public repositories',
        summary: 'Browse shipped work spanning AI research, full-stack ML, product engineering, data visualization, frontend products, and creative technology.',
        cta: 'Browse public work', caseFile: { kind: 'github-index' }, position: { x: 77, y: 50 },
      },
      {
        id: 'assembly', index: '05', eyebrow: 'Assembly alcove', title: 'Full-stack range',
        summary: 'World Cup Forecast combines React and TypeScript with FastAPI, scikit-learn, Monte Carlo simulation, and automated data refreshes.',
        cta: 'View World Cup Forecast', caseFile: { kind: 'github-project', repository: 'WC' }, position: { x: 75, y: 72 },
      },
    ],
  },
  signal: {
    image: '/game/interiors/signal.webp',
    exhibits: [
      {
        id: 'recording', index: '01', eyebrow: 'Recording nook', title: 'A direct channel',
        summary: 'Email Mauricio directly about frontend platforms, applied AI, ML systems, or research engineering.',
        cta: 'Email Mauricio', caseFile: { kind: 'contact', panel: 'email' }, position: { x: 18, y: 29 },
      },
      {
        id: 'console', index: '02', eyebrow: 'Signal console', title: 'Current focus',
        summary: 'Senior software engineering at the intersection of frontend platforms, production web products, and applied AI systems.',
        cta: 'View current focus', caseFile: { kind: 'contact', panel: 'focus' }, position: { x: 50, y: 25 },
      },
      {
        id: 'scope', index: '03', eyebrow: 'Constellation lens', title: 'The opportunity map',
        summary: 'Explore the existing frontend systems, product craft, AI/ML, and AI infrastructure skills behind the strongest technical fit.',
        cta: 'Explore technical fit', caseFile: { kind: 'contact', panel: 'skills' }, position: { x: 79, y: 31 },
      },
      {
        id: 'network', index: '04', eyebrow: 'Routing board', title: 'Find Mauricio',
        summary: 'GitHub, LinkedIn, and email are online. Choose the channel that fits the conversation.',
        cta: 'Open contact links', caseFile: { kind: 'contact', panel: 'links' }, position: { x: 19, y: 67 },
      },
      {
        id: 'lounge', index: '05', eyebrow: 'Listening lounge', title: 'Make the signal useful',
        summary: 'Share the problem, the constraints, and what a meaningful outcome would look like.',
        cta: 'Prepare a message', caseFile: { kind: 'contact', panel: 'brief' }, position: { x: 79, y: 68 },
      },
    ],
  },
  conservatory: {
    image: '/game/interiors/conservatory.webp',
    exhibits: [
      {
        id: 'tame-impala', index: '01', eyebrow: 'Studio garden', title: 'Tame Impala',
        summary: 'Psychedelic production, layered textures, and the studio craft behind immersive sound.',
        cta: 'Explore studio craft', caseFile: { kind: 'interest', interestId: 'tame-impala' }, position: { x: 20, y: 30 },
      },
      {
        id: 'fred-again', index: '02', eyebrow: 'Loop station', title: 'Fred again..',
        summary: 'Live sampling, loop-based performance, and finding emotion in everyday sound.',
        cta: 'Explore live looping', caseFile: { kind: 'interest', interestId: 'fred-again' }, position: { x: 80, y: 30 },
      },
      {
        id: 'nature-beach', index: '03', eyebrow: 'Coastal window', title: 'Nature & the beach',
        summary: 'Coastlines, water, and time outdoors as a way to reset.',
        cta: 'Take an outdoor reset', caseFile: { kind: 'interest', interestId: 'nature-beach' }, position: { x: 50, y: 20 },
      },
      {
        id: 'visual-art', index: '04', eyebrow: 'Color gallery', title: 'Visual art',
        summary: 'Color, composition, and atmosphere—and how each changes the feeling of an image.',
        cta: 'Enter the visual gallery', caseFile: { kind: 'interest', interestId: 'visual-art' }, position: { x: 22, y: 68 },
      },
      {
        id: 'videogames', index: '05', eyebrow: 'Discovery console', title: 'Videogames',
        summary: 'Interactive worlds shaped by systems, exploration, and the reward of discovery.',
        cta: 'Explore interactive worlds', caseFile: { kind: 'interest', interestId: 'videogames' }, position: { x: 78, y: 68 },
      },
    ],
  },
}

export function getInteriorExhibitKey(buildingId: BuildingId, exhibitId: string): InteriorExhibitKey {
  return `${buildingId}:${exhibitId}`
}
