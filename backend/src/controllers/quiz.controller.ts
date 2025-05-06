import type { Context } from 'hono'

import {
  getAllQuizzesModel,
  getQuizByTopicModel,
    postQuizModel,
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
export const createNewQuiz = async (c: Context) => {
  try {
    const body = await c.req.json();
    if (!body.category || !Array.isArray(body.questions) || body.questions.length === 0) {
      return c.json({ error: 'Invalid quiz data. Category and at least one question are required.' }, 400);
    }
     const newQuiz = await postQuizModel(body);

    return c.json(newQuiz, 201);

  } catch (error: any) {
     console.error("Error creating new quiz:", error);
    if (error instanceof SyntaxError) { // Handle invalid JSON
      return c.json({ error: 'Invalid JSON payload' }, 400);
    }
    return c.json({ error: 'Failed to create quiz' }, 500);
  }
};