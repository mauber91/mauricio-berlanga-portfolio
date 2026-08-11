/**
 * Pure collision model for the Systems District overworld.
 *
 * Positions use the same normalized 0–100 coordinate system as the DOM map.
 * Distances (shape radii, player radius, sweep step, and returned clearance)
 * are expressed as a percentage of the map's *height*. Horizontal distances
 * are aspect-corrected for the 3:2 source art, so circular footprints remain
 * circular when rendered instead of becoming 50% wider.
 *
 * The map art is illustrative rather than tile based. Collision therefore uses
 * a conservative walkable mask made from the visible paving, bridges, plaza,
 * and doorway aprons. Everything outside that mask is terrain collision; solid
 * props layered on top of the mask (buildings and the plaza beacon) are explicit
 * blockers. Keeping both layers makes the geometry inspectable and easy to draw
 * in a development overlay.
 */

export type WorldPoint = Readonly<{ x: number; y: number }>
export type WorldVector = Readonly<{ x: number; y: number }>

export type WalkableSurface = 'path' | 'plaza' | 'bridge' | 'door-approach'
export type BlockingSurface = 'building' | 'scenery'
export type CollisionSurface = BlockingSurface | 'bounds' | 'terrain'

type ShapeBase = Readonly<{
  id: string
  label: string
  surface: WalkableSurface | BlockingSurface | 'bounds'
}>

export type CollisionCircle = ShapeBase & Readonly<{
  kind: 'circle'
  center: WorldPoint
  /** Radius in map-height percentage units. */
  radius: number
}>

export type CollisionSegment = ShapeBase & Readonly<{
  kind: 'segment'
  start: WorldPoint
  end: WorldPoint
  /** Capsule radius in map-height percentage units. */
  radius: number
}>

export type CollisionRect = ShapeBase & Readonly<{
  kind: 'rect'
  x: number
  y: number
  width: number
  height: number
}>

export type CollisionPolygon = ShapeBase & Readonly<{
  kind: 'polygon'
  points: readonly WorldPoint[]
}>

export type CollisionShape = CollisionCircle | CollisionSegment | CollisionRect | CollisionPolygon

export type CollisionWorld = Readonly<{
  aspectRatio: number
  bounds: CollisionRect
  walkable: readonly CollisionShape[]
  blockers: readonly CollisionShape[]
}>

export type DebugCollisionShape = CollisionShape & Readonly<{
  layer: 'bounds' | 'walkable' | 'blocking'
}>

export type CollisionQueryOptions = Readonly<{
  /** Footprint radius in map-height percentage units. */
  radius?: number
  /** Number of perimeter samples used against the union of walkable shapes. */
  ringSamples?: number
  world?: CollisionWorld
}>

export type ResolveMovementOptions = CollisionQueryOptions & Readonly<{
  /** Maximum swept substep in map-height percentage units. */
  maxStep?: number
  /** Number of tangent projections allowed per substep. */
  maxSlides?: number
  /** Binary-search iterations used to locate an impact point. */
  sweepIterations?: number
  /** Tiny inward separation applied after impact, in map-height units. */
  skin?: number
}>

export type WalkableSegmentOptions = CollisionQueryOptions & Readonly<{
  /** Distance between footprint samples, in map-height percentage units. */
  sampleStep?: number
}>

export type FindWalkablePathOptions = CollisionQueryOptions & Readonly<{
  /** Aspect-corrected A* cell size in map-height percentage units. */
  gridStep?: number
  /** Swept-footprint sample spacing used by graph edges and smoothing. */
  collisionSampleStep?: number
  /** Maximum distance from an exact endpoint to a grid connector. */
  connectorRadius?: number
  /** Hard browser-work budget; a path returns null when this is exhausted. */
  maxVisitedNodes?: number
  /** Disable line-of-sight string pulling while retaining a valid grid path. */
  smooth?: boolean
  /** Caps how many raw nodes each smoothing pass may look through. */
  smoothingLookahead?: number
}>

export type CollisionContact = Readonly<{
  shapeId: string | null
  surface: CollisionSurface
  /** Unit direction toward valid space, aspect-corrected for the map. */
  normal: WorldVector
}>

export type MovementResolution = Readonly<{
  position: WorldPoint
  desiredPosition: WorldPoint
  appliedDelta: WorldVector
  remainingDelta: WorldVector
  collided: boolean
  contacts: readonly CollisionContact[]
  substeps: number
}>

export const NORMALIZED_WORLD_SIZE = 100
export const WORLD_ASPECT_RATIO = 3 / 2
export const DEFAULT_PLAYER_RADIUS = 0.9

const DEFAULT_RING_SAMPLES = 24
const DEFAULT_MAX_STEP = 0.55
const DEFAULT_MAX_SLIDES = 3
const DEFAULT_SWEEP_ITERATIONS = 12
const DEFAULT_SKIN = 0.025
const DEFAULT_PATH_GRID_STEP = 1.25
const DEFAULT_PATH_SAMPLE_STEP = 0.4
const DEFAULT_PATH_MAX_VISITED = 14_000
const DEFAULT_SMOOTHING_LOOKAHEAD = 72
const EPSILON = 1e-7

/**
 * Walkable paving traced from public/game-world-map.webp.
 *
 * The six diagonal/horizontal capsules follow the visible route spokes. Small
 * rectangles widen the actual bridge decks and doorway aprons without making
 * the adjacent water, cliffs, landscaping, or building mass traversable.
 */
export const WALKABLE_GEOMETRY: readonly CollisionShape[] = [
  {
    kind: 'circle',
    id: 'interface-plaza',
    label: 'Interface Plaza paving',
    surface: 'plaza',
    center: { x: 50, y: 51.2 },
    radius: 14.8,
  },
  {
    kind: 'rect',
    id: 'south-arrival-bridge',
    label: 'South arrival bridge',
    surface: 'bridge',
    x: 46.15,
    y: 80.5,
    width: 7.7,
    height: 19.5,
  },
  {
    kind: 'rect',
    id: 'central-avenue',
    label: 'Central avenue',
    surface: 'path',
    x: 46.1,
    y: 54.5,
    width: 7.8,
    height: 28.3,
  },
  {
    kind: 'segment',
    id: 'route-foundry',
    label: 'Northwest route to Platform Foundry',
    surface: 'path',
    start: { x: 43.7, y: 41.2 },
    end: { x: 29.7, y: 27.8 },
    radius: 4.25,
  },
  {
    kind: 'segment',
    id: 'route-observatory',
    label: 'Northeast route to Learning Observatory',
    surface: 'path',
    start: { x: 56.1, y: 41.2 },
    end: { x: 73, y: 28.2 },
    radius: 4.2,
  },
  {
    kind: 'segment',
    id: 'route-model-lab-crossing',
    label: 'West route to Model Lab channel crossing',
    surface: 'path',
    start: { x: 41.2, y: 51.4 },
    end: { x: 33.5, y: 51.8 },
    radius: 4.1,
  },
  {
    kind: 'segment',
    id: 'route-model-lab-corner',
    label: 'Model Lab southeast corner walk',
    surface: 'path',
    start: { x: 33.5, y: 51.8 },
    end: { x: 32.5, y: 55.8 },
    radius: 3.1,
  },
  {
    kind: 'segment',
    id: 'route-model-lab-front',
    label: 'Model Lab front walk',
    surface: 'path',
    start: { x: 32.5, y: 55.8 },
    end: { x: 23.2, y: 55.8 },
    radius: 2.8,
  },
  {
    kind: 'segment',
    id: 'route-model-lab-door',
    label: 'Model Lab door walk',
    surface: 'door-approach',
    start: { x: 23.2, y: 55.8 },
    end: { x: 23.2, y: 51.8 },
    radius: 2.35,
  },
  {
    kind: 'segment',
    id: 'route-archive-crossing',
    label: 'East route to Field Notes Archive channel crossing',
    surface: 'path',
    start: { x: 58.8, y: 51.5 },
    end: { x: 65.8, y: 52 },
    radius: 4.1,
  },
  {
    kind: 'segment',
    id: 'route-archive-corner',
    label: 'Archive southwest corner walk',
    surface: 'path',
    start: { x: 65.8, y: 52 },
    end: { x: 65.8, y: 56.1 },
    radius: 3.05,
  },
  {
    kind: 'segment',
    id: 'route-archive-front',
    label: 'Archive front walk',
    surface: 'path',
    start: { x: 65.8, y: 56.1 },
    end: { x: 74.5, y: 56.1 },
    radius: 2.8,
  },
  {
    kind: 'segment',
    id: 'route-archive-door',
    label: 'Archive door walk',
    surface: 'door-approach',
    start: { x: 74.5, y: 56.1 },
    end: { x: 74.5, y: 52.2 },
    radius: 2.35,
  },
  {
    kind: 'segment',
    id: 'route-station-crossing',
    label: 'Southwest route to Prototype Station channel crossing',
    surface: 'path',
    start: { x: 43.4, y: 60.8 },
    end: { x: 40.6, y: 65.6 },
    radius: 4.3,
  },
  {
    kind: 'segment',
    id: 'route-station-side',
    label: 'Prototype Station east side walk',
    surface: 'path',
    start: { x: 40.6, y: 65.6 },
    end: { x: 40.6, y: 81.3 },
    radius: 2.95,
  },
  {
    kind: 'segment',
    id: 'route-station-front',
    label: 'Prototype Station front walk',
    surface: 'path',
    start: { x: 40.6, y: 81.3 },
    end: { x: 29.5, y: 81.3 },
    radius: 2.85,
  },
  {
    kind: 'segment',
    id: 'route-station-door',
    label: 'Prototype Station door walk',
    surface: 'door-approach',
    start: { x: 29.5, y: 81.3 },
    end: { x: 29.5, y: 77.2 },
    radius: 2.35,
  },
  {
    kind: 'segment',
    id: 'route-signal-crossing',
    label: 'Southeast route to Signal Tower channel crossing',
    surface: 'path',
    start: { x: 56.4, y: 60.7 },
    end: { x: 59.4, y: 67.5 },
    radius: 4.25,
  },
  {
    kind: 'segment',
    id: 'route-signal-side',
    label: 'Signal Tower west side walk',
    surface: 'path',
    start: { x: 59.4, y: 67.5 },
    end: { x: 59.4, y: 82.35 },
    radius: 2.95,
  },
  {
    kind: 'segment',
    id: 'route-signal-front',
    label: 'Signal Tower front walk',
    surface: 'path',
    start: { x: 59.4, y: 82.35 },
    end: { x: 71.5, y: 82.35 },
    radius: 2.85,
  },
  {
    kind: 'segment',
    id: 'route-signal-door',
    label: 'Signal Tower door walk',
    surface: 'door-approach',
    start: { x: 71.5, y: 82.35 },
    end: { x: 71.5, y: 79 },
    radius: 2.35,
  },
  {
    kind: 'rect',
    id: 'bridge-foundry',
    label: 'Foundry channel bridge',
    surface: 'bridge',
    x: 43.45,
    y: 29.4,
    width: 5.25,
    height: 10.2,
  },
  {
    kind: 'rect',
    id: 'bridge-observatory',
    label: 'Observatory channel bridge',
    surface: 'bridge',
    x: 53.55,
    y: 29.8,
    width: 5.2,
    height: 9.8,
  },
  {
    kind: 'rect',
    id: 'bridge-model-lab',
    label: 'Model Lab channel bridge',
    surface: 'bridge',
    x: 33.35,
    y: 48.25,
    width: 6.25,
    height: 7.2,
  },
  {
    kind: 'rect',
    id: 'bridge-archive',
    label: 'Archive channel bridge',
    surface: 'bridge',
    x: 61.2,
    y: 48.4,
    width: 6.3,
    height: 7.25,
  },
  {
    kind: 'rect',
    id: 'bridge-station',
    label: 'Prototype Station channel bridge',
    surface: 'bridge',
    x: 35.25,
    y: 60.5,
    width: 5.6,
    height: 8.4,
  },
  {
    kind: 'rect',
    id: 'bridge-signal',
    label: 'Signal Tower channel bridge',
    surface: 'bridge',
    x: 59.45,
    y: 60.55,
    width: 5.8,
    height: 8.45,
  },
  {
    kind: 'rect',
    id: 'door-foundry',
    label: 'Platform Foundry doorway apron',
    surface: 'door-approach',
    x: 26.4,
    y: 25.75,
    width: 6.7,
    height: 5.8,
  },
  {
    kind: 'rect',
    id: 'door-observatory',
    label: 'Learning Observatory doorway apron',
    surface: 'door-approach',
    x: 69.6,
    y: 26,
    width: 6.8,
    height: 5.9,
  },
  {
    kind: 'rect',
    id: 'door-model-lab',
    label: 'Model Lab doorway apron',
    surface: 'door-approach',
    x: 20.1,
    y: 48.8,
    width: 6.2,
    height: 7.35,
  },
  {
    kind: 'rect',
    id: 'door-archive',
    label: 'Field Notes Archive doorway apron',
    surface: 'door-approach',
    x: 71.25,
    y: 49,
    width: 6.5,
    height: 7.3,
  },
  {
    kind: 'rect',
    id: 'door-station',
    label: 'Prototype Station doorway apron',
    surface: 'door-approach',
    x: 26.1,
    y: 73.5,
    width: 6.9,
    height: 7.5,
  },
  {
    kind: 'rect',
    id: 'door-signal',
    label: 'Signal Tower doorway apron',
    surface: 'door-approach',
    x: 68,
    y: 75.25,
    width: 7.2,
    height: 7.5,
  },
  {
    kind: 'segment',
    id: 'npc-bay-researcher',
    label: 'Researcher conversation bay',
    surface: 'path',
    start: { x: 34.5, y: 53.2 },
    end: { x: 34.5, y: 57 },
    radius: 2.45,
  },
  {
    kind: 'segment',
    id: 'npc-bay-curator',
    label: 'Curator conversation bay',
    surface: 'path',
    start: { x: 63.5, y: 52.1 },
    end: { x: 63.5, y: 56 },
    radius: 2.45,
  },
  {
    kind: 'segment',
    id: 'npc-bay-builder',
    label: 'Builder conversation bay',
    surface: 'path',
    start: { x: 40.6, y: 68.5 },
    end: { x: 38, y: 68.5 },
    radius: 2.2,
  },
] as const

/** Solid silhouettes that overlap otherwise walkable paving. */
export const BLOCKING_GEOMETRY: readonly CollisionShape[] = [
  {
    kind: 'polygon',
    id: 'building-foundry',
    label: 'Platform Foundry structure',
    surface: 'building',
    points: [
      { x: 19.2, y: 11.2 },
      { x: 23.1, y: 11.2 },
      { x: 23.1, y: 7.3 },
      { x: 36.8, y: 7.3 },
      { x: 36.8, y: 10.7 },
      { x: 40.8, y: 10.7 },
      { x: 40.8, y: 25.35 },
      { x: 19.2, y: 25.35 },
    ],
  },
  {
    kind: 'polygon',
    id: 'building-observatory',
    label: 'Learning Observatory structure',
    surface: 'building',
    points: [
      { x: 61.6, y: 8.5 },
      { x: 65.1, y: 8.5 },
      { x: 65.1, y: 5.2 },
      { x: 76.2, y: 5.2 },
      { x: 76.2, y: 8.4 },
      { x: 79.3, y: 8.4 },
      { x: 79.3, y: 25.75 },
      { x: 61.6, y: 25.75 },
    ],
  },
  {
    kind: 'polygon',
    id: 'building-model-lab',
    label: 'Model Lab structure',
    surface: 'building',
    points: [
      { x: 13.1, y: 36.3 },
      { x: 31.8, y: 36.3 },
      { x: 31.8, y: 53.9 },
      { x: 25.45, y: 53.9 },
      { x: 25.45, y: 49.55 },
      { x: 20.95, y: 49.55 },
      { x: 20.95, y: 53.9 },
      { x: 13.1, y: 53.9 },
    ],
  },
  {
    kind: 'polygon',
    id: 'building-archive',
    label: 'Field Notes Archive structure',
    surface: 'building',
    points: [
      { x: 66.55, y: 37.5 },
      { x: 84.4, y: 37.5 },
      { x: 84.4, y: 54.15 },
      { x: 77.05, y: 54.15 },
      { x: 77.05, y: 49.85 },
      { x: 71.95, y: 49.85 },
      { x: 71.95, y: 54.15 },
      { x: 66.55, y: 54.15 },
    ],
  },
  {
    kind: 'polygon',
    id: 'building-station',
    label: 'Prototype Station structure',
    surface: 'building',
    points: [
      { x: 20.9, y: 64.5 },
      { x: 39.6, y: 64.5 },
      { x: 39.6, y: 66.15 },
      { x: 36.2, y: 66.15 },
      { x: 36.2, y: 71.05 },
      { x: 39.6, y: 71.05 },
      { x: 39.6, y: 80.15 },
      { x: 32.15, y: 80.15 },
      { x: 32.15, y: 74.95 },
      { x: 27.05, y: 74.95 },
      { x: 27.05, y: 80.15 },
      { x: 20.9, y: 80.15 },
    ],
  },
  {
    kind: 'polygon',
    id: 'building-signal',
    label: 'Signal Tower structure',
    surface: 'building',
    points: [
      { x: 60.6, y: 63.25 },
      { x: 78.65, y: 63.25 },
      { x: 78.65, y: 81.25 },
      { x: 74.3, y: 81.25 },
      { x: 74.3, y: 76.25 },
      { x: 68.55, y: 76.25 },
      { x: 68.55, y: 81.25 },
      { x: 60.6, y: 81.25 },
    ],
  },
  {
    kind: 'circle',
    id: 'plaza-beacon',
    label: 'Interface Plaza central beacon',
    surface: 'scenery',
    center: { x: 50, y: 48.8 },
    radius: 1.65,
  },
] as const

export const WORLD_BOUNDS: CollisionRect = {
  kind: 'rect',
  id: 'world-bounds',
  label: 'Normalized map bounds',
  surface: 'bounds',
  x: 0,
  y: 0,
  width: NORMALIZED_WORLD_SIZE,
  height: NORMALIZED_WORLD_SIZE,
}

export const OVERWORLD_COLLISION: CollisionWorld = {
  aspectRatio: WORLD_ASPECT_RATIO,
  bounds: WORLD_BOUNDS,
  walkable: WALKABLE_GEOMETRY,
  blockers: BLOCKING_GEOMETRY,
}

/** Ready-to-render geometry for an SVG/canvas collision overlay. */
export const DEBUG_COLLISION_GEOMETRY: readonly DebugCollisionShape[] = [
  { ...WORLD_BOUNDS, layer: 'bounds' },
  ...WALKABLE_GEOMETRY.map((shape) => ({ ...shape, layer: 'walkable' as const })),
  ...BLOCKING_GEOMETRY.map((shape) => ({ ...shape, layer: 'blocking' as const })),
]

type MetricPoint = { x: number; y: number }

function finitePoint(point: WorldPoint) {
  return Number.isFinite(point.x) && Number.isFinite(point.y)
}

function toMetricPoint(point: WorldPoint, aspectRatio: number): MetricPoint {
  return { x: point.x * aspectRatio, y: point.y }
}

function fromMetricPoint(point: MetricPoint, aspectRatio: number): WorldPoint {
  return { x: point.x / aspectRatio, y: point.y }
}

function toMetricVector(vector: WorldVector, aspectRatio: number): MetricPoint {
  return { x: vector.x * aspectRatio, y: vector.y }
}

function fromMetricVector(vector: MetricPoint, aspectRatio: number): WorldVector {
  return { x: vector.x / aspectRatio, y: vector.y }
}

function add(a: MetricPoint, b: MetricPoint): MetricPoint {
  return { x: a.x + b.x, y: a.y + b.y }
}

function subtract(a: MetricPoint, b: MetricPoint): MetricPoint {
  return { x: a.x - b.x, y: a.y - b.y }
}

function scale(vector: MetricPoint, amount: number): MetricPoint {
  return { x: vector.x * amount, y: vector.y * amount }
}

function dot(a: MetricPoint, b: MetricPoint) {
  return a.x * b.x + a.y * b.y
}

function length(vector: MetricPoint) {
  return Math.hypot(vector.x, vector.y)
}

function normalize(vector: MetricPoint): MetricPoint {
  const magnitude = length(vector)
  return magnitude > EPSILON ? scale(vector, 1 / magnitude) : { x: 0, y: 0 }
}

function distanceToMetricSegment(point: MetricPoint, start: MetricPoint, end: MetricPoint) {
  const segment = subtract(end, start)
  const lengthSquared = dot(segment, segment)
  if (lengthSquared <= EPSILON) return length(subtract(point, start))
  const t = Math.max(0, Math.min(1, dot(subtract(point, start), segment) / lengthSquared))
  return length(subtract(point, add(start, scale(segment, t))))
}

function pointInPolygon(point: WorldPoint, points: readonly WorldPoint[], aspectRatio: number) {
  if (points.length < 3) return false
  const metricPoint = toMetricPoint(point, aspectRatio)
  let inside = false

  for (let index = 0, previous = points.length - 1; index < points.length; previous = index++) {
    const a = points[previous]
    const b = points[index]
    const metricA = toMetricPoint(a, aspectRatio)
    const metricB = toMetricPoint(b, aspectRatio)
    if (distanceToMetricSegment(metricPoint, metricA, metricB) <= EPSILON) return true

    const crosses = (a.y > point.y) !== (b.y > point.y)
      && point.x < (b.x - a.x) * (point.y - a.y) / (b.y - a.y) + a.x
    if (crosses) inside = !inside
  }

  return inside
}

/**
 * Signed distance to a shape in map-height percentage units. Positive values
 * are inside, zero is on the edge, and negative values are outside.
 */
export function signedDistanceToShape(
  point: WorldPoint,
  shape: CollisionShape,
  aspectRatio = WORLD_ASPECT_RATIO,
) {
  if (!finitePoint(point) || !Number.isFinite(aspectRatio) || aspectRatio <= 0) return Number.NEGATIVE_INFINITY
  const metricPoint = toMetricPoint(point, aspectRatio)

  if (shape.kind === 'circle') {
    return shape.radius - length(subtract(metricPoint, toMetricPoint(shape.center, aspectRatio)))
  }

  if (shape.kind === 'segment') {
    return shape.radius - distanceToMetricSegment(
      metricPoint,
      toMetricPoint(shape.start, aspectRatio),
      toMetricPoint(shape.end, aspectRatio),
    )
  }

  if (shape.kind === 'rect') {
    const left = shape.x * aspectRatio
    const right = (shape.x + shape.width) * aspectRatio
    const top = shape.y
    const bottom = shape.y + shape.height
    const outsideX = Math.max(left - metricPoint.x, 0, metricPoint.x - right)
    const outsideY = Math.max(top - metricPoint.y, 0, metricPoint.y - bottom)
    if (outsideX > 0 || outsideY > 0) return -Math.hypot(outsideX, outsideY)
    return Math.min(metricPoint.x - left, right - metricPoint.x, metricPoint.y - top, bottom - metricPoint.y)
  }

  let edgeDistance = Number.POSITIVE_INFINITY
  for (let index = 0; index < shape.points.length; index += 1) {
    const next = (index + 1) % shape.points.length
    edgeDistance = Math.min(
      edgeDistance,
      distanceToMetricSegment(
        metricPoint,
        toMetricPoint(shape.points[index], aspectRatio),
        toMetricPoint(shape.points[next], aspectRatio),
      ),
    )
  }
  if (!Number.isFinite(edgeDistance)) return Number.NEGATIVE_INFINITY
  return pointInPolygon(point, shape.points, aspectRatio) ? edgeDistance : -edgeDistance
}

export function isPointInsideShape(
  point: WorldPoint,
  shape: CollisionShape,
  aspectRatio = WORLD_ASPECT_RATIO,
) {
  return signedDistanceToShape(point, shape, aspectRatio) >= -EPSILON
}

function normalizedQueryOptions(options: CollisionQueryOptions = {}) {
  const world = options.world ?? OVERWORLD_COLLISION
  const radius = Number.isFinite(options.radius) ? Math.max(0, options.radius ?? DEFAULT_PLAYER_RADIUS) : DEFAULT_PLAYER_RADIUS
  const ringSamples = Number.isFinite(options.ringSamples)
    ? Math.max(8, Math.min(64, Math.round(options.ringSamples ?? DEFAULT_RING_SAMPLES)))
    : DEFAULT_RING_SAMPLES
  return { world, radius, ringSamples }
}

function pointInWalkableUnion(point: WorldPoint, world: CollisionWorld) {
  return world.walkable.some((shape) => isPointInsideShape(point, shape, world.aspectRatio))
}

/**
 * Approximate signed clearance for normal estimation and debug display. The
 * exact body query is `isPositionWalkable`; this scalar can be conservative at
 * the seam where two walkable shapes overlap.
 */
export function getCollisionClearance(point: WorldPoint, world: CollisionWorld = OVERWORLD_COLLISION) {
  if (!finitePoint(point)) return Number.NEGATIVE_INFINITY
  const boundsClearance = signedDistanceToShape(point, world.bounds, world.aspectRatio)
  let walkableClearance = Number.NEGATIVE_INFINITY
  for (const shape of world.walkable) {
    walkableClearance = Math.max(walkableClearance, signedDistanceToShape(point, shape, world.aspectRatio))
  }

  let blockerClearance = Number.POSITIVE_INFINITY
  for (const shape of world.blockers) {
    blockerClearance = Math.min(blockerClearance, -signedDistanceToShape(point, shape, world.aspectRatio))
  }
  return Math.min(boundsClearance, walkableClearance, blockerClearance)
}

/** True when a circular player footprint fits entirely on traversable ground. */
export function isPositionWalkable(point: WorldPoint, options: CollisionQueryOptions = {}) {
  if (!finitePoint(point)) return false
  const { world, radius, ringSamples } = normalizedQueryOptions(options)

  if (signedDistanceToShape(point, world.bounds, world.aspectRatio) + EPSILON < radius) return false
  if (!pointInWalkableUnion(point, world)) return false

  for (const blocker of world.blockers) {
    if (signedDistanceToShape(point, blocker, world.aspectRatio) > -radius + EPSILON) return false
  }

  if (radius <= EPSILON) return true
  // Most of the route lies comfortably inside one primitive. This exact fast
  // path avoids perimeter sampling unless the footprint straddles a union seam.
  if (getCollisionClearance(point, world) + EPSILON >= radius) return true
  const metricPoint = toMetricPoint(point, world.aspectRatio)
  for (let index = 0; index < ringSamples; index += 1) {
    const angle = index / ringSamples * Math.PI * 2
    const sample = fromMetricPoint({
      x: metricPoint.x + Math.cos(angle) * radius,
      y: metricPoint.y + Math.sin(angle) * radius,
    }, world.aspectRatio)
    if (!pointInWalkableUnion(sample, world)) return false
  }
  return true
}

/** Point-footprint convenience query, useful for click/tap destination checks. */
export function isWalkablePoint(point: WorldPoint, world: CollisionWorld = OVERWORLD_COLLISION) {
  return isPositionWalkable(point, { radius: 0, world })
}

function estimateNormalMetric(point: WorldPoint, options: CollisionQueryOptions) {
  const { world, radius } = normalizedQueryOptions(options)
  const sampleDistance = Math.max(0.08, radius * 0.18)
  const offsetX = sampleDistance / world.aspectRatio
  const positiveX = getCollisionClearance({ x: point.x + offsetX, y: point.y }, world)
  const negativeX = getCollisionClearance({ x: point.x - offsetX, y: point.y }, world)
  const positiveY = getCollisionClearance({ x: point.x, y: point.y + sampleDistance }, world)
  const negativeY = getCollisionClearance({ x: point.x, y: point.y - sampleDistance }, world)
  let normal = normalize({ x: positiveX - negativeX, y: positiveY - negativeY })

  if (length(normal) <= EPSILON) {
    const metricPoint = toMetricPoint(point, world.aspectRatio)
    let validDirection = { x: 0, y: 0 }
    for (let index = 0; index < 16; index += 1) {
      const angle = index / 16 * Math.PI * 2
      const direction = { x: Math.cos(angle), y: Math.sin(angle) }
      const sample = fromMetricPoint(add(metricPoint, scale(direction, sampleDistance * 2)), world.aspectRatio)
      if (isPositionWalkable(sample, options)) validDirection = add(validDirection, direction)
    }
    normal = normalize(validDirection)
  }

  return normal
}

/** Estimate the aspect-corrected unit direction from collision toward valid space. */
export function estimateCollisionNormal(point: WorldPoint, options: CollisionQueryOptions = {}): WorldVector {
  const { world } = normalizedQueryOptions(options)
  return fromMetricVector(estimateNormalMetric(point, options), world.aspectRatio)
}

/** Describe all reasons a player footprint is rejected at a position. */
export function getCollisionContacts(point: WorldPoint, options: CollisionQueryOptions = {}): readonly CollisionContact[] {
  const { world, radius } = normalizedQueryOptions(options)
  const metricNormal = estimateNormalMetric(point, options)
  const normal = fromMetricVector(metricNormal, world.aspectRatio)
  const contacts: CollisionContact[] = []

  if (signedDistanceToShape(point, world.bounds, world.aspectRatio) + EPSILON < radius) {
    contacts.push({ shapeId: world.bounds.id, surface: 'bounds', normal })
  }

  for (const blocker of world.blockers) {
    if (signedDistanceToShape(point, blocker, world.aspectRatio) > -radius + EPSILON) {
      contacts.push({ shapeId: blocker.id, surface: blocker.surface as BlockingSurface, normal })
    }
  }

  if (!isPositionWalkable(point, options) && contacts.length === 0) {
    let nearestShapeId: string | null = null
    let nearestDistance = Number.NEGATIVE_INFINITY
    for (const shape of world.walkable) {
      const shapeDistance = signedDistanceToShape(point, shape, world.aspectRatio)
      if (shapeDistance > nearestDistance) {
        nearestDistance = shapeDistance
        nearestShapeId = shape.id
      }
    }
    contacts.push({ shapeId: nearestShapeId, surface: 'terrain', normal })
  }

  return contacts
}

type SweepResult = { position: MetricPoint; fraction: number }

function sweepToLastWalkable(
  start: MetricPoint,
  movement: MetricPoint,
  options: CollisionQueryOptions,
  iterations: number,
): SweepResult {
  const { world } = normalizedQueryOptions(options)
  const target = add(start, movement)
  if (isPositionWalkable(fromMetricPoint(target, world.aspectRatio), options)) {
    return { position: target, fraction: 1 }
  }

  let low = 0
  let high = 1
  for (let iteration = 0; iteration < iterations; iteration += 1) {
    const middle = (low + high) / 2
    const candidate = add(start, scale(movement, middle))
    if (isPositionWalkable(fromMetricPoint(candidate, world.aspectRatio), options)) low = middle
    else high = middle
  }
  return { position: add(start, scale(movement, low)), fraction: low }
}

function axisSlide(
  position: MetricPoint,
  movement: MetricPoint,
  options: CollisionQueryOptions,
  sweepIterations: number,
) {
  const candidates = [
    { x: movement.x, y: 0 },
    { x: 0, y: movement.y },
  ]
  let best: SweepResult | null = null
  let bestDistance = 0

  for (const candidate of candidates) {
    if (length(candidate) <= EPSILON) continue
    const result = sweepToLastWalkable(position, candidate, options, sweepIterations)
    const traveled = length(subtract(result.position, position))
    if (traveled > bestDistance + EPSILON) {
      best = result
      bestDistance = traveled
    }
  }
  return best
}

function addUniqueContacts(target: CollisionContact[], incoming: readonly CollisionContact[]) {
  for (const contact of incoming) {
    if (!target.some((current) => current.shapeId === contact.shapeId && current.surface === contact.surface)) {
      target.push(contact)
    }
  }
}

/**
 * Resolve a normalized movement delta with swept collision and tangent sliding.
 * This is the direct replacement for the component's candidate/x-only/y-only
 * checks: `resolveMovement(current, { x: dx, y: dy }).position`.
 */
export function resolveMovement(
  start: WorldPoint,
  movement: WorldVector,
  options: ResolveMovementOptions = {},
): MovementResolution {
  const query = normalizedQueryOptions(options)
  const queryOptions: CollisionQueryOptions = {
    world: query.world,
    radius: query.radius,
    ringSamples: query.ringSamples,
  }
  const desiredPosition = { x: start.x + movement.x, y: start.y + movement.y }

  if (!finitePoint(start) || !finitePoint(movement) || !isPositionWalkable(start, queryOptions)) {
    const contacts = finitePoint(start) ? getCollisionContacts(start, queryOptions) : []
    return {
      position: start,
      desiredPosition,
      appliedDelta: { x: 0, y: 0 },
      remainingDelta: movement,
      collided: true,
      contacts,
      substeps: 0,
    }
  }

  const maxStep = Number.isFinite(options.maxStep) ? Math.max(0.05, options.maxStep ?? DEFAULT_MAX_STEP) : DEFAULT_MAX_STEP
  const maxSlides = Number.isFinite(options.maxSlides)
    ? Math.max(1, Math.min(8, Math.round(options.maxSlides ?? DEFAULT_MAX_SLIDES)))
    : DEFAULT_MAX_SLIDES
  const sweepIterations = Number.isFinite(options.sweepIterations)
    ? Math.max(6, Math.min(20, Math.round(options.sweepIterations ?? DEFAULT_SWEEP_ITERATIONS)))
    : DEFAULT_SWEEP_ITERATIONS
  const skin = Number.isFinite(options.skin) ? Math.max(0, options.skin ?? DEFAULT_SKIN) : DEFAULT_SKIN
  const metricMovement = toMetricVector(movement, query.world.aspectRatio)
  const movementLength = length(metricMovement)
  const substeps = Math.max(1, Math.ceil(movementLength / maxStep))
  const stepMovement = scale(metricMovement, 1 / substeps)
  let metricPosition = toMetricPoint(start, query.world.aspectRatio)
  let collided = false
  const contacts: CollisionContact[] = []

  for (let step = 0; step < substeps; step += 1) {
    let remaining = stepMovement

    for (let slideIndex = 0; slideIndex < maxSlides && length(remaining) > EPSILON; slideIndex += 1) {
      const target = add(metricPosition, remaining)
      const worldTarget = fromMetricPoint(target, query.world.aspectRatio)
      if (isPositionWalkable(worldTarget, queryOptions)) {
        metricPosition = target
        break
      }

      collided = true
      addUniqueContacts(contacts, getCollisionContacts(worldTarget, queryOptions))
      const sweep = sweepToLastWalkable(metricPosition, remaining, queryOptions, sweepIterations)
      metricPosition = sweep.position
      const untraveled = scale(remaining, 1 - sweep.fraction)
      if (length(untraveled) <= EPSILON) break

      const probeDirection = normalize(untraveled)
      const probe = fromMetricPoint(
        add(metricPosition, scale(probeDirection, Math.max(skin, 0.04))),
        query.world.aspectRatio,
      )
      const normal = estimateNormalMetric(probe, queryOptions)
      let slide = length(normal) > EPSILON
        ? subtract(untraveled, scale(normal, dot(untraveled, normal)))
        : { x: 0, y: 0 }

      if (length(normal) > EPSILON && skin > 0) {
        const separated = add(metricPosition, scale(normal, skin))
        if (isPositionWalkable(fromMetricPoint(separated, query.world.aspectRatio), queryOptions)) {
          metricPosition = separated
        }
      }

      if (length(slide) <= skin + EPSILON) {
        const fallback = axisSlide(metricPosition, untraveled, queryOptions, sweepIterations)
        if (!fallback || length(subtract(fallback.position, metricPosition)) <= EPSILON) break
        metricPosition = fallback.position
        break
      }

      // Avoid re-entering the same surface because of floating-point noise.
      slide = scale(slide, 1 - Math.min(0.05, skin))
      remaining = slide
    }
  }

  const position = fromMetricPoint(metricPosition, query.world.aspectRatio)
  const appliedDelta = { x: position.x - start.x, y: position.y - start.y }
  return {
    position,
    desiredPosition,
    appliedDelta,
    remainingDelta: {
      x: desiredPosition.x - position.x,
      y: desiredPosition.y - position.y,
    },
    collided,
    contacts,
    substeps,
  }
}

/** Resolve toward an absolute normalized destination instead of a delta. */
export function resolveMovementTo(
  start: WorldPoint,
  destination: WorldPoint,
  options: ResolveMovementOptions = {},
) {
  return resolveMovement(start, {
    x: destination.x - start.x,
    y: destination.y - start.y,
  }, options)
}

export type NearestWalkableOptions = CollisionQueryOptions & Readonly<{
  maxDistance?: number
  searchStep?: number
  angularSamples?: number
}>

/**
 * Deterministically recover an invalid saved/spawn position after geometry
 * changes. Returns null when no valid footprint exists inside the search radius.
 */
export function findNearestWalkablePosition(
  point: WorldPoint,
  options: NearestWalkableOptions = {},
): WorldPoint | null {
  if (!finitePoint(point)) return null
  const query = normalizedQueryOptions(options)
  const queryOptions: CollisionQueryOptions = {
    world: query.world,
    radius: query.radius,
    ringSamples: query.ringSamples,
  }
  if (isPositionWalkable(point, queryOptions)) return point

  const maxDistance = Number.isFinite(options.maxDistance) ? Math.max(0, options.maxDistance ?? 12) : 12
  const searchStep = Number.isFinite(options.searchStep) ? Math.max(0.1, options.searchStep ?? 0.5) : 0.5
  const angularSamples = Number.isFinite(options.angularSamples)
    ? Math.max(8, Math.min(96, Math.round(options.angularSamples ?? 32)))
    : 32
  const origin = toMetricPoint(point, query.world.aspectRatio)

  for (let radius = searchStep; radius <= maxDistance + EPSILON; radius += searchStep) {
    const samplesAtRadius = Math.max(angularSamples, Math.ceil(Math.PI * 2 * radius / searchStep))
    for (let index = 0; index < samplesAtRadius; index += 1) {
      const angle = index / samplesAtRadius * Math.PI * 2
      const candidate = fromMetricPoint({
        x: origin.x + Math.cos(angle) * radius,
        y: origin.y + Math.sin(angle) * radius,
      }, query.world.aspectRatio)
      if (isPositionWalkable(candidate, queryOptions)) return candidate
    }
  }
  return null
}

function walkableMetricSegment(
  start: MetricPoint,
  end: MetricPoint,
  queryOptions: CollisionQueryOptions,
  sampleStep: number,
) {
  const { world } = normalizedQueryOptions(queryOptions)
  const movement = subtract(end, start)
  const sampleCount = Math.max(1, Math.ceil(length(movement) / sampleStep))
  for (let index = 0; index <= sampleCount; index += 1) {
    const sample = fromMetricPoint(add(start, scale(movement, index / sampleCount)), world.aspectRatio)
    if (!isPositionWalkable(sample, queryOptions)) return false
  }
  return true
}

/**
 * Swept line-of-sight query for a complete player footprint. Unlike
 * `resolveMovement`, this never slides: any collision along the exact segment
 * rejects it, which makes it safe for path smoothing and auto-travel legs.
 */
export function isWalkableSegment(
  start: WorldPoint,
  destination: WorldPoint,
  options: WalkableSegmentOptions = {},
) {
  if (!finitePoint(start) || !finitePoint(destination)) return false
  const query = normalizedQueryOptions(options)
  const queryOptions: CollisionQueryOptions = {
    world: query.world,
    radius: query.radius,
    ringSamples: query.ringSamples,
  }
  const sampleStep = Number.isFinite(options.sampleStep)
    ? Math.max(0.08, Math.min(2, options.sampleStep ?? DEFAULT_PATH_SAMPLE_STEP))
    : DEFAULT_PATH_SAMPLE_STEP
  return walkableMetricSegment(
    toMetricPoint(start, query.world.aspectRatio),
    toMetricPoint(destination, query.world.aspectRatio),
    queryOptions,
    sampleStep,
  )
}

type PathHeapEntry = {
  id: number
  g: number
  h: number
  f: number
}

function pathEntryPrecedes(a: PathHeapEntry, b: PathHeapEntry) {
  if (Math.abs(a.f - b.f) > EPSILON) return a.f < b.f
  if (Math.abs(a.h - b.h) > EPSILON) return a.h < b.h
  if (Math.abs(a.g - b.g) > EPSILON) return a.g < b.g
  return a.id < b.id
}

function pushPathHeap(heap: PathHeapEntry[], entry: PathHeapEntry) {
  heap.push(entry)
  let index = heap.length - 1
  while (index > 0) {
    const parent = Math.floor((index - 1) / 2)
    if (!pathEntryPrecedes(entry, heap[parent])) break
    heap[index] = heap[parent]
    index = parent
  }
  heap[index] = entry
}

function popPathHeap(heap: PathHeapEntry[]) {
  const first = heap[0]
  const last = heap.pop()
  if (!first || !last || heap.length === 0) return first

  let index = 0
  while (true) {
    const left = index * 2 + 1
    const right = left + 1
    if (left >= heap.length) break
    const child = right < heap.length && pathEntryPrecedes(heap[right], heap[left]) ? right : left
    if (!pathEntryPrecedes(heap[child], last)) break
    heap[index] = heap[child]
    index = child
  }
  heap[index] = last
  return first
}

type PathConnector = { id: number; distance: number }

function smoothWalkablePath(
  path: readonly WorldPoint[],
  queryOptions: CollisionQueryOptions,
  sampleStep: number,
  lookahead: number,
) {
  if (path.length <= 2) return [...path]
  const { world } = normalizedQueryOptions(queryOptions)
  const metricPath = path.map((point) => toMetricPoint(point, world.aspectRatio))
  const smoothed: WorldPoint[] = [path[0]]
  let anchor = 0

  while (anchor < path.length - 1) {
    const furthestCandidate = Math.min(path.length - 1, anchor + lookahead)
    let next = furthestCandidate
    while (next > anchor + 1) {
      if (walkableMetricSegment(metricPath[anchor], metricPath[next], queryOptions, sampleStep)) break
      next -= 1
    }
    smoothed.push(path[next])
    anchor = next
  }
  return smoothed
}

/**
 * Find a deterministic collision-safe auto-travel path.
 *
 * A* runs lazily on a small aspect-correct grid, so it allocates only nodes the
 * search actually touches. Exact endpoints connect to nearby grid nodes through
 * swept-footprint checks. The returned route is then string-pulled only across
 * equally swept, collision-free segments. Returns null for invalid or unreachable
 * endpoints; otherwise the exact `start` and `destination` are always present.
 */
export function findWalkablePath(
  start: WorldPoint,
  destination: WorldPoint,
  options: FindWalkablePathOptions = {},
): WorldPoint[] | null {
  if (!finitePoint(start) || !finitePoint(destination)) return null
  const query = normalizedQueryOptions(options)
  const queryOptions: CollisionQueryOptions = {
    world: query.world,
    radius: query.radius,
    ringSamples: query.ringSamples,
  }
  if (!isPositionWalkable(start, queryOptions) || !isPositionWalkable(destination, queryOptions)) return null

  const metricStart = toMetricPoint(start, query.world.aspectRatio)
  const metricDestination = toMetricPoint(destination, query.world.aspectRatio)
  if (length(subtract(metricDestination, metricStart)) <= EPSILON) return [start]

  const gridStep = Number.isFinite(options.gridStep)
    ? Math.max(0.55, Math.min(4, options.gridStep ?? DEFAULT_PATH_GRID_STEP))
    : DEFAULT_PATH_GRID_STEP
  const collisionSampleStep = Number.isFinite(options.collisionSampleStep)
    ? Math.max(0.08, Math.min(gridStep / 2, options.collisionSampleStep ?? DEFAULT_PATH_SAMPLE_STEP))
    : Math.min(DEFAULT_PATH_SAMPLE_STEP, gridStep / 2)
  const connectorRadius = Number.isFinite(options.connectorRadius)
    ? Math.max(gridStep, Math.min(15, options.connectorRadius ?? gridStep * 2.75))
    : gridStep * 2.75
  const maxVisitedNodes = Number.isFinite(options.maxVisitedNodes)
    ? Math.max(100, Math.min(100_000, Math.round(options.maxVisitedNodes ?? DEFAULT_PATH_MAX_VISITED)))
    : DEFAULT_PATH_MAX_VISITED
  const smoothingLookahead = Number.isFinite(options.smoothingLookahead)
    ? Math.max(2, Math.min(256, Math.round(options.smoothingLookahead ?? DEFAULT_SMOOTHING_LOOKAHEAD)))
    : DEFAULT_SMOOTHING_LOOKAHEAD

  if (walkableMetricSegment(metricStart, metricDestination, queryOptions, collisionSampleStep)) {
    return [start, destination]
  }

  const boundsLeft = query.world.bounds.x * query.world.aspectRatio
  const boundsTop = query.world.bounds.y
  const boundsWidth = query.world.bounds.width * query.world.aspectRatio
  const boundsHeight = query.world.bounds.height
  const columns = Math.floor(boundsWidth / gridStep) + 1
  const rows = Math.floor(boundsHeight / gridStep) + 1
  const nodeCount = columns * rows
  if (!Number.isSafeInteger(nodeCount) || nodeCount <= 0 || nodeCount > 200_000) return null

  const nodePoint = (id: number): MetricPoint => ({
    x: boundsLeft + id % columns * gridStep,
    y: boundsTop + Math.floor(id / columns) * gridStep,
  })
  const nodeValidity = new Map<number, boolean>()
  const isNodeWalkable = (id: number) => {
    const cached = nodeValidity.get(id)
    if (cached !== undefined) return cached
    const valid = isPositionWalkable(fromMetricPoint(nodePoint(id), query.world.aspectRatio), queryOptions)
    nodeValidity.set(id, valid)
    return valid
  }

  const findConnectors = (point: MetricPoint) => {
    const centerColumn = Math.round((point.x - boundsLeft) / gridStep)
    const centerRow = Math.round((point.y - boundsTop) / gridStep)
    const cellRadius = Math.ceil(connectorRadius / gridStep)
    const connectors: PathConnector[] = []

    for (let row = Math.max(0, centerRow - cellRadius); row <= Math.min(rows - 1, centerRow + cellRadius); row += 1) {
      for (let column = Math.max(0, centerColumn - cellRadius); column <= Math.min(columns - 1, centerColumn + cellRadius); column += 1) {
        const id = row * columns + column
        const gridPoint = nodePoint(id)
        const connectorDistance = length(subtract(gridPoint, point))
        if (connectorDistance > connectorRadius + EPSILON || !isNodeWalkable(id)) continue
        if (!walkableMetricSegment(point, gridPoint, queryOptions, collisionSampleStep)) continue
        connectors.push({ id, distance: connectorDistance })
      }
    }
    connectors.sort((a, b) => Math.abs(a.distance - b.distance) > EPSILON ? a.distance - b.distance : a.id - b.id)
    return connectors
  }

  const startConnectors = findConnectors(metricStart)
  const destinationConnectors = findConnectors(metricDestination)
  if (startConnectors.length === 0 || destinationConnectors.length === 0) return null
  const destinationConnectorIds = new Set(destinationConnectors.map((connector) => connector.id))

  const open: PathHeapEntry[] = []
  const gScore = new Map<number, number>()
  const cameFrom = new Map<number, number>()
  const closed = new Set<number>()
  for (const connector of startConnectors) {
    const existing = gScore.get(connector.id)
    if (existing !== undefined && existing <= connector.distance) continue
    const h = length(subtract(metricDestination, nodePoint(connector.id)))
    gScore.set(connector.id, connector.distance)
    cameFrom.set(connector.id, -1)
    pushPathHeap(open, { id: connector.id, g: connector.distance, h, f: connector.distance + h })
  }

  const edgeValidity = new Map<string, boolean>()
  const isEdgeWalkable = (from: number, to: number) => {
    const low = Math.min(from, to)
    const high = Math.max(from, to)
    const key = `${low}:${high}`
    const cached = edgeValidity.get(key)
    if (cached !== undefined) return cached
    const valid = isNodeWalkable(to)
      && walkableMetricSegment(nodePoint(from), nodePoint(to), queryOptions, collisionSampleStep)
    edgeValidity.set(key, valid)
    return valid
  }

  const neighborOffsets = [
    [-1, 0],
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, -1],
    [1, -1],
    [1, 1],
    [-1, 1],
  ] as const
  let goalId: number | null = null
  let visitedNodes = 0

  while (open.length > 0 && visitedNodes < maxVisitedNodes) {
    const current = popPathHeap(open)
    if (!current) break
    const bestCurrentG = gScore.get(current.id)
    if (bestCurrentG === undefined || current.g > bestCurrentG + EPSILON || closed.has(current.id)) continue
    closed.add(current.id)
    visitedNodes += 1

    if (destinationConnectorIds.has(current.id)) {
      goalId = current.id
      break
    }

    const column = current.id % columns
    const row = Math.floor(current.id / columns)
    for (const [columnOffset, rowOffset] of neighborOffsets) {
      const nextColumn = column + columnOffset
      const nextRow = row + rowOffset
      if (nextColumn < 0 || nextColumn >= columns || nextRow < 0 || nextRow >= rows) continue
      const nextId = nextRow * columns + nextColumn
      if (closed.has(nextId) || !isEdgeWalkable(current.id, nextId)) continue
      const nextPoint = nodePoint(nextId)
      const stepCost = length(subtract(nextPoint, nodePoint(current.id)))
      const tentativeG = current.g + stepCost
      const knownG = gScore.get(nextId)
      if (knownG !== undefined && tentativeG >= knownG - EPSILON) continue
      const h = length(subtract(metricDestination, nextPoint))
      gScore.set(nextId, tentativeG)
      cameFrom.set(nextId, current.id)
      pushPathHeap(open, { id: nextId, g: tentativeG, h, f: tentativeG + h })
    }
  }

  if (goalId === null) return null
  const gridRoute: number[] = []
  let cursor = goalId
  while (cursor >= 0) {
    gridRoute.push(cursor)
    cursor = cameFrom.get(cursor) ?? -1
  }
  gridRoute.reverse()

  const rawPath: WorldPoint[] = [start]
  for (const id of gridRoute) {
    const point = fromMetricPoint(nodePoint(id), query.world.aspectRatio)
    const previous = rawPath[rawPath.length - 1]
    if (length(subtract(toMetricPoint(previous, query.world.aspectRatio), nodePoint(id))) > EPSILON) rawPath.push(point)
  }
  const lastRawPoint = rawPath[rawPath.length - 1]
  if (length(subtract(toMetricPoint(lastRawPoint, query.world.aspectRatio), metricDestination)) > EPSILON) {
    rawPath.push(destination)
  } else {
    rawPath[rawPath.length - 1] = destination
  }

  if (options.smooth === false) return rawPath
  return smoothWalkablePath(rawPath, queryOptions, collisionSampleStep, smoothingLookahead)
}

export function getDebugCollisionGeometry(world: CollisionWorld = OVERWORLD_COLLISION): readonly DebugCollisionShape[] {
  if (world === OVERWORLD_COLLISION) return DEBUG_COLLISION_GEOMETRY
  return [
    { ...world.bounds, layer: 'bounds' },
    ...world.walkable.map((shape) => ({ ...shape, layer: 'walkable' as const })),
    ...world.blockers.map((shape) => ({ ...shape, layer: 'blocking' as const })),
  ]
}
