import { Hono } from 'hono'
import { getAllQuizzes , getQuizByTopic, createNewQuiz } from '../controllers/quiz.controller.js'
import {authMiddleware} from "../middlwares/auth.middleware.js";

const quizRoutes = new Hono()

quizRoutes.get('/',authMiddleware, getAllQuizzes)
quizRoutes.get('/:topic',authMiddleware, getQuizByTopic)
quizRoutes.post('/', createNewQuiz)

export default quizRoutes
