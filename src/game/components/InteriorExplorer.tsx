import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, DoorOpen, Gamepad2 } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { sitePath } from '../../lib/paths'
import type { InteriorScene } from '../data/interiors'
import type { Building } from '../data/world'
import { resolveMovement } from '../engine/collision'
import { getInteriorCollision } from '../engine/interiorCollision'

type InteriorTarget =
  | { kind: 'exhibit'; index: number; label: string }
  | { kind: 'exit'; label: string }
  | null

type InteriorExplorerProps = {
  building: Building
  scene: InteriorScene
  selectedIndex: number
  selectionOpen: boolean
  paused: boolean
  onInspect: (index: number) => void
  onExit: () => void
}

const movementKeys = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', 'W', 'A', 'S', 'D'])
const actionKeys = new Set(['Enter', ' ', 'e', 'E'])

function targetKey(target: InteriorTarget) {
  return target ? `${target.kind}:${target.kind === 'exhibit' ? target.index : 'door'}` : ''
}

export function InteriorExplorer({
  building,
  scene,
  selectedIndex,
  selectionOpen,
  paused,
  onInspect,
  onExit,
}: InteriorExplorerProps) {
  const navigation = useMemo(() => getInteriorCollision(building.id), [building.id])
  const [nearby, setNearby] = useState<InteriorTarget>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<HTMLDivElement>(null)
  const positionRef = useRef({ ...navigation.spawn })
  const keysRef = useRef(new Set<string>())
  const nearbyRef = useRef<InteriorTarget>(null)
  const nearbyKeyRef = useRef('')

  const findNearby = useCallback((point: { x: number; y: number }): InteriorTarget => {
    let closestTarget: InteriorTarget = null
    let closestDistance = Number.POSITIVE_INFINITY

    for (const [index, exhibit] of scene.exhibits.entries()) {
      const approach = navigation.exhibitApproaches[exhibit.id]
      if (!approach) continue
      const distance = Math.hypot(
        (point.x - approach.x) * navigation.world.aspectRatio,
        point.y - approach.y,
      )
      if (distance <= 6.8 && distance < closestDistance) {
        closestTarget = { kind: 'exhibit', index, label: exhibit.title }
        closestDistance = distance
      }
    }

    const exitDistance = Math.hypot(
      (point.x - navigation.exit.x) * navigation.world.aspectRatio,
      point.y - navigation.exit.y,
    )
    if (exitDistance <= navigation.exitRadius && exitDistance < closestDistance) {
      closestTarget = { kind: 'exit', label: 'Exit to district' }
    }

    return closestTarget
  }, [navigation, scene.exhibits])

  const refreshNearby = useCallback((point: { x: number; y: number }) => {
    const next = findNearby(point)
    nearbyRef.current = next
    const nextKey = targetKey(next)
    if (nextKey === nearbyKeyRef.current) return
    nearbyKeyRef.current = nextKey
    setNearby(next)
  }, [findNearby])

  const applyPosition = useCallback((point: { x: number; y: number }) => {
    positionRef.current = point
    if (playerRef.current) {
      playerRef.current.style.left = `${point.x}%`
      playerRef.current.style.top = `${point.y}%`
      playerRef.current.dataset.playerX = point.x.toFixed(2)
      playerRef.current.dataset.playerY = point.y.toFixed(2)
    }

    if (!stageRef.current) return
    if (window.innerWidth <= 760) {
      const stageWidth = stageRef.current.getBoundingClientRect().width
      const viewportWidth = stageRef.current.parentElement?.getBoundingClientRect().width ?? window.innerWidth
      if (stageWidth <= viewportWidth) {
        stageRef.current.style.setProperty('--room-camera-x', '0px')
        return
      }
      const centeredLeft = (viewportWidth - stageWidth) / 2
      const desiredLeft = viewportWidth / 2 - point.x / 100 * stageWidth
      const clampedLeft = Math.min(0, Math.max(viewportWidth - stageWidth, desiredLeft))
      stageRef.current.style.setProperty('--room-camera-x', `${clampedLeft - centeredLeft}px`)
    } else {
      stageRef.current.style.removeProperty('--room-camera-x')
    }
  }, [])

  const interact = useCallback(() => {
    const target = nearbyRef.current
    if (!target) return
    if (target.kind === 'exit') onExit()
    else onInspect(target.index)
  }, [onExit, onInspect])

  useEffect(() => {
    applyPosition(navigation.spawn)
    refreshNearby(navigation.spawn)
    stageRef.current?.focus({ preventScroll: true })
  }, [applyPosition, navigation.spawn, refreshNearby])

  useEffect(() => {
    const syncCamera = () => applyPosition(positionRef.current)
    window.addEventListener('resize', syncCamera)
    return () => window.removeEventListener('resize', syncCamera)
  }, [applyPosition])

  useEffect(() => {
    if (paused) {
      keysRef.current.clear()
      playerRef.current?.classList.remove('is-walking', 'is-colliding')
      return
    }

    stageRef.current?.focus({ preventScroll: true })
    let frame = 0
    let previousTime = performance.now()
    const tick = (now: number) => {
      const delta = Math.min(.04, (now - previousTime) / 1000)
      previousTime = now
      const keys = keysRef.current
      const horizontal = Number(keys.has('ArrowRight') || keys.has('d') || keys.has('D')) - Number(keys.has('ArrowLeft') || keys.has('a') || keys.has('A'))
      const vertical = Number(keys.has('ArrowDown') || keys.has('s') || keys.has('S')) - Number(keys.has('ArrowUp') || keys.has('w') || keys.has('W'))
      const magnitude = Math.hypot(horizontal, vertical)

      if (magnitude) {
        const speed = 10.2 * delta
        const dx = horizontal / magnitude * speed / navigation.world.aspectRatio
        const dy = vertical / magnitude * speed
        const resolution = resolveMovement(positionRef.current, { x: dx, y: dy }, {
          world: navigation.world,
          radius: navigation.playerRadius,
        })
        const moved = Math.hypot(resolution.appliedDelta.x, resolution.appliedDelta.y) > .001
        applyPosition(resolution.position)
        refreshNearby(resolution.position)
        playerRef.current?.classList.toggle('is-walking', moved)
        playerRef.current?.classList.toggle('is-colliding', resolution.collided)
        if (playerRef.current) {
          playerRef.current.dataset.direction = Math.abs(dx) > Math.abs(dy)
            ? (dx > 0 ? 'right' : 'left')
            : (dy > 0 ? 'down' : 'up')
        }
      } else {
        playerRef.current?.classList.remove('is-walking', 'is-colliding')
      }

      frame = window.requestAnimationFrame(tick)
    }

    frame = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(frame)
  }, [applyPosition, navigation, paused, refreshNearby])

  useEffect(() => {
    const clearKeys = () => keysRef.current.clear()
    const keyDown = (event: KeyboardEvent) => {
      if (paused) return
      const target = event.target as HTMLElement | null
      if (target?.matches('input, textarea, select, [contenteditable="true"]')) return

      if (movementKeys.has(event.key)) {
        event.preventDefault()
        keysRef.current.add(event.key)
        return
      }

      if (!actionKeys.has(event.key) || event.repeat) return
      if (event.key !== 'e' && event.key !== 'E' && target?.matches('button, a')) return
      event.preventDefault()
      interact()
    }
    const keyUp = (event: KeyboardEvent) => keysRef.current.delete(event.key)

    window.addEventListener('keydown', keyDown)
    window.addEventListener('keyup', keyUp)
    window.addEventListener('blur', clearKeys)
    return () => {
      window.removeEventListener('keydown', keyDown)
      window.removeEventListener('keyup', keyUp)
      window.removeEventListener('blur', clearKeys)
      clearKeys()
    }
  }, [interact, paused])

  const holdKey = useCallback((event: ReactPointerEvent<HTMLButtonElement>, key: string) => {
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    keysRef.current.add(key)
  }, [])
  const releaseKey = useCallback((key: string) => keysRef.current.delete(key), [])
  const promptLabel = nearby?.kind === 'exhibit' ? `Inspect ${nearby.label}` : nearby?.label ?? 'Walk to an exhibit'

  return (
    <>
      <div
        className="game-interior-canvas"
        ref={stageRef}
        data-room-id={building.id}
        role="region"
        aria-label={`${building.name} playable interior`}
        tabIndex={-1}
      >
        <img className="game-interior-image" src={sitePath(scene.image)} alt={`Inside ${building.name}, with several interactive exhibits around an open central floor`} draggable="false" />
        <div className="game-interior-grade" aria-hidden="true" />

        <div className="game-interior-hotspots" aria-label={`${building.name} exhibits`}>
          {scene.exhibits.map((item, index) => {
            const isNearby = nearby?.kind === 'exhibit' && nearby.index === index
            return (
              <button
                className={`${selectionOpen && index === selectedIndex ? 'is-selected' : ''}${isNearby ? ' is-nearby' : ''}`}
                type="button"
                key={`${building.id}:${item.id}`}
                style={{ left: `${item.position.x}%`, top: `${item.position.y}%` }}
                onClick={() => onInspect(index)}
                aria-label={`Inspect ${item.title}`}
                aria-pressed={selectionOpen && index === selectedIndex}
              >
                <span>{item.index}</span><b>{item.eyebrow}</b>
              </button>
            )
          })}
        </div>

        <button
          className={`game-room-exit-marker${nearby?.kind === 'exit' ? ' is-nearby' : ''}`}
          type="button"
          style={{ left: `${navigation.exit.x}%`, top: `${navigation.exit.y}%` }}
          onClick={onExit}
          aria-label="Exit to the Systems District"
        >
          <DoorOpen size={13} /><span>District</span>
        </button>

        <div
          className="game-room-player"
          ref={playerRef}
          data-direction="up"
          data-player-x={navigation.spawn.x.toFixed(2)}
          data-player-y={navigation.spawn.y.toFixed(2)}
          style={{ left: `${navigation.spawn.x}%`, top: `${navigation.spawn.y}%` }}
          aria-hidden="true"
        >
          <span className="game-player-shadow" />
          <span className="game-player-ring" />
          <span className="game-player-sprite" style={{ backgroundImage: `url(${sitePath('/game/characters/mauricio-sprites.webp')})` }} />
        </div>
      </div>

      <div className={`game-room-interaction-prompt${nearby ? ' is-ready' : ''}`} role="status" aria-live="polite">
        <span className="game-keycap">E</span>
        <span>{promptLabel}</span>
        <button type="button" onClick={interact} disabled={!nearby}>{nearby?.kind === 'exit' ? 'Exit' : 'Inspect'}</button>
      </div>

      {!paused ? (
        <div className="game-room-touch-controls" aria-label="Interior touch controls">
          <div className="game-room-touch-dpad">
            <button className="is-up" type="button" aria-label="Move up" onPointerDown={(event) => holdKey(event, 'ArrowUp')} onPointerUp={() => releaseKey('ArrowUp')} onPointerCancel={() => releaseKey('ArrowUp')} onLostPointerCapture={() => releaseKey('ArrowUp')}><ChevronUp size={18} /></button>
            <button className="is-left" type="button" aria-label="Move left" onPointerDown={(event) => holdKey(event, 'ArrowLeft')} onPointerUp={() => releaseKey('ArrowLeft')} onPointerCancel={() => releaseKey('ArrowLeft')} onLostPointerCapture={() => releaseKey('ArrowLeft')}><ChevronLeft size={18} /></button>
            <button className="is-right" type="button" aria-label="Move right" onPointerDown={(event) => holdKey(event, 'ArrowRight')} onPointerUp={() => releaseKey('ArrowRight')} onPointerCancel={() => releaseKey('ArrowRight')} onLostPointerCapture={() => releaseKey('ArrowRight')}><ChevronRight size={18} /></button>
            <button className="is-down" type="button" aria-label="Move down" onPointerDown={(event) => holdKey(event, 'ArrowDown')} onPointerUp={() => releaseKey('ArrowDown')} onPointerCancel={() => releaseKey('ArrowDown')} onLostPointerCapture={() => releaseKey('ArrowDown')}><ChevronDown size={18} /></button>
          </div>
          <button className={`game-room-touch-action${nearby ? ' is-ready' : ''}`} type="button" onClick={interact} disabled={!nearby} aria-label={promptLabel}>
            <Gamepad2 size={17} /><span>{nearby?.kind === 'exit' ? 'Exit' : 'Inspect'}</span>
          </button>
        </div>
      ) : null}
    </>
  )
}
