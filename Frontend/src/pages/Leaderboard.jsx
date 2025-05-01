import React from "react";
import { Link } from "react-router-dom";
import { FaCrown } from "react-icons/fa";

const Leaderboard = () => {
  const players = [
    { name: "John Cena", score: 555, rank: 1 },
    { name: "Lebron James", score: 444, rank: 2 },
    { name: "Micheal Jordan", score: 333, rank: 3 },
    { name: "Pom Pom", score: 222, rank: 4 },
    { name: "Josh Washing", score: 111, rank: 5 },
    { name: "AmOK", score: 99, rank: 6 },
    { name: "Thanapot", score: 88, rank: 7 },
    { name: "LaptopNokia", score: 77, rank: 8 },
    { name: "GamingInwZa", score: 66, rank: 9 },
    { name: "MouseDaBest", score: 55, rank: 10 },
  ];

  return (
    <div className="w-full h-screen flex flex-col bg-bgimg p-6 text-center">
      <div className="w-full flex justify-start p-4">
        <Link to="/" className="bg-black text-white py-2 px-4 rounded hover:bg-gray-900 transition-all ml-4">
          Back
        </Link>
      </div>
      <div className="w-full max-w-md mx-auto p-6 rounded-lg">
        <h2 className="text-white text-2xl font-extrabold mb-4">Leaderboard</h2>
        <div className="rounded-lg p-3 space-y-2">
          {players.map((player) => (
            <div
              key={player.rank}
              className={`relative flex justify-between items-center p-3 rounded-lg shadow-md transition-all transform hover:scale-105 ${
                player.rank === 1
                  ? "bg-yellow-400 text-black font-bold"
                  : player.rank === 2
                  ? "bg-gray-400 text-black font-bold"
                  : player.rank === 3
                  ? "bg-orange-400 text-black font-bold"
                  : "bg-white text-black"
              }`}
            >
              {player.rank === 1 && (
                <FaCrown className="absolute -top-6 left 1/4 transform -translate-x-1/2 text-yellow-500 text-3xl" />
              )}
              <span className="text-lg font-bold">{player.rank}</span>
              <span className="text-lg">{player.name}</span>
              <span className="text-lg font-bold">{player.score}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
