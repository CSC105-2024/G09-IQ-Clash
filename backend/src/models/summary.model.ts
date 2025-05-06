import { db } from '../index.js'

export const submitSummaryModel = async ({
  userId,
  quizId,
  score,
  wrong,
  unanswered
}: {
  userId: number
  quizId: number
  score: number
  wrong: number
  unanswered: number
}) => {
  const result = await db.quizResult.create({
    data: { userId, quizId, score, wrong, unanswered }
  })

  await db.user.update({
    where: { id: userId },
    data: {
      totalScore: {
        increment: score
      }
    }
  })

  return result
}

export const getUserSummaryModel = async (userId: number) => {
  const results = await db.quizResult.findMany({
    where: { userId },
    select: {
      score: true,
      wrong: true,
      unanswered: true
    }
  })

  const totalScore = results.reduce((sum, r) => sum + r.score, 0)

  return {
    history: results,
    totalScore
  }
}
