import { Hono } from 'hono'
import { getAllQuizzes , getQuizByTopic } from '../controllers/quiz.controller.js'

const quizRoutes = new Hono()

quizRoutes.get('/', getAllQuizzes)
quizRoutes.get('/:topic', getQuizByTopic)

export default quizRoutes
