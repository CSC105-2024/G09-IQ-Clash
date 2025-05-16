import { Axios } from "../utils/axiosInstance"
//fetch UserId
export async function fetchUserById(id) {
  const { data } = await Axios.get(`/user/${id}`);
  return data;
}

//Update username
export const updateUsername = async (userId, newUsername) => {
  try {
    const { data } = await Axios.put(`/user/${userId}`, {
      username: newUsername,
    });
    return data;
  } catch (err) {
    throw new Error(err.response?.data?.error || "Failed to update username.");
  }
};

// Update password
export const updatePassword = async (userId, newPassword) => {
  try {
    const { data } = await Axios.patch(`/user/editPassword/${userId}`, {
      password: newPassword,
    });
    return data;
  } catch (err) {
    throw new Error(err.response?.data?.error || "Failed to update password.");
  }
};

//Delete user
export const deleteUser = async (userId) => {
  try {
    const { data } = await Axios.delete(`/user/${userId}`);
    return data;
  } catch (err) {
    throw new Error(err.response?.data?.error || "Failed to delete user.");
  }
};