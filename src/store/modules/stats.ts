import { defineModule } from 'direct-vuex'
import { OpponentInterface } from './matchmaker'
import api from 'src/utils/api'
import objectAssignDeep from 'object-assign-deep'
import store from '..'
import { formatDate, timestampToUtc } from 'src/utils/format'

// TODO: leaders and wonders data will be calculated here

export interface MatchInterface {
  name: string
  startDate: string
  endDate: string
  opponents: Array<OpponentInterface>
  score: string
}

export interface TrendDataPoint {
  value: number
  label: string
}

export interface StatsInterface {
  loading: boolean
  lastCheck: number
  matches: MatchInterface[]
  matchTrends: TrendDataPoint[]
  winTrends: TrendDataPoint[]
}

enum TREND_TYPE {
  MATCH,
  WINS,
}

const trendData: TrendDataPoint = { label: '', value: 0 }

const defaultState: StatsInterface = {
  loading: false,
  lastCheck: 0,
  matches: [],
  matchTrends: [trendData, trendData],
  winTrends: [trendData, trendData],
}

const getFullHistory = async (): Promise<MatchInterface[]> => {
  const matches: MatchInterface[] = []
  let page = 0
  const pageSize = 100
  let resultCount = 0
  do {
    const skip = page * pageSize
    const response = await api.getMatches(store.state.player.id, skip, pageSize)
    const results = response.data.results
    matches.push(...results)
    resultCount = results.length
    page++
  } while (resultCount == pageSize)

  return matches
}

export const isWin = (match: MatchInterface, player: string): boolean => {
  for (const opponent of match.opponents) {
    if (opponent.username == player && opponent.isWin) {
      return true
    }
  }
  return false
}

const getTrends = (
  matches: MatchInterface[],
  type: TREND_TYPE,
): TrendDataPoint[] => {
  const trends: TrendDataPoint[] = []
  const now = new Date().getTime()
  const player = store.state.player.username
  let date = new Date(store.state.config.seasonStart).getTime()
  let index = 0
  while (date < now) {
    const point: TrendDataPoint = {
      label: formatDate(date),
      value: 0,
    }
    while (
      index < matches.length &&
      timestampToUtc(matches[index].startDate) < date
    ) {
      if (type == TREND_TYPE.MATCH || isWin(matches[index], player)) {
        point.value++
      }
      index++
    }
    trends.push(point)
    date += 24 * 60 * 60 * 1000 // 24 hours
  }

  return trends
}

const mutations = {
  START_LOADING(state: StatsInterface) {
    state.loading = true
  },
  STOP_LOADING(state: StatsInterface) {
    state.loading = false
  },
  UPDATE_LAST_CHECK(state: StatsInterface) {
    state.lastCheck = new Date().getTime()
  },
  SET_MATCH_TRENDS(state: StatsInterface, matchTrends: TrendDataPoint[]) {
    state.matchTrends = matchTrends
  },
  SET_WIN_TRENDS(state: StatsInterface, winTrends: TrendDataPoint[]) {
    state.winTrends = winTrends
  },
  SET_MATCHES(state: StatsInterface, matches: MatchInterface[]) {
    state.matches = matches.sort(
      (a, b) => timestampToUtc(a.startDate) - timestampToUtc(b.startDate),
    )
  },
  CLEAR_MATCHES(state: StatsInterface) {
    objectAssignDeep(state, defaultState)
  },
} as const

const recentModule = defineModule({
  namespaced: true,
  state: (): StatsInterface => Object.assign({}, defaultState),
  getters: {
    getTotalMatches(context): number {
      return context.matches.length
    },
    getTotalWins(context): number {
      return context.matches.filter((match) =>
        isWin(match, store.state.player.username),
      ).length
    },
    getWinRate(context): string {
      const matchCount = context.matches.length
      if (!matchCount) return ''
      const winCount: number = context.matches.filter((match) =>
        isWin(match, store.state.player.username),
      ).length
      return ((winCount / matchCount) * 100).toFixed(1)
    },
  },
  mutations,
  actions: {
    async getHistory(context) {
      context.commit(mutations.START_LOADING.name)
      // check if last history check is within the last 1 minutes
      if (new Date().getTime() - 60 * 1000 < context.state.lastCheck) {
        return context.commit(mutations.STOP_LOADING.name)
      }
      context.commit(mutations.UPDATE_LAST_CHECK.name)
      const response = await api.getMatches(store.state.player.id, 0, 1)
      const total: number = response.data.total
      if (context.state.matches.length == total) {
        return context.commit(mutations.STOP_LOADING.name)
      }
      const matches = await getFullHistory()
      context.commit(mutations.SET_MATCHES.name, matches)
      context.commit(
        mutations.SET_MATCH_TRENDS.name,
        getTrends(matches, TREND_TYPE.MATCH),
      )
      context.commit(
        mutations.SET_WIN_TRENDS.name,
        getTrends(matches, TREND_TYPE.WINS),
      )

      return context.commit(mutations.STOP_LOADING.name)
    },
    logout(context) {
      context.commit(mutations.CLEAR_MATCHES.name)
    },
  },
})

export default recentModule
