import { defineModule } from 'direct-vuex'
import date from 'src/utils/date'
import { pad } from 'src/utils/format'
import store from '..'

export interface TimerInterface {
  secondsLeft: number
  expiresAt: number
  isReserve: boolean
}

export interface TimerPayload {
  utc: string
  isReserve: boolean
  onComplete: () => void
}

let timer: NodeJS.Timeout | undefined = undefined

const defaultState: TimerInterface = {
  secondsLeft: 0,
  expiresAt: 0,
  isReserve: false,
}

const mutations = {
  RESET(state: TimerInterface) {
    state.expiresAt = 0
    state.secondsLeft = 0
    state.isReserve = false
  },
  SET_EXPIRES_AT(state: TimerInterface, expiresAt: number) {
    state.expiresAt = expiresAt
  },
  SET_SECONDS(state: TimerInterface, secondsLeft: number) {
    state.secondsLeft = secondsLeft
  },
  SET_RESERVE(state: TimerInterface, isReserve: boolean) {
    state.isReserve = isReserve
  },
} as const

const timerModule = defineModule({
  namespaced: true,
  state: (): TimerInterface => Object.assign({}, defaultState),
  getters: {
    getTimer: (context) => {
      if (!context.secondsLeft) return 0
      const sign = context.isReserve ? '- ' : ''
      const minutes = Math.floor(context.secondsLeft / 60)
      if (minutes < 1) return sign + '0:' + pad(context.secondsLeft)
      const seconds = context.secondsLeft % 60
      const hours = Math.floor(minutes / 60)
      if (hours < 1) return sign + minutes + ':' + pad(seconds)
      const days = Math.floor(hours / 24)
      if (days < 1) return sign + hours + ':' + pad(minutes)
      return sign + days + ':' + pad(hours)
    },
  },
  mutations,
  actions: {
    setTimer: (context, payload: TimerPayload) => {
      if (timer) clearInterval(timer)
      const expiresAt = date.utc(payload.utc).toDate().getTime()
      if (new Date().getTime() > expiresAt)
        return context.commit(mutations.RESET.name)
      context.commit(mutations.SET_EXPIRES_AT.name, expiresAt)
      context.commit(mutations.SET_RESERVE.name, payload.isReserve)
      store.dispatch.timer.countdown(payload.onComplete)
      console.error(context, payload.utc, payload.isReserve)
    },
    startTimer(context) {
      const now = new Date()
      const expiresAt = now.setMinutes(
        now.getMinutes() + store.state.settings.matchmakerTimeout,
      )
      context.commit(mutations.SET_EXPIRES_AT.name, expiresAt)
      context.commit(mutations.SET_RESERVE.name, false)
      store.dispatch.timer.countdown(store.dispatch.matchmaker.cancelSearch)
    },
    stopTimer(context) {
      context.commit(mutations.RESET.name)
      if (timer) clearInterval(timer)
    },
    countdown(context, onComplete: () => void) {
      timer = setInterval(() => {
        const timeLeft = context.state.expiresAt - new Date().getTime()
        if (timeLeft <= 0) {
          if (timer) clearInterval(timer)
          return onComplete()
        }
        context.commit(mutations.SET_SECONDS.name, Math.floor(timeLeft / 1000))
      }, 1000)
    },
  },
})

export default timerModule
