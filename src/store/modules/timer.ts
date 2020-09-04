import { defineModule } from 'direct-vuex'
import store from '..'

export interface TimerInterface {
  secondsLeft: number
  expiresAt: number
}

let timer: NodeJS.Timeout | undefined = undefined

const defaultState: TimerInterface = {
  secondsLeft: 0,
  expiresAt: 0,
}

const mutations = {
  RESET(state: TimerInterface) {
    state.secondsLeft = 0
    state.expiresAt = 0
  },
  SET_EXPIRES_AT(state: TimerInterface, expiresAt: number) {
    state.expiresAt = expiresAt
  },
  SET_SECONDS(state: TimerInterface, secondsLeft: number) {
    state.secondsLeft = secondsLeft
  },
} as const

const timerModule = defineModule({
  namespaced: true,
  state: (): TimerInterface => Object.assign({}, defaultState),
  getters: {},
  mutations,
  actions: {
    startTimer(context) {
      const now = new Date()
      const expiresAt = now.setMinutes(
        now.getMinutes() + store.state.settings.matchmakerTimeout,
      )
      context.commit(mutations.SET_EXPIRES_AT.name, expiresAt)
      store.dispatch.timer.countdown(expiresAt)
    },
    stopTimer(context) {
      if (timer) clearInterval(timer)
      context.commit(mutations.RESET.name)
    },
    countdown(context, expiresAt: number) {
      timer = setInterval(() => {
        const timeLeft = expiresAt - new Date().getTime()
        if (timeLeft <= 0) {
          if (timer) clearInterval(timer)
          return store.dispatch.matchmaker.cancelSearch()
        }
        context.commit(mutations.SET_SECONDS.name, Math.floor(timeLeft / 1000))
      }, 1000)
    },
  },
})

export default timerModule
