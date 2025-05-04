import { db } from '../index.js'

export const getAllQuizzesModel = async () => {
  return db.quiz.findMany({
    select: {
      id: true,
      category: true
    }
  })
}

export const getQuizByTopicModel = async (category: string) => {
  return db.quiz.findFirst({
    where: { category },
    include: {
      questions: true
    }
  })
}
