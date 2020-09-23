import { reactive } from '@vue/composition-api'
import { LocalStorage, Notify } from 'quasar'
import api from 'src/games/Schotten2/api'
import router from 'src/router'
import store from 'src/store'
import { NOTIFICATIONS } from 'src/store/modules/config'
import { startConfetti, stopConfetti } from 'src/utils/confetti'

const SECTION_COUNT = 7
const LOCAL_KEY = 'pulse-schotten2-game'

export interface Schotten2RequestParams {
  matchId: string
  sectionIndex?: number
  handIndex?: number
}

export interface Schotten2Section {
  name: string
  spaces: number
  isDamaged: boolean
  attack: Schotten2Card[]
  defense: Schotten2Card[]
}

export interface Schotten2Response {
  // matchId: string
  // from api
  isAttacker: boolean
  isCurrentPlayer: boolean
  instructions: string
  handCards: Schotten2Card[]
  sections: Schotten2Section[]
  discardCards: Schotten2Card[]
  opponentCardsCount: number
  siegeCardsCount: number
  oilCount: number
}

export interface Schotten2Card {
  rank: number
  suit: number
}

export interface Schotten2SectionDetails {
  acceptCard?: boolean
  dropClass?: string
}

export interface Section {
  name: string
  spaces: number
  isDamaged: boolean
  topCards: Schotten2Card[]
  bottomCards: Schotten2Card[]
}

export interface DropZone {
  acceptCards: boolean
  class: string
}

export interface CardPayload {
  handIndex: number
  orderIndex: number
}

interface GameState {
  loading: boolean
  gameId: string
  dropZones: DropZone[]
  selectedCard: number
  // from api:
  isAttacker: boolean
  isCurrentPlayer: boolean
  instructions: string
  opponentCardsCount: number
  siegeCardsCount: number
  oilCount: number
  handCards: Schotten2Card[]
  handOrder: number[]
  discardCards: Schotten2Card[]
  sections: Section[]
}

const sections: Section[] = []
const dropZones: DropZone[] = []

for (let s = 0; s < SECTION_COUNT; s++) {
  dropZones.push({ acceptCards: false, class: '' })
  sections.push({
    name: '',
    spaces: 0,
    isDamaged: false,
    topCards: [],
    bottomCards: [],
  })
}

const handCards: Schotten2Card[] = []
const handOrder: number[] = [0, 1, 2, 3, 4, 5]
const discardCards: Schotten2Card[] = []

const localState = LocalStorage.getItem(LOCAL_KEY)
const defaultState = {
  loading: true,
  gameId: '',
  dropZones,
  selectedCard: -1,
  // from api:
  isAttacker: true,
  isCurrentPlayer: false,
  instructions: '',
  opponentCardsCount: 0,
  siegeCardsCount: 0,
  oilCount: 0,
  handCards,
  handOrder,
  discardCards,
  sections,
}

const state = reactive<GameState>(Object.assign(defaultState, localState))

const disableWallDrop = () => {
  state.dropZones.forEach((dropZone) => {
    dropZone.acceptCards = false
  })
}

const getState = async (): Promise<Schotten2Response> => {
  return await api.getGame(state.gameId)
}

const setState = (gameState: Schotten2Response) => {
  return new Promise((resolve) => {
    state.isAttacker = gameState.isAttacker
    state.oilCount = gameState.oilCount
    state.siegeCardsCount = gameState.siegeCardsCount
    state.discardCards = gameState.discardCards
    state.handCards = gameState.handCards

    for (let i = 0; i < gameState.sections.length; i++) {
      const gameSection = gameState.sections[i]
      const stateSection = state.sections[i]
      const dropZone = state.dropZones[i]
      stateSection.name = gameSection.name
      stateSection.spaces = gameSection.spaces
      stateSection.isDamaged = gameSection.isDamaged
      stateSection.topCards = (!gameState.isAttacker
        ? gameSection.attack
        : gameSection.defense
      ).reverse()
      stateSection.bottomCards = gameState.isAttacker
        ? gameSection.attack
        : gameSection.defense
      dropZone.acceptCards =
        gameState.isCurrentPlayer &&
        stateSection.spaces > stateSection.bottomCards.length
      dropZone.class = ''
    }
    state.opponentCardsCount = gameState.opponentCardsCount
    state.isCurrentPlayer = isGameOver(gameState)
      ? false
      : gameState.isCurrentPlayer

    LocalStorage.set(LOCAL_KEY, state)
    state.loading = false
    resolve()
  })
}

const isGameOver = (gameState: Schotten2Response): boolean => {
  const balance = gameState.handCards.length - gameState.opponentCardsCount

  console.error(
    gameState.handCards.length,
    gameState.opponentCardsCount,
    balance,
  )
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

const actions = {
  loadState: async (gameId: string) => {
    state.loading = true
    state.gameId = gameId
    const gameState = await getState()
    setState(gameState)
  },
  toggleCard: (index: number) => {
    state.selectedCard =
      index == state.selectedCard ? -1 : (state.selectedCard = index)
  },
  dragCard: (dragResult: { isSource: boolean; payload: number }) => {
    if (!dragResult.isSource) return
    state.selectedCard = dragResult.payload
  },
  dropCard: () => {
    state.selectedCard = -1
  },
  shuffleHand: (removedIndex: number, addedIndex: number) => {
    const index = state.handOrder[removedIndex]
    state.handOrder.splice(removedIndex, 1)
    state.handOrder.splice(addedIndex, 0, index)
  },
  addCardToWall: async (handIndex: number, sectionIndex: number) => {
    state.loading = true
    disableWallDrop()
    const card = state.handCards[handIndex]
    state.handCards.splice(handIndex, 1)
    state.sections[sectionIndex].bottomCards.push(card)
    const response = await api.playCard({
      matchId: state.gameId,
      sectionIndex,
      handIndex,
    })
    await setState(response)
    state.selectedCard = 0
  },
}

export const game = { state, actions }
