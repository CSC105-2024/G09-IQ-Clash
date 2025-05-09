import { db } from '../index.js'

export const getLeaderboardModel = async () => {
  return db.user.findMany({
    orderBy: { totalScore: 'desc' },
    take:10,
    select: {
      username: true,
      totalScore: true
    }
  })
}
