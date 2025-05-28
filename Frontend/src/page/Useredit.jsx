import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { updateUsername, updateEmail, updatePassword, updateProfile, fetchCurrentUser, logoutUser } from "../api/auth";


// --- Header (structure from previous correction) ---
const Header = ({ isLoggedIn, userName, userAvatar, onLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);
  const navigate = useNavigate();
  const handleLogoutClick = async () => {
    await logoutUser();
    setDropdownOpen(false);
    if (onLogout) {
      onLogout();
    }
    navigate('/');
  };

  return (
    <div className="w-full bg-white shadow-sm">
      <div className="w-full max-w-[1440px] mx-auto px-[34px] py-5 max-sm:px-[15px]">
        <header className="flex items-center relative">
          <Link to="/" className="flex items-center mr-auto">
            <img
              src={'/logo.png'}
              alt="Canopy Green Logo"
              className="w-[46px] h-[46px]"
              onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/46x46/14AE5C/FFFFFF?text=Logo"; }}
            />
            <div className="text-[#14AE5C] text-[32px] font-extrabold ml-2.5">
              Canopy Green
            </div>
          </Link>
          {isLoggedIn ? (
            <div className="flex items-center gap-3 relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 cursor-pointer focus:outline-none p-1 rounded-md hover:bg-gray-100"
              >
                <img
                  src={userAvatar || '/usericon60px.png'}
                  alt={`${userName || 'User'}'s avatar`}
                  className="w-[40px] h-[40px] rounded-full object-cover border-2 border-gray-300"
                  onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/40x40/cccccc/FFFFFF?text=User"; }}
                />
                <span className="text-[#2F6F42] text-lg font-medium max-sm:hidden">
                  {userName || 'User Name'}
                </span>
                <svg
                  className={`w-5 h-5 text-[#2F6F42] transition-transform duration-200 ${dropdownOpen ? "transform rotate-180" : ""
                    }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <Link
                    to="/useredit"
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#14AE5C]"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Edit Profile
                  </Link>
                  <button
                    onClick={handleLogoutClick}
                    className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#14AE5C]"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-5 max-sm:hidden">
              <Link to="/login" className="text-[#2F6F42] text-2xl hover:underline">Login</Link>
              <Link
                to="/signup"
                className="text-white text-2xl bg-[#14AE5C] px-5 py-[3px] border-[3px] border-solid border-[#14AE5C] hover:bg-[#129b52] hover:border-[#129b52] transition-colors rounded-md"
              >
                Signup
              </Link>
            </div>
          )}
        </header>
      </div>
    </div>
  );
};

// --- Footer (structure from previous) ---
const Footer = () => {
  const handleSmoothScroll = (event, targetId) => {
    event.preventDefault();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      if (window.location.pathname !== '/') window.location.href = `/#${targetId}`;
      else targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (window.location.pathname !== '/') {
      window.location.href = `/#${targetId}`;
    }
  };
  return (
    <div className="w-full bg-gray-900 text-gray-300">
      <div className="w-full max-w-[1440px] mx-auto">
        <footer className="px-5 sm:px-[34px] py-10 border-t border-solid border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-8">
            <div><h3 className="text-xl font-semibold mb-[15px] text-white">About Canopy Green</h3><p className="text-base max-w-[259px]">A community dedicated to tree enthusiasts, arborists, and nature lovers from around the world.</p></div>
            <div><h3 className="text-xl font-semibold mb-[15px] text-white">Quick Links</h3><ul className="space-y-2"><li><Link to="/" className="hover:text-[#14AE5C] hover:underline">Home</Link></li><li><Link to="/signup" className="hover:text-[#14AE5C] hover:underline">Register</Link></li><li><a href="/#how-it-works" onClick={(e) => handleSmoothScroll(e, "how-it-works")} className="hover:text-[#14AE5C] hover:underline cursor-pointer">How it Works</a></li><li><Link to="/blog" className="hover:text-[#14AE5C] hover:underline">Blog</Link></li></ul></div>
            <div><h3 className="text-xl font-semibold mb-[15px] text-white">Contact Us</h3><ul className="space-y-2"><li>Email: info@canopygreen.com</li><li>Phone: (555) 123-4567</li><li>Address: 123 Nature Way, Forest City, EARTH</li></ul></div>
          </div>
          <div className="text-center text-sm border-t border-solid border-gray-700 pt-8 mt-8"><p>© {new Date().getFullYear()} Canopy Green. All rights reserved.</p></div>
        </footer>
      </div>
    </div>
  );
};

// --- Button (structure from previous) ---
const Button = ({ children, className, variant = "primary", size = "md", type = "button", disabled = false, ...props }) => {
  const baseClasses = "flex justify-center items-center cursor-pointer font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 px-4 py-2";
  let variantClasses = "";
  if (variant === "primary") variantClasses = `bg-[#14AE5C] text-white border border-[#14AE5C] hover:bg-[#129b52] hover:border-[#129b52] focus:ring-[#14AE5C] ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`;
  else if (variant === "outline") variantClasses = `border border-gray-400 text-gray-700 hover:bg-gray-100 focus:ring-gray-300 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`;
  else if (variant === "danger") variantClasses = `bg-red-500 text-white hover:bg-red-600 focus:ring-red-400 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`;
  let sizeClasses = "";
  if (size === "sm") sizeClasses = "text-sm";
  else if (size === "md") sizeClasses = "text-base";
  else if (size === "lg") sizeClasses = "text-lg px-6 py-2.5";
  const combinedClassName = [baseClasses, variantClasses, sizeClasses, className].filter(Boolean).join(" ");
  return <button type={type} className={combinedClassName} disabled={disabled} {...props}>{children}</button>;
};

// --- Useredit Page Component ---
export const Useredit = () => {
  const navigate = useNavigate();

  const [currentUserData, setCurrentUserData] = useState({
    id: null,
    username: "",
    email: "",
    avatarUrl: "usericon60px.png",
    isLoggedIn: true,
  });


  const [usernameInput, setUsernameInput] = useState(currentUserData.username);
  const [emailInput, setEmailInput] = useState(currentUserData.email);

  // avatarPreview will hold the Data URL for immediate preview, or the existing URL
  const [avatarPreview, setAvatarPreview] = useState(currentUserData.avatarUrl);
  // avatarFile holds the actual File object if a new one is selected
  const [avatarFile, setAvatarFile] = useState(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [isUserLoggedIn, setIsUserLoggedIn] = useState(true);

  // Effect to update form fields if currentUserData changes (e.g., from global state)

  // ADDED: State for top-left notification
  const [notification, setNotification] = useState({ show: false, message: "", type: "success" });
  const notificationTimeoutRef = useRef(null);

  // ADDED: State for password visibility
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await fetchCurrentUser();
        if (data.loggedIn && data.user) {
          setCurrentUserData({
            id: data.user.id,
            username: data.user.username,
            email: data.user.email,
            avatarUrl: data.user.profile_picture || data.user.profile || "usericon60px.png",
            // isLoggedIn: data.loggedIn // Original code did not update isLoggedIn from data, so I will not add it.
          })
          // Original code does not setUsernameInput or setEmailInput here, they remain as initialized
        } else {
          console.log("User data not found")
          // setIsUserLoggedIn(false); // Original code does not set this here
          // navigate('/login'); // Original code does not navigate here
        }
      } catch (error) {
        console.log(error)
        // setIsUserLoggedIn(false); // Original code does not set this here
        // navigate('/login'); // Original code does not navigate here
        throw error;
      }
    };
    checkAuth();
  }, []); // Original: no navigate in dependency array


  const handleActualLogout = async () => {
    await logoutUser(); // assuming logoutUser exists
    setIsUserLoggedIn(false);
    setCurrentUserData(null); // Original: sets to null
    navigate("/");
  };

  // ADDED: Function to show notification
  const showNotification = (message, type = "success") => {
    if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
    }
    setNotification({ show: true, message, type });
    notificationTimeoutRef.current = setTimeout(() => {
        setNotification({ show: false, message: "", type: "success" });
    }, 3000); // Auto-hide after 3 seconds
  };


  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showNotification("File is too large. Max size is 5MB.", "error"); // ADDED Notification
        e.target.value = null;
        return;
      }
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        showNotification("Invalid file type. Must be JPEG or PNG.", "error"); // ADDED Notification
        e.target.value = null;
        return;
      }

      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const newAvatarDataUrl = reader.result;
        setAvatarPreview(newAvatarDataUrl); // Original: updates avatarPreview

        try {
          await updateProfile(newAvatarDataUrl);
          setCurrentUserData(prev => ({ ...prev, avatarUrl: newAvatarDataUrl }));
          showNotification("Profile picture updated!"); // ADDED Notification
        } catch (err) {
          showNotification("Failed to update profile picture.", "error"); // ADDED Notification
          console.error(err);
        }
      };
      reader.readAsDataURL(file);
    }
  };


  const handleRemoveAvatar = async () => {
    const defaultAvatar = "/usericon60px.png"; // your placeholder image path
    setAvatarFile(null);
    setAvatarPreview(defaultAvatar); // Original: updates avatarPreview
    try {
      await updateProfile(defaultAvatar);
      setCurrentUserData(prev => ({ ...prev, avatarUrl: defaultAvatar }));
      showNotification("Profile picture removed."); // ADDED Notification
    } catch (err) {
      showNotification("Failed to reset profile picture.", "error"); // ADDED Notification
      console.error(err);
    }

    const fileInput = document.getElementById('avatarUpload');
    if (fileInput) fileInput.value = null;
  };

  const handleUpdateIdentifyingDetails = async (e) => {
    e.preventDefault();

    console.log("Updating username to:", usernameInput);
    console.log("Updating email to:", emailInput);
    // API call to update username and email would go here
    // Original logic for updating username/email is preserved below
    let actionTaken = false; // ADDED: To track if any update was attempted for notification
    try {
        if (!emailInput) { // Original condition
            const usernameResponse = await updateUsername(currentUserData.id, usernameInput);
            setCurrentUserData(prev => ({ ...prev, username: usernameResponse.username }));
            actionTaken = true;
        } else { // Original condition
            // Assuming updateEmail also returns relevant part of user or just email
             await updateEmail(currentUserData.id, emailInput); // Removed 'const emailResponse =' as it's not used in original setCurrentUserData
            setCurrentUserData(prev => ({ ...prev, email: emailInput })); // Original uses emailInput directly
            actionTaken = true;
        }
        // Original line, might overwrite specific API responses if inputs were different
        setCurrentUserData(prev => ({ ...prev, username: usernameInput, email: emailInput })); 
        
        if(actionTaken) { // ADDED: Show notification only if an update was processed
             showNotification("Identifying details updated!");
        } else {
            // This case might not be hit if one of the branches above always runs
            // but added for completeness if no input was provided to trigger API.
            showNotification("No details provided for update.", "info");
        }

    } catch (error) {
        console.error("Error updating identifying details:", error);
        showNotification("Failed to update identifying details.", "error"); // ADDED Notification
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setPasswordError("");
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setPasswordError("All password fields are required to change password.");
      // Not adding notification here as original uses inline passwordError
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    // API call to update password (verify currentPassword on backend)
    try {
      // const userPassword = await updatePassword(currentUserData.id,currentPassword,newPassword); // Original: userPassword not used
      await updatePassword(currentUserData.id, currentPassword, newPassword);
      // Moved alert and state resets into try block for successful update
      showNotification("Password updated!"); // ADDED Notification
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setPasswordError(""); // ADDED: Clear error on success
    } catch (error) {
      showNotification("Failed to update password. Current password might be incorrect.", "error"); // ADDED Notification
      // setPasswordError("The current password is not correct."); // Optionally set inline error too
      return; // Original: returns on error
    }
  };

  if (!isUserLoggedIn) {
    navigate('/login');
    return null;
  }

  return (
    <div className="w-full bg-[#EBF5EE] flex flex-col min-h-screen font-sans">
      {/* ADDED: Notification Display */}
      {notification.show && (
        <div
          className={`fixed top-4 right-4 z-[1000] p-4 rounded-md shadow-lg text-white
            ${notification.type === "success" ? "bg-green-500" : ""}
            ${notification.type === "error" ? "bg-red-500" : ""}
            ${notification.type === "info" ? "bg-blue-500" : ""}`} // Added info type styling
        >
          {notification.message}
          <button 
            onClick={() => {
                if (notificationTimeoutRef.current) clearTimeout(notificationTimeoutRef.current);
                setNotification({ show: false, message: "", type: "success" });
            }}
            className="ml-4 text-lg font-semibold leading-none"
            aria-label="Close notification"
          >&times;</button>
        </div>
      )}

      <Header
        isLoggedIn={isUserLoggedIn}
        userName={currentUserData.username} // Display username from potentially updated data
        userAvatar={currentUserData.avatarUrl} // Display current avatar preview (original behavior)
        onLogout={handleActualLogout}
      />

      <main className="flex-grow w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-semibold text-gray-700 mb-8 text-left">Edit profile page</h1>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700 mb-1 border-b pb-3">Profile Setting</h2>
          <div className="flex flex-col sm:flex-row items-center sm:items-start pt-4 gap-6">
            <img
              src={currentUserData.avatarUrl} // Original: uses currentUserData.avatarUrl
              alt="Avatar Preview"
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
              onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/96x96/cccccc/FFFFFF?text=Ava"; }}
            />
            <div className="flex-grow text-center sm:text-left">
              <p className="text-sm text-gray-500 mb-3">Must be JPEG or PNG</p>
              <div className="flex gap-2 justify-center sm:justify-start">
                <label htmlFor="avatarUpload" className="bg-[#14AE5C] text-white text-sm font-medium py-2 px-3 rounded-md cursor-pointer hover:bg-[#129b52] transition-colors">
                  Upload Profile Picture
                </label>
                <input type="file" id="avatarUpload" accept="image/jpeg, image/png, image/gif" onChange={handleAvatarChange} className="hidden" />
                <Button variant="danger" size="sm" onClick={handleRemoveAvatar} className="p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </Button>
              </div>
              {/* The separate "Update Picture" button is now removed */}
            </div>
          </div>
        </div>

        <form onSubmit={handleUpdateIdentifyingDetails} className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700 mb-1 border-b pb-3">Change identifying details for your account</h2>
          <div className="space-y-4 pt-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-600 mb-1">Username</label>
              <input
                type="text"
                name="username"
                id="username"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#14AE5C] focus:border-[#14AE5C] text-sm"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#14AE5C] focus:border-[#14AE5C] text-sm"
              />
            </div>
            <div className="flex justify-end pt-2">
              <Button type="submit" variant="primary" size="sm">Update Details</Button>
            </div>
          </div>
        </form>

        <form onSubmit={handleUpdatePassword} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700 mb-1 border-b pb-3">Change Password</h2>
          <div className="space-y-4 pt-4">
            {passwordError && <p className="text-red-500 text-xs text-center">{passwordError}</p>}
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-600 mb-1">Current Password</label>
              {/* ADDED: Wrapper for password visibility toggle */}
              <div className="relative">
                {showCurrentPassword ? (
                  <input // ADDED: Text version of the input
                    type="text"
                    name="currentPassword"
                    id="currentPassword"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#14AE5C] focus:border-[#14AE5C] text-sm pr-10" // Added pr-10
                  />
                ) : (
                  // Original input below - unchanged
                  <input type="password" name="currentPassword" id="currentPassword" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#14AE5C] focus:border-[#14AE5C] text-sm pr-10" /> // Added pr-10
                )}
                {/* ADDED: Eye icon button */}
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700"
                  aria-label={showCurrentPassword ? "Hide current password" : "Show current password"}
                >
                  <img
                    src={showCurrentPassword ? "/eyeopen.png" : "/eyeclose.png"}
                    alt={showCurrentPassword ? "Hide" : "Show"}
                    className="w-5 h-5"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-600 mb-1">New Password</label>
              {/* ADDED: Wrapper for password visibility toggle */}
              <div className="relative">
                {showNewPassword ? (
                  <input // ADDED: Text version of the input
                    type="text"
                    name="newPassword"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#14AE5C] focus:border-[#14AE5C] text-sm pr-10" // Added pr-10
                  />
                ) : (
                  // Original input below - unchanged
                  <input type="password" name="newPassword" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#14AE5C] focus:border-[#14AE5C] text-sm pr-10" /> // Added pr-10
                )}
                {/* ADDED: Eye icon button */}
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700"
                  aria-label={showNewPassword ? "Hide new password" : "Show new password"}
                >
                  <img
                    src={showNewPassword ? "/eyeopen.png" : "/eyeclose.png"}
                    alt={showNewPassword ? "Hide" : "Show"}
                    className="w-5 h-5"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-600 mb-1">Confirm Password</label>
              {/* ADDED: Wrapper for password visibility toggle */}
              <div className="relative">
                {showConfirmNewPassword ? (
                  <input // ADDED: Text version of the input
                    type="text"
                    name="confirmNewPassword"
                    id="confirmNewPassword"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#14AE5C] focus:border-[#14AE5C] text-sm pr-10" // Added pr-10
                  />
                ) : (
                  // Original input below - unchanged
                  <input type="password" name="confirmNewPassword" id="confirmNewPassword" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#14AE5C] focus:border-[#14AE5C] text-sm pr-10" /> // Added pr-10
                )}
                {/* ADDED: Eye icon button */}
                <button
                  type="button"
                  onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700"
                  aria-label={showConfirmNewPassword ? "Hide confirm password" : "Show confirm password"}
                >
                  <img
                    src={showConfirmNewPassword ? "/eyeopen.png" : "/eyeclose.png"}
                    alt={showConfirmNewPassword ? "Hide" : "Show"}
                    className="w-5 h-5"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </button>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <Button type="submit" variant="primary" size="sm">Update Password</Button>
            </div>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
};
export default Useredit;
