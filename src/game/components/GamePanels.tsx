import {
  AudioWaveform,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  BrainCircuit,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  Code2,
  Copy,
  DoorOpen,
  ExternalLink,
  Factory,
  FlaskConical,
  Gamepad2,
  GraduationCap,
  Layers3,
  Library,
  Mail,
  MapPin,
  MessageCircle,
  Orbit,
  Palette,
  RadioTower,
  Search,
  Sparkles,
  Telescope,
  TreePalm,
  TrainFront,
  X,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { sitePath } from '../../lib/paths'
import {
  getPersonalInterest,
  type PersonalInterestId,
} from '../data/interests'
import { interiorScenes, type InteriorExhibit } from '../data/interiors'
import { InteriorExplorer } from './InteriorExplorer'
import {
  buildings,
  gameContent,
  type Building,
  type BuildingId,
  type Npc,
} from '../data/world'

const buildingIcons: Record<BuildingId, LucideIcon> = {
  foundry: Factory,
  observatory: Telescope,
  lab: FlaskConical,
  archive: Library,
  station: TrainFront,
  signal: RadioTower,
  conservatory: AudioWaveform,
}

const projectImages: Record<string, string | undefined> = {
  forecast: '/articles/usdmxn-social.png',
  routing: '/articles/model-routing-social.png',
  orchestration: '/articles/colmo-social.png',
}

type StartScreenProps = {
  mapUrl: string
  onStart: () => void
  onDossier: () => void
}

export function StartScreen({ mapUrl, onStart, onDossier }: StartScreenProps) {
  return (
    <section className="game-start-screen" aria-labelledby="game-start-title">
      <img src={mapUrl} alt="" className="game-start-map" aria-hidden="true" />
      <div className="game-start-shade" />
      <button className="game-start-skip" type="button" onClick={onDossier}>Skip exploration · Open dossier</button>

      <div className="game-start-content">
        <div className="game-start-overline"><span>MB</span><i />Playable case study · Original world</div>
        <h1 id="game-start-title">The <em>Systems</em><br />District</h1>
        <p className="game-start-lead">Control Mauricio through a living portfolio of platforms, intelligent systems, and work built to last.</p>
        <div className="game-start-actions">
          <button className="game-modern-button game-modern-button-primary" type="button" onClick={onStart}>
            Enter the district <ArrowRight size={17} />
          </button>
          <button className="game-modern-button game-modern-button-quiet" type="button" onClick={onDossier}>
            Open portfolio dossier <BookOpen size={16} />
          </button>
        </div>
        <p className="game-start-note">WASD / arrows · collision-aware world · seven explorable rooms · sound optional</p>
      </div>

      <div className="game-start-metrics" aria-label="Career highlights">
        <span><b>9+</b><small>Years engineering</small></span>
        <span><b>6+</b><small>Years at Walmart</small></span>
        <span><b>04</b><small>Featured AI systems</small></span>
        <span><b>10K+</b><small>Users reached</small></span>
      </div>

      <div className="game-start-coordinate"><MapPin size={13} /> Bentonville, Arkansas · 36.3729° N</div>
    </section>
  )
}

type DialoguePanelProps = {
  npc: Npc
  index: number
  onAdvance: () => void
  onClose: () => void
}

export function DialoguePanel({ npc, index, onAdvance, onClose }: DialoguePanelProps) {
  const finalLine = index === npc.dialogue.length - 1
  return (
    <div className="game-overlay game-dialogue-overlay" role="dialog" aria-modal="true" aria-labelledby="game-dialogue-name">
      <button className="game-overlay-dismiss" type="button" onClick={onClose} aria-label="Close conversation" />
      <section className="game-dialogue-sheet" style={{ '--dialogue-accent': npc.accent } as CSSProperties}>
        <div className="game-dialogue-avatar">
          <span
            className="game-dialogue-character"
            style={{
              backgroundImage: `url(${sitePath('/game/characters/district-npcs.webp')})`,
              backgroundPosition: `${npc.sprite.column * 50}% ${npc.sprite.row * 100}%`,
            }}
            aria-hidden="true"
          />
          <i />
        </div>
        <div className="game-dialogue-copy">
          <div className="game-dialogue-heading"><span><b id="game-dialogue-name">{npc.name}</b><small>{npc.role}</small></span><span>{String(index + 1).padStart(2, '0')} / {String(npc.dialogue.length).padStart(2, '0')}</span></div>
          <p key={`${npc.id}-${index}`} aria-live="polite">{npc.dialogue[index]}</p>
          <div className="game-dialogue-dots" aria-hidden="true">{npc.dialogue.map((_, dotIndex) => <i className={dotIndex <= index ? 'is-active' : ''} key={dotIndex} />)}</div>
        </div>
        <div className="game-dialogue-actions">
          <button className="game-icon-close" type="button" onClick={onClose} aria-label="Close conversation" autoFocus><X size={17} /></button>
          <button className="game-modern-button game-modern-button-dark" type="button" onClick={onAdvance}>{finalLine ? 'Close' : 'Continue'} <ArrowRight size={15} /></button>
        </div>
      </section>
    </div>
  )
}

type AtlasDrawerProps = {
  visited: Set<BuildingId>
  onClose: () => void
  onVisit: (building: Building) => void
}

export function AtlasDrawer({ visited, onClose, onVisit }: AtlasDrawerProps) {
  return (
    <div className="game-overlay game-drawer-overlay" role="dialog" aria-modal="true" aria-labelledby="atlas-title">
      <button className="game-overlay-dismiss" type="button" onClick={onClose} aria-label="Close atlas" />
      <aside className="game-atlas-drawer">
        <header className="game-panel-header">
          <div><p>District navigation</p><h2 id="atlas-title">Atlas</h2></div>
          <button className="game-icon-close" type="button" onClick={onClose} aria-label="Close atlas" autoFocus><X size={18} /></button>
        </header>
        <p className="game-atlas-intro">Fast-travel to any doorway. The signals show which parts of the story you have already explored.</p>
        <div className="game-atlas-list">
          {buildings.map((building, index) => {
            const Icon = buildingIcons[building.id]
            const online = visited.has(building.id)
            return (
              <button type="button" key={building.id} onClick={() => onVisit(building)} style={{ '--item-accent': building.accent } as CSSProperties}>
                <span className="game-atlas-index">0{index + 1}</span>
                <span className="game-atlas-icon"><Icon size={17} /></span>
                <span className="game-atlas-copy"><b>{building.name}</b><small>{building.eyebrow}</small></span>
                <span className={`game-atlas-status${online ? ' is-online' : ''}`}>{online ? <Check size={12} /> : <DoorOpen size={12} />}{online ? 'Online' : 'Visit'}</span>
              </button>
            )
          })}
        </div>
        <footer className="game-atlas-footer"><span>{visited.size} / {buildings.length} signals online</span><i><b style={{ width: `${visited.size / buildings.length * 100}%` }} /></i></footer>
      </aside>
    </div>
  )
}

type DossierPanelProps = {
  visited: Set<BuildingId>
  onClose: () => void
  onOpenBuilding: (id: BuildingId) => void
}

export function DossierPanel({ visited, onClose, onOpenBuilding }: DossierPanelProps) {
  const { experience, personal, skillGroups, socialLinks } = gameContent
  return (
    <div className="game-overlay game-dossier-overlay" role="dialog" aria-modal="true" aria-labelledby="dossier-title">
      <section className="game-dossier">
        <header className="game-dossier-topbar">
          <div className="game-dossier-wordmark"><span>MB</span><b>Portfolio dossier</b><small>Non-spatial view · All core information</small></div>
          <div className="game-dossier-top-actions">
            <a href={sitePath('/')}>Classic website <ArrowUpRight size={14} /></a>
            <button className="game-icon-close" type="button" onClick={onClose} aria-label="Close dossier" autoFocus><X size={18} /></button>
          </div>
        </header>

        <div className="game-dossier-scroll">
          <section className="game-dossier-hero">
            <p>Senior Software Engineer · Frontend Platforms & Applied AI</p>
            <h2 id="dossier-title">Mauricio<br /><em>Berlanga</em></h2>
            <div><p>{personal.summary}</p><a className="game-modern-button game-modern-button-dark" href={`mailto:${personal.email}`}>Start a conversation <Mail size={15} /></a></div>
          </section>

          <section className="game-dossier-metrics">
            <span><b>9+</b><small>years engineering</small></span><span><b>6+</b><small>years at Walmart</small></span><span><b>03</b><small>Stanford AI courses</small></span><span><b>04</b><small>featured AI projects</small></span>
          </section>

          <section className="game-dossier-section">
            <div className="game-dossier-section-heading"><p>01 / District map</p><h3>Every route, one tap away.</h3></div>
            <div className="game-dossier-route-grid">
              {buildings.map((building) => {
                const Icon = buildingIcons[building.id]
                return (
                  <button type="button" key={building.id} onClick={() => onOpenBuilding(building.id)} style={{ '--item-accent': building.accent } as CSSProperties}>
                    <span><Icon size={18} /></span><b>{building.name}</b><small>{building.description}</small><i>{visited.has(building.id) ? 'Signal online' : 'Open room'} <ChevronRight size={13} /></i>
                  </button>
                )
              })}
            </div>
          </section>

          <section className="game-dossier-section game-dossier-experience">
            <div className="game-dossier-section-heading"><p>02 / Experience</p><h3>Engineering for scale and longevity.</h3></div>
            <div className="game-dossier-timeline">
              {experience.map((role, index) => (
                <article key={`${role.company}-${role.role}`}><span>0{index + 1}</span><div><p>{role.period}</p><h4>{role.role} <em>at {role.company}</em></h4><p>{role.description}</p><ul>{role.focus.slice(0, 5).map((item) => <li key={item}>{item}</li>)}</ul></div></article>
              ))}
            </div>
          </section>

          <section className="game-dossier-section">
            <div className="game-dossier-section-heading"><p>03 / Technical range</p><h3>A systems-shaped stack.</h3></div>
            <div className="game-dossier-skills">
              {skillGroups.map((group) => <article key={group.title}><h4>{group.title}</h4><p>{group.skills.join(' · ')}</p></article>)}
            </div>
          </section>

          <footer className="game-dossier-contact">
            <div><p>Ready for the right problem.</p><h3>Let’s build something technically ambitious.</h3></div>
            <nav>{socialLinks.map((link) => <a href={link.href} key={link.label} target={link.href.startsWith('http') ? '_blank' : undefined} rel={link.href.startsWith('http') ? 'noreferrer' : undefined}>{link.label} <ArrowUpRight size={14} /></a>)}</nav>
          </footer>
        </div>
      </section>
    </div>
  )
}

type RoomSceneProps = {
  building: Building
  visitedCount: number
  isVisited: boolean
  onClose: () => void
  onDiscover: (id: BuildingId) => void
  onOpenBuilding: (id: BuildingId) => void
}

const focusableCaseFileElements = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function RoomScene({ building, visitedCount, isVisited, onClose, onDiscover, onOpenBuilding }: RoomSceneProps) {
  const Icon = buildingIcons[building.id]
  const scene = interiorScenes[building.id]
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [inspectorOpen, setInspectorOpen] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const roomRef = useRef<HTMLElement>(null)
  const roomBaseRef = useRef<HTMLDivElement>(null)
  const inspectorRef = useRef<HTMLElement>(null)
  const detailsRef = useRef<HTMLElement>(null)
  const detailsTriggerRef = useRef<HTMLButtonElement>(null)
  const exhibit = scene.exhibits[selectedIndex]

  const focusSelectedExhibit = useCallback(() => {
    window.requestAnimationFrame(() => {
      roomRef.current
        ?.querySelectorAll<HTMLButtonElement>('.game-interior-hotspots button')
        .item(selectedIndex)
        ?.focus({ preventScroll: true })
    })
  }, [selectedIndex])

  const closeInspector = useCallback(() => {
    setInspectorOpen(false)
    focusSelectedExhibit()
  }, [focusSelectedExhibit])

  const closeDetails = useCallback(() => {
    setDetailsOpen(false)
    window.requestAnimationFrame(() => detailsTriggerRef.current?.focus({ preventScroll: true }))
  }, [])

  const openDetails = useCallback(() => {
    onDiscover(building.id)
    setDetailsOpen(true)
  }, [building.id, onDiscover])

  const selectRelative = (offset: number) => {
    setSelectedIndex((current) => (current + offset + scene.exhibits.length) % scene.exhibits.length)
    setInspectorOpen(true)
  }
  const inspectExhibit = (index: number) => {
    setSelectedIndex(index)
    setInspectorOpen(true)
  }

  useEffect(() => {
    if (!inspectorOpen || detailsOpen) return
    inspectorRef.current?.focus({ preventScroll: true })
  }, [detailsOpen, inspectorOpen])

  useEffect(() => {
    const roomBase = roomBaseRef.current
    if (!roomBase) return
    roomBase.inert = detailsOpen
    return () => { roomBase.inert = false }
  }, [detailsOpen])

  useEffect(() => {
    if (!detailsOpen) return
    const details = detailsRef.current
    if (!details) return
    details.querySelector<HTMLElement>(focusableCaseFileElements)?.focus({ preventScroll: true })

    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return
      const focusable = [...details.querySelectorAll<HTMLElement>(focusableCaseFileElements)]
        .filter((element) => !element.hasAttribute('disabled') && element.getAttribute('aria-hidden') !== 'true')
      if (!focusable.length) {
        event.preventDefault()
        details.focus({ preventScroll: true })
        return
      }
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    details.addEventListener('keydown', trapFocus)
    return () => details.removeEventListener('keydown', trapFocus)
  }, [detailsOpen])

  useEffect(() => {
    const closeTopLayer = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || (!detailsOpen && !inspectorOpen)) return
      event.preventDefault()
      event.stopImmediatePropagation()
      if (detailsOpen) closeDetails()
      else closeInspector()
    }
    window.addEventListener('keydown', closeTopLayer, true)
    return () => window.removeEventListener('keydown', closeTopLayer, true)
  }, [closeDetails, closeInspector, detailsOpen, inspectorOpen])

  return (
    <div className="game-overlay game-room-overlay" role={detailsOpen ? undefined : 'dialog'} aria-modal={detailsOpen ? undefined : true} aria-labelledby={detailsOpen ? undefined : 'game-room-title'}>
      <section ref={roomRef} className={`game-room game-room-${building.id}${inspectorOpen ? ' has-inspector-open' : ''}${detailsOpen ? ' has-details-open' : ''}`} style={{ '--room-accent': building.accent } as CSSProperties}>
        <div className="game-room-base" ref={roomBaseRef} aria-hidden={detailsOpen || undefined}>
          <InteriorExplorer
            building={building}
            scene={scene}
            selectedIndex={selectedIndex}
            selectionOpen={inspectorOpen}
            paused={detailsOpen}
            onInspect={inspectExhibit}
            onExit={onClose}
          />

          <header className="game-interior-header">
            <button className="game-room-back" type="button" onClick={onClose}><ArrowLeft size={16} /> Exit to district</button>
            <div className="game-interior-wordmark"><span className="game-room-icon"><Icon size={17} /></span><span><b>{building.name}</b><small>{building.eyebrow}</small></span></div>
            <div className={`game-interior-status${isVisited ? ' is-online' : ' is-offline'}`}><i /> {isVisited ? 'Signal online' : 'Explore a case file'} <b>{visitedCount}/{buildings.length}</b></div>
          </header>

          <div className="game-interior-title">
            <p>Interior / Room {String(buildings.findIndex((item) => item.id === building.id) + 1).padStart(2, '0')}</p>
            <h1 id="game-room-title">{building.shortName}</h1>
            <span>{building.description}</span>
          </div>

          {inspectorOpen ? (
            <aside className="game-interior-inspector" ref={inspectorRef} role="region" tabIndex={-1} aria-labelledby="game-exhibit-title" aria-describedby="game-exhibit-summary">
              <button className="game-interior-inspector-close" type="button" onClick={closeInspector} aria-label="Close exhibit card"><X size={14} /></button>
              <div className="game-interior-inspector-meta"><span>{exhibit.eyebrow}</span><b>{exhibit.index} / {String(scene.exhibits.length).padStart(2, '0')}</b></div>
              <div className="game-interior-inspector-announcement" role="status" aria-live="polite" aria-atomic="true">
                <h2 id="game-exhibit-title" key={`${building.id}-${exhibit.id}`}>{exhibit.title}</h2>
                <p id="game-exhibit-summary">{exhibit.summary}</p>
              </div>
              <div className="game-interior-inspector-actions">
                <div><button type="button" onClick={() => selectRelative(-1)} aria-label="Previous exhibit"><ArrowLeft size={14} /></button><button type="button" onClick={() => selectRelative(1)} aria-label="Next exhibit"><ArrowRight size={14} /></button></div>
                <button ref={detailsTriggerRef} className="game-modern-button game-modern-button-primary" type="button" onClick={openDetails}>{exhibit.cta} <ChevronRight size={15} /></button>
              </div>
            </aside>
          ) : null}

          <div className="game-interior-guide"><Sparkles size={13} /><span>Walk to an exhibit · Press E to inspect · Return through the doorway</span></div>
        </div>

        {detailsOpen ? (
          <>
            <button className="game-room-details-backdrop" type="button" onClick={closeDetails} tabIndex={-1} aria-label="Close case file and return inside" />
            <section ref={detailsRef} className="game-room-details" role="dialog" aria-modal="true" aria-labelledby="game-case-file-title" tabIndex={-1}>
            <header className="game-room-header">
              <button className="game-room-back" type="button" onClick={closeDetails}><ArrowLeft size={16} /> Back inside</button>
              <div><span>{building.shortName} / {exhibit.eyebrow}</span><button className="game-icon-close" type="button" onClick={closeDetails} aria-label="Close case file"><X size={18} /></button></div>
            </header>
            <div className="game-room-scroll">
              <section className="game-room-intro">
                <p>{building.name} · Exhibit {exhibit.index}</p>
                <h2 id="game-case-file-title">{exhibit.title}</h2>
                <p>{exhibit.summary}</p>
              </section>
              <RoomContent exhibit={exhibit} onOpenBuilding={onOpenBuilding} />
              <footer className="game-room-exit">
                <span><Sparkles size={15} /> {building.name} is now online in your district map.</span>
                <button className="game-modern-button game-modern-button-dark" type="button" onClick={onClose}>Back to the overworld <ArrowRight size={15} /></button>
              </footer>
            </div>
            </section>
          </>
        ) : null}
      </section>
    </div>
  )
}

function RoomContent({ exhibit, onOpenBuilding }: { exhibit: InteriorExhibit; onOpenBuilding: (id: BuildingId) => void }) {
  const caseFile = exhibit.caseFile
  switch (caseFile.kind) {
    case 'career': return <CareerCaseFile caseFile={caseFile} />
    case 'education': return <EducationCaseFile caseFile={caseFile} />
    case 'research': return <ResearchCaseFile caseFile={caseFile} />
    case 'project': return <ProjectCaseFile projectIndex={caseFile.projectIndex} />
    case 'article': return <ArticleCaseFile slug={caseFile.slug} />
    case 'article-index': return <ArticleCaseFile />
    case 'github-project': return <GitHubCaseFile repository={caseFile.repository} />
    case 'github-index': return <GitHubCaseFile />
    case 'contact': return <ContactCaseFile panel={caseFile.panel} onOpenBuilding={onOpenBuilding} />
    case 'interest': return <InterestCaseFile interestId={caseFile.interestId} />
  }
}

type InterestEditorial = {
  headline: string
  introduction: string
  notes: readonly [string, string, string]
  related: readonly PersonalInterestId[]
}

const interestEditorial: Record<PersonalInterestId, InterestEditorial> = {
  'tame-impala': {
    headline: 'The studio becomes an instrument.',
    introduction: 'This exhibit focuses on the way layered production can turn rhythm, timbre, and space into a complete atmosphere.',
    notes: [
      'A sound can keep changing character as texture, saturation, and movement accumulate around it.',
      'Repetition becomes transportive when tiny shifts keep the ear moving through the arrangement.',
      'The appeal lives in the details: a carefully built sonic world that rewards focused listening.',
    ],
    related: ['fred-again', 'visual-art', 'nature-beach'],
  },
  'fred-again': {
    headline: 'The loop stays human.',
    introduction: 'This station explores how small recorded moments can be reshaped live into something immediate, emotional, and communal.',
    notes: [
      'A fragment of everyday sound can carry a surprising amount of memory and emotional context.',
      'Loop-based performance makes arrangement feel visible: ideas arrive, stack, disappear, and return in real time.',
      'Technology works best here when it preserves intimacy instead of polishing every human edge away.',
    ],
    related: ['tame-impala', 'videogames', 'nature-beach'],
  },
  'visual-art': {
    headline: 'Composition directs attention.',
    introduction: 'This gallery treats visual decisions as a language for pace, hierarchy, emotion, and the invitation to look closer.',
    notes: [
      'Color can set the emotional temperature before a viewer has interpreted a single object.',
      'Composition creates a path through an image, balancing focus, tension, and negative space.',
      'Atmosphere is the connective layer—the feeling created when light, material, and scale agree.',
    ],
    related: ['tame-impala', 'videogames', 'nature-beach'],
  },
  videogames: {
    headline: 'Systems become places.',
    introduction: 'This console celebrates interactive worlds where rules, art direction, movement, and sound combine into something the player can inhabit.',
    notes: [
      'A convincing world emerges when its mechanics and visual language seem to belong to the same place.',
      'The best systems teach through play, letting curiosity reveal how the world responds.',
      'Discovery gives exploration meaning: a hidden route, a new interaction, or a story assembled by the player.',
    ],
    related: ['visual-art', 'fred-again', 'nature-beach'],
  },
  'nature-beach': {
    headline: 'A horizon creates room to think.',
    introduction: 'This window treats coastlines, water, and time outdoors as a restorative counterweight to screen-based creative work.',
    notes: [
      'Coastlines hold two rhythms at once: a stable horizon and a shoreline that never stops changing.',
      'Water slows the field of attention and makes space for ideas to settle before the next decision.',
      'An outdoor reset is not an escape from the work; it is part of returning to it with more clarity.',
    ],
    related: ['visual-art', 'tame-impala', 'fred-again'],
  },
}

const interestIcons: Record<PersonalInterestId, LucideIcon> = {
  'tame-impala': AudioWaveform,
  'fred-again': AudioWaveform,
  'visual-art': Palette,
  videogames: Gamepad2,
  'nature-beach': TreePalm,
}

const interestWave = [34, 58, 86, 48, 72, 96, 64, 42, 82, 100, 76, 52, 91, 61, 38, 68, 88]

function InterestCaseFile({ interestId }: { interestId: PersonalInterestId }) {
  const interest = getPersonalInterest(interestId)
  const editorial = interestEditorial[interestId]
  const Icon = interestIcons[interestId]
  const relatedInterests = editorial.related.map(getPersonalInterest)

  return (
    <>
      <section className="game-interest-hero">
        <div>
          <p className="game-interest-kicker">Personal frequency / {interest.category}</p>
          <h2>{editorial.headline}</h2>
          <p>{editorial.introduction}</p>
        </div>
        <div className="game-interest-wave" aria-hidden="true">
          {interestWave.map((height, index) => (
            <i
              key={`${interest.id}-wave-${index}`}
              style={{ height: `${Math.round(20 + height * 1.05)}px`, animationDelay: `${index * -90}ms` }}
            />
          ))}
        </div>
      </section>

      <section className="game-interest-grid" aria-label={`${interest.title} listening notes`}>
        {interest.themes.map((theme, index) => (
          <article className="game-interest-card" key={theme}>
            <span><Icon size={17} /> 0{index + 1} / {interest.category}</span>
            <h3>{theme}</h3>
            <p>{editorial.notes[index]}</p>
          </article>
        ))}
      </section>

      <section className="game-interest-artists">
        <div>
          <p className="game-interest-kicker">Connected frequencies</p>
          <h2>{interestId === 'tame-impala' || interestId === 'fred-again' ? 'Two approaches to building a world from sound.' : 'Creativity rarely stays in one medium.'}</h2>
          <p>Follow the threads that connect this exhibit to other parts of the Conservatory.</p>
        </div>
        <ul aria-label="Related personal interests">
          {relatedInterests.map((related) => {
            const RelatedIcon = interestIcons[related.id]
            return <li className="game-interest-link" key={related.id}><RelatedIcon size={16} /><span><b>{related.title}</b><br />{related.category}</span></li>
          })}
        </ul>
      </section>
    </>
  )
}

function CareerCaseFile({ caseFile }: { caseFile: Extract<InteriorExhibit['caseFile'], { kind: 'career' }> }) {
  const { experience, skillGroups } = gameContent
  const roles = caseFile.experienceIndexes.flatMap((index) => experience[index] ? [experience[index]] : [])
  const selectedSkills = skillGroups.filter((group) => caseFile.skillGroupTitles?.includes(group.title))
  return (
    <>
      <section className="game-content-quote"><Factory size={19} /><p>{roles.length === 1 ? 'A focused production record, grounded in the work that shipped.' : 'A career timeline shaped by products, platforms, and systems that had to last.'}</p></section>
      <section className="game-room-section">
        <div className="game-room-section-heading"><p>Career evidence / Production work</p><h2>{roles.length === 1 ? 'One chapter, in full context.' : `${roles.length} chapters across the engineering path.`}</h2></div>
        <div className="game-career-line">
          {roles.map((role, index) => (
            <article key={`${role.company}-${role.role}`}>
              <span className="game-career-number">{String(index + 1).padStart(2, '0')}</span>
              <div><p>{role.period}</p><h3>{role.role}</h3><h4>{role.company}</h4><p>{role.description}</p><ul>{role.focus.map((focus) => <li key={focus}>{focus}</li>)}</ul></div>
            </article>
          ))}
        </div>
      </section>
      {selectedSkills.length ? (
        <section className="game-room-section">
          <div className="game-room-section-heading"><p>Supporting toolkit</p><h2>The systems behind this evidence.</h2></div>
          <div className="game-skill-modules">{selectedSkills.map((group) => <article key={group.title}><Layers3 size={18} /><h3>{group.title}</h3><p>{group.skills.join(' · ')}</p></article>)}</div>
        </section>
      ) : null}
    </>
  )
}

function EducationCaseFile({ caseFile }: { caseFile: Extract<InteriorExhibit['caseFile'], { kind: 'education' }> }) {
  const item = gameContent.education[caseFile.educationIndex]
  if (!item) return null
  const courses = caseFile.courseCodes?.length ? item.courses.filter(([code]) => caseFile.courseCodes?.includes(code)) : item.courses
  return (
    <section className="game-education-grid is-single">
      <article className="is-primary">
        <span><GraduationCap size={18} /> {item.note}</span><p>{item.institution}</p><h2>{item.program}</h2>
        {courses.length ? <div>{courses.map(([code, name]) => <span key={code}><b>{code}</b><small>{name}</small></span>)}</div> : null}
      </article>
    </section>
  )
}

function ResearchCaseFile({ caseFile }: { caseFile: Extract<InteriorExhibit['caseFile'], { kind: 'research' }> }) {
  const { education, researchThemes, skillGroups } = gameContent
  const themes = caseFile.researchThemeIndexes.flatMap((index) => researchThemes[index] ? [researchThemes[index]] : [])
  const courses = education.flatMap((item) => item.courses).filter(([code]) => caseFile.courseCodes?.includes(code))
  const selectedSkills = skillGroups.filter((group) => caseFile.skillGroupTitles?.includes(group.title))
  return (
    <>
      <section className="game-room-section">
        <div className="game-room-section-heading"><p>Research constellation</p><h2>{themes.length === 1 ? 'One question, examined from the foundations up.' : 'Connected questions across working systems.'}</h2></div>
        <div className={`game-research-orbits${themes.length === 1 ? ' is-single' : ''}`}>
          {themes.map((theme) => <article key={theme.number}><span>{theme.number}</span><Orbit size={18} /><h3>{theme.title}</h3><p>{theme.description}</p><ul>{theme.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul></article>)}
        </div>
      </section>
      {courses.length || selectedSkills.length ? (
        <section className="game-skill-ribbon">
          {courses.length ? <div><b>Coursework</b><span>{courses.map(([code, name]) => `${code} · ${name}`).join('  /  ')}</span></div> : null}
          {selectedSkills.map((group) => <div key={group.title}><b>{group.title}</b><span>{group.skills.join(' · ')}</span></div>)}
        </section>
      ) : null}
    </>
  )
}

function ProjectCaseFile({ projectIndex }: { projectIndex: number }) {
  const project = gameContent.projects[projectIndex]
  if (!project) return null
  const image = projectImages[project.visual]
  return (
    <>
      <article className="game-lab-feature" key={project.title}>
        <div className="game-lab-visual">
          {image ? <img src={sitePath(image)} alt="" /> : <div className="game-lab-code-visual"><Search size={36} /><span>query → retrieve → rerank → explain</span></div>}
          <span>{project.status} / Experiment {String(projectIndex + 1).padStart(2, '0')}</span>
        </div>
        <div className="game-lab-copy">
          <p>Selected experiment</p><h2>{project.title}</h2><p>{project.description}</p>
          <blockquote><b>What mattered</b>{project.insight}</blockquote>
          <ul>{project.technologies.map((technology) => <li key={technology}>{technology}</li>)}</ul>
          <div>{project.article ? <a href={sitePath(project.article)}>Read field note <ArrowUpRight size={14} /></a> : <span>Project overview</span>}{project.github ? <a href={project.github} target="_blank" rel="noreferrer">Repository <ExternalLink size={13} /></a> : null}</div>
        </div>
      </article>
      <section className="game-evaluation-strip"><BrainCircuit size={20} /><div><p>Recorded result</p><h3>{project.insight}</h3></div><span>{project.status} · {project.technologies.length} methods</span></section>
    </>
  )
}

function ArticleCaseFile({ slug }: { slug?: string }) {
  const articles = slug ? gameContent.articles.filter((article) => article.slug === slug) : gameContent.articles
  return (
    <>
      <section className="game-archive-lead"><BookOpen size={22} /><div><p>{slug ? 'Selected field note' : 'Open shelf'}</p><h2>{slug ? articles[0]?.title : 'Three experiments, with the evidence left visible.'}</h2></div><span>{articles.length} {articles.length === 1 ? 'field note' : 'field notes'}</span></section>
      <section className="game-article-stack">
        {articles.map((article, index) => (
          <a href={sitePath(article.path)} key={article.slug}>
            <div className="game-article-image">{article.leadImage ? <img src={sitePath(article.leadImage)} alt="" /> : null}<span>{String(index + 1).padStart(2, '0')}</span></div>
            <div className="game-article-copy"><p>{article.course}</p><h2>{article.title}</h2><p>{article.description}</p><ul>{article.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul></div>
            <span className="game-article-open">{article.readTime}<ArrowUpRight size={17} /></span>
          </a>
        ))}
      </section>
    </>
  )
}

function GitHubCaseFile({ repository }: { repository?: string }) {
  const projects = repository ? gameContent.githubProjects.filter((project) => project.repository === repository) : gameContent.githubProjects
  return (
    <section className="game-room-section">
      <div className="game-room-section-heading"><p>{repository ? 'Selected build / Public repository' : 'Active workbenches / Public GitHub'}</p><h2>{repository ? projects[0]?.title : 'Shipped work across six technical directions.'}</h2></div>
      <div className={`game-github-workbenches${repository ? ' is-single' : ''}`}>
        {projects.map((project, index) => (
          <a href={project.url} target="_blank" rel="noreferrer" key={project.repository}><span>{String(index + 1).padStart(2, '0')} / {project.category}</span><Code2 size={19} /><h3>{project.title}</h3><p>{project.description}</p><ul>{project.technologies.map((item) => <li key={item}>{item}</li>)}</ul><i>{project.activity}<ExternalLink size={13} /></i></a>
        ))}
      </div>
    </section>
  )
}

function ContactCaseFile({ panel, onOpenBuilding }: { panel: Extract<InteriorExhibit['caseFile'], { kind: 'contact' }>['panel']; onOpenBuilding: (id: BuildingId) => void }) {
  const { personal, skillGroups, socialLinks } = gameContent
  const [copied, setCopied] = useState(false)
  const contactIcons: Record<string, LucideIcon> = { GitHub: Code2, LinkedIn: BriefcaseBusiness, Email: Mail }
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(personal.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = `mailto:${personal.email}`
    }
  }
  const opportunitySkills = skillGroups.filter((group) => ['Frontend Systems', 'Frontend Product Craft', 'AI / ML', 'AI Infrastructure'].includes(group.title))

  return (
    <>
      {panel === 'email' ? (
        <>
          <section className="game-signal-hero"><div><p>Direct frequency</p><h2>{personal.email.split('@')[0]}<wbr />@{personal.email.split('@')[1]}</h2><p>Use email for a direct conversation about frontend platforms, applied AI, ML systems, or research engineering.</p></div><Mail size={76} /></section>
          <section className="game-copy-signal"><div><p>Ready to connect</p><h3>{personal.email}</h3></div><div className="game-contact-actions"><a className="game-modern-button game-modern-button-dark" href={`mailto:${personal.email}`}>Open email <Mail size={15} /></a><button className="game-modern-button game-modern-button-quiet" type="button" onClick={copyEmail}>{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? 'Copied' : 'Copy address'}</button></div></section>
        </>
      ) : null}
      {panel === 'focus' ? (
        <>
          <section className="game-signal-hero"><div><p>Current focus</p><h2>{personal.title}</h2><p>{personal.summary}</p></div><RadioTower size={86} /></section>
          <section className="game-skill-ribbon"><div><b>Current team</b><span>{personal.employer}</span></div><div><b>Location</b><span>{personal.location}</span></div></section>
        </>
      ) : null}
      {panel === 'skills' ? (
        <section className="game-room-section"><div className="game-room-section-heading"><p>Opportunity map / Existing evidence</p><h2>Product craft and intelligent systems, connected.</h2></div><div className="game-skill-modules">{opportunitySkills.map((group) => <article key={group.title}><Layers3 size={18} /><h3>{group.title}</h3><p>{group.skills.join(' · ')}</p></article>)}</div></section>
      ) : null}
      {panel === 'links' ? (
        <section className="game-contact-grid">
          {socialLinks.map((link) => {
            const Icon = contactIcons[link.label] ?? ArrowUpRight
            return <a href={link.href} key={link.label} target={link.href.startsWith('http') ? '_blank' : undefined} rel={link.href.startsWith('http') ? 'noreferrer' : undefined}><span><Icon size={20} /></span><p>{link.label}</p><h3>{link.display}</h3><i>Open channel <ArrowUpRight size={14} /></i></a>
          })}
        </section>
      ) : null}
      {panel === 'brief' ? (
        <>
          <section className="game-signal-hero"><div><p>Conversation brief</p><h2>Make the first message useful.</h2><p>A short note with these three pieces gives the conversation a concrete place to start.</p></div><RadioTower size={86} /></section>
          <section className="game-origin-steps"><article><span>01</span><MessageCircle size={19} /><h3>The problem</h3><p>What are you trying to make possible, improve, or understand?</p></article><article><span>02</span><Layers3 size={19} /><h3>The constraints</h3><p>What technical, product, timeline, or team realities shape the work?</p></article><article><span>03</span><Check size={19} /><h3>The outcome</h3><p>What would a meaningful result look like for the people involved?</p></article></section>
          <section className="game-copy-signal"><div><p>Open channel</p><h3>{personal.email}</h3></div><a className="game-modern-button game-modern-button-dark" href={`mailto:${personal.email}?subject=Project%20conversation`}>Start the message <ArrowUpRight size={14} /></a></section>
        </>
      ) : null}
      <section className="game-next-routes"><p>Keep exploring</p><div>{buildings.filter((building) => building.id !== 'signal').slice(0, 3).map((building) => <button type="button" key={building.id} onClick={() => onOpenBuilding(building.id)}>{building.shortName}<ChevronRight size={13} /></button>)}</div></section>
    </>
  )
}

type CompletionPanelProps = {
  onClose: () => void
  onContact: () => void
}

export function CompletionPanel({ onClose, onContact }: CompletionPanelProps) {
  return (
    <div className="game-overlay game-completion-overlay" role="dialog" aria-modal="true" aria-labelledby="completion-title">
      <div className="game-completion-beam" />
      <section className="game-completion-panel">
        <span className="game-completion-icon"><Zap size={24} fill="currentColor" /></span>
        <p>District transmission complete</p>
        <h2 id="completion-title">All seven signals<br /><em>are online.</em></h2>
        <p>You traced the path from product beginnings through platform engineering, intelligent systems, graduate study, public technical work, and the creative life beyond the screen.</p>
        <blockquote>“The best systems make complexity legible.”</blockquote>
        <div><button className="game-modern-button game-modern-button-primary" type="button" onClick={onContact}>Open a direct channel <ArrowRight size={16} /></button><button className="game-modern-button game-modern-button-quiet" type="button" onClick={onClose} autoFocus>Return to the district</button></div>
      </section>
    </div>
  )
}
