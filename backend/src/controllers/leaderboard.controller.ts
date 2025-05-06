import type { Context } from 'hono'

import { getLeaderboardModel} from '../models/leaderboard.model.js'

export const getLeaderboard = async (c: Context) => {
  const leaderboard = await getLeaderboardModel()
  return c.json(leaderboard)
}
