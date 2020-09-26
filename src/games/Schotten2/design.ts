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
    color: '#a7b56d',
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

export { suits }
