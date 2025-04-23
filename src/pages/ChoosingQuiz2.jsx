import React, { useState } from 'react';
import { useParams, useNavigate} from 'react-router-dom';
const ChoosingQuiz2 = () => {
  const { topic } = useParams();
  const [selectedTime, setSelectedTime] = useState('01:00');
  const [selectedItems, setSelectedItems] = useState('10');

  const navigate = useNavigate();

  const handlePlay = () => {
    navigate(`/play/${encodeURIComponent(topic)}/${selectedTime}/${selectedItems}`);
  };

  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 bg-bgimg">
      <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center mb-8">{topic.charAt(0).toUpperCase()+topic.slice(1)}</h1>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Timer:</h2>
          <div className="flex justify-around">   
            {['01:00', '02:00', '03:00'].map((time) => (
              <label key={time} className={`cursor-pointer px-6 py-2 rounded-xl text-white font-bold text-lg ${selectedTime === time ? 'bg-black' : 'bg-gray-800'} transition-colors duration-200`}>
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
          <h2 className="text-xl font-semibold mb-4">Number of items:</h2>
          <div className="flex justify-around">
            {[{ value: '10', color: 'bg-green-500' }, { value: '20', color: 'bg-yellow-400' }, { value: '30', color: 'bg-red-500' }].map(({ value, color }) => (
              <label key={value} className={`cursor-pointer px-6 py-2 rounded-xl text-white font-bold text-lg ${selectedItems === value ? color : 'bg-gray-400'} transition-colors duration-200`}>
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
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handlePlay}
            className="bg-sky-400 text-white px-8 py-3 rounded-xl font-bold text-lg hover:bg-sky-500 transition duration-200">
            Play
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChoosingQuiz2;
