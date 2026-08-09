import {
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronRight,
  Clock3,
  ExternalLink,
  Filter,
  Library,
  Search,
  Shuffle,
  Sparkles,
  X,
} from 'lucide-react'
import { type CSSProperties, type KeyboardEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { sitePath } from '../lib/paths'

type FocusedItem = {
  id: string
  initials: string
  tone: string
  signal: 'Essential' | 'Worth a look' | 'Skim'
  category: string
  sourceType: 'Article' | 'Research' | 'Repository' | 'Product'
  title: string
  why: string
  takeaways: string[]
  author: string
  duration: string
  topics: string[]
  image?: string
  article?: string
  sourceUrl: string
  isBrief: boolean
  fresh: boolean
}

const focusedItems: FocusedItem[] = [
  {
    id: 'colmo',
    initials: 'CO',
    tone: '#176b65',
    signal: 'Essential',
    category: 'AI / ML',
    sourceType: 'Research',
    title: 'Cloud thinks, local reads: building COLMo',
    why: 'A practical look at where local models can absorb context-heavy work without hiding the privacy and quality tradeoffs.',
    takeaways: ['A cloud supervisor can delegate document reading to local workers.', 'Verification is measured as part of the privacy boundary.', 'The cloud-mini baseline can falsify the economic case for local inference.'],
    author: 'Mauricio Berlanga',
    duration: '12 min brief',
    topics: ['Local inference', 'Privacy', 'LLM systems'],
    image: '/articles/colmo-social.png',
    article: '/writing/colmo/',
    sourceUrl: 'https://github.com/mauber91/COLMo',
    isBrief: true,
    fresh: true,
  },
  {
    id: 'router',
    initials: 'MR',
    tone: '#6941c6',
    signal: 'Essential',
    category: 'AI / ML',
    sourceType: 'Research',
    title: 'Routing code generation with verifiers',
    why: 'Executable tests make a surprisingly strong signal for deciding when an expensive model is actually worth calling.',
    takeaways: ['Cheap-then-escalate reached 0.958 hidden pass rate.', 'Only 16.9% of tasks needed escalation.', 'Calibration and evaluator correctness mattered as much as the policy.'],
    author: 'Mauricio Berlanga',
    duration: '14 min brief',
    topics: ['Contextual bandits', 'LLM routing', 'Evaluation'],
    image: '/articles/model-routing-social.png',
    article: '/writing/verifier-aware-model-routing/',
    sourceUrl: 'https://github.com/mauber91/cs224R',
    isBrief: true,
    fresh: true,
  },
  {
    id: 'usd-mxn',
    initials: 'FX',
    tone: '#b75d3b',
    signal: 'Worth a look',
    category: 'Machine learning',
    sourceType: 'Article',
    title: 'When the baseline wins: forecasting USD/MXN',
    why: 'A negative result is still useful when it tells you that a simple autoregressive direction is hard to beat.',
    takeaways: ['Chronological splits matter more than leaderboard theater.', 'Tree, neural, and state-space models did not erase the baseline gap.', 'The right conclusion is a boundary, not a failure story.'],
    author: 'Mauricio Berlanga',
    duration: '11 min brief',
    topics: ['Time series', 'Model evaluation', 'Negative results'],
    image: '/articles/usdmxn-social.png',
    article: '/writing/usd-mxn-forecasting/',
    sourceUrl: 'https://github.com/mauber91/USD_MXN_prediction',
    isBrief: true,
    fresh: false,
  },
  {
    id: 'rag',
    initials: 'RAG',
    tone: '#195c61',
    signal: 'Essential',
    category: 'AI engineering',
    sourceType: 'Product',
    title: 'A retrieval layer for navigating large codebases',
    why: 'Semantic search is only the beginning; useful code intelligence depends on ranking, summaries, and symbol-aware context.',
    takeaways: ['Embeddings narrow a large codebase to plausible files.', 'Reranking and heuristics determine what the model actually sees.', 'The system is judged by lookup quality, not by generation style.'],
    author: 'Mauricio Berlanga',
    duration: '8 min brief',
    topics: ['RAG', 'Semantic search', 'Code intelligence'],
    sourceUrl: 'https://github.com/mauber91',
    isBrief: true,
    fresh: false,
  },
  {
    id: 'world-cup',
    initials: 'WC',
    tone: '#087f5b',
    signal: 'Worth a look',
    category: 'Frontend + ML',
    sourceType: 'Product',
    title: 'World Cup Forecast',
    why: 'A full-stack forecasting product where the interface makes uncertainty and tournament rules feel usable.',
    takeaways: ['React and TypeScript turn model outputs into an interactive product.', 'Monte Carlo simulation respects FIFA tie-break rules.', 'Live data pipelines keep the frontend tied to changing inputs.'],
    author: 'Mauricio Berlanga',
    duration: '7 min brief',
    topics: ['React', 'TypeScript', 'Monte Carlo'],
    sourceUrl: 'https://github.com/mauber91/WC',
    isBrief: false,
    fresh: true,
  },
  {
    id: 'bookmarks',
    initials: 'XB',
    tone: '#c24177',
    signal: 'Worth a look',
    category: 'Product engineering',
    sourceType: 'Product',
    title: 'X Bookmarks Reader',
    why: 'A focused reading workflow that turns a backlog of saved links into a small, searchable daily route.',
    takeaways: ['Content processing makes exported bookmarks useful again.', 'Local state keeps reading progress immediate and private.', 'The product is intentionally about finishing, not collecting.'],
    author: 'Mauricio Berlanga',
    duration: '5 min brief',
    topics: ['React', 'Local storage', 'Content UX'],
    sourceUrl: 'https://github.com/mauber91/bookmarks-viewer',
    isBrief: false,
    fresh: true,
  },
  {
    id: 'handflow',
    initials: 'HF',
    tone: '#c66a2f',
    signal: 'Skim',
    category: 'Creative technology',
    sourceType: 'Repository',
    title: 'HandFlow / aetherTouch',
    why: 'A browser experiment that makes frontend interaction physical: gestures steer thousands of particles in real time.',
    takeaways: ['MediaPipe turns hand movement into browser input.', 'Three.js makes a 35,000-particle scene feel responsive.', 'The experiment treats the canvas as an interface, not decoration.'],
    author: 'Mauricio Berlanga',
    duration: '4 min brief',
    topics: ['Three.js', 'WebGL', 'Interaction'],
    sourceUrl: 'https://github.com/mauber91/aetherTouch',
    isBrief: false,
    fresh: false,
  },
]

const routeStoragePrefix = 'mauricio-focused-route'
const readStoragePrefix = 'mauricio-focused-read'
const today = new Date().toISOString().slice(0, 10)
const dateLabel = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(new Date())

function readStoredIds(key: string) {
  try {
    const stored = JSON.parse(window.localStorage.getItem(key) ?? '[]')
    return Array.isArray(stored) ? new Set<string>(stored.filter((value): value is string => typeof value === 'string')) : new Set<string>()
  } catch {
    return new Set<string>()
  }
}

function dailyRoute() {
  try {
    const key = `${routeStoragePrefix}:${today}`
    const stored = JSON.parse(window.localStorage.getItem(key) ?? 'null')
    if (Array.isArray(stored) && stored.length === focusedItems.length && stored.every((id) => focusedItems.some((item) => item.id === id))) return stored as string[]
    window.localStorage.setItem(key, JSON.stringify(focusedItems.map((item) => item.id)))
  } catch {
    // Private browsing can deny local storage; the frozen in-memory route still works.
  }
  return focusedItems.map((item) => item.id)
}

let audioContext: AudioContext | undefined

function playCue(kind: 'tick' | 'press' | 'toggle') {
  if (typeof window === 'undefined' || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
  const AudioContextConstructor = window.AudioContext
  if (!AudioContextConstructor) return
  audioContext ??= new AudioContextConstructor()
  const oscillator = audioContext.createOscillator()
  const gain = audioContext.createGain()
  const frequency = kind === 'toggle' ? 440 : kind === 'press' ? 330 : 560
  oscillator.type = 'sine'
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)
  oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.12, audioContext.currentTime + 0.045)
  gain.gain.setValueAtTime(0.0001, audioContext.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.025, audioContext.currentTime + 0.008)
  gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.075)
  oscillator.connect(gain).connect(audioContext.destination)
  oscillator.start()
  oscillator.stop(audioContext.currentTime + 0.08)
}

function itemStyle(item: FocusedItem): CSSProperties {
  return { '--item-tone': item.tone } as CSSProperties
}

function FocusedCover({ item, large = false }: { item: FocusedItem; large?: boolean }) {
  return (
    <div className={`focused-cover${large ? ' focused-cover-large' : ''}`} style={itemStyle(item)}>
      {item.image ? <img src={sitePath(item.image)} alt="" /> : null}
      <div className="focused-cover-fallback"><b>{item.initials}</b><span>{item.category}</span></div>
      <span className="focused-signal">{item.signal}</span>
    </div>
  )
}

function ItemMeta({ item }: { item: FocusedItem }) {
  return (
    <div className="focused-item-meta">
      <span>{item.category}</span><i>·</i><span>{item.sourceType}</span><i>·</i><span>{item.duration}</span>
    </div>
  )
}

function Takeaways({ item, numbered = false }: { item: FocusedItem; numbered?: boolean }) {
  return (
    <ul className={numbered ? 'focused-takeaways focused-takeaways-numbered' : 'focused-takeaways'}>
      {item.takeaways.map((takeaway, index) => <li key={takeaway}>{numbered ? <b>0{index + 1}</b> : <span>+</span>}<p>{takeaway}</p></li>)}
    </ul>
  )
}

function OpenItemLink({ item }: { item: FocusedItem }) {
  const href = item.article ? sitePath(item.article) : item.sourceUrl
  return <a className="focused-button focused-button-outline" href={href} target={item.article ? undefined : '_blank'} rel={item.article ? undefined : 'noreferrer'}>{item.article ? 'Open article' : 'Open source'} <ArrowUpRight size={14} /></a>
}

export function FocusedPortfolio() {
  const routeIds = useMemo(() => dailyRoute(), [])
  const routeItems = routeIds.map((id) => focusedItems.find((item) => item.id === id)).filter((item): item is FocusedItem => Boolean(item))
  const [readIds, setReadIds] = useState<Set<string>>(() => readStoredIds(`${readStoragePrefix}:${today}`))
  const [selectedId, setSelectedId] = useState(routeItems.find((item) => !readIds.has(item.id))?.id ?? routeItems[0]?.id ?? focusedItems[0].id)
  const [scope, setScope] = useState<'briefs' | 'all'>('briefs')
  const [view, setView] = useState<'for-you' | 'unread' | 'newest'>('for-you')
  const [topic, setTopic] = useState('All topics')
  const [query, setQuery] = useState('')
  const [dialogId, setDialogId] = useState<string | null>(null)
  const [toast, setToast] = useState('')
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const lastDialogTrigger = useRef<HTMLElement | null>(null)

  const selectedItem = focusedItems.find((item) => item.id === selectedId) ?? focusedItems[0]
  const dialogItem = focusedItems.find((item) => item.id === dialogId)
  const readCount = routeItems.filter((item) => readIds.has(item.id)).length
  const progress = routeItems.length ? readCount / routeItems.length : 0

  const showToast = useCallback((message: string) => setToast(message), [])

  useEffect(() => {
    if (!toast) return undefined
    const timeout = window.setTimeout(() => setToast(''), 2400)
    return () => window.clearTimeout(timeout)
  }, [toast])

  useEffect(() => {
    if (!dialogItem) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()
    return () => {
      document.body.style.overflow = previousOverflow
      window.setTimeout(() => lastDialogTrigger.current?.focus(), 0)
    }
  }, [dialogItem])

  const selectItem = (item: FocusedItem) => {
    setSelectedId(item.id)
    playCue('toggle')
  }

  const markAsRead = (item: FocusedItem) => {
    setReadIds((current) => {
      const next = new Set(current)
      if (next.has(item.id)) {
        next.delete(item.id)
        showToast('Back in the pile. No shame.')
      } else {
        next.add(item.id)
        showToast(readCount + 1 === routeItems.length ? 'Seven down. Close the laptop guilt-free.' : 'One less tab haunting you.')
      }
      try { window.localStorage.setItem(`${readStoragePrefix}:${today}`, JSON.stringify([...next])) } catch { /* in-memory fallback */ }
      return next
    })
    playCue('toggle')
  }

  const openBrief = (item: FocusedItem, trigger?: HTMLElement) => {
    setSelectedId(item.id)
    lastDialogTrigger.current = trigger ?? null
    setDialogId(item.id)
  }

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return focusedItems.filter((item) => {
      if (scope === 'briefs' && !item.isBrief) return false
      if (view === 'unread' && readIds.has(item.id)) return false
      if (view === 'newest' && !item.fresh) return false
      if (topic !== 'All topics' && !item.topics.includes(topic)) return false
      if (!normalizedQuery) return true
      return `${item.title} ${item.category} ${item.topics.join(' ')}`.toLowerCase().includes(normalizedQuery)
    })
  }, [query, readIds, scope, topic, view])

  const topicCounts = useMemo(() => {
    const counts = new Map<string, number>()
    focusedItems.forEach((item) => item.topics.forEach((itemTopic) => counts.set(itemTopic, (counts.get(itemTopic) ?? 0) + 1)))
    return [...counts.entries()].sort((a, b) => b[1] - a[1])
  }, [])

  const surpriseMe = () => {
    const candidates = filteredItems.filter((item) => item.id !== selectedItem.id)
    const next = candidates[Math.floor(Math.random() * Math.max(candidates.length, 1))] ?? focusedItems[0]
    selectItem(next)
    showToast('A fresh rabbit hole, hand-picked by chaos.')
  }

  const onDialogKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Escape') {
      setDialogId(null)
      return
    }
    if (event.key !== 'Tab' || !event.currentTarget) return
    const focusable = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button, a[href], input, [tabindex]:not([tabindex="-1"])')).filter((element) => !element.hasAttribute('disabled'))
    if (!focusable.length) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
  }

  return (
    <div className="focused-app">
      <header className="focused-topbar">
        <a className="focused-wordmark" href="#focused-top"><span>MB</span><i /></a>
        <div className="focused-topbar-note"><Sparkles size={13} /> A quieter way to keep learning</div>
      </header>

      <main id="focused-top">
        <section className="focused-hero">
          <div className="focused-shell focused-hero-grid">
            <div className="focused-plan-card">
              <p className="focused-eyebrow">Today’s little rabbit holes · {dateLabel}</p>
              <h1>Seven sparks for <em>today.</em></h1>
              <p className="focused-plan-copy">Small enough to finish. Interesting enough to derail your day.</p>
              <button className="focused-pill-button focused-pill-button-coral" type="button" onClick={surpriseMe} onMouseEnter={() => playCue('press')}><Shuffle size={15} /> Surprise me</button>
              <div className="focused-progress-copy"><span><b>{readCount}</b> of {routeItems.length} read</span><span>{routeItems.length - readCount} left</span></div>
              <div className="focused-progress" role="progressbar" aria-label="Today’s reading progress" aria-valuemin={0} aria-valuemax={routeItems.length} aria-valuenow={readCount}><i style={{ transform: `scaleX(${progress})` }} /></div>
              <div className="focused-plan-stats"><span><b>~52 min</b> total route</span><span><b>{focusedItems.length}</b> pieces ready</span></div>
            </div>
            <article className="focused-featured-card" style={itemStyle(selectedItem)}>
              <FocusedCover item={selectedItem} large />
              <div className="focused-featured-copy">
                <ItemMeta item={selectedItem} />
                <h2>{selectedItem.title}</h2>
                <div className="focused-why"><b>Why it matters</b><p>{selectedItem.why}</p></div>
                <Takeaways item={selectedItem} />
                <div className="focused-action-row">
                  <button className="focused-button focused-button-ink" type="button" onClick={(event) => openBrief(selectedItem, event.currentTarget)}>Read brief <BookOpen size={14} /></button>
                  <OpenItemLink item={selectedItem} />
                  <button className={`focused-button focused-button-read${readIds.has(selectedItem.id) ? ' is-read' : ''}`} type="button" aria-pressed={readIds.has(selectedItem.id)} onClick={() => markAsRead(selectedItem)}>{readIds.has(selectedItem.id) ? <Check size={14} /> : null}{readIds.has(selectedItem.id) ? 'Read' : 'Mark as read'}</button>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section className="focused-route-section" aria-labelledby="focused-route-title">
          <div className="focused-shell">
            <div className="focused-section-line"><p className="focused-eyebrow">The daily contract</p><h2 id="focused-route-title">Today’s seven</h2><span>{readCount}/{routeItems.length} complete</span></div>
            <div className="focused-route-rail">
              {routeItems.map((item, index) => <button className={`focused-route-card${selectedItem.id === item.id ? ' is-active' : ''}${readIds.has(item.id) ? ' is-read' : ''}`} style={itemStyle(item)} type="button" key={item.id} aria-current={selectedItem.id === item.id ? 'true' : undefined} onClick={() => selectItem(item)}>
                <span className="focused-route-index">{readIds.has(item.id) ? <Check size={13} /> : `0${index + 1}`}</span><b>{item.title}</b><small>{item.duration.replace(' brief', '')}</small>
              </button>)}
            </div>
          </div>
        </section>

        <section className="focused-library-section" id="focused-library" aria-labelledby="focused-library-title">
          <div className="focused-shell">
            <div className="focused-library-heading"><div><p className="focused-eyebrow">A pile of tabs, now with taste</p><h2 id="focused-library-title">The reading library.</h2></div><label className="focused-search"><Search size={17} /><span className="sr-only">Search the reading library</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search titles, topics, ideas…" /></label></div>
            <div className="focused-scope-tabs" role="tablist" aria-label="Library scope"><button type="button" role="tab" aria-selected={scope === 'briefs'} className={scope === 'briefs' ? 'is-active' : ''} onClick={() => setScope('briefs')}>Insight briefs <span>{focusedItems.filter((item) => item.isBrief).length}</span></button><button type="button" role="tab" aria-selected={scope === 'all'} className={scope === 'all' ? 'is-active' : ''} onClick={() => setScope('all')}>All bookmarks <span>{focusedItems.length}</span></button></div>
            <div className="focused-library-grid">
              <aside className="focused-filters" aria-label="Reading filters">
                <p className="focused-filter-heading"><Filter size={14} /> View</p>
                {[['for-you', 'For you'], ['unread', 'Unread'], ['newest', 'Newest']].map(([value, label]) => <button type="button" key={value} aria-pressed={view === value} className={view === value ? 'is-active' : ''} onClick={() => { setView(value as typeof view); playCue('press') }}>{label}{value === 'unread' ? <span>{routeItems.length - readCount}</span> : null}</button>)}
                <p className="focused-filter-heading focused-filter-heading-topics">Topics</p>
                <button type="button" aria-pressed={topic === 'All topics'} className={topic === 'All topics' ? 'is-active' : ''} onClick={() => setTopic('All topics')}>All topics <span>{focusedItems.length}</span></button>
                {topicCounts.map(([itemTopic, count]) => <button type="button" key={itemTopic} aria-pressed={topic === itemTopic} className={topic === itemTopic ? 'is-active' : ''} onClick={() => setTopic(itemTopic)}>{itemTopic} <span>{count}</span></button>)}
              </aside>
              <div className="focused-card-grid">
                {filteredItems.length ? filteredItems.map((item, index) => <article className={`focused-library-card${selectedItem.id === item.id ? ' is-selected' : ''}${readIds.has(item.id) ? ' is-read' : ''}`} style={{ ...itemStyle(item), '--float-delay': `${(index % 9) * -0.58}s`, '--float-range': `${7 + (index % 5)}px`, '--float-sway': `${2 + (index % 3)}px` } as CSSProperties} role="button" tabIndex={0} key={item.id} aria-label={`Preview ${item.title}`} onClick={() => selectItem(item)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); selectItem(item) } }} onMouseEnter={() => playCue('tick')}>
                  <FocusedCover item={item} /><div className="focused-library-card-body"><ItemMeta item={item} /><h3>{item.title}</h3><div className="focused-why"><b>Why it matters</b><p>{item.why}</p></div><div className="focused-card-footer"><span><Clock3 size={13} /> {item.duration}</span>{readIds.has(item.id) ? <span className="focused-read-label"><Check size={13} /> Read</span> : <span>Preview <ChevronRight size={13} /></span>}</div></div>
                </article>) : <div className="focused-empty"><p>No bookmarks match “{query || topic}”.</p><button type="button" onClick={() => { setQuery(''); setTopic('All topics') }}>Show all {focusedItems.length}</button></div>}
              </div>
              <aside className="focused-preview-panel" aria-label="Selected item preview">
                <div className="focused-preview-header"><span>Selected preview</span><Library size={15} /></div><FocusedCover item={selectedItem} /><ItemMeta item={selectedItem} /><h3>{selectedItem.title}</h3><div className="focused-why"><b>Why it matters</b><p>{selectedItem.why}</p></div><Takeaways item={selectedItem} /><div className="focused-preview-actions"><button className="focused-button focused-button-ink" type="button" onClick={(event) => openBrief(selectedItem, event.currentTarget)}>Read brief <BookOpen size={14} /></button><OpenItemLink item={selectedItem} /><button className={`focused-button focused-button-read${readIds.has(selectedItem.id) ? ' is-read' : ''}`} type="button" onClick={() => markAsRead(selectedItem)}>{readIds.has(selectedItem.id) ? 'Read' : 'Mark as read'}</button></div></aside>
            </div>
          </div>
        </section>
      </main>

      <footer className="focused-footer"><div className="focused-shell"><span>© {new Date().getFullYear()} Mauricio Berlanga</span><span>Curiosity, with an exit strategy.</span><button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Back to top ↑</button></div></footer>

      {toast ? <div className="focused-toast" role="status"><Sparkles size={15} /> {toast}</div> : null}

      {dialogItem ? <div className="focused-dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setDialogId(null) }}>
        <section className="focused-dialog" role="dialog" aria-modal="true" aria-labelledby="focused-dialog-title" onKeyDown={onDialogKeyDown}>
          <button className="focused-dialog-close" type="button" ref={closeButtonRef} aria-label="Close reading brief" onClick={() => setDialogId(null)}><X size={17} /> Close</button>
          <aside className="focused-dialog-aside"><FocusedCover item={dialogItem} large /><div><ItemMeta item={dialogItem} /><p>Source by {dialogItem.author}</p><a href={dialogItem.article ? sitePath(dialogItem.article) : dialogItem.sourceUrl} target={dialogItem.article ? undefined : '_blank'} rel={dialogItem.article ? undefined : 'noreferrer'}>Open original <ExternalLink size={13} /></a></div></aside>
          <article className="focused-dialog-content"><p className="focused-eyebrow">{dialogItem.category} · {dialogItem.sourceType}</p><h2 id="focused-dialog-title">{dialogItem.title}</h2><p className="focused-dialog-author">A focused brief by {dialogItem.author} · {dialogItem.duration}</p><div className="focused-why"><b>Why it matters</b><p>{dialogItem.why}</p></div><Takeaways item={dialogItem} numbered /><blockquote>Good reading leaves a useful shape behind: a decision, a question, or a better next step.</blockquote><div className="focused-dialog-actions"><button className={`focused-button focused-button-read${readIds.has(dialogItem.id) ? ' is-read' : ''}`} type="button" onClick={() => markAsRead(dialogItem)}>{readIds.has(dialogItem.id) ? <Check size={14} /> : null}{readIds.has(dialogItem.id) ? 'Read' : 'Mark as read'}</button><OpenItemLink item={dialogItem} /></div></article>
        </section>
      </div> : null}
    </div>
  )
}
