import { Hono } from 'hono'
import {getUserSummary,submitSummary} from '../controllers/summary.controller.js'
import {authMiddleware} from "../middlwares/auth.middleware.js";
const summaryRoutes = new Hono()


summaryRoutes.get('/:userId',authMiddleware, getUserSummary)
summaryRoutes.post('/result',authMiddleware, submitSummary)

export default summaryRoutes