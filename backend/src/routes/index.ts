import { Hono } from 'hono'
import userRoutes from './user.js'
import quizRoutes from './quiz.js'
import leaderboardRoutes from './leaderboard.js'
import summaryRoutes from './summary.js'

const router = new Hono()

router.route('/user', userRoutes)
router.route('/quiz', quizRoutes)
router.route('/leaderboard', leaderboardRoutes)
router.route('/summary', summaryRoutes)

export default router
