import type { Context } from 'hono'
import {
  getAllQuizzesModel,
  getQuizByTopicModel
} from '../models/quiz.model.js'

export const getAllQuizzes = async (c: Context) => {
  const quizzes = await getAllQuizzesModel()
  return c.json(quizzes)
}

export const getQuizByTopic = async (c: Context) => {
  const topic = c.req.param('topic')
  const quiz = await getQuizByTopicModel(topic)
  return c.json(quiz)
}
