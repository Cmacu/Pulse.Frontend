import { reactive, ref } from '@vue/composition-api'
import { LocalStorage, Notify } from 'quasar'
import { demo } from 'src/games/Schotten2/demo'
import { socket } from 'src/games/Schotten2/socket'
import router from 'src/router'
import store from 'src/store'
import { NOTIFICATIONS } from 'src/store/modules/config'
import { startConfetti, stopConfetti } from 'src/utils/confetti'

const SECTION_COUNT = 7
const LOCAL_KEY = 'pulse-schotten2'

interface SectionCard {
  sectionIndex: number
  card: Schotten2Card
}

export type UpdateStateFunction = (gameState: Schotten2State) => void

export interface Schotten2Api {
  connect: (matchId: string, updateState: UpdateStateFunction) => Promise<void>
  playCard: (sectionIndex: number, handIndex: number) => void
  useOil: (sectionIndex: number) => void
  retreat: (sectionIndex: number) => void
  resign: () => Promise<void> | undefined
  disconnect: () => void | Promise<void>
}

export interface Schotten2Card {
  rank: number
  suit: number
  protected?: boolean
}
export interface Schotten2Section {
  name: string
  spaces: number
  types: number[]
  isDamaged: boolean
  attack: Schotten2Card[]
  defense: Schotten2Card[]
}

export interface Schotten2State {
  isAttacker: boolean
  isCurrentPlayer: boolean
  enablePreparation: boolean
  opponentCardsCount: number
  siegeCardsCount: number
  oilCount: number
  handCards: Schotten2Card[]
  newCards: number
  discardCards: Schotten2Card[]
  sections: Schotten2Section[]
  lastEvent: string
  lastSection: number
}

const sections: Schotten2Section[] = []

for (let s = 0; s < SECTION_COUNT; s++) {
  sections.push({
    name: '',
    spaces: 0,
    types: [],
    isDamaged: false,
    attack: [],
    defense: [],
  })
}

const handCards: Schotten2Card[] = []
const handOrder: number[] = [0, 1, 2, 3, 4, 5]
const discardCards: Schotten2Card[] = []

const defaultState = {
  loading: true,
  cardPlayed: false,
  enableOil: false,
  enableRetreat: false,
  handOrder,
  handOrderSelectedIndex: -1,
  demoIndex: 0,
  api: {
    isAttacker: true,
    enablePreparation: true,
    isCurrentPlayer: false,
    opponentCardsCount: 0,
    siegeCardsCount: 0,
    oilCount: 0,
    handCards,
    newCards: 0,
    discardCards,
    sections,
    lastEvent: '',
    lastSection: -1,
  },
}

const getDefaultState = () =>
  reactive(
    Object.assign(defaultState, LocalStorage.getItem(LOCAL_KEY), {
      api: { isCurrentPlayer: false },
    }),
  )

let state = getDefaultState()
let engine: Schotten2Api
const matchId = ref('')

const setState = (gameState: Schotten2State) => {
  state.cardPlayed = false
  // console.error(gameState.isCurrentPlayer, state.api.isCurrentPlayer)
  if (
    isGameOver(gameState) &&
    gameState.isCurrentPlayer &&
    !state.api.isCurrentPlayer
  )
    Notify.create({
      icon: 'check',
      color: gameState.isAttacker ? 'accent' : 'primary',
      message: 'Its your turn',
      timeout: 3000,
    })
  state.api = Object.assign({}, state.api, gameState)
  LocalStorage.set(LOCAL_KEY, state)
  state.loading = false
}

const isGameOver = (gameState: Schotten2State): boolean => {
  if (gameState.lastEvent != 'Destroyed' && gameState.lastEvent != 'Defended')
    return false

  let isWin = false
  if (gameState.isAttacker && gameState.lastEvent == 'Destroyed') isWin = true
  else if (!gameState.isAttacker && gameState.lastEvent == 'Defended')
    isWin = true

  if (isWin) startConfetti()
  const notify = isWin ? NOTIFICATIONS.WIN : NOTIFICATIONS.LOSS
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

const placeCard = (sectionIndex: number, cardIndex: number) => {
  state.cardPlayed = true
  state.api.isCurrentPlayer = false
  const card = state.api.handCards[cardIndex]
  state.api.handCards.splice(cardIndex, 1)
  const section = state.api.sections[sectionIndex]
  const formation = state.api.isAttacker ? section.attack : section.defense
  formation.push(card)
}

const actions = {
  loadState: async (match: string) => {
    state.loading = true
    if (matchId.value != match) {
      LocalStorage.remove(LOCAL_KEY)
      state = getDefaultState()
    }
    engine = socket
    if (match.includes('demo')) engine = demo
    matchId.value = match
    await engine.connect(match, setState)
    // const gameState = await getState()
    // setState(gameState)
  },
  toggleCard: (orderIndex: number) => {
    disablePrepOptions()
    state.api.newCards = 0
    state.handOrderSelectedIndex =
      state.handOrderSelectedIndex == orderIndex ? -1 : orderIndex
  },
  dragCard: (dragResult: { isSource: boolean; payload: number }) => {
    disablePrepOptions()
    state.api.newCards = 0
    state.handOrderSelectedIndex = dragResult.payload
  },
  shuffleHand: (removedIndex: number, addedIndex: number) => {
    const index = state.handOrder[removedIndex]
    const result = [...state.handOrder]
    result.splice(removedIndex, 1)
    result.splice(addedIndex, 0, index)
    state.handOrder = result
    state.handOrderSelectedIndex = addedIndex
  },
  addCardToWall: (sectionIndex: number, handIndex: number) => {
    state.loading = true
    disablePrepOptions()
    const cardIndex = state.handOrder[handIndex]
    placeCard(sectionIndex, cardIndex)
    return engine.playCard(sectionIndex, cardIndex)
  },
  toggleRetreat: () => {
    state.handOrderSelectedIndex = -1
    state.enableRetreat = !state.enableRetreat
  },
  retreat: (sectionIndex: number) => {
    if (!state.enableRetreat) return
    state.api.sections[sectionIndex].attack = []
    return engine.retreat(sectionIndex)
  },
  toggleOil: () => {
    state.enableOil = !state.enableOil
  },
  useOil: (sectionIndex: number) => {
    if (!state.enableOil) return
    state.enableOil = false
    state.api.sections[sectionIndex].attack.splice(0, 1)
    return engine.useOil(sectionIndex)
  },
  resign: () => engine.resign(),
  disconnect: () => {
    LocalStorage.remove(LOCAL_KEY)
    return engine.disconnect()
  },
}

export const game = { state, actions }
