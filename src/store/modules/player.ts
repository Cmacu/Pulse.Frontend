import { defineModule } from 'direct-vuex'
import { MATCH_STATES, NOTIFICATIONS } from './config'
import api from 'src/utils/api'
import { updateLogRocket } from 'src/boot/log-rocket'
import store from '..'
import { Notify } from 'quasar'
import { stopConfetti, startConfetti } from 'src/utils/confetti'

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
  winPercent: number
  lastGame: string
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
  winPercent: 0,
  lastGame: 'May 15',
  loading: false,
}

export interface Badge {
  name: string
  createdAt: string
}

const updateBadges = (badges: Badge[]) => {
  console.error(badges)
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
      message: badgeDetails.notify,
      icon: 'img:' + badgeDetails.image,
      color: 'positive',
      timeout: 0,
      html: true,
      onDismiss: () => stopConfetti(),
    })
  }
}

const updateMatchState = (status: MATCH_STATES = defaultState.status) => {
  console.info('Update Match State: ', status)
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
  const rank = store.getters.config.getDivision(newDivision, newLevel)
  const newRank = rank.name + ' ' + rank.title + ' ' + rank.rank
  if (oldDivision == newDivision && oldLevel > newLevel) {
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
  getters: {},
  mutations,
  actions: {
    async updatePlayer(context) {
      context.commit(mutations.START_LOADING.name)
      const response = await api.getCurrentPlayer()
      const player = response.data
      store.dispatch.stats.getHistory()
      updateLogRocket(player.id, player.username)
      updateMatchState(player.status.toUpperCase())
      updateRank(
        context.state.division,
        context.state.level,
        player.division,
        player.level,
      )
      updateBadges(player.badges)
      context.commit(mutations.SET_PLAYER.name, player)
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
