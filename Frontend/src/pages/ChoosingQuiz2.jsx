import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ChoosingQuiz2 = () => {
  const { topic } = useParams();
  const [selectedTime, setSelectedTime] = useState('01:00');
  const [selectedItems, setSelectedItems] = useState('10');
  const navigate = useNavigate();

  const handlePlay = () => {
    navigate(`/play/${encodeURIComponent(topic)}/${selectedTime}/${selectedItems}`);
  };

  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 bg-bgimg relative px-4 pt-20 sm:pt-0">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="sm:absolute sm:top-6 sm:left-6 bg-black text-white px-4 py-2 rounded-md font-semibold hover:bg-gray-800 transition mb-4 sm:mb-0 self-start sm:self-auto"
      >
        Back
      </button>

      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 md:p-10 w-full max-w-lg sm:max-w-xl md:max-w-2xl border-4 border-black">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-6 sm:mb-8 break-words">
          {topic.charAt(0).toUpperCase() + topic.slice(1)}
        </h1>

        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">Timer:</h2>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8">
            {['01:00', '02:00', '03:00'].map((time) => (
              <label
                key={time}
                className={`cursor-pointer px-6 py-3 rounded-xl text-white font-semibold text-lg sm:text-xl ${
                  selectedTime === time ? 'bg-black' : 'bg-gray-800'
                } transition-colors duration-200 border-4 border-black`}
              >
                <input
                  type="radio"
                  name="timer"
                  value={time}
                  checked={selectedTime === time}
                  onChange={() => setSelectedTime(time)}
                  className="hidden"
                />
                {time}
              </label>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">Number of items:</h2>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8">
            {[{ value: '10', color: 'bg-green-500' }, { value: '20', color: 'bg-yellow-400' }, { value: '30', color: 'bg-red-500' }].map(
              ({ value, color }) => (
                <label
                  key={value}
                  className={`cursor-pointer px-6 py-3 rounded-xl text-white font-semibold text-lg sm:text-xl ${
                    selectedItems === value ? color : 'bg-gray-400'
                  } transition-colors duration-200 border-4 border-black`}
                >
                  <input
                    type="radio"
                    name="items"
                    value={value}
                    checked={selectedItems === value}
                    onChange={() => setSelectedItems(value)}
                    className="hidden"
                  />
                  {value}
                </label>
              )
            )}
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handlePlay}
            className="bg-sky-400 text-white px-8 py-3 rounded-xl font-semibold text-lg sm:text-xl hover:bg-sky-500 transition duration-200 border-4 border-black"
          >
            Play
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChoosingQuiz2;
