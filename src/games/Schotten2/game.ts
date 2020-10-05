import { reactive, ref } from '@vue/composition-api'
import { LocalStorage, Notify } from 'quasar'
import { demo } from 'src/games/Schotten2/demo'
import { events } from 'src/games/Schotten2/design'
import { socket } from 'src/games/Schotten2/socket'
import router from 'src/router'
import store from 'src/store'
import { NOTIFICATIONS, Notification } from 'src/store/modules/config'
import { startConfetti, stopConfetti } from 'src/utils/confetti'

const SECTION_COUNT = 7
const LOCAL_KEY = 'pulse-schotten2'

export type UpdateStateFunction = (gameState: Schotten2State) => void

export interface Schotten2Api {
  connect: (matchId: string, updateState: UpdateStateFunction) => Promise<void>
  playCard: (sectionIndex: number, handIndex: number) => void
  useOil: (sectionIndex: number) => void
  retreat: (sectionIndex: number) => void
  resign: () => Promise<void> | undefined
  load: (cardCount: number) => Promise<void> | undefined
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
  lastPlayer: string
  lastEvent: string
  lastSection: number
  gameOver: string
}

export interface Schotten2Log {
  role: string
  player?: string
  event: string
  description?: string
  section: string
  cards?: Schotten2Card[]
  icon?: string
  color?: string
  skipCards?: boolean
}

const log: Schotten2Log[] = []

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
  isLog: false,
  enableOil: false,
  enableRetreat: false,
  handOrder,
  log,
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

const parseLog = (gameState: Schotten2State): Schotten2Log | undefined => {
  if (gameState.lastEvent == 'DrawCard') return
  const event = events[gameState.lastEvent]
  const emptyCard: Schotten2Card = { rank: -1, suit: -1, protected: true }
  let card = emptyCard
  const lastSection = +gameState.lastSection
  let section: Schotten2Section | undefined = undefined
  let cards: Schotten2Card[] = []
  if (!event.skipCards && lastSection >= 0 && state.api.sections?.length) {
    section = gameState.sections[lastSection]
    const formation =
      gameState.lastPlayer == '0' ? section.attack : section.defense
    card = formation[formation.length - 1]
    cards = [card]
  }

  if (gameState.lastEvent == 'Eliminate') {
    const opposite = { suit: card.suit, rank: card.rank == 0 ? 11 : 0 }
    cards = [card, emptyCard, opposite]
  } else if (gameState.lastEvent == 'Damage') {
    cards = [...(section?.attack || []), emptyCard, ...(section?.attack || [])]
  }

  return {
    role: gameState.lastPlayer,
    event: gameState.lastEvent,
    description: event.description,
    skipCards: event.skipCards,
    icon: event.icon,
    color: event.color,
    section:
      section?.name?.replace('Left', 'West ')?.replace('Right', 'East ') || '',
    cards,
  }
}

const setState = (gameState: Schotten2State, isLog = false) => {
  if (
    !isLog &&
    !isGameOver(gameState) &&
    gameState.isCurrentPlayer &&
    !state.api.isCurrentPlayer
  )
    Notify.create({
      icon: 'check',
      color: gameState.isAttacker ? 'accent' : 'primary',
      message: 'Its your turn',
      timeout: 3000,
    })
  if (state.isLog && !isLog) {
    state.loading = false
    return
  }
  const log = parseLog(gameState)
  state.api = Object.assign({}, state.api, gameState)
  LocalStorage.set(LOCAL_KEY, state)
  if (log) state.log.push(log)
  state.loading = false
}

const isGameOver = (gameState: Schotten2State): boolean => {
  if (!gameState.gameOver) return false
  let notification: Notification
  if (gameState.gameOver == 'Win') {
    startConfetti()
    notification = store.state.config.notifications[NOTIFICATIONS.WIN]
  } else if (gameState.gameOver == 'Loss') {
    notification = store.state.config.notifications[NOTIFICATIONS.LOSS]
  } else {
    notification = store.state.config.notifications[NOTIFICATIONS.OVER]
  }

  Notify.create(
    Object.assign({}, notification, {
      timeout: 0,
      closeBtn: false,
      actions: [
        {
          label: 'Open Pulse Games',
          color: 'white',
          size: '0.5rem',
          handler: () => {
            stopConfetti()
            router.push('/')
          },
        },
        {
          label: 'Dismiss',
          color: 'dark',
          size: '0.5rem',
          handler: stopConfetti,
        },
      ],
    }),
  )
  return true
}

const disablePrepOptions = () => {
  state.enableOil = false
  state.enableRetreat = false
}

const placeCard = (sectionIndex: number, cardIndex: number) => {
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
    await engine.disconnect()
    await engine.connect(match, setState)
  },
  parseLog,
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
    matchId.value = ''
    LocalStorage.remove(LOCAL_KEY)
    return engine.disconnect()
  },
  loadLog: (logState: Schotten2State) => {
    state.isLog = true
    setState(logState, true)
  },
  restoreState: () => {
    console.error('restore', game.state.api.siegeCardsCount)
    state.isLog = false
    engine.load(game.state.api.siegeCardsCount)
  },
}

export const game = { state, actions }
