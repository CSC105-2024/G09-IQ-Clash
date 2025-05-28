import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchCurrentUser} from '../api/auth.js';

const Homepage = () => {
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await fetchCurrentUser();
        if (data && data.user) {
          setUsername(data.user.username);
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };
    checkAuth();
  }, []);

  const handlePlayClick = () => {
    if (username) {
      navigate('/play');
    } else {
      alert('Please log in to your account before playing.');
    }
  };

  return (
      <div className='relative min-h-screen bg-bgimg flex flex-col'>
        <div className='fixed top-0 w-full bg-red-800 p-6 shadow-md z-10'>
        </div>

        {username ? (
            <button
                onClick={() => navigate('/userpage')}
                className='fixed top-4 right-4 z-20 bg-red-600 text-white text-lg font-bold rounded-xl px-6 py-3 hover:bg-red-700 transition-all shadow-xl'
            >
              {username}
            </button>
        ) : (
            <div className='fixed top-4 right-4 flex items-center gap-2 sm:gap-3 z-20'>
              <Link to='/login'>
                <button className='bg-red-700 text-white font-semibold rounded-xl px-4 py-2 sm:px-6 sm:py-3 sm:text-lg border-2 border-gray-700 hover:bg-red-800 transition-all shadow-md'>
                  Log in
                </button>
              </Link>
              <Link to='/register'>
                <button className='bg-white text-red-700 font-semibold border-2 border-gray-700 rounded-xl px-4 py-2 sm:px-6 sm:py-3 sm:text-lg hover:bg-gray-200 transition-all shadow-md'>
                  Sign Up
                </button>
              </Link>
            </div>
        )}

        <main className="flex-grow pt-24 sm:pt-28">
          <div className='flex flex-col items-center justify-center gap-10 text-center px-4'>
            <div className='flex flex-col items-center justify-center'>
              <h1 className="text-4xl sm:text-6xl font-extrabold text-white drop-shadow-lg">
                IQ <span className="text-yellow-400">CLASH</span>
              </h1>
              <img
                  src="/logo.jpg"
                  alt="IQ Clash Logo"
                  className="rounded-full p-3 w-3/4 max-w-md sm:max-w-sm shadow-lg border-4 border-white mt-4"
              />
            </div>

            <div className='flex flex-col gap-4 items-center justify-center w-full max-w-xs sm:max-w-sm mt-8'>
              <button
                  type="button"
                  onClick={handlePlayClick}
                  className='w-48 bg-red-500 text-white font-bold rounded-xl px-6 py-3 sm:px-8 sm:py-4 text-lg sm:text-xl border-2 border-gray-700 hover:bg-red-600 transition-all shadow-md'
              >
                Play
              </button>
              <Link to="/leaderboard">
                <button
                    type="button"
                    className='w-48 bg-red-700 text-white font-bold rounded-xl px-6 py-3 sm:px-8 sm:py-4 text-lg sm:text-xl border-2 border-gray-700 hover:bg-red-800 transition-all shadow-md'
                >
                  Leaderboard
                </button>
              </Link>
            </div>
          </div>
        </main>

        <footer className="bg-slate-800 text-white py-5 mt-20">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <h5 className="text-xl font-semibold mb-4">About IQ Clash</h5>
                <p className="text-gray-400 text-sm">
                  A vibrant community for quiz enthusiasts, puzzle solvers, and knowledge
                  seekers worldwide. Challenge your intellect and climb the ranks!
                </p>
              </div>

              <div>
                <h5 className="text-xl font-semibold mb-4">Quick Links</h5>
                <ul className="text-gray-400 space-y-2 text-sm">
                  <li><Link to="/" className="hover:text-yellow-400 transition-colors">Home</Link></li>
                  <li><Link to="/register" className="hover:text-yellow-400 transition-colors">Register</Link></li>
                  <li><Link to="/leaderboard" className="hover:text-yellow-400 transition-colors">Leaderboard</Link></li>
                </ul>
              </div>

              <div>
                <h5 className="text-xl font-semibold mb-4">Contact Us</h5>
                <ul className="text-gray-400 space-y-2 text-sm">
                  <li>Email: <a  className="transition-colors">info@iqclash.com</a></li>
                  <li>Phone: (555) 123-4567</li>
                  <li>Address: 123 Brainy Way, Quiz City, KNOWLEDGE</li>
                </ul>
              </div>
            </div>
            <hr className="border-gray-700" />

          </div>
        </footer>
      </div>
  );
};

export default Homepage;