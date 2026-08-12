import { ExternalLink, Music2, X } from 'lucide-react'
import type { CSSProperties } from 'react'
import './spotifyStationPlayer.css'

export type SpotifyStationId = 'tame-impala' | 'fred-again'

type SpotifyStation = {
  artist: string
  title: string
  trackId: string
  accent: string
}

const spotifyStations: Record<SpotifyStationId, SpotifyStation> = {
  'tame-impala': {
    artist: 'Tame Impala',
    title: 'Let It Happen',
    trackId: '2X485T9Z5Ly0xyaghN73ed',
    accent: '#ff9c78',
  },
  'fred-again': {
    artist: 'Fred again..',
    title: 'Delilah (pull me out of this)',
    trackId: '0Ftrkz2waaHcjKb4qYvLmz',
    accent: '#8cf5e7',
  },
}

export type SpotifyStationPlayerProps = {
  activeStationId: SpotifyStationId | null
  onDismiss: () => void
}

export function SpotifyStationPlayer({ activeStationId, onDismiss }: SpotifyStationPlayerProps) {
  if (!activeStationId) return null

  const station = spotifyStations[activeStationId]
  const spotifyUrl = `https://open.spotify.com/track/${station.trackId}`
  const embedUrl = `https://open.spotify.com/embed/track/${station.trackId}?utm_source=generator&theme=0`

  return (
    <aside
      className="game-spotify-station-player"
      style={{ '--spotify-station-accent': station.accent } as CSSProperties}
      role="region"
      aria-label={`${station.artist} listening station`}
    >
      <span className="game-spotify-station-status" role="status" aria-live="polite" aria-atomic="true">
        Spotify listening station discovered: {station.title} by {station.artist}. Use Spotify&apos;s Play button to listen.
      </span>
      <header className="game-spotify-station-heading">
        <span className="game-spotify-station-icon" aria-hidden="true"><Music2 size={15} /></span>
        <div>
          <p>Listening station discovered</p>
          <b>{station.title}</b>
          <span>{station.artist}</span>
        </div>
        <button type="button" onClick={onDismiss} aria-label="Dismiss Spotify player">
          <X size={16} />
        </button>
      </header>

      <div className="game-spotify-embed">
        <iframe
          key={station.trackId}
          src={embedUrl}
          title={`Spotify player: ${station.title} by ${station.artist}`}
          width="100%"
          height="152"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        />
      </div>

      <footer className="game-spotify-station-footer">
        <span>Press Play in Spotify · separate from interface sound</span>
        <a href={spotifyUrl} target="_blank" rel="noreferrer">
          Open Spotify <ExternalLink size={12} />
        </a>
      </footer>
    </aside>
  )
}
