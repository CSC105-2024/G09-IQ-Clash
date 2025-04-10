import React, { useState } from "react";
import { Link } from 'react-router-dom';

const Modal = ({ title, children, onClose }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-5 w-[90%] max-w-sm shadow-xl animate-fade-in relative">
      <button className="absolute top-2 right-2 text-black text-xl font-bold"onClick={onClose}>✕</button>
      {title && <p className="text-base font-semibold text-gray-800 mb-4 text-center">{title}</p>}
      {children}
    </div>
  </div>
);

const UserPage = () => {
  const [username, setUsername] = useState("John Cena");
  const [password, setPassword] = useState("********");
  const [deleteInput, setDeleteInput] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [modalType, setModalType] = useState(null);

  const closeModal = () => setModalType(null);

  const handleDelete = () => {
    if (deleteInput === username) {
      alert("Account deleted!");
      closeModal();
    } else {
      alert("Username does not match.");
    }
  };

  const handleUsernameChange = () => {
    if (newUsername.trim()) {
      setUsername(newUsername);
      closeModal();
    }
  };

  const handlePasswordChange = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      alert("Please fill out all fields.");
    } else if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
    } else {
      setPassword("********");
      alert("Password changed successfully!");
      closeModal();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-bgimg p-4 relative">
      <Link to="/"><button className="absolute top-4 left-4 bg-black text-white px-4 py-1 rounded text-sm">Back</button></Link>

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

        <div className="mt-3 text-sm">
          <span>Total Score: 100</span>
        </div>

        <button className="mt-5 bg-black text-red-500 px-2 py-1 rounded text-xs font-bold hover:bg-gray-600" onClick={() => setModalType("delete")}>Delete Account</button>
      </div>

      {modalType === "delete" && (
        <Modal title="Do you want to delete your account?" onClose={closeModal}>
          <input
            type="text"
            placeholder="Enter your Username"
            value={deleteInput}
            onChange={(e) => setDeleteInput(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4 text-sm"
          />
          <button onClick={handleDelete} className="w-full bg-black text-white py-2 rounded font-semibold text-sm hover:bg-gray-800">
            Confirm Delete
          </button>
        </Modal>
      )}

      {modalType === "editUsername" && (
        <Modal onClose={closeModal}>
          <p className="text-sm font-medium text-gray-700 mb-2">New Username</p>
          <input
            type="text"
            placeholder="Enter your new Username"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4 text-sm"
          />
          <button onClick={handleUsernameChange} className="w-full bg-black text-white py-2 rounded font-semibold text-sm hover:bg-gray-800">
            Confirm Edit
          </button>
        </Modal>
      )}

      {modalType === "editPassword" && (
        <Modal onClose={closeModal}>
          {[["Old Password", oldPassword, setOldPassword], ["New Password", newPassword, setNewPassword], ["Confirm New Password", confirmPassword, setConfirmPassword]].map(([label, value, setter], idx) => (
            <div key={idx}>
              <p className="text-sm font-medium text-gray-700 mb-1">{label}</p>
              <input
                type="password"
                placeholder={`Enter your ${label.toLowerCase()}`}
                value={value}
                onChange={(e) => setter(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 mb-3 text-sm"
              />
            </div>
          ))}
          <button onClick={handlePasswordChange} className="w-full bg-black text-white py-2 rounded font-semibold text-sm hover:bg-gray-800">
            Confirm Edit
          </button>
        </Modal>
      )}
    </div>
  );
};

export default UserPage;
