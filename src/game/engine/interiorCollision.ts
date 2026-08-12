import type { BuildingId } from '../data/world'
import {
  WORLD_ASPECT_RATIO,
  WORLD_BOUNDS,
  isPositionWalkable,
  resolveMovement,
  type CollisionPolygon,
  type CollisionQueryOptions,
  type CollisionShape,
  type CollisionWorld,
  type MovementResolution,
  type ResolveMovementOptions,
  type WorldPoint,
  type WorldVector,
} from './collision'

/** The interior sprite uses a small feet collider, not its full visual height. */
export const DEFAULT_INTERIOR_PLAYER_RADIUS = 1

export type InteriorBarrierCategory = 'exhibit' | 'fixture'

export type InteriorBarrier = Readonly<{
  category: InteriorBarrierCategory
  exhibitId?: string
  /** A nearby floor point suitable for proximity interaction or auto-travel. */
  approach?: WorldPoint
  shape: CollisionShape
}>

export type InteriorCollision = Readonly<{
  id: BuildingId
  world: CollisionWorld
  spawn: WorldPoint
  /** Bottom-center exit trigger center. */
  exit: WorldPoint
  /** Trigger radius in aspect-corrected map-height percentage units. */
  exitRadius: number
  playerRadius: number
  /** The floor silhouette; its exterior acts as the room perimeter blocker. */
  perimeter: CollisionPolygon
  barriers: readonly InteriorBarrier[]
  exhibitApproaches: Readonly<Record<string, WorldPoint>>
}>

export type InteriorQueryOptions = Omit<CollisionQueryOptions, 'world'>
export type InteriorMovementOptions = Omit<ResolveMovementOptions, 'world'>

type InteriorDefinition = Readonly<{
  perimeter: readonly WorldPoint[]
  barriers: readonly InteriorBarrier[]
  spawn?: WorldPoint
  exit?: WorldPoint
  exitRadius?: number
}>

function polygonShape(
  id: string,
  label: string,
  points: readonly WorldPoint[],
  surface: 'path' | 'scenery',
): CollisionPolygon {
  return { kind: 'polygon', id, label, surface, points }
}

function ellipsePoints(center: WorldPoint, radiusX: number, radiusY: number, segments = 16) {
  return Array.from({ length: segments }, (_, index): WorldPoint => {
    const angle = index / segments * Math.PI * 2
    return {
      x: center.x + Math.cos(angle) * radiusX,
      y: center.y + Math.sin(angle) * radiusY,
    }
  })
}

function exhibitBarrier(
  room: BuildingId,
  exhibitId: string,
  label: string,
  points: readonly WorldPoint[],
  approach: WorldPoint,
): InteriorBarrier {
  return {
    category: 'exhibit',
    exhibitId,
    approach,
    shape: polygonShape(`interior-${room}-exhibit-${exhibitId}`, label, points, 'scenery'),
  }
}

function fixtureBarrier(
  room: BuildingId,
  id: string,
  label: string,
  points: readonly WorldPoint[],
): InteriorBarrier {
  return {
    category: 'fixture',
    shape: polygonShape(`interior-${room}-fixture-${id}`, label, points, 'scenery'),
  }
}

const definitions: Record<BuildingId, InteriorDefinition> = {
  foundry: {
    perimeter: [
      { x: 5.5, y: 20 }, { x: 94.5, y: 20 }, { x: 94.5, y: 84.5 },
      { x: 58.2, y: 84.5 }, { x: 58.2, y: 100 }, { x: 41.8, y: 100 },
      { x: 41.8, y: 84.5 }, { x: 5.5, y: 84.5 },
    ],
    barriers: [
      exhibitBarrier('foundry', 'craft', 'Fabrication bench', [
        { x: 8, y: 18 }, { x: 35, y: 18 }, { x: 41.5, y: 24 }, { x: 41.5, y: 38 },
        { x: 37, y: 43.5 }, { x: 14, y: 44 }, { x: 8, y: 39 },
      ], { x: 30, y: 48 }),
      exhibitBarrier('foundry', 'platform', 'Systems core', [
        { x: 60, y: 13 }, { x: 65, y: 8 }, { x: 81, y: 8 }, { x: 88, y: 17 },
        { x: 88, y: 34 }, { x: 84, y: 43 }, { x: 65, y: 43 }, { x: 59, y: 34 },
      ], { x: 70, y: 48 }),
      exhibitBarrier('foundry', 'archive', 'Component vault', [
        { x: 7, y: 49 }, { x: 30, y: 49 }, { x: 37.5, y: 55 }, { x: 37.5, y: 76 },
        { x: 33, y: 81 }, { x: 9, y: 81 }, { x: 7, y: 76 },
      ], { x: 40, y: 67 }),
      exhibitBarrier('foundry', 'quality', 'Quality station', [
        { x: 62, y: 52 }, { x: 88, y: 53 }, { x: 92, y: 59 }, { x: 92, y: 77 },
        { x: 87, y: 81 }, { x: 63, y: 81 }, { x: 61.2, y: 76 }, { x: 61.2, y: 61 },
      ], { x: 60, y: 67 }),
      fixtureBarrier('foundry', 'furnace', 'Central furnace', [
        { x: 42, y: 17 }, { x: 58, y: 17 }, { x: 59, y: 31 }, { x: 55, y: 36 },
        { x: 45, y: 36 }, { x: 41, y: 31 },
      ]),
    ],
  },
  observatory: {
    perimeter: [
      { x: 16, y: 7 }, { x: 84, y: 7 }, { x: 96, y: 24 }, { x: 97, y: 73 },
      { x: 88, y: 88 }, { x: 58, y: 88 }, { x: 58, y: 100 }, { x: 42, y: 100 },
      { x: 42, y: 88 }, { x: 12, y: 88 }, { x: 3, y: 73 }, { x: 4, y: 25 },
    ],
    barriers: [
      exhibitBarrier('observatory', 'optics', 'Optics bench', [
        { x: 0, y: 30 }, { x: 23, y: 27 }, { x: 31, y: 36 }, { x: 31, y: 60 },
        { x: 25, y: 69 }, { x: 3, y: 70 }, { x: 0, y: 64 },
      ], { x: 35, y: 50 }),
      exhibitBarrier('observatory', 'orrery', 'Celestial orrery',
        ellipsePoints({ x: 50, y: 24 }, 20, 16.5), { x: 50, y: 42 }),
      exhibitBarrier('observatory', 'archive', 'Research desk', [
        { x: 69, y: 20 }, { x: 94, y: 20 }, { x: 98, y: 30 }, { x: 98, y: 53 },
        { x: 91, y: 59 }, { x: 70, y: 59 }, { x: 66, y: 51 }, { x: 66, y: 30 },
      ], { x: 65, y: 50 }),
      exhibitBarrier('observatory', 'constellation', 'Constellation table', [
        { x: 68, y: 58 }, { x: 91, y: 58 }, { x: 96, y: 66 }, { x: 94, y: 82 },
        { x: 86, y: 87 }, { x: 69, y: 85 }, { x: 67.5, y: 77 },
      ], { x: 66, y: 69 }),
      fixtureBarrier('observatory', 'southwest-seating', 'Southwest seating', [
        { x: 4, y: 70 }, { x: 25, y: 70 }, { x: 27, y: 84 }, { x: 21, y: 88 },
        { x: 7, y: 86 },
      ]),
    ],
  },
  lab: {
    perimeter: [
      { x: 7, y: 10 }, { x: 93, y: 10 }, { x: 98, y: 24 }, { x: 98, y: 87 },
      { x: 57, y: 87 }, { x: 57, y: 100 }, { x: 43, y: 100 }, { x: 43, y: 87 },
      { x: 2, y: 87 }, { x: 2, y: 22 },
    ],
    barriers: [
      exhibitBarrier('lab', 'retrieval', 'Specimen gallery', [
        { x: 3, y: 8 }, { x: 32, y: 8 }, { x: 36, y: 16 }, { x: 33, y: 40 },
        { x: 28, y: 47 }, { x: 4, y: 49 },
      ], { x: 33, y: 43 }),
      exhibitBarrier('lab', 'core', 'Neural lattice',
        ellipsePoints({ x: 49, y: 20 }, 17, 17), { x: 50, y: 39 }),
      exhibitBarrier('lab', 'routing', 'Comparison bench', [
        { x: 65, y: 10 }, { x: 96, y: 10 }, { x: 98, y: 48 }, { x: 89, y: 52 },
        { x: 70, y: 45 }, { x: 65, y: 37 },
      ], { x: 67, y: 43 }),
      exhibitBarrier('lab', 'evaluation', 'Robustness rig', [
        { x: 2, y: 52 }, { x: 30, y: 52 }, { x: 37, y: 60 }, { x: 35, y: 82 },
        { x: 28, y: 87 }, { x: 2, y: 86 },
      ], { x: 38, y: 67 }),
      fixtureBarrier('lab', 'southeast-rig', 'Southeast experiment rig', [
        { x: 64, y: 52 }, { x: 97, y: 52 }, { x: 98, y: 86 }, { x: 69, y: 88 },
        { x: 61, y: 79 }, { x: 61, y: 62 },
      ]),
    ],
  },
  archive: {
    perimeter: [
      { x: 7, y: 19 }, { x: 93, y: 19 }, { x: 96, y: 30 }, { x: 96, y: 81 },
      { x: 60, y: 81 }, { x: 60, y: 100 }, { x: 40, y: 100 }, { x: 40, y: 81 },
      { x: 4, y: 81 }, { x: 4, y: 28 },
    ],
    barriers: [
      exhibitBarrier('archive', 'methods', 'Specimen cabinet', [
        { x: 5, y: 19 }, { x: 30.5, y: 19 }, { x: 30.5, y: 42 }, { x: 27, y: 46 },
        { x: 6, y: 44 },
      ], { x: 32, y: 39 }),
      exhibitBarrier('archive', 'desk', 'Curator desk', [
        { x: 37, y: 15 }, { x: 63, y: 15 }, { x: 65, y: 29 }, { x: 59, y: 35 },
        { x: 41, y: 35 }, { x: 35, y: 29 },
      ], { x: 50, y: 39 }),
      exhibitBarrier('archive', 'evidence', 'Evidence table', [
        { x: 64, y: 18 }, { x: 84, y: 18 }, { x: 86, y: 40 }, { x: 82, y: 46 },
        { x: 65, y: 44 }, { x: 62, y: 34 },
      ], { x: 67, y: 49 }),
      exhibitBarrier('archive', 'index', 'Living index', [
        { x: 71, y: 55 }, { x: 93, y: 54 }, { x: 94, y: 80 }, { x: 71, y: 81 },
        { x: 70.5, y: 74 },
      ], { x: 69, y: 66 }),
      fixtureBarrier('archive', 'west-worktables', 'West worktables', [
        { x: 5, y: 40 }, { x: 31, y: 40 }, { x: 31, y: 80 }, { x: 5, y: 80 },
      ]),
    ],
  },
  station: {
    perimeter: [
      { x: 5, y: 15 }, { x: 95, y: 15 }, { x: 97, y: 24 }, { x: 97, y: 88 },
      { x: 57, y: 88 }, { x: 57, y: 100 }, { x: 43, y: 100 }, { x: 43, y: 88 },
      { x: 3, y: 88 }, { x: 3, y: 22 },
    ],
    barriers: [
      exhibitBarrier('station', 'origin', 'Founder bench', [
        { x: 4, y: 10 }, { x: 40, y: 10 }, { x: 41, y: 35 }, { x: 36, y: 40 },
        { x: 5, y: 39 },
      ], { x: 40, y: 40 }),
      exhibitBarrier('station', 'core', 'Prototype core', [
        { x: 59, y: 8 }, { x: 96, y: 8 }, { x: 97, y: 38 }, { x: 92, y: 42 },
        { x: 64.5, y: 39.5 }, { x: 60, y: 33 },
      ], { x: 63, y: 41 }),
      exhibitBarrier('station', 'blueprint', 'Projection table', [
        { x: 3, y: 35 }, { x: 32, y: 35 }, { x: 34, y: 59 }, { x: 28, y: 65 },
        { x: 3, y: 63 },
      ], { x: 35, y: 52 }),
      exhibitBarrier('station', 'toolwall', 'Public workbench', [
        { x: 68, y: 37 }, { x: 97, y: 37 }, { x: 97, y: 62 }, { x: 69, y: 64 },
        { x: 67.5, y: 58 },
      ], { x: 66, y: 52 }),
      exhibitBarrier('station', 'assembly', 'Assembly alcove', [
        { x: 65, y: 62 }, { x: 97, y: 62 }, { x: 97, y: 88 }, { x: 65, y: 88 },
        { x: 63.5, y: 80 },
      ], { x: 62, y: 72 }),
      fixtureBarrier('station', 'southwest-machine', 'Southwest machine bay', [
        { x: 3, y: 64 }, { x: 39, y: 64 }, { x: 39, y: 87 }, { x: 3, y: 87 },
      ]),
    ],
  },
  signal: {
    perimeter: [
      { x: 15, y: 2 }, { x: 85, y: 2 }, { x: 97, y: 17 }, { x: 98, y: 75 },
      { x: 88, y: 88 }, { x: 57, y: 88 }, { x: 57, y: 100 }, { x: 43, y: 100 },
      { x: 43, y: 88 }, { x: 12, y: 88 }, { x: 2, y: 75 }, { x: 2, y: 22 },
    ],
    barriers: [
      exhibitBarrier('signal', 'recording', 'Recording nook', [
        { x: 4, y: 16 }, { x: 28, y: 15 }, { x: 31, y: 45 }, { x: 25, y: 52 },
        { x: 3, y: 50 },
      ], { x: 34, y: 48 }),
      exhibitBarrier('signal', 'console', 'Signal console', [
        { x: 30, y: 17 }, { x: 67, y: 17 }, { x: 68, y: 37 }, { x: 62, y: 43 },
        { x: 36, y: 43 }, { x: 29, y: 37 },
      ], { x: 50, y: 45 }),
      exhibitBarrier('signal', 'scope', 'Constellation lens', [
        { x: 67, y: 16 }, { x: 96, y: 17 }, { x: 98, y: 50 }, { x: 91, y: 56 },
        { x: 68, y: 53 }, { x: 64, y: 43 },
      ], { x: 63, y: 50 }),
      exhibitBarrier('signal', 'network', 'Routing board', [
        { x: 3, y: 49 }, { x: 29, y: 49 }, { x: 32, y: 76 }, { x: 25, y: 84 },
        { x: 3, y: 80 },
      ], { x: 34, y: 68 }),
      exhibitBarrier('signal', 'lounge', 'Listening lounge', [
        { x: 69, y: 56 }, { x: 97, y: 55 }, { x: 98, y: 82 }, { x: 90, y: 88 },
        { x: 69, y: 86 }, { x: 67.5, y: 77 },
      ], { x: 66, y: 68 }),
    ],
  },
}

function buildInteriorCollision(id: BuildingId, definition: InteriorDefinition): InteriorCollision {
  const perimeter = polygonShape(
    `interior-${id}-perimeter`,
    `${id} walkable floor perimeter`,
    definition.perimeter,
    'path',
  )
  const spawn = definition.spawn ?? { x: 50, y: 91.5 }
  const exit = definition.exit ?? { x: 50, y: 97.25 }
  const barriers = definition.barriers
  const exhibitApproaches: Record<string, WorldPoint> = {}
  for (const barrier of barriers) {
    if (barrier.exhibitId && barrier.approach) exhibitApproaches[barrier.exhibitId] = barrier.approach
  }
  return {
    id,
    spawn,
    exit,
    exitRadius: definition.exitRadius ?? 2.75,
    playerRadius: DEFAULT_INTERIOR_PLAYER_RADIUS,
    perimeter,
    barriers,
    exhibitApproaches,
    world: {
      aspectRatio: WORLD_ASPECT_RATIO,
      bounds: WORLD_BOUNDS,
      walkable: [perimeter],
      blockers: barriers.map((barrier) => barrier.shape),
    },
  }
}

export const INTERIOR_COLLISIONS: Readonly<Record<BuildingId, InteriorCollision>> = {
  foundry: buildInteriorCollision('foundry', definitions.foundry),
  observatory: buildInteriorCollision('observatory', definitions.observatory),
  lab: buildInteriorCollision('lab', definitions.lab),
  archive: buildInteriorCollision('archive', definitions.archive),
  station: buildInteriorCollision('station', definitions.station),
  signal: buildInteriorCollision('signal', definitions.signal),
}

/** Primary GamePortfolio integration entrypoint. */
export function getInteriorCollision(id: BuildingId): InteriorCollision {
  return INTERIOR_COLLISIONS[id]
}

export function isInteriorPositionWalkable(
  id: BuildingId,
  point: WorldPoint,
  options: InteriorQueryOptions = {},
) {
  const interior = getInteriorCollision(id)
  return isPositionWalkable(point, {
    ...options,
    radius: options.radius ?? interior.playerRadius,
    world: interior.world,
  })
}

export function resolveInteriorMovement(
  id: BuildingId,
  start: WorldPoint,
  movement: WorldVector,
  options: InteriorMovementOptions = {},
): MovementResolution {
  const interior = getInteriorCollision(id)
  return resolveMovement(start, movement, {
    ...options,
    radius: options.radius ?? interior.playerRadius,
    world: interior.world,
  })
}

/** Aspect-corrected distance from the player's feet to the exit trigger center. */
export function getInteriorExitDistance(id: BuildingId, point: WorldPoint) {
  const { exit } = getInteriorCollision(id)
  return Math.hypot((point.x - exit.x) * WORLD_ASPECT_RATIO, point.y - exit.y)
}

export function isInteriorExitTriggered(id: BuildingId, point: WorldPoint, padding = 0) {
  const interior = getInteriorCollision(id)
  const safePadding = Number.isFinite(padding) ? Math.max(0, padding) : 0
  return getInteriorExitDistance(id, point) <= interior.exitRadius + safePadding
}

export function getInteriorExhibitApproach(id: BuildingId, exhibitId: string) {
  return getInteriorCollision(id).exhibitApproaches[exhibitId] ?? null
}
