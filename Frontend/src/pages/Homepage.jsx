import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Homepage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user'); 
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && parsedUser.username) {
          setUser(parsedUser); 
        } else {
          localStorage.removeItem('user');
          setUser(null);
        }
      } else {
        setUser(null); 
      }
    } catch (error) {
      localStorage.removeItem('user'); 
      setUser(null);
    }
  }, []); 

  return (
    <div className='relative min-h-screen bg-bgimg' > 
      
      <div className='fixed top-0 w-full bg-red-800 p-6 shadow-md z-10'></div> 

      {
        user ? ( 
          
          <Link 
            to="/userpage" 
            className='fixed top-4 right-4 z-20 bg-red-600 text-white font-semibold rounded-md px-4 py-2 hover:bg-red-700 transition-all shadow-lg' 
          >
            {user.username}
          </Link>
        ) : (
   
          <div className='absolute flex justify-end items-center gap-2 top-4 right-4 w-full mb-2 sm:gap-3 z-20'> 
            <> 
              <Link to="/login">
                <button className='bg-red-700 text-white font-semibold rounded-xl px-4 py-2 sm:px-6 sm:py-3 sm:text-lg border-2 border-gray-700 hover:bg-red-800 transition-all shadow-md'>Log in</button>
              </Link>
              <Link to="/register">
                <button className='bg-white text-red-700 font-semibold border-2 border-gray-700 rounded-xl px-4 py-2 sm:px-6 sm:py-3 sm:text-lg hover:bg-gray-200 transition-all shadow-md' >Sign Up</button>
              </Link>
            </>
          </div>
        )
      }
 
      <div className='pt-20 relative top-1/7 flex flex-col gap-10'> 
        <div className='h-1/2 flex flex-col items-center justify-center'>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white drop-shadow-lg">
            IQ <span className="text-yellow-400">CLASH</span>
          </h1>
          <img src="logo.jpg" alt="Logo" className="rounded-full p-3 w-2/4 max-w-sm shadow-lg border-4 border-white"/>
        </div>
        <div className='flex flex-col gap-4 items-center justify-center w-full h-1/12'>
          <Link to="/play"><button type="button" className='bg-red-500 text-white font-bold rounded-xl px-6 py-3 sm:px-8 sm:py-4 sm:text-lg border-2 border-gray-700 hover:bg-red-600 transition-all shadow-md w-43'>Play</button></Link>
          <Link to="/leaderboard"><button type="button" className='bg-red-700 text-white font-bold rounded-xl px-6 py-3 sm:px-8 sm:py-4 sm:text-lg border-2 border-gray-700 hover:bg-red-800 transition-all shadow-md w-43'>Leaderboard</button></Link>
        </div>
      </div>
      
    </div>  
  )
}

export default Homepage
