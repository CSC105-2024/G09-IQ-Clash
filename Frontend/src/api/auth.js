import { Axios } from "../utils/axiosInstance";

export const registerUser = async (username, password) => {
  const response = await Axios.post('/user/register', { username, password });
  return response.data;
};

export const loginUser = async (username, password) => {
  const response = await Axios.post('/user/login', { username, password });
  return response.data;
};