import { reactive } from '@vue/composition-api'

interface Card {
  rank: number
  suit: number
  selectedClass?: string
}

interface Section {
  name: string
  attackFormation: Card[]
  defendFormation: Card[]
  acceptCard?: boolean
  dropClass?: string
}

const hand: Card[] = [
  { suit: 0, rank: 11 },
  { suit: 0, rank: 3 },
  { suit: 1, rank: 5 },
  { suit: 2, rank: 3 },
  { suit: 3, rank: 10 },
  { suit: 3, rank: 1 },
]

const wall: Section[] = [
  {
    name: 'pit',
    defendFormation: [],
    attackFormation: [],
    acceptCard: true,
  },
  {
    name: 'tower',
    defendFormation: [
      { suit: 1, rank: 9 },
      { suit: 2, rank: 3 },
      { suit: 3, rank: 6 },
      { suit: 3, rank: 5 },
    ],
    attackFormation: [
      { suit: 3, rank: 11 },
      { suit: 3, rank: 3 },
      { suit: 2, rank: 5 },
      { suit: 2, rank: 3 },
    ],
    acceptCard: false,
  },
  {
    name: 'wall',
    defendFormation: [],
    attackFormation: [],
    acceptCard: true,
  },
  {
    name: 'gate',
    defendFormation: [],
    attackFormation: [],
    acceptCard: true,
  },
  {
    name: 'wall',
    defendFormation: [],
    attackFormation: [],
    dropClass: '',
    acceptCard: true,
  },
  {
    name: 'tower',
    defendFormation: [],
    attackFormation: [],
    acceptCard: true,
  },
  {
    name: 'pit',
    defendFormation: [],
    attackFormation: [],
    acceptCard: true,
  },
]

export const state = reactive({
  loading: true,
  hand,
  wall,
})

const clearSelected = () =>
  state.hand.forEach((card) => (card.selectedClass = ''))
const activateDropZones = () => {
  state.wall.forEach((section) => {
    if (!section.acceptCard) return
    section.dropClass = 'drop-zone-active'
  })
}
const clearDropZones = () => {
  state.wall.forEach((section) => {
    section.dropClass = ''
  })
}
const disableWallDrop = () => {
  state.wall.forEach((section) => {
    section.acceptCard = false
  })
}

// export interface GameState {
//   match: {
//     name: string
//     currentPlayer: string
//     score: number
//   }
//   players: {
//     attacker: Player
//     defender: Player
//   }
//   board: {
//     wall: Section[]
//     hand: Card[]
//     discardDeck: Card[]
//     opponentHandCount: number
//     remainingOilCount: number
//     remainingCardsCount: number
//   }
//   chat: Message[]
// }

export const stopLoading = () => (state.loading = false)
export const toggleCard = (index: number, currentClass = '') => {
  clearSelected()
  if (currentClass.length) {
    clearDropZones()
  } else {
    state.hand[index].selectedClass = 'card-ghost'
    activateDropZones()
  }
}

export const dragCard = () => {
  clearSelected()
  activateDropZones()
}

export const dropCard = () => {
  // clearSelected()
  clearDropZones()
}

export const shuffleHand = (removedIndex: number, addedIndex: number) => {
  const card = state.hand[removedIndex]
  state.hand.splice(removedIndex, 1)
  state.hand.splice(addedIndex, 0, card)
}

export const addCardToWall = (cardIndex: number, wallIndex: number) => {
  const card = state.hand[cardIndex]
  state.hand.splice(cardIndex, 1)
  state.wall[wallIndex].attackFormation.push(card)
  disableWallDrop()
}
