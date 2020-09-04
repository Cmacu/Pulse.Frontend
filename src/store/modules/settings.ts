import { defineModule } from 'direct-vuex'
import { Dark } from 'quasar'
import store from '..'
import api from 'src/utils/api'
import { playMatchedSound } from 'src/utils/audio'

export interface SettingsInterface {
  loading: boolean
  showFab: boolean
  matchmakerTimeout: number
  isDark: boolean
  enableClock: boolean
  enableGravatar: boolean
  enableSound: boolean
}

export interface CountryCode {
  code: string
  name: string
}

const defaultState: SettingsInterface = {
  loading: false,
  showFab: true,
  matchmakerTimeout: 60,
  isDark: true,
  enableClock: true,
  enableGravatar: false,
  enableSound: false,
}

const mutations = {
  START_LOADING(state: SettingsInterface) {
    state.loading = true
  },
  STOP_LOADING(state: SettingsInterface) {
    state.loading = false
  },
  UPDATE_ANIMATE_CLOCK(state: SettingsInterface, payload: boolean) {
    state.enableClock = payload
  },
  UPDATE_GRAVATAR(state: SettingsInterface, payload: boolean) {
    state.enableGravatar = payload
  },
  UPDATE_DARK_MODE(state: SettingsInterface, payload: boolean) {
    state.isDark = payload
  },
  UPDATE_SHOW_FAB(state: SettingsInterface, payload: boolean) {
    state.showFab = payload
  },
  UPDATE_SOUND(state: SettingsInterface, payload: boolean) {
    state.enableSound = payload
  },
  UPDATE_TIMEOUT(state: SettingsInterface, payload: number) {
    state.matchmakerTimeout = payload
  },
  SET_PLAYER(
    state: SettingsInterface,
    player: SettingsInterface = defaultState,
  ) {
    state = Object.assign(state, player)
  },
} as const

const playerModule = defineModule({
  namespaced: true,
  state: (): SettingsInterface => Object.assign({}, defaultState),
  getters: {},
  mutations,
  actions: {
    updateAnimateClock(context, payload: boolean) {
      context.commit(mutations.UPDATE_ANIMATE_CLOCK.name, payload)
    },
    async updateGravatar(context, payload: boolean) {
      context.commit(mutations.START_LOADING.name)
      await api.setGravatar(payload)
      await store.dispatch.player.updatePlayer()
      context.commit(mutations.UPDATE_GRAVATAR.name, payload)
      context.commit(mutations.STOP_LOADING.name)
    },
    async updateCountryFlag(context, payload: CountryCode) {
      const code = payload ? payload.code : ''
      context.commit(mutations.START_LOADING.name)
      await api.setCountry(code)
      store.dispatch.player.updateCountry(code)
      context.commit(mutations.STOP_LOADING.name)
    },
    updateDarkMode(context, payload: boolean) {
      Dark.set(payload)
      context.commit(mutations.UPDATE_DARK_MODE.name, payload)
    },
    updateShowFab(context, payload: boolean) {
      context.commit(mutations.UPDATE_SHOW_FAB.name, payload)
    },
    updateSound(context, payload: boolean) {
      playMatchedSound()
      context.commit(mutations.UPDATE_SOUND.name, payload)
    },
    updateTimeout(context, payload: number) {
      context.commit(mutations.UPDATE_TIMEOUT.name, payload)
    },
  },
})

export default playerModule
