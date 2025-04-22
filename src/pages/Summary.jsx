import React from 'react';
// Import icons from react-icons library (Font Awesome in this case)
import { FaTimes, FaQuestionCircle } from 'react-icons/fa';

// Main App Component
function App() {
  // Props would typically be passed in here for dynamic data
  const score = 30;
  const wrongAnswers = 0;
  const unanswered = 0;
  const totalQuestions = 30;
  const totalScore = 555;

  return (
    <div className="flex items-center justify-center min-h-screen bg-bgimg dark:bg-gray-800 font-sans p-4">
      {/* Main card container */}
      <div className="flex flex-col md:flex-row bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden max-w-2xl lg:max-w-3xl w-full">

        {/* Left Section: Score */}
        <div className="w-full md:w-1/2 p-8 lg:p-10 bg-teal-700 dark:bg-teal-800 text-white flex flex-col items-center justify-center text-center">
          <h2 className="text-xl lg:text-2xl font-semibold mb-4">Your Score</h2>
          {/* Score Circle */}
          <div className="w-32 h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 bg-gradient-to-br from-gray-300 to-gray-500 dark:from-gray-600 dark:to-gray-800 rounded-full flex items-center justify-center mb-4 shadow-md">
            <span className="text-4xl md:text-5xl lg:text-6xl font-bold text-teal-900 dark:text-white">{score}</span>
          </div>
          <p className="text-2xl lg:text-3xl font-bold mb-2">Excellent!</p>
          <p className="text-sm lg:text-base text-teal-100 dark:text-teal-200">You are absolutely genius!</p>
        </div>

        {/* Right Section: Summary */}
        <div className="w-full md:w-1/2 p-8 lg:p-10 bg-gray-50 dark:bg-gray-700 flex flex-col justify-center">
           {/* Slightly increased padding on large screens */}
          <h2 className="text-xl lg:text-2xl font-semibold mb-6 text-center md:text-left text-gray-800 dark:text-gray-100">Summary</h2>

          {/* Summary Items */}
          <div className="space-y-4 mb-6">
            {/* Wrong Answers - Using FaTimes from react-icons */}
            <div className="flex items-center justify-between p-3 lg:p-4 bg-gray-200 dark:bg-gray-600 rounded-lg">
              <div className="flex items-center space-x-2 lg:space-x-3">
                {/* Using FaTimes icon */}
                <FaTimes className="text-red-500 w-5 h-5 lg:w-6 lg:h-6" />
                <span className="text-gray-700 dark:text-gray-200 lg:text-lg">Wrong answers</span>
              </div>
              <span className="font-medium text-gray-800 dark:text-gray-100 lg:text-lg">{wrongAnswers}/{totalQuestions}</span>
            </div>

            {/* Unanswered - Using FaQuestionCircle from react-icons */}
            <div className="flex items-center justify-between p-3 lg:p-4 bg-gray-200 dark:bg-gray-600 rounded-lg">
               {/* Slightly increased padding and icon size on large screens */}
              <div className="flex items-center space-x-2 lg:space-x-3">
                {/* Using FaQuestionCircle icon */}
                <FaQuestionCircle className="text-gray-600 dark:text-gray-400 w-5 h-5 lg:w-6 lg:h-6" />
                <span className="text-gray-700 dark:text-gray-200 lg:text-lg">Unanswered</span>
              </div>
              <span className="font-medium text-gray-800 dark:text-gray-100 lg:text-lg">{unanswered}/{totalQuestions}</span>
            </div>

            {/* Total Score */}
            <div className="flex items-center justify-between p-3 lg:p-4 bg-teal-100 dark:bg-teal-600 rounded-lg">
              <span className="font-semibold text-teal-800 dark:text-white lg:text-lg">Total Score</span>
              <span className="font-bold text-lg lg:text-xl text-teal-900 dark:text-white">{totalScore}</span>
            </div>
          </div>

          {/* Continue Button */}
          <button className="w-full py-3 lg:py-4 px-4 bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-800 text-white font-semibold lg:text-lg rounded-lg shadow-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50">
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
