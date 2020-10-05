// enum FORMATION_TYPES {
//   SUM,
//   RUN,
//   SAME_SUIT,
//   SAME_RANK,
//   SUIT_RUN,
// }

import { Schotten2Card } from 'src/games/Schotten2/game'

// enum ACTION_TYPE {
//   RETREAT,
//   USE_OIL,
//   PLAY_CARD,
//   DECLARE_CONTROL,
// }

// interface Formation {
//   spaces: number
//   validFormations: FORMATION_TYPES[]
//   isLower: boolean
// }

// interface WallType {
//   name: string
//   preFormation: Formation
//   postFormation: Formation
// }

export interface Suit {
  name: string
  color: string
  icon: string
  image: string
}

const suits: Suit[] = [
  {
    name: '',
    color: '#bfbf67',
    icon: 'anchor',
    image: '',
  },
  {
    name: '',
    color: '#99c3ff',
    icon: 'api',
    image: '',
  },
  {
    name: '',
    color: '#5c9974',
    icon: 'check',
    image: '',
  },
  {
    name: '',
    color: '#9b65a8',
    icon: 'bubble_chart',
    image: '',
  },
  {
    name: '',
    color: '#ad6868',
    icon: 'favorite',
    image: '',
  },
]

export interface Formation {
  name: string
  description: string
  example: Schotten2Card[]
}

const formations: Formation[] = [
  {
    name: 'Sum',
    description: 'Any cards. Highest sum wins',
    example: [
      { suit: 4, rank: 0 },
      { suit: 3, rank: 5 },
      { suit: 2, rank: 3 },
      { suit: 2, rank: 7 },
    ],
  },
  {
    name: 'Low Sum',
    description: 'Any cards. Lower sum wins',
    example: [
      { suit: 0, rank: 0 },
      { suit: 2, rank: 2 },
      { suit: 1, rank: 0 },
      { suit: 1, rank: 1 },
    ],
  },
  {
    name: 'Run',
    description:
      'Cards with consecutive rank from any color. Any order is accepted',
    example: [
      { suit: 0, rank: 5 },
      { suit: 1, rank: 6 },
      { suit: 2, rank: 7 },
      { suit: 1, rank: 8 },
    ],
  },
  {
    name: 'Same Color',
    description:
      'All of the cards in this formation should have the same color',
    example: [
      { suit: 3, rank: 6 },
      { suit: 3, rank: 8 },
      { suit: 3, rank: 4 },
      { suit: 3, rank: 3 },
    ],
  },
  {
    name: 'Same Rank',
    description: 'All of the cards in this formation should have the same rank',
    example: [
      { suit: 4, rank: 1 },
      { suit: 3, rank: 1 },
      { suit: 2, rank: 1 },
      { suit: 1, rank: 1 },
    ],
  },
  {
    name: 'Color Run',
    description:
      'Cards with consecutive rank from the same color. Any order is accepted',
    example: [
      { suit: 0, rank: 8 },
      { suit: 0, rank: 9 },
      { suit: 0, rank: 10 },
      { suit: 0, rank: 11 },
    ],
  },
]

interface Schotten2Event {
  description: string
  icon: string
  color: string
  skipCards?: boolean
}

const events: { [key: string]: Schotten2Event } = {
  Eliminate: {
    description: 'eliminated opposites at the',
    icon: 'sports_hockey',
    color: 'negative',
  },
  PlayCard: {
    description: 'played a card at the',
    icon: 'view_agenda',
    color: 'primary',
  },
  Damage: {
    description: 'damaged the',
    icon: 'power_settings_new',
    color: 'primary',
  },
  Start: {
    description: 'started the game',
    icon: 'check',
    color: 'positive',
    skipCards: true,
  },
  Retreat: {
    description: 'retreated at the',
    icon: 'directions_run',
    color: 'accent',
  },
  UseOil: {
    description: 'used oil at the',
    icon: 'local_fire_department',
    color: 'primary',
  },
  Expire: {
    description: 'expired',
    icon: 'timer_off',
    color: 'negative',
    skipCards: true,
  },
  Resign: {
    description: 'resigned',
    icon: 'flag',
    color: 'negative',
    skipCards: true,
  },
  Destroy: {
    description: 'won by successfully destroying the',
    icon: 'emoji_events',
    color: 'primary',
    skipCards: true,
  },
  Demolish: {
    description: 'won by successfully damaging 4 sections',
    icon: 'emoji_events',
    color: 'primary',
    skipCards: true,
  },
  Defend: {
    description: 'won by successfully defending the wall',
    icon: 'emoji_events',
    color: 'primary',
    skipCards: true,
  },
}

export { events, suits, formations }
