import { defineModule } from 'direct-vuex'
import { MATCH_STATES, NOTIFICATIONS } from './config'
import api from 'src/utils/api'
import { updateLogRocket } from 'src/boot/log-rocket'
import store from '..'
import { Notify } from 'quasar'
import { stopConfetti, startConfetti } from 'src/utils/confetti'
import { OpponentInterface } from 'src/store/modules/matchmaker'

export interface DeltaInterface {
  rating: number
  decay: number
  sign: string
  color: string
  side: string
}

export const defaultDelta = {
  rating: 0,
  decay: 0,
  sign: '',
  color: '',
  side: '',
}

export interface PlayerInterface {
  id: string
  status: MATCH_STATES
  badges: Badge[]
  username: string
  country: string
  avatar: string
  division: string
  level: string
  games: number
  totalWins: number
  totalGames: number
  totalResigns: number
  totalTimeouts: number
  totalCulture: number
  totalDecay: number
  regainDecay: number
  conservativeRating: number
  winPercent: number
  lastGame: string
  leaderboardRating: number
  loading: boolean
}

const defaultState: PlayerInterface = {
  id: '',
  status: MATCH_STATES.AVAILABLE,
  badges: [],
  username: '',
  country: '',
  avatar: '',
  division: '',
  level: '',
  games: 0,
  totalWins: 0,
  totalGames: 0,
  totalResigns: 0,
  totalTimeouts: 0,
  totalCulture: 0,
  totalDecay: 0,
  regainDecay: 0,
  conservativeRating: 0,
  winPercent: 0,
  lastGame: 'May 15',
  leaderboardRating: 0,
  loading: false,
}

export interface Badge {
  name: string
  createdAt: string
}

const updateBadges = (badges: Badge[]) => {
  for (const badge of badges) {
    if (
      store.state.player.badges.find(
        (playerBadge) => playerBadge.name == badge.name,
      )
    ) {
      continue
    }
    const badgeDetails = store.getters.config.getBadgeDetails(badge.name)
    startConfetti()
    Notify.create({
      message: badgeDetails?.notify ?? 'Achievement Badge',
      icon: 'img:' + badgeDetails?.image,
      color: 'positive',
      timeout: 0,
      html: true,
      onDismiss: () => stopConfetti(),
    })
  }
}

const updateMatchState = (
  status: MATCH_STATES = defaultState.status,
  matchId: string,
) => {
  if (matchId) return store.dispatch.matchmaker.startMatch(matchId)
  if (status == MATCH_STATES.SEARCHING) {
    return store.dispatch.matchmaker.findMatch()
  }

  store.commit.matchmaker.SET_STATE(status)
}

const updateRank = (
  oldDivision: number,
  oldLevel: number,
  newDivision: number,
  newLevel: number,
) => {
  if (oldDivision == newDivision && oldLevel == newLevel) return

  let isPromoted = true
  if (oldDivision == newDivision) {
    if (newDivision == 3) {
      // MASTER
      if (oldLevel < newLevel) {
        isPromoted = false
      }
    } else {
      // OTHER DIVISIONS
      if (oldLevel > newLevel) {
        isPromoted = false
      }
    }
  }

  const rank = store.getters.config.getDivision(newDivision, newLevel)
  const newRank = rank.name + ' ' + rank.title + ' ' + rank.rank

  if (!isPromoted) {
    const demote = store.state.config.notifications[NOTIFICATIONS.DEMOTED]
    Notify.create({
      message: demote.message + newRank,
      icon: 'img:' + rank.badge,
      color: demote.color,
    })
    return
  }
  startConfetti()
  const promote = store.state.config.notifications[NOTIFICATIONS.PROMOTED]
  Notify.create({
    message: promote.message + newRank,
    icon: 'img:' + rank.badge,
    color: promote.color,
    timeout: 0,
    onDismiss: () => stopConfetti(),
  })
}

const mutations = {
  START_LOADING(state: PlayerInterface) {
    state.loading = true
  },
  STOP_LOADING(state: PlayerInterface) {
    state.loading = false
  },
  SET_COUNTRY(state: PlayerInterface, country: string) {
    state.country = country
  },
  SET_PLAYER(state: PlayerInterface, player: PlayerInterface = defaultState) {
    state = Object.assign(state, player)
  },
} as const

const playerModule = defineModule({
  namespaced: true,
  state: (): PlayerInterface => Object.assign({}, defaultState),
  getters: {
    getDelta: (context) => (
      op1: OpponentInterface,
      op2: OpponentInterface,
    ): DeltaInterface => {
      const delta: DeltaInterface = Object.assign({}, defaultDelta)
      if (context.division != '3') return delta

      if (op1.username == context.username) {
        delta.rating = op1.ratingDelta
        delta.decay = op1.decayValue
        delta.side = 'left'
      }
      if (op2.username == context.username) {
        delta.rating = op2.ratingDelta
        delta.decay = op2.decayValue
        delta.side = 'right'
      }
      if (delta.rating != 0) {
        delta.rating = Math.round(delta.rating)
        delta.sign = delta.rating > 0 ? '+' : '-'
        delta.color = delta.rating > 0 ? 'positive' : 'negative'
      }
      return delta
    },
  },
  mutations,
  actions: {
    async updatePlayer(context) {
      context.commit(mutations.START_LOADING.name)
      const response = await api.getCurrentPlayer()
      const player = response.data
      updateLogRocket(player.id, player.username)
      updateMatchState(player.status.toUpperCase(), player.matchId)
      updateRank(
        context.state.division,
        context.state.level,
        player.division,
        player.level,
      )
      updateBadges(player.badges)
      context.commit(mutations.SET_PLAYER.name, player)
      store.dispatch.stats.getHistory()
      context.commit(mutations.STOP_LOADING.name)
    },
    updateCountry(context, payload: string) {
      context.commit(mutations.SET_COUNTRY.name, payload)
    },
    logout(context) {
      context.commit(mutations.SET_PLAYER.name)
    },
  },
})

export default playerModule
