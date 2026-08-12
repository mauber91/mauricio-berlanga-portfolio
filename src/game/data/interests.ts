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
    category: 'Music & production',
    description: 'Psychedelic production, layered textures, and the studio craft behind immersive sound.',
    themes: ['Psychedelic production', 'Layered textures', 'Studio craft'],
  },
  {
    id: 'fred-again',
    title: 'Fred again..',
    category: 'Live electronic music',
    description: 'Live sampling, loop-based performance, and finding emotion in everyday sound.',
    themes: ['Live sampling', 'Loop-based performance', 'Everyday sound'],
  },
  {
    id: 'visual-art',
    title: 'Visual art',
    category: 'Visual culture',
    description: 'Color, composition, and atmosphere—and how each changes the feeling of an image.',
    themes: ['Color', 'Composition', 'Atmosphere'],
  },
  {
    id: 'videogames',
    title: 'Videogames',
    category: 'Interactive media',
    description: 'Interactive worlds shaped by systems, exploration, and the reward of discovery.',
    themes: ['Interactive worlds', 'Systems', 'Discovery'],
  },
  {
    id: 'nature-beach',
    title: 'Nature & the beach',
    category: 'Outdoor reset',
    description: 'Coastlines, water, and time outdoors as a way to reset.',
    themes: ['Coastlines', 'Water', 'Outdoor reset'],
  },
] as const satisfies readonly PersonalInterest[]

export function getPersonalInterest(id: PersonalInterestId): PersonalInterest {
  return personalInterests.find((interest) => interest.id === id) ?? personalInterests[0]
}
