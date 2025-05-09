import { Axios } from "../utils/axiosInstance"


const getLeaderboardapi = async () => {
    const res = await Axios.get('/leaderboard');
    return res.data;
}

export {getLeaderboardapi};