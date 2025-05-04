import { Hono } from 'hono'
import { getLeaderboard } from '../controllers/leaderboard.controller.js'

const leaderboardRoutes = new Hono()

leaderboardRoutes.get('/', getLeaderboard)

export default leaderboardRoutes
