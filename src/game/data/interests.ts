export type PersonalInterestId =
  | 'tame-impala'
  | 'fred-again'
  | 'visual-art'
  | 'videogames'
  | 'nature-beach'

export type PersonalInterest = {
  id: PersonalInterestId
  title: string
  category: string
  description: string
  themes: readonly string[]
}

export const personalInterests = [
  {
    id: 'tame-impala',
    title: 'Tame Impala',
    category: 'Music / studio craft',
    description: 'Mauricio returns to Tame Impala for music that rewards close listening: patient layering, shifting repetition, and complete sonic worlds assembled one studio choice at a time.',
    themes: ['Layered texture', 'Evolving repetition', 'Studio-built worlds'],
  },
  {
    id: 'fred-again',
    title: 'Fred again..',
    category: 'Music / live sampling',
    description: 'Fred again.. is a reminder that electronic production can stay intimate: small recordings, loops, and live decisions preserve the human texture inside the technology.',
    themes: ['Everyday fragments', 'Loops in motion', 'Technology with a human edge'],
  },
  {
    id: 'visual-art',
    title: 'Visual art',
    category: 'Art / visual language',
    description: 'Mauricio is drawn to work where color, composition, light, and negative space shape attention before the subject is fully understood.',
    themes: ['Color', 'Composition', 'Atmosphere'],
  },
  {
    id: 'videogames',
    title: 'Videogames',
    category: 'Games / interactive design',
    description: 'Games turn rules into places. Mauricio enjoys the way mechanics, art direction, movement, and sound can teach a world through curiosity rather than explanation.',
    themes: ['World coherence', 'Learning through play', 'Discovery'],
  },
  {
    id: 'nature-beach',
    title: 'Nature & the beach',
    category: 'Nature / reset',
    description: 'Coastlines and time outdoors provide a counterweight to screen-based work: a wider field of attention, a steadier pace, and room for ideas to settle.',
    themes: ['Stable and changing', 'Room to think', 'Return with clarity'],
  },
] as const satisfies readonly PersonalInterest[]

export function getPersonalInterest(id: PersonalInterestId): PersonalInterest {
  return personalInterests.find((interest) => interest.id === id) ?? personalInterests[0]
}
