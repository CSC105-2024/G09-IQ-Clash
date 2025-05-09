
export const getUser = async (userId) => {
  const res = await fetch(`/user/${userId}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to get user.");
  return data;
};

export const updateUsername = async (userId, newUsername) => {
  const res = await fetch(`/user/editUsername/${userId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: newUsername }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to update username.");
  return data;
};

// Update password
export const updatePassword = async (userId, newPassword) => {
  const res = await fetch(`/user/editPassword/${userId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: newPassword }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to update password.");
  return data;
};

// Delete user
export const deleteUser = async (userId) => {
  const res = await fetch(`/user/${userId}`, {
    method: "DELETE",
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to delete user.");
  return data;
};