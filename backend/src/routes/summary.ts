import { Hono } from 'hono'
import {getUserSummary,submitSummary} from '../controllers/summary.controller.js'

const summaryRoutes = new Hono()

summaryRoutes.get('/:userId', getUserSummary)
summaryRoutes.post('/', submitSummary)

export default summaryRoutes
