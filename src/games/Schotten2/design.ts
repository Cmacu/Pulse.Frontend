// enum FORMATION_TYPES {
//   SUM,
//   RUN,
//   SAME_SUIT,
//   SAME_RANK,
//   SUIT_RUN,
// }

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
    color: 'blue',
    icon: 'anchor',
    image: '',
  },
  {
    name: '',
    color: 'yellow',
    icon: 'api',
    image: '',
  },
  {
    name: '',
    color: 'red',
    icon: 'check',
    image: '',
  },
  {
    name: '',
    color: 'cyan',
    icon: 'bubble_chart',
    image: '',
  },
  {
    name: '',
    color: 'light-green',
    icon: 'favorite',
    image: '',
  },
]

export { suits }
