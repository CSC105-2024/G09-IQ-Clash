import { Axios } from '../utils/axiosInstance';

export const getQuizQuestions = async (topic) => {
    try {
        const response = await Axios.get(`/quiz/${encodeURIComponent(topic)}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching quiz questions for topic "${topic}" in apiquiz:`, error);
        throw error;
    }
};