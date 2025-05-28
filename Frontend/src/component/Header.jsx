import { useState,useEffect,useRef } from "react";
import { Link } from "react-router-dom";
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

  const handleLogoutClick = () => {
    setDropdownOpen(false);
    if (onLogout) {
      onLogout();
    }
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
              onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/46x46/14AE5C/FFFFFF?text=Logo"; }}
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
                  onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/40x40/cccccc/FFFFFF?text=User"; }}
                />
                <span className="text-[#2F6F42] text-lg font-medium max-sm:hidden">
                  {userName || 'User Name'}
                </span>
                <svg
                  className={`w-5 h-5 text-[#2F6F42] transition-transform duration-200 ${
                    dropdownOpen ? "transform rotate-180" : ""
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

export default Header