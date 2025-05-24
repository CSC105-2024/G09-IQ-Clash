import { Axios } from "../utils/axiosInstance";

//fetch current user info by decoding cookie.
export const fetchCurrentUser = async () => {
    try {
      const res = await Axios.get('/user/decodeCookie',{withCredentials:true})
      return res.data
    } catch (error) {
      throw error;
    }
}

//to create new account
export const registerUser = async (username, password) => {
  const response = await Axios.post('/user/register', { username, password });
  return response.data;
};

//to login
export const loginUser = async(username,password,rememberMe) => {
    try {
      const response = await Axios.post('/user/login',{   
        username,
        password,
        rememberMe,
      })
      return response.data;
    } catch (error) {
      console.error('Login Error: ',error);
      throw error;
    }
}

//to log out
export const logoutUser = async() => {
  try {
    const res = await Axios.delete('/user/logout',{withCredentials:true});
    return res.data;
  } catch (error) {
    throw error;
  }
}

//update username
export const updateUsername = async(id, newUsername) => {
  try {
    const res = await Axios.patch('/user/updateUsername',{
      id,
      newUsername
    })
    return res.data;
  }catch (error) {
    console.error('Update username error:',error);
    throw error;
  }
}

// Update password
export const updatePassword = async(id,currentPassword, newPassword) => {
  try {
    const res = await Axios.patch('/user/updatePassword',{
      id,
      currentPassword,
      newPassword
    })
    return res.data;
  }catch (error) {
    console.error('Update password error:',error);
    throw error;
  }
}

//Delete user
export const deleteUser = async (id) => {
  try {
    const deleteUser = await Axios.delete('/user/deleteAccount');
    return deleteUser
  } catch (err) {
    throw new Error(err.response?.data?.error || "Failed to delete user.");
  }
};