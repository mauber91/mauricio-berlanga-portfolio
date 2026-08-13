import { articles } from '../../data/articles'
import {
  education,
  experience,
  githubProjects,
  personal,
  projects,
  researchThemes,
  skillGroups,
  socialLinks,
} from '../../data/content'

export type Point = { x: number; y: number }

export type BuildingId =
  | 'foundry'
  | 'observatory'
  | 'lab'
  | 'archive'
  | 'station'
  | 'signal'
  | 'conservatory'

export type Building = {
  id: BuildingId
  name: string
  shortName: string
  eyebrow: string
  description: string
  accent: string
  door: Point
  label: Point
  routeHint: string
}

export type NpcId = 'relay' | 'architect' | 'researcher' | 'observer' | 'builder' | 'curator'

export type Npc = {
  id: NpcId
  name: string
  role: string
  accent: string
  sprite: { column: 0 | 1 | 2; row: 0 | 1 }
  position: Point
  dialogue: string[]
}

export const spawnPoint: Point = { x: 50, y: 92 }
export const plazaPoint: Point = { x: 50, y: 51.5 }

export const buildings: Building[] = [
  {
    id: 'foundry',
    name: 'Platform Foundry',
    shortName: 'Foundry',
    eyebrow: 'Career progression',
    description:
      'Nine-plus years from co-founding a transit product to leading frontend architecture for production systems across Walmart Global Sourcing.',
    accent: '#ff7a5c',
    door: { x: 29.7, y: 27.8 },
    label: { x: 28.5, y: 15.5 },
    routeHint: 'Northwest trace',
  },
  {
    id: 'observatory',
    name: 'Learning Observatory',
    shortName: 'Observatory',
    eyebrow: 'AI study & research',
    description:
      'A Stanford AI graduate certificate in progress, connecting CS229, CS234, and CS224R to measured experiments in learning and decision systems.',
    accent: '#ffd166',
    door: { x: 73, y: 28.2 },
    label: { x: 72.2, y: 15.4 },
    routeHint: 'Northeast trace',
  },
  {
    id: 'lab',
    name: 'Model Lab',
    shortName: 'Model Lab',
    eyebrow: 'Applied AI systems',
    description:
      'Four applied systems—retrieval, forecasting, model routing, and local/cloud orchestration—showing how Mauricio builds, evaluates, and revises.',
    accent: '#48d7c7',
    door: { x: 23.2, y: 51.8 },
    label: { x: 18.2, y: 41.5 },
    routeHint: 'West trace',
  },
  {
    id: 'archive',
    name: 'Field Notes Archive',
    shortName: 'Archive',
    eyebrow: 'Technical writing',
    description:
      'Case studies that expose baselines, failed hypotheses, tradeoffs, and the technical reasoning behind each result.',
    accent: '#f4a261',
    door: { x: 74.5, y: 52.2 },
    label: { x: 79.2, y: 41.7 },
    routeHint: 'East trace',
  },
  {
    id: 'station',
    name: 'Prototype Station',
    shortName: 'Station',
    eyebrow: 'Product origins',
    description:
      'Founder roots and independent products, from a transit app with 10,000-plus registered riders to full-stack ML and creative browser work.',
    accent: '#8bd17c',
    door: { x: 29.5, y: 77.2 },
    label: { x: 25.5, y: 68.7 },
    routeHint: 'Southwest trace',
  },
  {
    id: 'signal',
    name: 'Signal Tower',
    shortName: 'Signal',
    eyebrow: 'Role fit & contact',
    description:
      'The clearest fit: senior frontend or platform work and applied AI systems where product craft, architecture, and experimentation meet.',
    accent: '#78b7ff',
    door: { x: 71.5, y: 79 },
    label: { x: 76, y: 69.5 },
    routeHint: 'Southeast trace',
  },
  {
    id: 'conservatory',
    name: 'Resonance Conservatory',
    shortName: 'Conservatory',
    eyebrow: 'Creative interests',
    description:
      'Music, live looping, digital art, games, and the coast—the creative inputs that keep a systems-minded engineer curious.',
    accent: '#c995ff',
    door: { x: 50, y: 59.2 },
    label: { x: 50, y: 42.8 },
    routeHint: 'Central plaza',
  },
]

export const npcs: Npc[] = [
  {
    id: 'relay',
    name: 'Relay',
    role: 'District guide',
    accent: '#65e6d6',
    sprite: { column: 0, row: 0 },
    position: { x: 48, y: 83 },
    dialogue: [
      `Welcome to the Systems District—${personal.name}'s career path drawn as a working map.`,
      'Each building answers a different question: what he has owned, how his scope has grown, how he makes decisions, and what he is exploring next.',
      'Follow the paths with WASD or the arrow keys. You can also select any doorway—the district will guide you there.',
    ],
  },
  {
    id: 'architect',
    name: 'The Architect',
    role: 'Platform keeper',
    accent: '#ff7a5c',
    sprite: { column: 1, row: 0 },
    position: { x: 42, y: 50 },
    dialogue: [
      "Mauricio's path runs from co-founding a mobile transit product to leading frontend architecture for production applications across Walmart's Global Sourcing organization.",
      'Between those points: Angular and TypeScript at TIBCO Flogo, legacy-to-React interoperability, micro-frontends, Nx monorepos, shared tooling, routing, testing, and federation.',
      'The pattern is ownership at the seams: create clear boundaries, useful defaults, and foundations other engineers can extend.',
    ],
  },
  {
    id: 'researcher',
    name: 'The Researcher',
    role: 'Experiment steward',
    accent: '#48d7c7',
    sprite: { column: 2, row: 0 },
    position: { x: 34.5, y: 57 },
    dialogue: [
      'Mauricio treats experiments like engineering work: start with a baseline, make evaluation explicit, and keep failure modes visible.',
      'The USD/MXN study found that sophisticated models still struggled to beat a simple baseline; preserving that result mattered more than forcing a win.',
      'The same discipline shapes retrieval tuning, verifier-aware model routing, and local/cloud orchestration—each judged by the tradeoffs it actually creates.',
    ],
  },
  {
    id: 'observer',
    name: 'The Observer',
    role: 'Learning cartographer',
    accent: '#ffd166',
    sprite: { column: 0, row: 1 },
    position: { x: 63, y: 37.5 },
    dialogue: [
      'The Stanford AI graduate certificate is in progress, adding formal depth to nine-plus years of software engineering.',
      'CS229, CS234, and CS224R move the map from supervised learning into sequential decisions and modern policy learning.',
      'The connection runs both ways: production constraints sharpen the research questions, and the research expands the systems Mauricio can reason about.',
    ],
  },
  {
    id: 'builder',
    name: 'The Builder',
    role: 'Prototype mechanic',
    accent: '#8bd17c',
    sprite: { column: 1, row: 1 },
    position: { x: 38, y: 68.5 },
    dialogue: [
      'GoBus was not a concept piece: Mauricio co-founded it, led Ionic and Angular mobile development, and helped it grow past 10,000 registered riders.',
      'At TIBCO Flogo, that product focus shifted into reusable Angular components and JSON-driven forms for an event-driven application builder.',
      'The founder instinct remains visible in his independent work: ship a useful interface, observe the system, then invest where repeatability matters.',
    ],
  },
  {
    id: 'curator',
    name: 'The Curator',
    role: 'Keeper of field notes',
    accent: '#f4a261',
    sprite: { column: 2, row: 1 },
    position: { x: 63.5, y: 56 },
    dialogue: [
      'The archive shows the reasoning behind the work, not only the finished result.',
      'Its case studies keep baselines, failed hypotheses, evaluation traps, and tradeoffs in view.',
      'Read one to see how Mauricio frames ambiguity, tests assumptions, and communicates a decision another engineer can inspect.',
    ],
  },
]

export const gameContent = {
  articles,
  education,
  experience,
  githubProjects,
  personal,
  projects,
  researchThemes,
  skillGroups,
  socialLinks,
}

export function getBuilding(id: BuildingId) {
  return buildings.find((building) => building.id === id) ?? buildings[0]
}
