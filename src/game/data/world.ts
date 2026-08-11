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
    eyebrow: 'Career & systems',
    description: 'Nine-plus years of product engineering, platform architecture, and teams built to scale.',
    accent: '#ff7a5c',
    door: { x: 29.7, y: 27.8 },
    label: { x: 28.5, y: 15.5 },
    routeHint: 'Northwest trace',
  },
  {
    id: 'observatory',
    name: 'Learning Observatory',
    shortName: 'Observatory',
    eyebrow: 'Education & research',
    description: 'Stanford AI study, machine learning, reinforcement learning, and questions still unfolding.',
    accent: '#ffd166',
    door: { x: 73, y: 28.2 },
    label: { x: 72.2, y: 15.4 },
    routeHint: 'Northeast trace',
  },
  {
    id: 'lab',
    name: 'Model Lab',
    shortName: 'Model Lab',
    eyebrow: 'Selected experiments',
    description: 'RAG, forecasting, model routing, and local/cloud intelligence—built, measured, and refined.',
    accent: '#48d7c7',
    door: { x: 23.2, y: 51.8 },
    label: { x: 18.2, y: 41.5 },
    routeHint: 'West trace',
  },
  {
    id: 'archive',
    name: 'Field Notes Archive',
    shortName: 'Archive',
    eyebrow: 'Writing & evidence',
    description: 'Technical stories about baselines, verifiers, local models, and what the experiments taught.',
    accent: '#f4a261',
    door: { x: 74.5, y: 52.2 },
    label: { x: 79.2, y: 41.7 },
    routeHint: 'East trace',
  },
  {
    id: 'station',
    name: 'Prototype Station',
    shortName: 'Station',
    eyebrow: 'Origins & side quests',
    description: 'The path from a 10,000-rider transit product to creative technology and full-stack ML work.',
    accent: '#8bd17c',
    door: { x: 29.5, y: 77.2 },
    label: { x: 25.5, y: 68.7 },
    routeHint: 'Southwest trace',
  },
  {
    id: 'signal',
    name: 'Signal Tower',
    shortName: 'Signal',
    eyebrow: 'Contact & current focus',
    description: 'Open a direct channel for ambitious frontend platforms, AI systems, and research engineering.',
    accent: '#78b7ff',
    door: { x: 71.5, y: 79 },
    label: { x: 76, y: 69.5 },
    routeHint: 'Southeast trace',
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
      `Welcome to the Systems District. This whole island is ${personal.name}'s working map.`,
      'Every building holds a different layer: products, platforms, experiments, learning, writing, or a direct signal.',
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
      'Mauricio builds the layer between complexity and the people who depend on it.',
      'React, TypeScript, Nx, Module Federation, and shared tooling are not trophies here—they are ways to make teams faster and systems easier to change.',
      'The through-line is longevity: clear boundaries, useful defaults, observable behavior, and software that can evolve.',
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
      'Good experiments leave room for the answer to be inconvenient.',
      'One forecasting study found that sophisticated models still struggled to beat a simple baseline. That negative result mattered.',
      'In the lab, every model is paired with a measurement—and every measurement is treated as part of the system.',
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
      'The observatory connects theory to things that actually run.',
      'CS229, CS234, and CS224R deepen the map from supervised learning into sequential decisions and modern policy learning.',
      'The goal is not to collect course codes. It is to ask sharper questions of real systems.',
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
      'Before the platform work, there was a bus route and a product people could carry in their pocket.',
      'GoBus grew past 10,000 registered riders through live crowdsourced bus locations and practical route tools.',
      'That founder instinct is still here: ship the smallest useful thing, watch how it behaves, and keep improving it.',
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
      'The archive keeps more than polished conclusions.',
      'It records failed hypotheses, evaluation traps, and the exact moment a system became easier to understand.',
      'Three case studies are open now. Take any note with you; they are meant to be read, not guarded.',
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
