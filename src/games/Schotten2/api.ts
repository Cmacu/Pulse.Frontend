import { axiosInstance } from 'src/boot/axios'
import {
  Schotten2RequestParams,
  Schotten2Response,
} from 'src/games/Schotten2/game'

const api = {
  getGame: async (matchId: string): Promise<Schotten2Response> => {
    const response = await axiosInstance.get<Schotten2Response>(
      `/schotten2?matchId=${matchId}`,
    )
    return response.data
  },
  playCard: async (
    params: Schotten2RequestParams,
  ): Promise<Schotten2Response> => {
    const response = await axiosInstance.get<Schotten2Response>(
      '/schotten2/card',
      {
        params,
      },
    )
    return response.data
  },
}

export default api
