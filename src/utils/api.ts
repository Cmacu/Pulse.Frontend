import { axiosInstance } from 'src/boot/axios'

const api = {
  setCountry: (country: string) => {
    return axiosInstance.post('/player/country?country=' + country)
  },
  setEmailNotifications: (notify: boolean) => {
    return axiosInstance.post('/player/emails?notify=' + notify)
  },
  setGravatar: (active: boolean) => {
    return axiosInstance.post('/player/gravatar?active=' + active)
  },
  getMatchmakerActivity: (utcFrom: string, utcTo: string) => {
    return axiosInstance.get(
      `/matchmaker/activity?utcFrom=${utcFrom}&utcTo=${utcTo}`,
    )
  },
  getMatchmakerAggregate: (utcFrom: string, utcTo: string) => {
    return axiosInstance.get(
      `/matchmaker/aggregate?utcFrom=${utcFrom}&utcTo=${utcTo}`,
    )
  },
  getPlayer: (playerId: string) => {
    const url =
      '/player' + (isNaN(+playerId) ? '/' : '/get?playerId=') + playerId
    return axiosInstance.get(url)
  },
  getCurrentPlayer: () => {
    return axiosInstance.get('/player/')
  },
  getLeaderboard: (skip = 0, take = 10) => {
    return axiosInstance.get(`/leaderboard?take=${take}&skip=${skip}`)
  },
  getLastMatch: () => axiosInstance.get('/match/last'),
  getMatches: (playerId: string, skip = 0, take = 10, opponentId = '') => {
    return axiosInstance.get(
      `/match?playerId=${playerId}&skip=${skip}&take=${take}&opponentId=${opponentId}`,
    )
  },
  getSettings: () => axiosInstance.get('/player/settings'),
  getResources: () => axiosInstance.get('/resource'),
}

export default api
