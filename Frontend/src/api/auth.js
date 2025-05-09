import { Axios } from "../utils/axiosInstance";

export const loginUser = async (credentials) => {
    const res = await Axios.post('/user/login',credentials);
    return res.data;
}
export const registerUser = async (credentials) => {
    const res = await Axios.post('/user/register',credentials);
    return res.data;   
}