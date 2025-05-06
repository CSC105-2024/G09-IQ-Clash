import { Hono } from 'hono'
import { getAllQuizzes , getQuizByTopic, createNewQuiz } from '../controllers/quiz.controller.js'

const quizRoutes = new Hono()

quizRoutes.get('/', getAllQuizzes)
quizRoutes.get('/:topic', getQuizByTopic)
quizRoutes.post('/', createNewQuiz)


export default quizRoutes
