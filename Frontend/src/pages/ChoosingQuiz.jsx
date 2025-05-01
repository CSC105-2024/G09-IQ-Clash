import React from 'react';
import { Link } from 'react-router-dom';

const ChoosingQuiz = () => {
  return (
    <div className="min-h-screen bg-bgimg bg-cover bg-center px-4 py-6">
      {/* Back Button */}
      <div className="mb-4">
        <Link to="/">
          <button className="bg-black text-white px-4 py-2 rounded-md">Back</button>
        </Link>
      </div>

      {/* Title */}
      <h1 className="text-center text-3xl sm:text-4xl font-bold text-white mb-8 drop-shadow-lg">
        Choosing Quiz
      </h1>

      {/* Quiz Options Container */}
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center sm:gap-8">
        
        {/* Mathematics */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-center bg-red-300 rounded-lg p-4 w-full max-w-[280px] shadow-lg">
            <img
              src="mathI.png"
              alt="Math"
              className="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-52 lg:h-52 object-contain"
            />
          </div>
          <Link to="/play/mathematics">
            <button className="bg-gray-300 text-black px-4 py-2 rounded-md w-full font-semibold border-2">
              Mathematics 
            </button>
          </Link>
        </div>

        {/* Sports */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-center bg-red-300 rounded-lg p-4 w-full max-w-[280px] shadow-lg">
            <img
              src="sportsI.png"
              alt="Sports"
              className="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-52 lg:h-52 object-contain"
            />
          </div>
          <Link to="/play/sports">
            <button className="bg-purple-500 text-black px-4 py-2 rounded-md w-full font-semibold border-2">
              Sports
            </button>
          </Link>
        </div>

        {/* Science */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-center bg-red-300 rounded-lg p-4 w-full max-w-[280px] shadow-lg">
            <img
              src="ScienceI.png"
              alt="Science"
              className="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-52 lg:h-52 object-contain"
            />
          </div>
          <Link to="/play/science">
            <button className="bg-yellow-200 text-black px-4 py-2 rounded-md w-full font-semibold border-2">
              Science
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ChoosingQuiz;
