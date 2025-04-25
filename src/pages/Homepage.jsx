import React from 'react'
import { Link } from 'react-router-dom'

const Homepage = () => {
  return (
    <div className='bg-bgimg h-screen relative'>
      <div className='fixed top-0 w-full bg-red-800 p-6 shadow-md'></div>
      <div className='absolute flex justify-end gap-2 top-1/12 w-full mb-2 sm:gap-3'> 
        <Link to="/login"><button className='bg-teal-500 text-white font-semibold rounded-xl px-4 py-2 sm:px-6 sm:py-3 sm:text-lg border-2 border-gray-700 hover:bg-teal-600 transition-all shadow-md'>Log in</button></Link>
        <Link to="/register"><button className='bg-white text-black font-semibold border-2 border-gray-700 rounded-xl px-4 py-2 sm:px-6 sm:py-3 sm:text-lg hover:bg-gray-200 transition-all shadow-md' >Sign Up</button></Link>
      </div>
 
      <div className='relative top-1/7 flex flex-col gap-10'>
      <div className='h-1/2 flex flex-col items-center justify-center'>
      {/* Title */}
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white drop-shadow-lg">
          IQ <span className="text-yellow-400">CLASH</span>
        </h1>

      {/* Logo */}
      <img src="logo.jpg" alt="Logo" className="rounded-full p-3 w-2/4 max-w-sm shadow-lg border-4 border-white"/>
    </div>
        <div className='flex flex-col gap-4 items-center justify-center w-full h-1/12'>
          <Link to="/play"><button type="button" className='bg-red-500 text-white font-bold rounded-xl px-6 py-3 sm:px-8 sm:py-4 sm:text-lg border-2 border-gray-700 hover:bg-red-600 transition-all shadow-md w-43'>Play</button></Link>
          <Link to="/leaderboard"><button type="button" className='bg-green-500 text-white font-bold rounded-xl px-6 py-3 sm:px-8 sm:py-4 sm:text-lg border-2 border-gray-700 hover:bg-green-600 transition-all shadow-md w-43'>Leaderboard</button></Link>
        </div>
      </div>
      
    </div>  
  )
}

export default Homepage 
