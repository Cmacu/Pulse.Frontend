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
  checkUsername: (username: string) => {
    return axiosInstance.get('/auth/validate/?username=' + username)
  },
  getPlayer: (player: string) => {
    return axiosInstance.get('/player/' + player)
  },
  findPlayer: (query: string) => {
    return axiosInstance.get('/player/search?query=' + query)
  },
  getCurrentPlayer: () => {
    return axiosInstance.get('/player/')
  },
  getLeaderboard: (skip = 0, take = 10) => {
    return axiosInstance.get(`/leaderboard?take=${take}&skip=${skip}`)
  },
  getLeaderboardLog: (player: string) => {
    return axiosInstance.get('/leaderboard/log?username=' + player)
  },
  getLastMatch: () => axiosInstance.get('/match/last'),
  getMatches: (player: string, skip = 0, take = 10, opponent = '') => {
    return axiosInstance.get(
      `/match?player=${player}&skip=${skip}&take=${take}&opponent=${opponent}`,
    )
  },
  getSchotten2Log: (matchId: string, skip: number) =>
    axiosInstance.get('/schotten2/log', {
      params: { matchId, skip },
    }),
  getMatch: (matchId: string) => axiosInstance.get('/match/' + matchId),
  getSettings: () => axiosInstance.get('/player/settings'),
  getResources: () => axiosInstance.get('/resource'),
}

export default api
