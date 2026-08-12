import {
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
  GraduationCap,
  Layers3,
  Library,
  Mail,
  MapPin,
  Network,
  Orbit,
  RadioTower,
  Search,
  Sparkles,
  Telescope,
  TrainFront,
  X,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { useEffect, useState, type CSSProperties } from 'react'
import { sitePath } from '../../lib/paths'
import { interiorScenes } from '../data/interiors'
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
        <p className="game-start-note">WASD / arrows · collision-aware world · six explorable rooms · sound optional</p>
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
  onClose: () => void
  onOpenBuilding: (id: BuildingId) => void
}

export function RoomScene({ building, visitedCount, onClose, onOpenBuilding }: RoomSceneProps) {
  const Icon = buildingIcons[building.id]
  const scene = interiorScenes[building.id]
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [inspectorOpen, setInspectorOpen] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const exhibit = scene.exhibits[selectedIndex]
  const selectRelative = (offset: number) => {
    setSelectedIndex((current) => (current + offset + scene.exhibits.length) % scene.exhibits.length)
    setInspectorOpen(true)
  }
  const inspectExhibit = (index: number) => {
    setSelectedIndex(index)
    setInspectorOpen(true)
  }

  useEffect(() => {
    const closeTopLayer = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || (!detailsOpen && !inspectorOpen)) return
      event.preventDefault()
      event.stopImmediatePropagation()
      if (detailsOpen) setDetailsOpen(false)
      else setInspectorOpen(false)
    }
    window.addEventListener('keydown', closeTopLayer, true)
    return () => window.removeEventListener('keydown', closeTopLayer, true)
  }, [detailsOpen, inspectorOpen])

  return (
    <div className="game-overlay game-room-overlay" role="dialog" aria-modal="true" aria-labelledby="game-room-title">
      <section className={`game-room game-room-${building.id}${inspectorOpen ? ' has-inspector-open' : ''}${detailsOpen ? ' has-details-open' : ''}`} style={{ '--room-accent': building.accent } as CSSProperties}>
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
          <div className="game-interior-status"><i /> Signal online <b>{visitedCount}/{buildings.length}</b></div>
        </header>

        <div className="game-interior-title">
          <p>Interior / Signal {String(buildings.findIndex((item) => item.id === building.id) + 1).padStart(2, '0')}</p>
          <h1 id="game-room-title">{building.shortName}</h1>
          <span>{building.description}</span>
        </div>

        {inspectorOpen ? (
          <aside className="game-interior-inspector" aria-live="polite">
            <button className="game-interior-inspector-close" type="button" onClick={() => setInspectorOpen(false)} aria-label="Close exhibit card"><X size={14} /></button>
            <div className="game-interior-inspector-meta"><span>{exhibit.eyebrow}</span><b>{exhibit.index} / {String(scene.exhibits.length).padStart(2, '0')}</b></div>
            <h2 key={`${building.id}-${exhibit.id}`}>{exhibit.title}</h2>
            <p>{exhibit.summary}</p>
            <div className="game-interior-inspector-actions">
              <div><button type="button" onClick={() => selectRelative(-1)} aria-label="Previous exhibit"><ArrowLeft size={14} /></button><button type="button" onClick={() => selectRelative(1)} aria-label="Next exhibit"><ArrowRight size={14} /></button></div>
              <button className="game-modern-button game-modern-button-primary" type="button" onClick={() => setDetailsOpen(true)}>Open case file <ChevronRight size={15} /></button>
            </div>
          </aside>
        ) : null}

        <div className="game-interior-guide"><Sparkles size={13} /><span>Walk to a signal · Press E to inspect · Return through the doorway</span></div>

        {detailsOpen ? (
          <section className="game-room-details" aria-label={`${building.name} case file`}>
            <header className="game-room-header">
              <button className="game-room-back" type="button" onClick={() => setDetailsOpen(false)} autoFocus><ArrowLeft size={16} /> Back inside</button>
              <div><span>MB / Case file</span><button className="game-icon-close" type="button" onClick={() => setDetailsOpen(false)} aria-label="Close case file"><X size={18} /></button></div>
            </header>
            <div className="game-room-scroll">
              <section className="game-room-intro">
                <p>{building.eyebrow}</p>
                <h2>{building.name}</h2>
                <p>{building.description}</p>
              </section>
              <RoomContent id={building.id} onOpenBuilding={onOpenBuilding} />
              <footer className="game-room-exit">
                <span><Sparkles size={15} /> This signal is now part of your district map.</span>
                <button className="game-modern-button game-modern-button-dark" type="button" onClick={onClose}>Back to the overworld <ArrowRight size={15} /></button>
              </footer>
            </div>
          </section>
        ) : null}
      </section>
    </div>
  )
}

function RoomContent({ id, onOpenBuilding }: { id: BuildingId; onOpenBuilding: (id: BuildingId) => void }) {
  switch (id) {
    case 'foundry': return <FoundryRoom />
    case 'observatory': return <ObservatoryRoom />
    case 'lab': return <LabRoom />
    case 'archive': return <ArchiveRoom />
    case 'station': return <StationRoom />
    case 'signal': return <SignalRoom onOpenBuilding={onOpenBuilding} />
  }
}

function FoundryRoom() {
  const { experience, skillGroups } = gameContent
  const platformSkills = skillGroups.filter((group) => ['Frontend Systems', 'Frontend Product Craft', 'Software Engineering'].includes(group.title))
  return (
    <>
      <section className="game-content-quote"><Factory size={19} /><p>“Make the system legible enough to change, and dependable enough to last.”</p></section>
      <section className="game-room-section">
        <div className="game-room-section-heading"><p>Assembly line / Career</p><h2>Platforms are products for the teams behind the product.</h2></div>
        <div className="game-career-line">
          {experience.map((role, index) => (
            <article key={`${role.company}-${role.role}`}>
              <span className="game-career-number">{String(index + 1).padStart(2, '0')}</span>
              <div><p>{role.period}</p><h3>{role.role}</h3><h4>{role.company}</h4><p>{role.description}</p><ul>{role.focus.slice(0, 5).map((focus) => <li key={focus}>{focus}</li>)}</ul></div>
            </article>
          ))}
        </div>
      </section>
      <section className="game-room-section">
        <div className="game-room-section-heading"><p>Tool wall / Technical practice</p><h2>A frontend foundation shaped by systems.</h2></div>
        <div className="game-skill-modules">{platformSkills.map((group) => <article key={group.title}><Layers3 size={18} /><h3>{group.title}</h3><p>{group.skills.join(' · ')}</p></article>)}</div>
      </section>
    </>
  )
}

function LabRoom() {
  const { projects } = gameContent
  const [selectedIndex, setSelectedIndex] = useState(0)
  const project = projects[selectedIndex]
  const image = projectImages[project.visual]
  return (
    <>
      <section className="game-lab-selector" aria-label="Select a featured project">
        {projects.map((item, index) => <button type="button" className={index === selectedIndex ? 'is-selected' : ''} key={item.title} onClick={() => setSelectedIndex(index)}><span>0{index + 1}</span><b>{item.title}</b><small>{item.status}</small></button>)}
      </section>
      <article className="game-lab-feature" key={project.title}>
        <div className="game-lab-visual">
          {image ? <img src={sitePath(image)} alt="" /> : <div className="game-lab-code-visual"><Search size={36} /><span>query → retrieve → rerank → explain</span></div>}
          <span>{project.status} / Experiment {String(selectedIndex + 1).padStart(2, '0')}</span>
        </div>
        <div className="game-lab-copy">
          <p>Selected experiment</p><h2>{project.title}</h2><p>{project.description}</p>
          <blockquote><b>What mattered</b>{project.insight}</blockquote>
          <ul>{project.technologies.map((technology) => <li key={technology}>{technology}</li>)}</ul>
          <div>{project.article ? <a href={sitePath(project.article)}>Read case study <ArrowUpRight size={14} /></a> : <span>Case study in progress</span>}{project.github ? <a href={project.github} target="_blank" rel="noreferrer">Repository <ExternalLink size={13} /></a> : null}</div>
        </div>
      </article>
      <section className="game-evaluation-strip"><BrainCircuit size={20} /><div><p>Lab principle</p><h3>Evaluation infrastructure is part of the model.</h3></div><span>Build → measure → inspect → revise</span></section>
    </>
  )
}

function ObservatoryRoom() {
  const { education, researchThemes, skillGroups } = gameContent
  const aiSkills = skillGroups.filter((group) => ['AI / ML', 'AI Infrastructure'].includes(group.title))
  return (
    <>
      <section className="game-education-grid">
        {education.map((item, index) => (
          <article key={item.institution} className={index === 0 ? 'is-primary' : ''}>
            <span><GraduationCap size={18} /> {item.note}</span><p>{item.institution}</p><h2>{item.program}</h2>
            {item.courses.length ? <div>{item.courses.map(([code, name]) => <span key={code}><b>{code}</b><small>{name}</small></span>)}</div> : null}
          </article>
        ))}
      </section>
      <section className="game-room-section">
        <div className="game-room-section-heading"><p>Research constellation</p><h2>Questions connected across four systems.</h2></div>
        <div className="game-research-orbits">
          {researchThemes.map((theme) => <article key={theme.number}><span>{theme.number}</span><Orbit size={18} /><h3>{theme.title}</h3><p>{theme.description}</p><ul>{theme.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul></article>)}
        </div>
      </section>
      <section className="game-skill-ribbon">{aiSkills.map((group) => <div key={group.title}><b>{group.title}</b><span>{group.skills.join(' · ')}</span></div>)}</section>
    </>
  )
}

function ArchiveRoom() {
  const { articles } = gameContent
  return (
    <>
      <section className="game-archive-lead"><BookOpen size={22} /><div><p>Open shelf</p><h2>Learning in public, including when the baseline wins.</h2></div><span>{articles.length} field notes · 37 min total</span></section>
      <section className="game-article-stack">
        {articles.map((article, index) => (
          <a href={sitePath(article.path)} key={article.slug}>
            <div className="game-article-image">{article.leadImage ? <img src={sitePath(article.leadImage)} alt="" /> : null}<span>0{index + 1}</span></div>
            <div className="game-article-copy"><p>{article.course}</p><h2>{article.title}</h2><p>{article.description}</p><ul>{article.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul></div>
            <span className="game-article-open">{article.readTime}<ArrowUpRight size={17} /></span>
          </a>
        ))}
      </section>
    </>
  )
}

function StationRoom() {
  const { githubProjects, personal } = gameContent
  return (
    <>
      <section className="game-origin-story">
        <div><p>Origin log / 2015 → now</p><h2>Start with a real problem. Build the route.</h2><p>{personal.summary}</p></div>
        <div className="game-origin-metric"><span>10K+</span><p>registered riders reached by GoBus, the public-transit product Mauricio co-founded.</p></div>
      </section>
      <section className="game-origin-steps">
        <article><span>01</span><TrainFront size={19} /><h3>Product origins</h3><p>Mobile maps, live crowdsourced bus locations, and route-monitoring tools used by a real community.</p></article>
        <article><span>02</span><Network size={19} /><h3>Platform depth</h3><p>Years of frontend architecture, micro-frontends, shared tooling, APIs, and production delivery.</p></article>
        <article><span>03</span><BrainCircuit size={19} /><h3>Intelligent systems</h3><p>Retrieval, evaluation, model routing, local inference, and graduate-level AI study.</p></article>
      </section>
      <section className="game-room-section">
        <div className="game-room-section-heading"><p>Active workbenches / Public GitHub</p><h2>Side quests that ship.</h2></div>
        <div className="game-github-workbenches">
          {githubProjects.map((project, index) => (
            <a href={project.url} target="_blank" rel="noreferrer" key={project.repository}><span>0{index + 1} / {project.category}</span><Code2 size={19} /><h3>{project.title}</h3><p>{project.description}</p><ul>{project.technologies.slice(0, 4).map((item) => <li key={item}>{item}</li>)}</ul><i>{project.activity}<ExternalLink size={13} /></i></a>
          ))}
        </div>
      </section>
    </>
  )
}

function SignalRoom({ onOpenBuilding }: { onOpenBuilding: (id: BuildingId) => void }) {
  const { personal, socialLinks } = gameContent
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
  return (
    <>
      <section className="game-signal-hero"><div><p>Open channel / Current focus</p><h2>Let’s build something technically ambitious.</h2><p>Interested in frontend platforms, applied AI, ML systems, research engineering, or software that demands strong technical foundations? The signal is open.</p></div><RadioTower size={86} /></section>
      <section className="game-contact-grid">
        {socialLinks.map((link) => {
          const Icon = contactIcons[link.label] ?? ArrowUpRight
          return <a href={link.href} key={link.label} target={link.href.startsWith('http') ? '_blank' : undefined} rel={link.href.startsWith('http') ? 'noreferrer' : undefined}><span><Icon size={20} /></span><p>{link.label}</p><h3>{link.display}</h3><i>Open channel <ArrowUpRight size={14} /></i></a>
        })}
      </section>
      <section className="game-copy-signal"><div><p>Direct frequency</p><h3>{personal.email}</h3></div><button className="game-modern-button game-modern-button-dark" type="button" onClick={copyEmail}>{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? 'Copied' : 'Copy email'}</button></section>
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
        <h2 id="completion-title">All six signals<br /><em>are online.</em></h2>
        <p>You traced the path from product beginnings through platform engineering, intelligent systems, graduate study, and public technical work.</p>
        <blockquote>“The best systems make complexity legible.”</blockquote>
        <div><button className="game-modern-button game-modern-button-primary" type="button" onClick={onContact}>Open a direct channel <ArrowRight size={16} /></button><button className="game-modern-button game-modern-button-quiet" type="button" onClick={onClose} autoFocus>Return to the district</button></div>
      </section>
    </div>
  )
}
