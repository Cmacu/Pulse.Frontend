import { reactive, ref } from '@vue/composition-api'
import { LocalStorage, Notify } from 'quasar'
import { socket } from 'src/games/Schotten2/socket'
import router from 'src/router'
import store from 'src/store'
import { NOTIFICATIONS } from 'src/store/modules/config'
import { startConfetti, stopConfetti } from 'src/utils/confetti'

const SECTION_COUNT = 7
const LOCAL_KEY = 'pulse-schotten2'

export interface Schotten2Card {
  rank: number
  suit: number
}
export interface Schotten2Section {
  name: string
  spaces: number
  isDamaged: boolean
  attack: Schotten2Card[]
  defense: Schotten2Card[]
}

export interface Schotten2State {
  isAttacker: boolean
  isCurrentPlayer: boolean
  enablePreparation: boolean
  activeSectionIndex: number
  opponentCardsCount: number
  siegeCardsCount: number
  oilCount: number
  handCards: Schotten2Card[]
  newCards: number
  discardCards: Schotten2Card[]
  sections: Schotten2Section[]
}

const sections: Schotten2Section[] = []

for (let s = 0; s < SECTION_COUNT; s++) {
  sections.push({
    name: '',
    spaces: 0,
    isDamaged: false,
    attack: [],
    defense: [],
  })
}

const handCards: Schotten2Card[] = []
const handOrder: number[] = [0, 1, 2, 3, 4, 5]
const discardCards: Schotten2Card[] = []

const localState = LocalStorage.getItem(LOCAL_KEY)
const defaultState = {
  loading: true,
  cardPlayed: false,
  enableOil: false,
  enableRetreat: false,
  selectedCard: -1,
  handOrder,
  api: {
    isAttacker: true,
    enablePreparation: true,
    isCurrentPlayer: false,
    activeSectionIndex: -1,
    opponentCardsCount: 0,
    siegeCardsCount: 0,
    oilCount: 0,
    handCards,
    newCards: 0,
    discardCards,
    sections,
  },
}

const state = reactive(Object.assign(defaultState, localState))
const matchId = ref('')

const setState = (gameState: Schotten2State) => {
  if (isGameOver(gameState)) return true
  state.cardPlayed = false
  state.api = Object.assign({}, state.api, gameState)
  // state.isAttacker = gameState.isAttacker
  // state.enablePreparation = gameState.enablePreparation
  // state.activeSectionIndex = gameState.activeSectionIndex
  // state.oilCount = gameState.oilCount
  // state.siegeCardsCount = gameState.siegeCardsCount
  // state.discardCards = gameState.discardCards
  // state.handCards = gameState.handCards
  // state.newCards = gameState.newCards

  // for (let i = 0; i < gameState.sections.length; i++) {
  //   const gameSection = gameState.sections[i]
  //   const stateSection = state.sections[i]
  //   stateSection.name = gameSection.name
  //   stateSection.spaces = gameSection.spaces
  //   stateSection.isDamaged = gameSection.isDamaged
  //   stateSection.attack = gameSection.attack
  //   stateSection.defense = gameSection.defense
  // }
  // state.opponentCardsCount = gameState.opponentCardsCount
  // state.isCurrentPlayer = gameState.isCurrentPlayer

  LocalStorage.set(LOCAL_KEY, state)
  state.loading = false
}

const isGameOver = (gameState: Schotten2State): boolean => {
  const balance = gameState.handCards.length - gameState.opponentCardsCount
  if (balance == 0) {
    return false
  }
  if (balance > 0) {
    startConfetti()
  }
  const notify = balance > 0 ? NOTIFICATIONS.WIN : NOTIFICATIONS.LOSS
  Notify.create(
    Object.assign(store.state.config.notifications[notify], {
      timeout: 0,
      onDismiss: () => {
        stopConfetti()
        router.push('/')
      },
    }),
  )
  return true
}

const disablePrepOptions = () => {
  state.enableOil = false
  state.enableRetreat = false
}

const placeCard = (sectionIndex: number, handIndex: number) => {
  state.cardPlayed = true
  state.api.isCurrentPlayer = false
  const card = state.api.handCards[handIndex]
  state.api.handCards.splice(handIndex, 1)
  const section = state.api.sections[sectionIndex]
  const formation = state.api.isAttacker ? section.attack : section.defense
  formation.push(card)
}

const actions = {
  loadState: async (match: string) => {
    state.loading = true
    matchId.value = match
    await socket.connect(match, setState)
    // const gameState = await getState()
    // setState(gameState)
  },
  toggleCard: (index: number) => {
    disablePrepOptions()
    state.api.newCards = 0
    state.selectedCard = index == state.selectedCard ? -1 : index
  },
  dragCard: (dragResult: { isSource: boolean; payload: number }) => {
    disablePrepOptions()
    state.api.newCards = 0
    if (!dragResult.isSource) return
    state.selectedCard = dragResult.payload
  },
  shuffleHand: (removedIndex: number, addedIndex: number) => {
    const index = state.handOrder[removedIndex]
    state.handOrder.splice(removedIndex, 1)
    state.handOrder.splice(addedIndex, 0, index)
  },
  addCardToWall: (sectionIndex: number, handIndex: number) => {
    state.loading = true
    disablePrepOptions()
    placeCard(sectionIndex, handIndex)
    return socket.playCard(sectionIndex, handIndex)
  },
  toggleRetreat: () => {
    state.enableRetreat = !state.enableRetreat
  },
  retreat: (sectionIndex: number) => {
    if (!state.enableRetreat) return
    state.api.sections[sectionIndex].attack = []
    return socket.retreat(sectionIndex)
  },
  toggleOil: () => {
    state.enableOil = !state.enableOil
  },
  useOil: (sectionIndex: number) => {
    if (!state.enableOil) return
    state.enableOil = false
    state.api.sections[sectionIndex].attack.splice(0, 1)
    return socket.useOil(sectionIndex)
  },
}

export const game = { state, actions }
