import { db } from '../index.js' // Your Prisma client instance

export const submitSummaryModel = async ({userId, quizId, score, wrong, unanswered}: {
  userId: number;
  quizId: number;
  score: number;
  wrong: number;
  unanswered: number;
}) => {
  console.log('[submitSummaryModel] Attempting to create quiz result with data:', { userId, quizId, score, wrong, unanswered });
  try {
    const quizResult = await db.quizResult.create({
      data: {
        userId,
        quizId,
        score,
        wrong,
        unanswered
      }
    });
    console.log('[submitSummaryModel] Quiz result created successfully:', quizResult);

    console.log(`[submitSummaryModel] Attempting to update user ID: ${userId} with score increment: ${score}`);
    await db.user.update({
      where: { id: userId },
      data: {
        totalScore: {
          increment: score
        }
      }
    });
    console.log(`[submitSummaryModel] User ID: ${userId} total score updated successfully.`);

    return quizResult;
  } catch (error) {
    console.error("[submitSummaryModel] Error during database operation:", error);
    if (error.code) {
      console.error(`[submitSummaryModel] Prisma Error Code: ${error.code}`);
    }
    throw error;
  }
};
export const getUserSummaryModel = async (userId: number) => {
  const results = await db.quizResult.findMany({
    where: { userId },
    select: {
      score: true,
      wrong: true,
      unanswered: true
    }
  })

  const totalScoreFromHistory = results.reduce((sum, r) => sum + r.score, 0)

  return {
    history: results,
    totalScore: totalScoreFromHistory
  }
}