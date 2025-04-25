import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// --- Constants ---
const DEFAULT_QUIZ_TIME_SECONDS = 60;
const DEFAULT_QUIZ_ITEMS = 10;

// --- Data & Helpers (Assume defined elsewhere or imported) ---
const questionBank = [
    // ... (keep your questionBank as is)
     { topic: "Science", question: "What is the capital of Italy?", image: "path/to/image1.png", name: "Rome", answers: [ { id: 'A', text: 'Madrid', color: 'yellow' }, { id: 'B', text: 'Rome', color: 'green' }, { id: 'C', text: 'Berlin', color: 'blue' }, { id: 'D', text: 'Lisbon', color: 'pink' } ], correct: 'B' },
     { topic: "Science", question: "Which gas do plants absorb?", image: null, name: "Leaves", answers: [ { id: 'A', text: 'Oxygen', color: 'blue' }, { id: 'B', text: 'Hydrogen', color: 'pink' }, { id: 'C', text: 'Carbon Dioxide', color: 'green' }, { id: 'D', text: 'Nitrogen', color: 'yellow' } ], correct: 'C' },
     { topic: "Science", question: "What is the longest river in the world?", image: null, name: "River", answers: [ { id: 'A', text: 'Nile', color: 'blue' }, { id: 'B', text: 'Amazon', color: 'green' }, { id: 'C', text: 'Mississippi', color: 'yellow' }, { id: 'D', text: 'Yangtze', color: 'pink' } ], correct: 'A' },
     { topic: "Science", question: "What is the chemical symbol for Water?", image: null, name: "Water Molecule", answers: [ { id: 'A', text: 'O2', color: 'blue' }, { id: 'B', text: 'CO2', color: 'pink' }, { id: 'C', text: 'H2O', color: 'green' }, { id: 'D', text: 'NaCl', color: 'yellow' } ], correct: 'C' },
     { topic: "sport", question: "What is the chemical symbol for Water?", image: null, name: "Water Molecule", answers: [ { id: 'A', text: 'O2', color: 'blue' }, { id: 'B', text: 'CO2', color: 'pink' }, { id: 'C', text: 'H2O', color: 'green' }, { id: 'D', text: 'NaCl', color: 'yellow' } ], correct: 'C' },
];

function shuffleArray(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

// --- Modal Components (Keep these separate as they are well-defined) ---
function QuizOverModal({ isOpen, timeLeft, finalScore, totalQuestions, error, onContinue }) {
     if (!isOpen) return null;
     const titleId = "quizOverModalTitle"; const descriptionId = "quizOverModalDesc";
     let title = ""; let description = "";
     if (error) { title = "⚠️ Quiz Error"; description = error; }
     else if (timeLeft <= 0) { title = "⏰ Time is up!!!"; description = `Your final score: ${finalScore} / ${totalQuestions}`; }
     else { title = "🎉 Quiz Complete!"; description = `Your final score: ${finalScore} / ${totalQuestions}`; }
     return ( <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4" role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={descriptionId}> <div className="bg-white p-6 rounded-xl shadow-lg text-center w-full max-w-sm sm:max-w-md"> <h2 id={titleId} className="text-2xl font-bold mb-2">{title}</h2> <p id={descriptionId} className="text-xl mb-6">{description}</p> <button onClick={onContinue} className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 transition w-full sm:w-auto"> Continue </button> </div> </div> );
}

function CancelModal({ isOpen, onConfirm, onCancel }) {
    if (!isOpen) return null; const titleId = "cancelModalTitle";
    return ( <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4" role="dialog" aria-modal="true" aria-labelledby={titleId}> <div className="bg-white p-6 rounded-xl shadow-lg text-center w-full max-w-sm sm:max-w-md"> <h2 id={titleId} className="text-xl sm:text-2xl font-bold mb-6">Do you want to cancel the quiz?</h2> <div className="flex flex-col sm:flex-row justify-center gap-3"> <button onClick={onCancel} className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 transition w-full sm:w-auto"> No, Continue Quiz </button> <button onClick={onConfirm} className="bg-red-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-red-700 transition w-full sm:w-auto"> Yes, Cancel </button> </div> </div> </div> );
}

function FeedbackModal({ feedback, isOpen, onContinue, isLastQuestion }) {
     if (!isOpen || !feedback) return null; const titleId = "feedbackModalTitle"; const descriptionId = "feedbackModalDesc";
     return ( <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4" role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={descriptionId}> <div className={`p-6 rounded-xl shadow-lg text-center w-full max-w-sm sm:max-w-md ${feedback.isCorrect ? 'bg-green-100' : 'bg-red-100'}`}> <h2 id={titleId} className="text-2xl font-bold mb-3"> {feedback.isCorrect ? "✅ Correct!" : "❌ Incorrect"} </h2> {!feedback.isCorrect && ( <p id={descriptionId} className="mb-4 text-gray-700">The correct answer was: <span className="font-semibold">{feedback.correctAnswerText}</span></p> )} {feedback.isCorrect && <p id={descriptionId}></p>} <button onClick={onContinue} className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 transition w-full sm:w-auto"> {isLastQuestion ? "Finish Quiz" : "Next Question"} </button> </div> </div> );
}


// --- Helper Component for Timer Display ---
function TimerDisplay({ timeDigits }) {
    return (
        <div className="flex justify-center items-center space-x-1 lg:space-x-1.5" aria-live="off">
             {/* Minute Digits */}
             <span className="bg-black text-white text-2xl font-mono p-2 rounded-md shadow">{timeDigits[0]}</span>
             <span className="bg-black text-white text-2xl font-mono p-2 rounded-md shadow">{timeDigits[1]}</span>
             {/* Colon Separator */}
             <span className="text-2xl font-mono text-black mx-0.5 pb-1">:</span>
             {/* Second Digits */}
             <span className="bg-black text-white text-2xl font-mono p-2 rounded-md shadow">{timeDigits[2]}</span>
             <span className="bg-black text-white text-2xl font-mono p-2 rounded-md shadow">{timeDigits[3]}</span>
         </div>
    );
}

// --- Main Quiz Gameplay Component (Refactored) ---
function DoingQuiz() {
    const { topic, time, items } = useParams();
    const navigate = useNavigate();

    // --- State Initialization ---
    const totalItems = useMemo(() => parseInt(items) || DEFAULT_QUIZ_ITEMS, [items]);
    const initialTimeInSeconds = useMemo(() => {
        const parts = time?.split(':');
        if (parts?.length === 2) {
            const minutes = parseInt(parts[0]);
            const seconds = parseInt(parts[1]);
            if (!isNaN(minutes) && !isNaN(seconds)) {
                return Math.max(0, minutes * 60 + seconds);
            }
        }
        return DEFAULT_QUIZ_TIME_SECONDS;
    }, [time]);

    const [quizQuestions, setQuizQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(initialTimeInSeconds);
    const [finalScore, setFinalScore] = useState(0); // Renamed from previous finalScore state
    const [quizStatus, setQuizStatus] = useState('loading'); // 'loading', 'running', 'finished', 'error'
    const [quizError, setQuizError] = useState(null);
    const [isAnswerSelected, setIsAnswerSelected] = useState(false);
    const [answerFeedback, setAnswerFeedback] = useState(null); // { isCorrect: bool, correctAnswerText: string, selectedAnswerId: string }
    const [showCancelModal, setShowCancelModal] = useState(false);

    // --- Effects ---
    // Initialize/Reset Quiz Effect
    useEffect(() => {
        // Reset all state variables
        setQuizStatus('loading');
        setQuizError(null);
        setQuizQuestions([]);
        setCurrentQuestionIndex(0);
        setScore(0);
        setTimeLeft(initialTimeInSeconds);
        setFinalScore(0);
        setIsAnswerSelected(false);
        setAnswerFeedback(null);
        setShowCancelModal(false);

        // Filter and select questions
        const filteredQuestions = questionBank.filter(
            q => q.topic.toLowerCase() === topic?.toLowerCase()
        );

        if (filteredQuestions.length === 0) {
             setQuizError(`No questions found for the topic "${topic}".`);
             setQuizStatus('error');
             return;
        }

        const selectedQuestions = shuffleArray([...filteredQuestions]).slice(0, totalItems);

         if (selectedQuestions.length === 0 && totalItems > 0) {
             setQuizError(`Could not select any questions. Invalid number requested? (${items})`);
             setQuizStatus('error');
             return;
         }
         if (selectedQuestions.length < totalItems) {
             console.warn(`Requested ${totalItems} items for topic "${topic}", but only ${selectedQuestions.length} were available.`);
         }

        setQuizQuestions(selectedQuestions);
        setQuizStatus('running'); // Start the quiz

    }, [topic, items, totalItems, initialTimeInSeconds]); // Dependencies triggering reset


    // Timer Effect
    useEffect(() => {
        if (quizStatus !== 'running' || timeLeft <= 0) {
            if (timeLeft <= 0 && quizStatus === 'running') {
                 setFinalScore(score);
                 setQuizStatus('finished');
            }
            return;
        }

        const timerId = setInterval(() => {
            setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);

        // Cleanup interval on unmount or when dependencies change
        return () => clearInterval(timerId);

    }, [timeLeft, quizStatus, score]); // Rerun effect if time or status changes


    // --- Derived State & Formatting ---
    const currentQuestion = useMemo(() => {
        if (quizStatus !== 'running' || quizQuestions.length === 0 || currentQuestionIndex >= quizQuestions.length) {
            return null;
        }
        return quizQuestions[currentQuestionIndex];
    }, [quizStatus, quizQuestions, currentQuestionIndex]);

    const timeDigits = useMemo(() => {
        const minutes = Math.max(0, Math.floor(timeLeft / 60));
        const seconds = Math.max(0, timeLeft % 60);
        return [
            String(minutes).padStart(2, '0')[0], String(minutes).padStart(2, '0')[1],
            String(seconds).padStart(2, '0')[0], String(seconds).padStart(2, '0')[1],
        ];
    }, [timeLeft]);

    const isQuizOver = useMemo(() => quizStatus === 'finished' || quizStatus === 'error', [quizStatus]);

    // --- Event Handlers (using useCallback for potential performance optimization) ---
    const handleAnswerClick = useCallback((selectedAnswerId) => {
        if (!currentQuestion || isAnswerSelected || quizStatus !== 'running') return;

        const isCorrect = selectedAnswerId === currentQuestion.correct;
        let currentScore = score;
        if (isCorrect) {
            currentScore = score + 1;
            setScore(currentScore);
        }

        setAnswerFeedback({
            isCorrect,
            correctAnswerText: currentQuestion.answers.find(a => a.id === currentQuestion.correct)?.text || 'N/A',
            selectedAnswerId: selectedAnswerId
        });
        setIsAnswerSelected(true);

    }, [currentQuestion, isAnswerSelected, quizStatus, score]); // Dependencies

    const handleContinueAfterFeedback = useCallback(() => {
        setIsAnswerSelected(false);
        setAnswerFeedback(null);

        const nextQuestionIndex = currentQuestionIndex + 1;
        if (nextQuestionIndex < quizQuestions.length) {
            setCurrentQuestionIndex(nextQuestionIndex); // Go to next question
        } else {
            setFinalScore(score);
            setQuizStatus('finished');
        }
    }, [currentQuestionIndex, quizQuestions.length, score]); // Dependencies

    const handleBackClick = useCallback(() => setShowCancelModal(true), []);
    const handleCancelConfirm = useCallback(() => navigate("/"), [navigate]);
    const handleCancelDismiss = useCallback(() => setShowCancelModal(false), []);
    const handleQuizEndContinue = useCallback(() => navigate("summary"), [navigate]);
    const handleImageError = useCallback((event) => {
        console.warn("Image failed to load:", event.target.src);
        event.target.style.display = 'none'; // Hide broken image placeholder
    }, []);

    // --- Button Styling Logic ---
    const getButtonProps = useCallback((answer) => {
        const baseClasses = `w-full text-left font-bold py-3 px-5 rounded-lg shadow mb-3 md:w-auto md:mb-0 transition-all duration-150 ease-in-out`;
        const colorClasses = {
            'yellow': 'bg-yellow-500 hover:bg-yellow-600 text-black',
            'blue': 'bg-blue-500 hover:bg-blue-600 text-white',
            'pink': 'bg-pink-500 hover:bg-pink-600 text-white',
            'green': 'bg-green-500 hover:bg-green-600 text-white',
            'default': 'bg-gray-500 hover:bg-gray-600 text-white'
        };
        let style = `${baseClasses} ${colorClasses[answer.color] || colorClasses['default']}`;
        let isDisabled = false;

        // Apply feedback styling if an answer has been selected and feedback is ready
        if (answerFeedback && isAnswerSelected) {
            isDisabled = true; // Disable all buttons after selection
            if (answer.id === currentQuestion?.correct) {
                style += ' ring-4 ring-offset-2 ring-green-400 scale-105'; // Highlight correct
            } else if (answer.id === answerFeedback.selectedAnswerId) {
                 style += ' ring-4 ring-offset-2 ring-red-400 opacity-70'; // Highlight incorrect selection
            } else {
                 style += ' opacity-50'; // Dim unselected, incorrect options
            }
        } else if (isAnswerSelected && !answerFeedback) { // Briefly disable while processing (optional)
             isDisabled = true;
             style += ' opacity-50 cursor-not-allowed';
        }

        return { className: style, disabled: isDisabled };
    }, [answerFeedback, isAnswerSelected, currentQuestion]); // Dependencies


    // --- Render Logic ---
    if (quizStatus === 'loading') {
        return (
            <div className="bg-gray-300 min-h-screen flex items-center justify-center">
                <p className="text-xl font-semibold">Loading Quiz...</p>
            </div>
        );
    }

     // Show QuizOverModal when finished or error
     if (isQuizOver) {
         return (
             <QuizOverModal
                 isOpen={true}
                 timeLeft={timeLeft}
                 finalScore={finalScore}
                 totalQuestions={quizQuestions.length > 0 ? quizQuestions.length : totalItems} // Use actual questions length if available
                 error={quizError}
                 onContinue={handleQuizEndContinue}
             />
         );
     }

    // Main Quiz View (when status is 'running')
    return (
        <div className="bg-gray-300 min-h-screen flex items-center justify-center p-4 font-sans bg-bgimg">
            <div className="bg-gray-100 p-4 rounded-lg shadow-xl w-full max-w-3xl md:p-6 lg:p-8 relative">

                 {/* --- Mobile Header --- */}
                 <div className="md:hidden flex justify-between items-center mb-4">
                     <button onClick={handleBackClick} className="bg-gray-600 hover:bg-gray-700 text-white text-sm font-semibold px-4 py-2 rounded shadow">
                         Back
                     </button>
                      <div className="text-center" aria-live="polite">
                          <div className="bg-orange-500 text-white px-4 py-1 rounded-full shadow-md inline-block">
                              <span className="block text-xs font-medium leading-tight tracking-wider">SCORE</span>
                              <span className="block text-xl font-bold leading-tight">{score}</span>
                          </div>
                      </div>
                       <div className="text-sm font-semibold text-gray-600 w-16 text-right tabular-nums">
                          {currentQuestionIndex + 1}/{quizQuestions.length}
                       </div>
                 </div>

                {/* --- Desktop Header --- */}
                <header className="hidden md:flex justify-between items-center mb-8 relative">
                    <button onClick={handleBackClick} className="bg-gray-600 hover:bg-gray-700 text-white text-sm font-semibold px-4 py-1.5 rounded shadow">
                        Back
                    </button>
                    <div className="text-center flex-grow mx-4">
                         <div className="text-sm font-semibold text-gray-600 mb-1 tabular-nums" aria-hidden="true">
                             Question {currentQuestionIndex + 1} of {quizQuestions.length}
                         </div>
                        <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 uppercase tracking-wider">Time</h1>
                        {/* Use TimerDisplay component */}
                        <div className="mt-2">
                            <TimerDisplay timeDigits={timeDigits} />
                        </div>
                    </div>
                     <div className="bg-orange-500 text-white px-3 py-1 rounded shadow text-center" aria-live="polite">
                         <span className="block text-xs font-medium uppercase tracking-wider">Score</span>
                         <span className="block text-xl font-bold">{score}</span>
                     </div>
                </header>

                {/* --- Question Area --- */}
                <main className="text-center mb-6 md:mb-8">
                     <p className="text-gray-800 mb-4 text-lg lg:text-xl font-medium px-2 leading-relaxed">
                         <span className="sr-only">Question {currentQuestionIndex + 1} of {quizQuestions.length}:</span>
                         {currentQuestion?.question}
                     </p>
                     {/* Image Display */}
                    {currentQuestion?.image && (
                        <div className="bg-white inline-block p-4 rounded-lg shadow-md w-4/5 max-w-[250px] md:max-w-xs md:rounded-lg md:border md:border-gray-300 md:p-6 my-4">
                            <img
                                src={currentQuestion.image}
                                alt={currentQuestion.name || `Quiz visual aid`}
                                className="h-32 md:h-40 w-auto mx-auto object-contain"
                                onError={handleImageError}
                            />
                        </div>
                    )}
                 </main>

                 {/* --- Mobile Timer Display --- */}
                 <div className="flex justify-center items-center mb-8 md:hidden">
                     {/* Use TimerDisplay component */}
                     <TimerDisplay timeDigits={timeDigits} />
                  </div>


                {/* --- Answer Buttons Section --- */}
                <section className="w-full max-w-sm mx-auto px-4 md:px-0 md:max-w-none md:bg-gradient-to-b from-gray-800 to-black md:p-6 md:rounded-lg md:shadow-inner">
                     <h2 className="sr-only">Choose an answer:</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                        {currentQuestion?.answers.map((answer) => {
                            const buttonProps = getButtonProps(answer); // Calculate props once
                            return (
                                <button
                                    key={answer.id}
                                    onClick={() => handleAnswerClick(answer.id)}
                                    disabled={buttonProps.disabled}
                                    className={buttonProps.className}
                                    aria-label={`Answer ${answer.id}: ${answer.text}`} // Better accessibility
                                >
                                    <span className="font-bold mr-2">{answer.id}.</span> {answer.text}
                                </button>
                            );
                        })}
                    </div>
                </section>

            </div>

            {/* --- Modals --- */}
             <CancelModal
                 isOpen={showCancelModal}
                 onConfirm={handleCancelConfirm}
                 onCancel={handleCancelDismiss}
             />
             <FeedbackModal
                 isOpen={Boolean(answerFeedback)} // Use boolean coercion
                 feedback={answerFeedback}
                 onContinue={handleContinueAfterFeedback}
                 isLastQuestion={currentQuestionIndex >= quizQuestions.length - 1}
             />
        </div>
    );
}

export default DoingQuiz;
