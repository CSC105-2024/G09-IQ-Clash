import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCheck, FaTimes, FaQuestionCircle } from 'react-icons/fa';
// QuizSummary Component
function Summary() {
  const location = useLocation();
  const navigate = useNavigate();

  // --- Extract data from location state ---
  const { score = 0, total = 0,wrong =0  } = location.state || {};

  // --- Calculate derived values ---
  const totalQuestions = total;
  const wrongAnswers = wrong;
  const TotalScore   = 0;
  const correctAnswer = total-wrong;
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  // --- Determine dynamic messages ---
  let performanceMessage = "Good Effort!";
  let performanceSubMessage = "Keep practicing!";
  if (percentage >= 90) {
      performanceMessage = "Excellent!";
      performanceSubMessage = "You are absolutely genius!";
  } else if (percentage >= 75) {
      performanceMessage = "Great Job!";
      performanceSubMessage = "Very impressive score!";
  } else if (percentage >= 60) {
      performanceMessage = "Nice Try!";
      performanceSubMessage = "You were close to passing.";
  } else if (percentage >= 40) {
      performanceMessage = "Keep Trying!";
      performanceSubMessage = "Study a bit more.";
  } else {
      performanceMessage = "Needs Improvement";
      performanceSubMessage = "Don't give up. Try again!";
  }

  // --- Handle navigation ---
  const handleContinue = () => {
      navigate('/');
  };

  if (!location.state) {
      return (
          <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-800 font-sans p-4">
              <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg text-center">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">No Quiz Data</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">Quiz summary cannot be displayed without completing a quiz.</p>
                  <button
                      onClick={handleContinue}
                      className="py-2 px-6 bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-800 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out">
                      Go Home
                  </button>
              </div>
          </div>
      );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-800 font-sans p-4 bg-bgimg">
      {/* Main card container */}
      <div className="flex flex-col md:flex-row bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden max-w-2xl lg:max-w-3xl w-full">

        <div className="w-full md:w-1/2 p-8 lg:p-10 bg-teal-700 dark:bg-teal-800 text-white flex flex-col items-center justify-center text-center">
          <h2 className="text-xl lg:text-2xl font-semibold mb-4">Your Score</h2>
          <div className="w-32 h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 bg-gradient-to-br from-gray-300 to-gray-500 dark:from-gray-600 dark:to-gray-800 rounded-full flex items-center justify-center mb-4 shadow-md">
            <span className="text-4xl md:text-5xl lg:text-6xl font-bold text-teal-900 dark:text-white">{score}</span>
          </div>
          <p className="text-2xl lg:text-3xl font-bold mb-2">{performanceMessage}</p>
          <p className="text-sm lg:text-base text-teal-100 dark:text-teal-200">{performanceSubMessage}</p>
        </div>
        <div className="w-full md:w-1/2 p-8 lg:p-10 bg-gray-50 dark:bg-gray-700 flex flex-col justify-center">
          <h2 className="text-xl lg:text-2xl font-semibold mb-6 text-center md:text-left text-gray-800 dark:text-gray-100">Summary</h2>

          {/* Summary Items */}
          <div className="space-y-4 mb-6">
             {/* Correct Answers - Added for completeness */}
             <div className="flex items-center justify-between p-3 lg:p-4 bg-gray-200 dark:bg-gray-600 rounded-lg">
              <div className="flex items-center space-x-2 lg:space-x-3">
                <FaCheck className="text-green-500 w-5 h-5 lg:w-6 lg:h-6" />
                <span className="text-gray-700 dark:text-gray-200 lg:text-lg">Correct answers</span>
              </div>
              <span className="font-medium text-gray-800 dark:text-gray-100 lg:text-lg">{correctAnswer}/{totalQuestions}</span>
            </div>

            {/* Wrong Answers - Using FaTimes */}
            <div className="flex items-center justify-between p-3 lg:p-4 bg-gray-200 dark:bg-gray-600 rounded-lg">
              <div className="flex items-center space-x-2 lg:space-x-3">
                <FaTimes className="text-red-500 w-5 h-5 lg:w-6 lg:h-6" />
                <span className="text-gray-700 dark:text-gray-200 lg:text-lg">Wrong answers</span>
              </div>
               {/* Display calculated wrong answers */}
              <span className="font-medium text-gray-800 dark:text-gray-100 lg:text-lg">{wrongAnswers}/{totalQuestions}</span>
            </div>

            {/* TotalScore - Using FaQuestionCircle */}
            <div className="flex items-center justify-between p-3 lg:p-4 bg-gray-200 dark:bg-gray-600 rounded-lg">
              <div className="flex items-center space-x-2 lg:space-x-3">
                <FaQuestionCircle className="text-gray-600 dark:text-gray-400 w-5 h-5 lg:w-6 lg:h-6" />
                <span className="text-gray-700 dark:text-gray-200 lg:text-lg">TotalScore</span>
              </div>
               {/* Display dynamic TotalScore */}
              <span className="font-medium text-gray-800 dark:text-gray-100 lg:text-lg">{TotalScore}</span>
            </div>
          </div>
          {/* Continue Button */}
          <button
            onClick={handleContinue}
            className="w-full py-3 lg:py-4 px-4 bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-800 text-white font-semibold lg:text-lg rounded-lg shadow-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50">
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export default Summary;
