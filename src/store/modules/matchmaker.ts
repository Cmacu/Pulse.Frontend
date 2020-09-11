import { defineModule } from 'direct-vuex'
import {
  MatchState,
  MATCH_STATES,
  defaultMatchState,
  NOTIFICATIONS,
} from './config'
import store from '../index'
import { Notify } from 'quasar'
import * as socket from 'src/utils/socket'
import api from 'src/utils/api'
import { timestampToUtc } from 'src/utils/format'
import { playMatchedSound } from 'src/utils/audio'

export interface OpponentInterface {
  id: string
  username: string
  avatar: string
  country: string
  division: string
  level: string
  score: string
  isWin: boolean
  position: number
  isExpired?: boolean
  isResigned?: boolean
}

export interface MatchmakerInterface extends MatchState {
  name: string
  status: MATCH_STATES
  loading: boolean
  opponents: OpponentInterface[]
  timeoutAt: number
}

export const defaultOpponent: OpponentInterface = {
  id: '',
  username: '???',
  avatar: 'symbols/Unknown.png',
  country: '',
  division: '',
  level: '',
  score: '',
  isWin: false,
  position: 1,
}

const defaultState: MatchmakerInterface = Object.assign(
  {
    name: '',
    status: MATCH_STATES.AVAILABLE,
    loading: false,
    opponents: [defaultOpponent, defaultOpponent],
    timeoutAt: 0,
  },
  defaultMatchState,
)

const matchLimitReached = async (limit: number): Promise<boolean> => {
  await store.dispatch.stats.getHistory()
  const millisecondsPerDay = 24 * 60 * 60 * 1000
  const now = new Date().getTime()
  const yesterday = now - millisecondsPerDay
  const recentMatches = store.state.stats.matches.filter(
    (match) => timestampToUtc(match.startDate) > yesterday,
  )
  if (recentMatches.length < limit) {
    return false
  }

  const firstMatchTimestamp = timestampToUtc(recentMatches[0].startDate)
  let expiresIn = firstMatchTimestamp - yesterday
  const oneHour = 60 * 60 * 1000
  const expiresInHours = Math.floor(expiresIn / oneHour)
  expiresIn -= expiresInHours * oneHour

  Notify.create({
    message: `
      You reached the limit of ${limit} per day.
      We apologize for the inconvenience.
      <br>Another match will be available in
      <strong>
        ${expiresInHours} hours and
        ${Math.round(expiresIn / (60 * 1000))} minutes
      </strong>
      <br>We are working on increasing the match per day limits.
    `,
    html: true,
    icon: 'o_history',
    color: 'negative',
    timeout: 0,
  })

  return true
}

const mutations = {
  START_LOADING(state: MatchmakerInterface) {
    state.loading = true
  },
  STOP_LOADING(state: MatchmakerInterface) {
    state.loading = false
  },
  SET_STATE(state: MatchmakerInterface, status: MATCH_STATES) {
    state.status = status
    const matchState = store.state.config.matchStates[status]
    if (matchState.notify) {
      Notify.create({
        message: matchState.notify,
        color: matchState.color,
        icon: matchState.icon,
      })
    }
    state = Object.assign(state, matchState)
    if (status === MATCH_STATES.SEARCHING) {
      const now = new Date()
      state.timeoutAt = now.setMinutes(
        now.getMinutes() + store.state.settings.matchmakerTimeout,
      )
    } else {
      state.timeoutAt = 0
    }
    state.loading = false
  },
  SET_OPPONENT(
    state: MatchmakerInterface,
    data: { index: number; opponent: OpponentInterface },
  ) {
    state.opponents[data.index] = Object.assign({}, data.opponent)
  },
  SET_MATCH_NAME(state: MatchmakerInterface, name = '') {
    state.name = name
  },
} as const

const matchmakerModule = defineModule({
  namespaced: true,
  state: (): MatchmakerInterface => Object.assign({}, defaultState),
  getters: {},
  mutations,
  actions: {
    toggle(context) {
      switch (context.state.status) {
        case MATCH_STATES.AVAILABLE:
          store.dispatch.matchmaker.findMatch()
          break
        case MATCH_STATES.SEARCHING:
          store.dispatch.matchmaker.cancelSearch()
          break
        case MATCH_STATES.PLAYING:
          store.dispatch.matchmaker.finishMatch()
          break
        default:
          break
      }
    },
    reset(context) {
      context.commit(mutations.SET_MATCH_NAME.name, '')
      context.commit(mutations.SET_OPPONENT.name, {
        index: 0,
        opponent: Object.assign({}, store.state.player),
      })
      context.commit(mutations.SET_OPPONENT.name, {
        index: 1,
        opponent: Object.assign({}, defaultOpponent),
      })
    },
    async findMatch(context) {
      context.commit(mutations.START_LOADING.name)
      store.dispatch.matchmaker.reset()
      await store.dispatch.stats.getHistory()
      const limit = store.state.config.matchesPerDayLimit
      if (await matchLimitReached(limit)) {
        context.commit(mutations.STOP_LOADING.name)
        return
      }

      socket.reset()
      await socket.connect()
      context.commit(mutations.SET_STATE.name, MATCH_STATES.SEARCHING)
      store.dispatch.timer.startTimer()
    },
    async cancelSearch(context) {
      context.commit(mutations.START_LOADING.name)
      store.dispatch.timer.stopTimer()
      await socket.disconnect()
      context.commit(mutations.SET_STATE.name, MATCH_STATES.AVAILABLE)
    },
    setMatched(context) {
      if (store.state.settings.enableSound) playMatchedSound()
      context.commit(mutations.SET_STATE.name, MATCH_STATES.MATCHED)
    },
    async startMatch(context) {
      store.dispatch.matchmaker.cancelSearch()
      if (await store.dispatch.matchmaker.isMatchInProgress()) {
        context.commit(mutations.SET_STATE.name, MATCH_STATES.PLAYING)
      } else {
        Notify.create(store.state.config.notifications[NOTIFICATIONS.ERROR])
        context.commit(mutations.SET_STATE.name, MATCH_STATES.AVAILABLE)
      }
    },
    async finishMatch(context) {
      context.commit(mutations.START_LOADING.name)
      if (await store.dispatch.matchmaker.isMatchInProgress()) {
        Notify.create(
          store.state.config.notifications[NOTIFICATIONS.IN_PROGRESS],
        )
        context.commit(mutations.STOP_LOADING.name)
        return
      }
      store.state.matchmaker.opponents.forEach((opponent) => {
        if (opponent.username != store.state.player.username) {
          return
        }
        Notify.create(
          store.state.config.notifications[
            opponent.isWin ? NOTIFICATIONS.WIN : NOTIFICATIONS.LOSS
          ],
        )
      })
      context.commit(mutations.SET_STATE.name, MATCH_STATES.AVAILABLE)
      store.dispatch.player.updatePlayer()
    },
    async isMatchInProgress(context) {
      const response = await api.getLastMatch()
      const match = response.data
      if (!match || !match.opponents) {
        store.dispatch.matchmaker.reset()
        return false
      }
      context.commit(mutations.SET_MATCH_NAME.name, match.name)
      match.opponents
        .sort(
          (opp1: OpponentInterface, opp2: OpponentInterface) =>
            opp1.position - opp2.position,
        )
        .forEach((opponent: OpponentInterface, index: number) => {
          context.commit(mutations.SET_OPPONENT.name, { index, opponent })
        })

      return match.status == 0
    },
  },
})

export default matchmakerModule
