import { axiosInstance } from 'src/boot/axios'

const api = {
  setCountry: (country: string) => {
    return axiosInstance.post('/v1/player/country?country=' + country)
  },
  setEmailNotifications: (notify: boolean) => {
    return axiosInstance.post('/v1/player/emails?notify=' + notify)
  },
  setGravatar: (active: boolean) => {
    return axiosInstance.post('/v1/player/gravatar?active=' + active)
  },
  getMatchmakerActivity: (utcFrom: string, utcTo: string) => {
    return axiosInstance.get(
      `/v1/matchmaker/activity?utcFrom=${utcFrom}&utcTo=${utcTo}`,
    )
  },
  getMatchmakerAggregate: (utcFrom: string, utcTo: string) => {
    return axiosInstance.get(
      `/v1/matchmaker/aggregate?utcFrom=${utcFrom}&utcTo=${utcTo}`,
    )
  },
  getPlayer: (playerId: string) => {
    return axiosInstance.get('/v1/player/' + playerId)
  },
  getCurrentPlayer: () => {
    return axiosInstance.get('/v1/player/')
  },
  getLeaderboard: (skip = 0, take = 10) => {
    return axiosInstance.get(`/v1/player/leaderboard?take=${take}&skip=${skip}`)
  },
  getLastMatch: () => axiosInstance.get('/v1/match/last'),
  getMatches: (playerId: string, skip = 0, take = 10, opponentId = '') => {
    return axiosInstance.get(
      `/v1/match?playerId=${playerId}&skip=${skip}&take=${take}&opponentId=${opponentId}`,
    )
  },
  getSettings: () => axiosInstance.get('/v1/player/settings'),
  getResources: () => axiosInstance.get('/v1/resource'),
}

export default api
