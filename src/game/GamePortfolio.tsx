import {
  Accessibility,
  BookOpen,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Compass,
  DoorOpen,
  Gamepad2,
  Home,
  Map,
  MessageCircle,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  Zap,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { sitePath } from '../lib/paths'
import {
  AtlasDrawer,
  CompletionPanel,
  DialoguePanel,
  DossierPanel,
  RoomScene,
  StartScreen,
} from './components/GamePanels'
import {
  buildings,
  getBuilding,
  npcs,
  spawnPoint,
  type Building,
  type BuildingId,
  type Npc,
  type NpcId,
  type Point,
} from './data/world'
import { findWalkablePath, resolveMovement, WORLD_ASPECT_RATIO } from './engine/collision'
import './game.css'

type NearbyTarget =
  | { kind: 'building'; id: BuildingId; label: string }
  | { kind: 'npc'; id: NpcId; label: string }
  | null

type CueName = 'navigate' | 'talk' | 'door' | 'complete'

const progressKey = 'mb-systems-district-progress'
const completionKey = 'mb-systems-district-complete-v2'
const movementKeys = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', 'W', 'A', 'S', 'D'])

function distance(a: Point, b: Point) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

function findNearby(point: Point): NearbyTarget {
  let closest: { target: NearbyTarget; distance: number } | null = null

  for (const building of buildings) {
    const currentDistance = distance(point, building.door)
    if (currentDistance <= 5.4 && (!closest || currentDistance < closest.distance)) {
      closest = { target: { kind: 'building', id: building.id, label: building.name }, distance: currentDistance }
    }
  }

  for (const npc of npcs) {
    const currentDistance = distance(point, npc.position)
    if (currentDistance <= 3.8 && (!closest || currentDistance < closest.distance)) {
      closest = { target: { kind: 'npc', id: npc.id, label: npc.name }, distance: currentDistance }
    }
  }

  return closest?.target ?? null
}

function readVisited(): BuildingId[] {
  try {
    const stored = JSON.parse(window.localStorage.getItem(progressKey) ?? '[]') as string[]
    const validIds = new Set(buildings.map((building) => building.id))
    return stored.filter((id): id is BuildingId => validIds.has(id as BuildingId))
  } catch {
    return []
  }
}

function emitCue(contextRef: React.MutableRefObject<AudioContext | null>, cue: CueName) {
  const AudioContextConstructor = window.AudioContext
  if (!AudioContextConstructor) return
  const context = contextRef.current ?? new AudioContextConstructor()
  contextRef.current = context
  if (context.state === 'suspended') void context.resume()

  const notes: Record<CueName, number[]> = {
    navigate: [330],
    talk: [520, 660],
    door: [196, 293.7, 392],
    complete: [261.6, 329.6, 392, 523.3],
  }
  const now = context.currentTime
  notes[cue].forEach((frequency, index) => {
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    oscillator.type = cue === 'navigate' ? 'sine' : 'triangle'
    oscillator.frequency.value = frequency
    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.exponentialRampToValueAtTime(cue === 'complete' ? 0.065 : 0.035, now + 0.015 + index * 0.025)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22 + index * 0.075)
    oscillator.connect(gain).connect(context.destination)
    oscillator.start(now + index * 0.055)
    oscillator.stop(now + 0.32 + index * 0.08)
  })
}

function targetKey(target: NearbyTarget) {
  return target ? `${target.kind}:${target.id}` : ''
}

export function GamePortfolio() {
  const [started, setStarted] = useState(false)
  const [visited, setVisited] = useState<BuildingId[]>(readVisited)
  const [activeRoom, setActiveRoom] = useState<BuildingId | null>(null)
  const [activeNpc, setActiveNpc] = useState<NpcId | null>(null)
  const [dialogueIndex, setDialogueIndex] = useState(0)
  const [atlasOpen, setAtlasOpen] = useState(false)
  const [dossierOpen, setDossierOpen] = useState(false)
  const [celebrationOpen, setCelebrationOpen] = useState(false)
  const [completionSeen, setCompletionSeen] = useState(() => {
    try { return window.localStorage.getItem(completionKey) === 'true' } catch { return false }
  })
  const [nearby, setNearby] = useState<NearbyTarget>(null)
  const [isTraveling, setIsTraveling] = useState(false)
  const [enteringRoom, setEnteringRoom] = useState<BuildingId | null>(null)
  const [soundOn, setSoundOn] = useState(false)
  const [reducedEffects, setReducedEffects] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [toast, setToast] = useState('')

  const playerRef = useRef<HTMLDivElement>(null)
  const worldStageRef = useRef<HTMLDivElement>(null)
  const positionRef = useRef<Point>({ ...spawnPoint })
  const keysRef = useRef(new Set<string>())
  const travelFrameRef = useRef<number | null>(null)
  const transitionTimerRef = useRef<number | null>(null)
  const toastTimerRef = useRef<number | null>(null)
  const nearbyKeyRef = useRef('')
  const audioContextRef = useRef<AudioContext | null>(null)
  const overlayReturnFocusRef = useRef<HTMLElement | null>(null)

  const activeNpcData = useMemo(() => npcs.find((npc) => npc.id === activeNpc) ?? null, [activeNpc])
  const visitedSet = useMemo(() => new Set(visited), [visited])
  const overlaysOpen = Boolean(activeRoom || activeNpc || atlasOpen || dossierOpen || celebrationOpen || enteringRoom)
  const canMove = started && !overlaysOpen && !isTraveling

  const applyPlayerPosition = useCallback((point: Point) => {
    positionRef.current = point
    if (playerRef.current) {
      playerRef.current.style.left = `${point.x}%`
      playerRef.current.style.top = `${point.y}%`
    }
    if (worldStageRef.current) {
      if (window.innerWidth <= 760) {
        const stageWidth = worldStageRef.current.getBoundingClientRect().width
        const centeredLeft = (window.innerWidth - stageWidth) / 2
        const desiredLeft = window.innerWidth / 2 - point.x / 100 * stageWidth
        const clampedLeft = Math.min(0, Math.max(window.innerWidth - stageWidth, desiredLeft))
        worldStageRef.current.style.transform = `translate3d(${clampedLeft - centeredLeft}px, 0, 0)`
      } else {
        worldStageRef.current.style.transform = ''
      }
    }
  }, [])

  const refreshNearby = useCallback((point: Point) => {
    const next = findNearby(point)
    const nextKey = targetKey(next)
    if (nearbyKeyRef.current === nextKey) return
    nearbyKeyRef.current = nextKey
    setNearby(next)
  }, [])

  const showToast = useCallback((message: string) => {
    setToast(message)
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current)
    toastTimerRef.current = window.setTimeout(() => setToast(''), 2600)
  }, [])

  const cue = useCallback((name: CueName) => {
    if (soundOn) emitCue(audioContextRef, name)
  }, [soundOn])

  const rememberOverlayTrigger = useCallback(() => {
    const activeElement = document.activeElement
    if (!(activeElement instanceof HTMLElement) || activeElement === document.body) return
    if (!activeElement.closest('.game-overlay')) overlayReturnFocusRef.current = activeElement
  }, [])

  const restoreOverlayTrigger = useCallback(() => {
    const previous = overlayReturnFocusRef.current
    overlayReturnFocusRef.current = null
    window.requestAnimationFrame(() => {
      const fallback = document.querySelector<HTMLElement>('.game-command-actions button:not([tabindex="-1"])')
      const target = previous?.isConnected ? previous : fallback
      target?.focus({ preventScroll: true })
    })
  }, [])

  const discoverBuilding = useCallback((id: BuildingId) => {
    setVisited((current) => current.includes(id) ? current : [...current, id])
  }, [])

  const openRoom = useCallback((id: BuildingId) => {
    if (transitionTimerRef.current) window.clearTimeout(transitionTimerRef.current)
    rememberOverlayTrigger()
    setEnteringRoom(id)
    setAtlasOpen(false)
    setDossierOpen(false)
    cue('door')
    transitionTimerRef.current = window.setTimeout(() => {
      setActiveRoom(id)
      setEnteringRoom(null)
      transitionTimerRef.current = null
    }, reducedEffects ? 100 : 720)
  }, [cue, reducedEffects, rememberOverlayTrigger])

  const openNpc = useCallback((id: NpcId) => {
    rememberOverlayTrigger()
    setDialogueIndex(0)
    setActiveNpc(id)
    cue('talk')
  }, [cue, rememberOverlayTrigger])

  const travelTo = useCallback((destination: Point, onArrive: () => void) => {
    if (travelFrameRef.current) window.cancelAnimationFrame(travelFrameRef.current)
    keysRef.current.clear()
    setIsTraveling(true)

    const start = { ...positionRef.current }
    const points = findWalkablePath(start, destination)
    if (!points) {
      setIsTraveling(false)
      showToast('No safe route found from this position. Return to the paved path and try again.')
      return
    }
    if (points.length === 1) {
      refreshNearby(destination)
      setIsTraveling(false)
      onArrive()
      return
    }
    const segments = points.slice(1).map((point, index) => ({
      start: points[index],
      end: point,
      length: Math.hypot((point.x - points[index].x) * WORLD_ASPECT_RATIO, point.y - points[index].y),
    }))
    const totalLength = segments.reduce((sum, segment) => sum + segment.length, 0)
    const duration = reducedEffects ? 80 : Math.min(1750, Math.max(680, totalLength * 22))
    const startedAt = performance.now()

    const animate = (now: number) => {
      const rawProgress = Math.min(1, (now - startedAt) / duration)
      const progress = 1 - (1 - rawProgress) ** 3
      let remaining = totalLength * progress
      let nextPoint = destination

      for (const segment of segments) {
        if (remaining <= segment.length) {
          const t = segment.length ? remaining / segment.length : 1
          nextPoint = {
            x: segment.start.x + (segment.end.x - segment.start.x) * t,
            y: segment.start.y + (segment.end.y - segment.start.y) * t,
          }
          break
        }
        remaining -= segment.length
      }

      const movementX = nextPoint.x - positionRef.current.x
      const movementY = nextPoint.y - positionRef.current.y
      if (playerRef.current && Math.hypot(movementX, movementY) > .01) {
        playerRef.current.dataset.direction = Math.abs(movementX) > Math.abs(movementY)
          ? (movementX > 0 ? 'right' : 'left')
          : (movementY > 0 ? 'down' : 'up')
      }
      applyPlayerPosition(nextPoint)
      playerRef.current?.classList.toggle('is-walking', rawProgress < 1)

      if (rawProgress < 1) {
        travelFrameRef.current = window.requestAnimationFrame(animate)
        return
      }

      applyPlayerPosition(destination)
      refreshNearby(destination)
      playerRef.current?.classList.remove('is-walking')
      travelFrameRef.current = null
      setIsTraveling(false)
      onArrive()
    }

    cue('navigate')
    travelFrameRef.current = window.requestAnimationFrame(animate)
  }, [applyPlayerPosition, cue, reducedEffects, refreshNearby, showToast])

  const visitBuilding = useCallback((building: Building) => {
    travelTo(building.door, () => openRoom(building.id))
  }, [openRoom, travelTo])

  const visitNpc = useCallback((npc: Npc) => {
    travelTo(npc.position, () => openNpc(npc.id))
  }, [openNpc, travelTo])

  const interact = useCallback(() => {
    if (!nearby) {
      showToast('Follow a lit path toward a doorway or district guide.')
      return
    }
    if (nearby.kind === 'building') openRoom(nearby.id)
    else openNpc(nearby.id)
  }, [nearby, openNpc, openRoom, showToast])

  const closeDialogue = useCallback(() => {
    setActiveNpc(null)
    setDialogueIndex(0)
    restoreOverlayTrigger()
  }, [restoreOverlayTrigger])

  const closeRoom = useCallback(() => {
    setActiveRoom(null)
    restoreOverlayTrigger()
  }, [restoreOverlayTrigger])

  const openAtlas = useCallback(() => {
    rememberOverlayTrigger()
    setAtlasOpen(true)
    setDossierOpen(false)
  }, [rememberOverlayTrigger])

  const closeAtlas = useCallback(() => {
    setAtlasOpen(false)
    restoreOverlayTrigger()
  }, [restoreOverlayTrigger])

  const openDossier = useCallback(() => {
    rememberOverlayTrigger()
    setDossierOpen(true)
    setAtlasOpen(false)
  }, [rememberOverlayTrigger])

  const closeDossier = useCallback(() => {
    setDossierOpen(false)
    restoreOverlayTrigger()
  }, [restoreOverlayTrigger])

  const closeCelebration = useCallback(() => {
    setCelebrationOpen(false)
    restoreOverlayTrigger()
  }, [restoreOverlayTrigger])

  const advanceDialogue = useCallback(() => {
    if (!activeNpcData) return
    if (dialogueIndex >= activeNpcData.dialogue.length - 1) closeDialogue()
    else {
      setDialogueIndex((index) => index + 1)
      cue('talk')
    }
  }, [activeNpcData, closeDialogue, cue, dialogueIndex])

  const resetProgress = useCallback(() => {
    setVisited([])
    setCompletionSeen(false)
    setCelebrationOpen(false)
    applyPlayerPosition(spawnPoint)
    try {
      window.localStorage.removeItem(progressKey)
      window.localStorage.removeItem(completionKey)
    } catch { /* in-memory fallback */ }
    showToast('District signals reset. The map is yours again.')
  }, [applyPlayerPosition, showToast])

  const toggleSound = () => {
    const nextValue = !soundOn
    setSoundOn(nextValue)
    if (nextValue) emitCue(audioContextRef, 'navigate')
  }

  const startGame = () => {
    setStarted(true)
    applyPlayerPosition(spawnPoint)
    showToast('Seven buildings. Seven district signals. Wander in any order.')
  }

  const openDossierFromStart = () => {
    setStarted(true)
    openDossier()
  }

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    const previousTitle = document.title
    const themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
    const previousThemeColor = themeColor?.content
    document.body.style.overflow = 'hidden'
    document.body.classList.add('systems-district-active')
    document.title = 'The Systems District — Mauricio Berlanga Interactive Portfolio'
    if (themeColor) themeColor.content = '#071b27'
    return () => {
      document.body.style.overflow = previousOverflow
      document.body.classList.remove('systems-district-active')
      document.title = previousTitle
      if (themeColor && previousThemeColor) themeColor.content = previousThemeColor
    }
  }, [])

  useEffect(() => {
    try { window.localStorage.setItem(progressKey, JSON.stringify(visited)) } catch { /* in-memory fallback */ }
  }, [visited])

  useEffect(() => {
    if (!started || activeRoom || enteringRoom || completionSeen || celebrationOpen || visited.length !== buildings.length) return
    const timer = window.setTimeout(() => {
      rememberOverlayTrigger()
      setCelebrationOpen(true)
      setCompletionSeen(true)
      try { window.localStorage.setItem(completionKey, 'true') } catch { /* in-memory fallback */ }
      cue('complete')
    }, reducedEffects ? 120 : 620)
    return () => window.clearTimeout(timer)
  }, [activeRoom, celebrationOpen, completionSeen, cue, enteringRoom, reducedEffects, rememberOverlayTrigger, started, visited.length])

  useEffect(() => {
    if (!canMove) {
      keysRef.current.clear()
      playerRef.current?.classList.remove('is-walking')
      return
    }

    let frame = 0
    let previousTime = performance.now()
    const tick = (now: number) => {
      const delta = Math.min(0.04, (now - previousTime) / 1000)
      previousTime = now
      const keys = keysRef.current
      const horizontal = Number(keys.has('ArrowRight') || keys.has('d') || keys.has('D')) - Number(keys.has('ArrowLeft') || keys.has('a') || keys.has('A'))
      const vertical = Number(keys.has('ArrowDown') || keys.has('s') || keys.has('S')) - Number(keys.has('ArrowUp') || keys.has('w') || keys.has('W'))
      const magnitude = Math.hypot(horizontal, vertical)

      if (magnitude) {
        const speed = 8.7 * delta
        const dx = horizontal / magnitude * speed / WORLD_ASPECT_RATIO
        const dy = vertical / magnitude * speed
        const current = positionRef.current
        const resolution = resolveMovement(current, { x: dx, y: dy })
        const accepted = resolution.position
        const moved = Math.hypot(resolution.appliedDelta.x, resolution.appliedDelta.y) > .001
        applyPlayerPosition(accepted)
        refreshNearby(accepted)
        playerRef.current?.classList.toggle('is-walking', moved)
        playerRef.current?.classList.toggle('is-colliding', resolution.collided)
        if (playerRef.current) playerRef.current.dataset.direction = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up')
      } else {
        playerRef.current?.classList.remove('is-walking')
        playerRef.current?.classList.remove('is-colliding')
      }
      frame = window.requestAnimationFrame(tick)
    }
    frame = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(frame)
  }, [applyPlayerPosition, canMove, refreshNearby])

  useEffect(() => {
    const keyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      if (target?.matches('input, textarea, select, [contenteditable="true"]')) return

      if (event.key === 'Escape') {
        if (celebrationOpen) closeCelebration()
        else if (activeRoom) closeRoom()
        else if (activeNpc) closeDialogue()
        else if (dossierOpen) closeDossier()
        else if (atlasOpen) closeAtlas()
        return
      }

      if (started && !activeRoom && !activeNpc && !celebrationOpen && (event.key === 'm' || event.key === 'M')) {
        event.preventDefault()
        if (atlasOpen) closeAtlas()
        else openAtlas()
        return
      }
      if (started && !activeRoom && !activeNpc && !celebrationOpen && (event.key === 'p' || event.key === 'P')) {
        event.preventDefault()
        if (dossierOpen) closeDossier()
        else openDossier()
        return
      }
      if (canMove && ['Enter', 'e', 'E', ' '].includes(event.key) && !event.repeat) {
        if (event.key !== 'e' && event.key !== 'E' && target?.closest('button, a, [role="button"]')) return
        event.preventDefault()
        interact()
        return
      }
      if (canMove && movementKeys.has(event.key)) {
        event.preventDefault()
        keysRef.current.add(event.key)
      }
    }
    const keyUp = (event: KeyboardEvent) => keysRef.current.delete(event.key)
    window.addEventListener('keydown', keyDown)
    window.addEventListener('keyup', keyUp)
    return () => {
      window.removeEventListener('keydown', keyDown)
      window.removeEventListener('keyup', keyUp)
    }
  }, [activeNpc, activeRoom, atlasOpen, canMove, celebrationOpen, closeAtlas, closeCelebration, closeDialogue, closeDossier, closeRoom, dossierOpen, interact, openAtlas, openDossier, started])

  useEffect(() => {
    applyPlayerPosition(positionRef.current)
    refreshNearby(positionRef.current)
    const syncCamera = () => applyPlayerPosition(positionRef.current)
    window.addEventListener('resize', syncCamera)
    return () => {
      window.removeEventListener('resize', syncCamera)
      if (travelFrameRef.current) window.cancelAnimationFrame(travelFrameRef.current)
      if (transitionTimerRef.current) window.clearTimeout(transitionTimerRef.current)
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current)
    }
  }, [applyPlayerPosition, refreshNearby])

  return (
    <div className="game-app" data-started={started} data-reduced-effects={reducedEffects}>
      <a className="game-access-skip" href="#game-command-bar" tabIndex={started && !overlaysOpen ? 0 : -1}>Skip to game controls</a>

      <div className="game-world" role="region" aria-label="The Systems District interactive map" aria-hidden={!started || overlaysOpen}>
        <div className="game-world-stage" ref={worldStageRef}>
          <img className="game-world-map" src={sitePath('/game-world-map.webp')} alt="Illustrated island district with seven buildings connected by paths" draggable="false" />
          <div className="game-world-grade" aria-hidden="true" />
          <div className="game-water-glint game-water-glint-one" aria-hidden="true" />
          <div className="game-water-glint game-water-glint-two" aria-hidden="true" />

          {buildings.map((building) => {
            const online = visitedSet.has(building.id)
            return (
              <div className={`game-landmark game-landmark-${building.id}${online ? ' is-online' : ''}`} key={building.id}>
                <span
                  className="game-door-signal"
                  style={{ left: `${building.door.x}%`, top: `${building.door.y}%`, '--landmark-accent': building.accent } as React.CSSProperties}
                  aria-hidden="true"
                />
                <button
                  className="game-landmark-button"
                  type="button"
                  style={{ left: `${building.label.x}%`, top: `${building.label.y}%`, '--landmark-accent': building.accent } as React.CSSProperties}
                  onClick={() => visitBuilding(building)}
                  tabIndex={started && !overlaysOpen ? 0 : -1}
                  aria-label={`${online ? 'Revisit' : 'Visit'} ${building.name}: ${building.description}`}
                >
                  <span className="game-landmark-state">{online ? <Check size={11} /> : <span />}{online ? 'Signal online' : building.eyebrow}</span>
                  <strong>{building.name}</strong>
                  <span className="game-landmark-action"><DoorOpen size={13} /> Enter</span>
                </button>
              </div>
            )
          })}

          {npcs.map((npc) => (
            <button
              className="game-npc"
              type="button"
              key={npc.id}
              style={{ left: `${npc.position.x}%`, top: `${npc.position.y}%`, '--npc-accent': npc.accent } as React.CSSProperties}
              onClick={() => visitNpc(npc)}
              tabIndex={started && !overlaysOpen ? 0 : -1}
              aria-label={`Speak with ${npc.name}, ${npc.role}`}
            >
              <span
                className="game-npc-sprite"
                style={{
                  backgroundImage: `url(${sitePath('/game/characters/district-npcs.webp')})`,
                  backgroundPosition: `${npc.sprite.column * 50}% ${npc.sprite.row * 100}%`,
                }}
                aria-hidden="true"
              />
              <span className="game-npc-label"><b>{npc.name}</b><small>{npc.role}</small></span>
              <MessageCircle className="game-npc-chat" size={12} />
            </button>
          ))}

          <div
            className="game-player"
            ref={playerRef}
            style={{ left: `${spawnPoint.x}%`, top: `${spawnPoint.y}%` }}
            aria-hidden="true"
          >
            <span className="game-player-shadow" />
            <span className="game-player-ring" />
            <span className="game-player-sprite" style={{ backgroundImage: `url(${sitePath('/game/characters/mauricio-sprites.webp')})` }} />
            <span className="game-player-name">Mauricio</span>
          </div>
        </div>
      </div>

      {started ? (
        <>
          <header className="game-command-bar" id="game-command-bar" aria-hidden={overlaysOpen}>
            <div className="game-brand-lockup">
              <span className="game-brand-mark">MB</span>
              <span><b>The Systems District</b><small>{activeRoom ? getBuilding(activeRoom).name : 'Overworld · Interface Plaza'}</small></span>
            </div>

            <div className="game-signal-progress" aria-label={`${visited.length} of ${buildings.length} district signals online`}>
              {buildings.map((building) => (
                <span
                  key={building.id}
                  className={visitedSet.has(building.id) ? 'is-online' : ''}
                  style={{ '--signal-accent': building.accent } as React.CSSProperties}
                  title={`${building.name}: ${visitedSet.has(building.id) ? 'online' : 'unvisited'}`}
                />
              ))}
              <b>{visited.length}/{buildings.length}</b>
            </div>

            <nav className="game-command-actions" aria-label="Game and portfolio controls">
              <button type="button" tabIndex={overlaysOpen ? -1 : 0} aria-label="Open district atlas" onClick={openAtlas}><Map size={15} /><span>Atlas</span></button>
              <button type="button" tabIndex={overlaysOpen ? -1 : 0} aria-label="Open portfolio dossier" onClick={openDossier}><BookOpen size={15} /><span>Dossier</span></button>
              <button type="button" tabIndex={overlaysOpen ? -1 : 0} aria-label={reducedEffects ? 'Use full motion effects' : 'Reduce motion effects'} onClick={() => setReducedEffects((value) => !value)} aria-pressed={reducedEffects} title="Toggle reduced effects"><Accessibility size={15} /><span>Motion</span></button>
              <button type="button" tabIndex={overlaysOpen ? -1 : 0} aria-label={soundOn ? 'Mute sound cues' : 'Enable sound cues'} onClick={toggleSound} aria-pressed={soundOn} title={soundOn ? 'Mute sound cues' : 'Enable sound cues'}>{soundOn ? <Volume2 size={15} /> : <VolumeX size={15} />}<span>Sound</span></button>
              <a href={sitePath('/')} tabIndex={overlaysOpen ? -1 : 0} title="Return to the classic portfolio"><Home size={15} /><span>Portfolio</span></a>
            </nav>
          </header>

          <div className="game-world-caption">
            <Compass size={14} />
            <span><b>Interface Plaza</b><small>Choose any path. Nothing important is locked.</small></span>
          </div>

          <div className={`game-interaction-prompt${nearby ? ' is-visible' : ''}`} aria-live="polite">
            <span className="game-keycap">E</span>
            <span>{nearby?.kind === 'building' ? 'Enter' : 'Speak with'} <b>{nearby?.label}</b></span>
            <button type="button" onClick={interact} tabIndex={nearby && canMove ? 0 : -1} disabled={!canMove}>Interact</button>
          </div>

          <div className="game-controls-hint" aria-hidden="true"><span><i>WASD</i> Move</span><span><i>E</i> Interact</span><span><i>M</i> Atlas</span><span><i>P</i> Dossier</span></div>
          {!overlaysOpen && !isTraveling ? <div className="game-touch-controls" aria-label="Touch movement controls">
            <div className="game-touch-dpad">
              <button className="is-up" type="button" aria-label="Move up" onPointerDown={(event) => { event.preventDefault(); keysRef.current.add('ArrowUp') }} onPointerUp={() => keysRef.current.delete('ArrowUp')} onPointerCancel={() => keysRef.current.delete('ArrowUp')} onPointerLeave={() => keysRef.current.delete('ArrowUp')}><ChevronUp size={18} /></button>
              <button className="is-left" type="button" aria-label="Move left" onPointerDown={(event) => { event.preventDefault(); keysRef.current.add('ArrowLeft') }} onPointerUp={() => keysRef.current.delete('ArrowLeft')} onPointerCancel={() => keysRef.current.delete('ArrowLeft')} onPointerLeave={() => keysRef.current.delete('ArrowLeft')}><ChevronLeft size={18} /></button>
              <button className="is-right" type="button" aria-label="Move right" onPointerDown={(event) => { event.preventDefault(); keysRef.current.add('ArrowRight') }} onPointerUp={() => keysRef.current.delete('ArrowRight')} onPointerCancel={() => keysRef.current.delete('ArrowRight')} onPointerLeave={() => keysRef.current.delete('ArrowRight')}><ChevronRight size={18} /></button>
              <button className="is-down" type="button" aria-label="Move down" onPointerDown={(event) => { event.preventDefault(); keysRef.current.add('ArrowDown') }} onPointerUp={() => keysRef.current.delete('ArrowDown')} onPointerCancel={() => keysRef.current.delete('ArrowDown')} onPointerLeave={() => keysRef.current.delete('ArrowDown')}><ChevronDown size={18} /></button>
            </div>
            <button className={`game-touch-action${nearby ? ' is-ready' : ''}`} type="button" onClick={interact} aria-label={nearby ? `${nearby.kind === 'building' ? 'Enter' : 'Speak with'} ${nearby.label}` : 'Interact'}><Gamepad2 size={17} /><span>{nearby ? `${nearby.kind === 'building' ? 'Enter' : 'Talk'} · ${nearby.label}` : 'Interact'}</span></button>
          </div> : null}
          <button className="game-reset-button" type="button" tabIndex={overlaysOpen ? -1 : 0} onClick={resetProgress} title="Reset district progress"><RotateCcw size={13} /> Reset</button>
        </>
      ) : null}

      {toast ? <div className="game-toast" role="status"><Zap size={14} />{toast}</div> : null}

      {!started ? <StartScreen onStart={startGame} onDossier={openDossierFromStart} mapUrl={sitePath('/game-world-map.webp')} /> : null}

      {activeNpcData ? (
        <DialoguePanel npc={activeNpcData} index={dialogueIndex} onAdvance={advanceDialogue} onClose={closeDialogue} />
      ) : null}

      {activeRoom ? (
        <RoomScene
          key={activeRoom}
          building={getBuilding(activeRoom)}
          visitedCount={visited.length}
          isVisited={visitedSet.has(activeRoom)}
          onClose={closeRoom}
          onDiscover={discoverBuilding}
          onOpenBuilding={(id) => openRoom(id)}
        />
      ) : null}

      {atlasOpen ? (
        <AtlasDrawer
          visited={visitedSet}
          onClose={closeAtlas}
          onVisit={(building) => { setAtlasOpen(false); visitBuilding(building) }}
        />
      ) : null}

      {dossierOpen ? (
        <DossierPanel
          visited={visitedSet}
          onClose={closeDossier}
          onOpenBuilding={(id) => openRoom(id)}
        />
      ) : null}

      {celebrationOpen ? (
        <CompletionPanel
          onClose={closeCelebration}
          onContact={() => { setCelebrationOpen(false); openRoom('signal') }}
        />
      ) : null}

      {enteringRoom ? (
        <div className="game-door-transition" style={{ '--door-accent': getBuilding(enteringRoom).accent } as React.CSSProperties} role="status" aria-live="polite">
          <div><span>Crossing the threshold</span><strong>{getBuilding(enteringRoom).name}</strong><i /></div>
        </div>
      ) : null}

      <div className="game-corner-signature" aria-hidden="true"><Sparkles size={12} /> Original interactive portfolio · 2026</div>
    </div>
  )
}
