import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function ResponsiveQuizInterface() {
    const initialTimeInSeconds = 60;
    const [timeLeft, setTimeLeft] = useState(initialTimeInSeconds);

    // Timer countdown logic
    useEffect(() => {
        if (timeLeft <= 0)return;
        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);
    useEffect(() => {
        if (timeLeft === 0) {
            console.log('Time is up!');
            setShowModal(true); 
        }
    }, [timeLeft]);


    // Format time into digits for display
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const timeDigits = [
        String(minutes).padStart(2, '0')[0],
        String(minutes).padStart(2, '0')[1],
        String(seconds).padStart(2, '0')[0],
        String(seconds).padStart(2, '0')[1],
    ];
    const [showModal, setShowModal] = useState(false);
    const [showBack, setShowBack] = useState(false)
    const score = 100;
    const questionNumber = 1;
    const questionText = "What is this?";
    const imageSrc = "path/to/your/bull-image.png";
    const imageName = "Brown bull";
    const answers = [
        { id: 'A', text: 'Answer A', color: 'yellow' },
        { id: 'B', text: 'Answer B', color: 'blue' },
        { id: 'C', text: 'Answer C', color: 'pink' },
        { id: 'D', text: 'Answer D', color: 'green' },
    ];

    const getButtonClasses = (color) => {
        let baseClasses = `
            w-full text-left font-bold py-3 px-5 rounded-lg shadow mb-3
            md:w-auto md:mb-0
        `;
        switch (color) {
            case 'yellow': return baseClasses + ' bg-yellow-500 hover:bg-yellow-600 text-black';
            case 'blue':   return baseClasses + ' bg-blue-500 hover:bg-blue-600 text-white';
            case 'pink':   return baseClasses + ' bg-pink-500 hover:bg-pink-600 text-white';
            case 'green':  return baseClasses + ' bg-green-500 hover:bg-green-600 text-white';
            default:       return baseClasses + ' bg-gray-500 hover:bg-gray-600 text-white';
        }
    };

    const handleAnswerClick = (answerId) => {
        console.log(`Answer ${answerId} clicked`);
    };

    const handleBackClick = () => {
        console.log('Back button clicked');
        setShowBack(true);
    };

    return (
        <div className="bg-gray-300 min-h-screen flex items-center justify-center p-4">
            <div className="bg-gray-100 p-4 rounded-lg shadow-xl w-full max-w-3xl md:p-6 lg:p-8">

                {/* Back Button (Mobile View) */}
                <div className="md:hidden mb-4">
                    <button onClick={handleBackClick}className="bg-gray-600 hover:bg-gray-700 text-white text-sm font-semibold px-4 py-2 rounded shadow">
                        Back
                    </button>
                </div>

                {/* Score (Mobile View) */}
                <div className="text-center md:hidden mb-6">
                    <div className="bg-orange-500 text-white px-8 py-2 rounded-full shadow-md inline-block">
                        <span className="block text-xs font-medium leading-tight">SCORE</span>
                        <span className="block text-2xl font-bold leading-tight">{score}</span>
                    </div>
                </div>

                {/* Desktop Header */}
                <header className="hidden md:flex justify-between items-center mb-8 relative">
                    <button onClick={handleBackClick} className="bg-gray-600 hover:bg-gray-700 text-white text-sm font-semibold px-4 py-1.5 rounded shadow">
                        Back
                    </button>
                    <div className="text-center flex-grow">
                        <h1 className="text-3xl lg:text-4xl font-bold text-gray-800">TIME!</h1>
                        <div className="flex justify-center space-x-1 lg:space-x-2 mt-2">
                     <span className="bg-black text-white text-2xl font-mono p-2 rounded-md">{timeDigits[0]}</span>
                     <span className="bg-black text-white text-2xl font-mono p-2 rounded-md">{timeDigits[1]}</span>
                     <span className="text-black text-2xl font-mono mx-1">:</span>
                     <span className="bg-black text-white text-2xl font-mono p-2 rounded-md">{timeDigits[2]}</span>
                     <span className="bg-black text-white text-2xl font-mono p-2 rounded-md">{timeDigits[3]}</span>
                        </div>
                    </div>
                    <div className="bg-orange-500 text-white px-3 py-1 rounded shadow text-center">
                        <span className="block text-xs font-medium">SCORE</span>
                        <span className="block text-xl font-bold">{score}</span>
                    </div>
                </header>

                {/* Question & Image */}
                <main className="text-center mb-6 md:mb-8">
                    <p className="hidden md:block text-gray-700 mb-4 text-lg">
                        {questionNumber}. {questionText}
                    </p>
                    <div className="bg-white inline-block p-4 rounded-2xl shadow-lg w-4/5 max-w-[250px] md:max-w-none md:w-auto md:rounded-lg md:border md:border-gray-300 md:shadow-md md:p-6">
                        <img
                            src={imageSrc}
                            alt={`Quiz image - ${imageName}`}
                            className="h-32 md:h-40 w-auto mx-auto object-contain"
                        />
                    </div>
                </main>

                {/* Timer (Mobile View) */}
                <div className="flex justify-center items-center space-x-1 mb-8 md:hidden">
                    <span className="bg-black text-white text-2xl font-mono p-2 rounded-md">{timeDigits[0]}</span>
                    <span className="bg-black text-white text-2xl font-mono p-2 rounded-md">{timeDigits[1]}</span>
                    <span className="text-black text-2xl font-mono mx-1">:</span>
                    <span className="bg-black text-white text-2xl font-mono p-2 rounded-md">{timeDigits[2]}</span>
                    <span className="bg-black text-white text-2xl font-mono p-2 rounded-md">{timeDigits[3]}</span>
                </div>

                {/* Answers */}
                <section className="w-full max-w-sm mx-auto px-4 md:px-0 md:max-w-none md:bg-black md:p-6 md:rounded-lg md:shadow-inner">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                        {answers.map((answer) => (
                            <button
                                key={answer.id}
                                onClick={() => handleAnswerClick(answer.id)}
                                className={getButtonClasses(answer.color)}>
                                {answer.id}. {answer.text}
                            </button>
                        ))}
                    </div>
                </section>
            </div>
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
                    <div className="bg-white p-6 rounded-xl shadow-lg text-center w-full max-w-sm sm:max-w-md">
                        <h2 className="text-2xl font-bold mb-4">⏰ Time is up!!!</h2>
                        <button onClick={() => window.location.href = "/"}className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 transition w-full sm:w-auto">
                            Continue
                        </button>
                    </div>
                </div>
            )}
            {showBack && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
                    <div className="bg-white p-6 rounded-xl shadow-lg text-center w-full max-w-sm sm:max-w-md">
                        <h2 className="text-2xl font-bold mb-6">Do you want to cancel the quiz?</h2>
                        <div className="flex flex-col sm:flex-row justify-center gap-3">
                            <button onClick={() => setShowBack(false)} className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 transition w-full sm:w-auto">
                                No
                            </button>
                            <button onClick={() => window.location.href = "/"}className="bg-red-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-red-700 transition w-full sm:w-auto">
                                Yes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

}

export default ResponsiveQuizInterface;
