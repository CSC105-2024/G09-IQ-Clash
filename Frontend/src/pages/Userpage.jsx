import React, { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom'; 
import { z } from "zod";
import { fetchCurrentUser, updateUsername, updatePassword, deleteUser, logoutUser } from "../api/auth";

// Zod schemas
const usernameSchema = z.string().min(3, "Username must be at least 3 characters");
const passwordSchema = z.object({
  oldPassword: z.string().min(6, "Old password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, { message: "Passwords do not match", path: ["confirmPassword"] });

// Reusable modal
const Modal = ({ title, children, onClose }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-5 w-[90%] max-w-sm shadow-xl animate-fade-in relative">
      <button className="absolute top-2 right-2 text-black text-xl font-bold" onClick={onClose}>✕</button>
      {title && <p className="text-base font-semibold text-gray-800 mb-4 text-center">{title}</p>}
      {children}
    </div>
  </div>
);

const UserPage = () => {
  const navigate = useNavigate(); 
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState("Loading..."); 
  const [score, setScore] = useState(0);
  const [password, setPassword] = useState("********"); 
  const [deleteInput, setDeleteInput] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [modalType, setModalType] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);


  // Fetch user info on load
 useEffect(() => {
   const checkAuth = async () => {
     try {
       const data = await fetchCurrentUser();
       if (data) {
         setUserId(data.user.id);
         setUsername(data.user.username);
         setScore(data.user.totalScore);
       }
     } catch (error) {
       console.error(error);
     }
   };
   checkAuth();
   }, []);
 



  // Reload user info after update
  const reloadUser = async () => {
    try {
      if (!userId) return;
      const userData = await getUser(userId);
      setUsername(userData.username);
      setScore(userData.totalScore || 0);
    } catch (error) {
      console.error("Error refreshing user data:", error);
    }
  };

  const closeModal = () => {
    setModalType(null); 
    setErrors({}); 
    setDeleteInput(""); 
    setNewUsername(""); 
    setOldPassword(""); 
    setNewPassword(""); 
    setConfirmPassword("");
  };

  const handleUsernameChange = async () => {
    const result = usernameSchema.safeParse(newUsername);
    if (!result.success) {
      setErrors({ username: result.error.errors[0].message });
      return;
    }
    try {
      await updateUsername(userId, newUsername);
      await reloadUser();
      setUsername(newUsername);
      closeModal();
    } catch (error) {
      setErrors({ username: error.message });
    }
  };

  const handlePasswordChange = async () => {
    const result = passwordSchema.safeParse({ oldPassword, newPassword, confirmPassword });
    if (!result.success) {
      const fieldErrors = {};
      result.error.errors.forEach(err => { fieldErrors[err.path[0]] = err.message; });
      setErrors(fieldErrors);
      return;
    }

    try {
      await updatePassword(userId,oldPassword,newPassword); // Assumes backend handles old password
      const masked = "*".repeat(newPassword.length);
      setPassword(masked);
      closeModal();
    } catch (error) {
      setErrors({ newPassword: error.message });
    }
  };

  const handleDelete = async () => {
    if (deleteInput !== username) {
      setErrors({ delete: "Username does not match." });
      return;
    }

    try {
      setLoading(true);
      await deleteUser(userId);
      navigate("/");
    } catch (error) {
      setErrors({ delete: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async() => {
    await logoutUser();
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-bgimg p-4 relative">
      <Link to="/">
        <button className="absolute top-4 left-4 bg-black text-white px-4 py-1 rounded text-sm">Back</button>
      </Link>
      <button onClick={handleLogout} className="absolute top-4 right-4 bg-red-600 text-white px-4 py-1 rounded text-sm hover:bg-red-700">
        Log Out
      </button>

      <div className="flex flex-col items-center">
        <img src="logo.jpg" alt="Logo" className="rounded-full p-3 w-2/4 max-w-lg shadow-lg border-4 border-white" />
      </div>

      <div className="bg-white p-5 rounded-xl shadow-lg mt-4 w-full md:w-1/2 max-w-md">
        <h2 className="text-lg font-bold text-center">Account Information</h2>
        <div className="mt-4 flex justify-between items-center text-sm md:text-base">
          <p><strong>Username:</strong> {username}</p>
          <button className="bg-black text-white px-3 py-1 rounded text-xs hover:bg-gray-800" onClick={() => setModalType("editUsername")}>Edit</button>
        </div>
        <div className="mt-4 flex justify-between items-center text-sm md:text-base">
          <p><strong>Password:</strong> {password}</p>
          <button className="bg-black text-white px-3 py-1 rounded text-xs hover:bg-gray-800" onClick={() => setModalType("editPassword")}>Edit</button>
        </div>
        <div className="mt-3 text-sm"><span>Total Score: {score}</span></div>
        <button className="mt-5 bg-black text-red-500 px-2 py-1 rounded text-xs font-bold hover:bg-gray-600" onClick={() => setModalType("delete")}>
          Delete Account
        </button>
      </div>

      {modalType === "delete" && (
        <Modal title="Do you want to delete your account?" onClose={closeModal}>
          <input type="text" placeholder="Enter your Username" value={deleteInput} onChange={e => setDeleteInput(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 mb-2 text-sm" />
          {errors.delete && <p className="text-red-600 text-sm mb-2">{errors.delete}</p>}
          <button onClick={handleDelete} className="w-full bg-black text-white py-2 rounded font-semibold text-sm hover:bg-gray-800" disabled={loading}>
            {loading ? "Deleting..." : "Confirm Delete"}
          </button>
        </Modal>
      )}

      {modalType === "editUsername" && (
        <Modal title="Edit Username" onClose={closeModal}>
          <input type="text" placeholder="Enter your new Username" value={newUsername} onChange={e => setNewUsername(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 mb-2 text-sm" />
          {errors.username && <p className="text-red-600 text-sm mb-2">{errors.username}</p>}
          <button onClick={handleUsernameChange} className="w-full bg-black text-white py-2 rounded font-semibold text-sm hover:bg-gray-800">Confirm Edit</button>
        </Modal>
      )}

      {modalType === "editPassword" && (
        <Modal title="Edit Password" onClose={closeModal}>
          <input type="password" placeholder="Old Password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 mb-2 text-sm" />
          {errors.oldPassword && <p className="text-red-600 text-sm mb-2">{errors.oldPassword}</p>}

          <input type="password" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 mb-2 text-sm" />
          {errors.newPassword && <p className="text-red-600 text-sm mb-2">{errors.newPassword}</p>}

          <input type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 mb-2 text-sm" />
          {errors.confirmPassword && <p className="text-red-600 text-sm mb-2">{errors.confirmPassword}</p>}

          <button onClick={handlePasswordChange} className="w-full bg-black text-white py-2 rounded font-semibold text-sm hover:bg-gray-800">Confirm Edit</button>
        </Modal>
      )}
    </div>
  );
};

export default UserPage;