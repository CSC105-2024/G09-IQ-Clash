import { Axios } from '../utils/axiosInstance';
export const getUserSummary = async (userId) => {
    if (!userId) {
        throw new Error('User ID is required to fetch summary.');
    }
    try {
        const response = await Axios.get(`/summary/${userId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching summary for user ${userId}:`, error.response?.data || error.message);
        throw error;
    }
};

export const submitSummary = async (summaryData) => {
    if (!summaryData) {
        throw new Error('Summary data is required to submit.');
    }
    try {
        const response = await Axios.post('/summary/result', summaryData);
        return response.data;
    } catch (error) {
        console.error('Error submitting summary:', error.response?.data || error.message);
        throw error;
    }
};