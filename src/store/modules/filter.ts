import { defineModule } from 'direct-vuex'

export interface FilterOption {
  label: string
  value: number
}

export interface FilterInterface {
  title?: FilterOption
  mode?: FilterOption
  timer?: FilterOption
  role?: FilterOption
}

export interface FilterPayload {
  type: keyof FilterInterface
  value: FilterOption | undefined
}

export const GAME_TITLES = [
  // '<img src="/symbols/SchottenTotten2.png" height="200" />',
]
export const GAME_MODES = ['Demo', 'Casual', 'Competitive']
export const GAME_TIMERS = ['Async (1 day/turn)', 'Blitz (30 sec/turn)']
export const GAME_ROLES = ['Any', 'Attacker', 'Defender']

const defaultState: FilterInterface = {
  title: { value: 0, label: GAME_TITLES[0] },
  mode: { value: 0, label: GAME_MODES[0] },
}

const mutations = {
  RESET(state: FilterInterface) {
    state = Object.assign({}, state, defaultState)
    console.error(state)
  },
  SET(state: FilterInterface, payload: FilterPayload) {
    state[payload.type] = payload.value
  },
} as const

const filterModule = defineModule({
  namespaced: true,
  state: (): FilterInterface => Object.assign({}, defaultState),
  getters: {},
  mutations,
  actions: {
    setFilter: (context, payload: FilterPayload) =>
      context.commit(mutations.SET.name, payload),
  },
})

export default filterModule

export const getFilterOptions = (list: string[]) =>
  list.map((x, i) => ({ label: x, value: i }))
