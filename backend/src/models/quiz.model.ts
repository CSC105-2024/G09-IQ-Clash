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
interface QuestionInput {
  text: string;
  imageUrl?: string | null;
  options: any;
  answer: string;
}

interface QuizInput {
  category: string;
  questions: QuestionInput[];
}

export const postQuizModel = async (quizData: QuizInput) => {
  const { category, questions } = quizData;
  return db.quiz.create({
    data: {
      category: category,
      questions: {
         create: questions.map(q => ({
          text: q.text,
          imageUrl: q.imageUrl,
          options: q.options,
          answer: String(q.answer),
        })),
      },
    },
    include: {
      questions: true,
    },
  });
};
