import { PlayerInterface } from 'src/store/modules/player'
import { defineModule } from 'direct-vuex'

export interface Message {
  player: string
  timestamp: Date
  message: string
}

export interface MatchInterface {
  loading: boolean
  name: string
  players: PlayerInterface[]
  chat: Message[]
  log: Message[]
}

const defaultState: MatchInterface = {
  loading: false,
  name: '',
  players: [],
  chat: [],
  log: [],
}

const mutations = {
  START_LOADING(state: MatchInterface) {
    state.loading = true
  },
  STOP_LOADING(state: MatchInterface) {
    state.loading = false
  },
  SET_MATCH_NAME(state: MatchInterface, name = '') {
    state.name = name
  },
} as const

const matchModule = defineModule({
  namespaced: true,
  state: (): MatchInterface => Object.assign({}, defaultState),
  getters: {},
  mutations,
  actions: {},
})

export default matchModule
