import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchCurrentUser } from '../api/auth.js';
import { submitSummary } from '../api/summary.js';
import { getQuizQuestions } from '../api/quiz.js';

function shuffleArray(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

function QuizOverModal({ isOpen, timeLeft, finalScore, totalQuestions, error, onContinue }) {
    if (!isOpen) return null;
    const titleId = "quizOverModalTitle"; const descriptionId = "quizOverModalDesc";
    let title = ""; let description = "";
    if (error) { title = "⚠️ Quiz Error"; description = error; }
    else if (timeLeft <= 0) { title = "⏰ Time is up!!!"; description = `Your final score: ${finalScore} / ${totalQuestions}`; }
    else { title = "🎉 Quiz Complete!"; description = `Your final score: ${finalScore} / ${totalQuestions}`; }
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4" role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={descriptionId}>
            <div className="bg-white p-6 rounded-xl shadow-lg text-center w-full max-w-sm sm:max-w-md">
                <h2 id={titleId} className="text-2xl font-bold mb-2">{title}</h2>
                <p id={descriptionId} className="text-xl mb-6">{description}</p>
                <button onClick={onContinue} className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 transition w-full sm:w-auto">Continue</button>
            </div>
        </div>
    );
}

function CancelModal({ isOpen, onConfirm, onCancel }) {
    if (!isOpen) return null;
    const titleId = "cancelModalTitle";
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4" role="dialog" aria-modal="true" aria-labelledby={titleId}>
            <div className="bg-white p-6 rounded-xl shadow-lg text-center w-full max-w-sm sm:max-w-md">
                <h2 id={titleId} className="text-xl sm:text-2xl font-bold mb-6">Do you want to cancel the quiz?</h2>
                <div className="flex flex-col sm:flex-row justify-center gap-3">
                    <button onClick={onCancel} className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 transition w-full sm:w-auto">No, Continue Quiz</button>
                    <button onClick={onConfirm} className="bg-red-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-red-700 transition w-full sm:w-auto">Yes, Cancel</button>
                </div>
            </div>
        </div>
    );
}

function FeedbackModal({ feedback, isOpen, onContinue, isLastQuestion }) {
    if (!isOpen || !feedback) return null;
    const titleId = "feedbackModalTitle"; const descriptionId = "feedbackModalDesc";
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4" role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={descriptionId}>
            <div className={`p-6 rounded-xl shadow-lg text-center w-full max-w-sm sm:max-w-md ${feedback.isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
                <h2 id={titleId} className="text-2xl font-bold mb-3">{feedback.isCorrect ? "✅ Correct!" : "❌ Incorrect"}</h2>
                {!feedback.isCorrect && (<p id={descriptionId} className="mb-4 text-gray-700">The correct answer was: <span className="font-semibold">{feedback.correctAnswerText}</span></p>)}
                {feedback.isCorrect && <p id={descriptionId}></p>}
                <button onClick={onContinue} className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 transition w-full sm:w-auto">{isLastQuestion ? "Finish Quiz" : "Next Question"}</button>
            </div>
        </div>
    );
}

function TimerDisplay({ timeDigits }) {
    return (
        <div className="flex justify-center items-center space-x-1 lg:space-x-1.5" aria-live="off">
            <span className="bg-black text-white text-2xl font-mono p-2 rounded-md shadow">{timeDigits[0]}</span>
            <span className="bg-black text-white text-2xl font-mono p-2 rounded-md shadow">{timeDigits[1]}</span>
            <span className="text-2xl font-mono text-black mx-0.5 pb-1">:</span>
            <span className="bg-black text-white text-2xl font-mono p-2 rounded-md shadow">{timeDigits[2]}</span>
            <span className="bg-black text-white text-2xl font-mono p-2 rounded-md shadow">{timeDigits[3]}</span>
        </div>
    );
}

function DoingQuiz() {
    const { topic = 'default', time = '01:00', items = '10' } = useParams();
    const navigate = useNavigate();

    const totalItems = useMemo(() => parseInt(items, 10) || 10, [items]);
    const initialTimeInSeconds = useMemo(() => {
        const parts = time.split(':');
        if (parts.length === 2) {
            const minutes = parseInt(parts[0], 10);
            const seconds = parseInt(parts[1], 10);
            if (!isNaN(minutes) && !isNaN(seconds)) {
                return Math.max(0, minutes * 60 + seconds);
            }
        }
        return 60;
    }, [time]);

    const [quizStatus, setQuizStatus] = useState('loading');
    const [quizError, setQuizError] = useState(null);
    const [quizQuestions, setQuizQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [correct, setCorrect] = useState(0);
    const [wrongQ, setWrongQ] = useState(0);
    const [timeLeft, setTimeLeft] = useState(initialTimeInSeconds);
    const [finalScore, setFinalScore] = useState(0);
    const [finalUnanswered, setFinalUnanswered] = useState(0);
    const [isAnswerSelected, setIsAnswerSelected] = useState(false);
    const [answerFeedback, setAnswerFeedback] = useState(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [userId, setUserId] = useState(null);
    const [quizId, setQuizId] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const data = await fetchCurrentUser();
                if (data) {
                    setUserId(data.user.id);
                }
            } catch (error) {
                console.error(error);
            }
        };
        checkAuth();
    }, []);
    useEffect(() => {
        const fetchQuizData = async () => {
            if (!topic || topic === 'default') {
                setQuizError("No quiz topic specified.");
                setQuizStatus('error');
                return;
            }

            setQuizStatus('loading');
            setQuizError(null);
            setQuizQuestions([]);
            setCurrentQuestionIndex(0);
            setScore(0);
            setWrongQ(0);
            setCorrect(0);
            setTimeLeft(initialTimeInSeconds);
            setFinalScore(0);
            setFinalUnanswered(0);
            setIsAnswerSelected(false);
            setAnswerFeedback(null);
            setShowCancelModal(false);
            setQuizId(null);

            try {
                const quizData = await getQuizQuestions(topic);

                if (quizData && Array.isArray(quizData.questions)) {
                    setQuizId(quizData.id);
                    const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F'];
                    const allQuestions = quizData.questions.map(q => {
                        let processedAnswers = [];
                        if (Array.isArray(q.options)) {
                            processedAnswers = q.options.map((option, index) => {
                                const optionIdStr = String(option.id || index);
                                let displayLabel = optionIdStr.toUpperCase();
                                return {
                                    id: optionIdStr,
                                    text: String(option.text || ''),
                                    displayKey: displayLabel
                                };
                            });
                        } else if (typeof q.options === 'object' && q.options !== null) {
                            processedAnswers = Object.entries(q.options).map(([key, value], index) => {
                                let optionText = '';
                                if (typeof value === 'string') {
                                    optionText = value;
                                } else if (typeof value === 'object' && value !== null && typeof value.text === 'string') {
                                    optionText = value.text;
                                } else {
                                    optionText = String(value);
                                }
                                return {
                                    id: String(key),
                                    text: optionText,
                                    displayKey: optionLetters[index] || String(index + 1)
                                };
                            });
                        }

                        return {
                            ...q,
                            answer: String(q.answer),
                            answers: processedAnswers,
                        };
                    });

                    if (allQuestions.length === 0) {
                        setQuizError(`No questions found for the topic "${topic}".`);
                        setQuizStatus('error');
                        return;
                    }

                    const validQuestions = allQuestions.filter(q => q.answers && q.answers.length > 0);

                    if (validQuestions.length === 0) {
                        setQuizError(`No usable questions (with answer choices) found for topic "${topic}". Please check quiz data.`);
                        setQuizStatus('error');
                        return;
                    }

                    const questionsToTake = Math.min(totalItems, validQuestions.length);
                    const selectedQuestions = shuffleArray([...validQuestions]).slice(0, questionsToTake);

                    if (selectedQuestions.length === 0 && questionsToTake > 0) {
                        setQuizError(`Could not select any valid questions for topic "${topic}" after filtering.`);
                        setQuizStatus('error');
                        return;
                    }

                    setQuizQuestions(selectedQuestions);
                    setQuizStatus('running');

                } else {
                    setQuizError(`Failed to load questions for "${topic}". Invalid data format received.`);
                    setQuizStatus('error');
                }
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    setQuizError(`Quiz topic "${topic}" not found.`);
                } else {
                    setQuizError(error.message || "An error occurred while fetching the quiz. Please try again later.");
                }
                setQuizStatus('error');
            }
        };

        fetchQuizData();
    }, [topic, totalItems, initialTimeInSeconds]);

    const handleQuizSubmission = useCallback(async (currentScore, currentWrongQ, currentUnanswered) => {
        if (userId && quizId !== null && quizStatus !== 'submitting') {
            setQuizStatus('submitting');
            try {
                const summaryData = {
                    userId: userId,
                    quizId: quizId,
                    score: currentScore,
                    wrong: currentWrongQ,
                    unanswered: currentUnanswered
                };
                await submitSummary(summaryData);
                console.log("Quiz results submitted successfully via imported function");
                const data = await fetchCurrentUser();
                if (data) {
                }
            } catch (error) {
                console.error("Error during submission process in component:", error);
            } finally {
                setQuizStatus('finished');
            }
        } else {
            if (quizStatus === 'submitting') {
                console.log("Submission already in progress.");
            } else {
                console.warn("Missing userId or quizId, cannot submit results. Proceeding to finish.", { userId, quizId });
            }
            setQuizStatus('finished');
        }
    }, [userId, quizId, quizStatus, setQuizStatus, fetchCurrentUser]);

    useEffect(() => {
        if (quizStatus !== 'running' || timeLeft <= 0) {
            if (timeLeft <= 0 && quizStatus === 'running') {
                setFinalScore(score);
                const unansweredCount = Math.max(0, quizQuestions.length - (correct + wrongQ));
                setFinalUnanswered(unansweredCount);
                handleQuizSubmission(score, correct, wrongQ, unansweredCount);
            }
            return;
        }
        const timerId = setInterval(() => {
            setTimeLeft((prevTime) => Math.max(0, prevTime - 1));
        }, 1000);
        return () => clearInterval(timerId);
    }, [timeLeft, quizStatus, score, correct, wrongQ, quizQuestions, handleQuizSubmission]);

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

    const isQuizOver = useMemo(() => quizStatus === 'finished' || quizStatus === 'error' || quizStatus === 'submitting', [quizStatus]);

    const handleAnswerClick = useCallback((selectedAnswerId) => {
        if (!currentQuestion || isAnswerSelected || quizStatus !== 'running') return;

        const isCorrect = selectedAnswerId === currentQuestion.answer;
        let newScore = score;
        let newCorrect = correct;
        let newWrongQ = wrongQ;

        if (isCorrect) {
            newCorrect = correct + 1;
            newScore = score + 1;
        } else {
            newWrongQ = wrongQ + 1;
            if(score > 0) {
                newScore = score - 1;
            }
        }
        setCorrect(newCorrect);
        setScore(newScore);
        setWrongQ(newWrongQ);

        const correctOption = currentQuestion.answers?.find(a => a.id === currentQuestion.answer);
        let correctAnswerDisplayText;

        if (correctOption && typeof correctOption.text === 'string') {
            correctAnswerDisplayText = correctOption.text;
        } else {
            if (currentQuestion.answer === "") {
                correctAnswerDisplayText = '(The correct answer key stored in the database is an empty string, and no option matches this.)';
            } else if (currentQuestion.answer !== null && typeof currentQuestion.answer !== 'undefined') {
                correctAnswerDisplayText = `(No option found for the stored correct answer key: "${currentQuestion.answer}")`;
            } else {
                correctAnswerDisplayText = '(The correct answer key is missing or undefined in the data from the backend.)';
            }
        }

        setAnswerFeedback({
            isCorrect,
            correctAnswerText: correctAnswerDisplayText,
            selectedAnswerId: selectedAnswerId
        });
        setIsAnswerSelected(true);
    }, [currentQuestion, isAnswerSelected, quizStatus, score, correct, wrongQ]);

    const handleContinueAfterFeedback = useCallback(() => {
        setIsAnswerSelected(false);
        setAnswerFeedback(null);
        const nextQuestionIndex = currentQuestionIndex + 1;
        if (nextQuestionIndex < quizQuestions.length) {
            setCurrentQuestionIndex(nextQuestionIndex);
        } else {
            setFinalScore(score);
            const unansweredCount = Math.max(0, quizQuestions.length - (correct + wrongQ));
            setFinalUnanswered(unansweredCount);
            handleQuizSubmission(score, correct, wrongQ, unansweredCount);
        }
    }, [currentQuestionIndex, quizQuestions.length, score, correct, wrongQ, handleQuizSubmission]);

    const handleBackClick = useCallback(() => setShowCancelModal(true), []);
    const handleCancelConfirm = useCallback(() => navigate("/"), [navigate]);
    const handleCancelDismiss = useCallback(() => setShowCancelModal(false), []);

    const handleQuizEndContinue = useCallback(() => {
        const totalQs = quizQuestions.length > 0 ? quizQuestions.length : totalItems;
        navigate("summary", {
            state: {
                score: finalScore,
                correct: correct,
                wrong: wrongQ,
                total: totalQs,
                unanswered: finalUnanswered
            }
        });
    }, [navigate, finalScore, correct, wrongQ, quizQuestions, totalItems, finalUnanswered]);

    const handleImageError = useCallback((event) => {
        event.target.style.display = 'none';
    }, []);

    const getButtonProps = useCallback((answer, index) => {
        const baseClasses = `w-full text-left font-bold py-3 px-5 rounded-lg shadow mb-3 md:w-auto md:mb-0 transition-all duration-150 ease-in-out`;
        const colors = [
            'bg-yellow-500 hover:bg-yellow-600 text-black',
            'bg-blue-500 hover:bg-blue-600 text-white',
            'bg-pink-500 hover:bg-pink-600 text-white',
            'bg-green-500 hover:bg-green-600 text-white'
        ];
        const colorClass = colors[index % colors.length];

        let style = `${baseClasses} ${colorClass}`;
        let isDisabled = false;

        if (answerFeedback && isAnswerSelected) {
            isDisabled = true;
            if (answer.id === currentQuestion?.answer) {
                style += ' ring-4 ring-offset-2 ring-green-400 scale-105';
            } else if (answer.id === answerFeedback.selectedAnswerId) {
                style += ' ring-4 ring-offset-2 ring-red-400 opacity-70';
            } else {
                style += ' opacity-50';
            }
        } else if (isAnswerSelected && !answerFeedback) {
            isDisabled = true;
            style += ' opacity-50 cursor-not-allowed';
        }
        return { className: style, disabled: isDisabled };
    }, [answerFeedback, isAnswerSelected, currentQuestion]);

    if (quizStatus === 'loading' || quizStatus === 'submitting') {
        return (
            <div className="bg-gray-300 min-h-screen flex items-center justify-center p-4 font-sans bg-bgimg">
                <div className="bg-white p-8 rounded-lg shadow-xl text-center">
                    <p className="text-xl font-semibold animate-pulse">
                        {quizStatus === 'submitting' ? 'Submitting Results...' : 'Loading Quiz...'}
                    </p>
                </div>
            </div>
        );
    }

    if (isQuizOver && quizStatus !== 'submitting') {
        return (
            <QuizOverModal
                isOpen={true}
                timeLeft={timeLeft}
                finalScore={finalScore}
                totalQuestions={quizQuestions.length > 0 ? quizQuestions.length : totalItems}
                error={quizError}
                onContinue={handleQuizEndContinue}
            />
        );
    }
    return (
        <div className="bg-gray-300 min-h-screen flex items-center justify-center p-4 font-sans bg-bgimg">
            <div className="bg-gray-100 p-4 rounded-lg shadow-xl w-full max-w-3xl md:p-6 lg:p-8 relative">
                <div className="md:hidden flex justify-between items-center mb-4">
                    <button onClick={handleBackClick} className="bg-gray-600 hover:bg-gray-700 text-white text-sm font-semibold px-4 py-2 rounded shadow">Back</button>
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

                <header className="hidden md:flex justify-between items-center mb-8 relative">
                    <button onClick={handleBackClick} className="bg-gray-600 hover:bg-gray-700 text-white text-sm font-semibold px-4 py-1.5 rounded shadow">Back</button>
                    <div className="text-center flex-grow mx-4">
                        <div className="text-sm font-semibold text-gray-600 mb-1 tabular-nums" aria-hidden="true">
                            Question {currentQuestionIndex + 1} of {quizQuestions.length}
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 uppercase tracking-wider">Time</h1>
                        <div className="mt-2">
                            <TimerDisplay timeDigits={timeDigits} />
                        </div>
                    </div>
                    <div className="bg-orange-500 text-white px-3 py-1 rounded shadow text-center" aria-live="polite">
                        <span className="block text-xs font-medium uppercase tracking-wider">Score</span>
                        <span className="block text-xl font-bold">{score}</span>
                    </div>
                </header>

                <main className="text-center mb-6 md:mb-8">
                    <p className="text-gray-800 mb-4 text-lg lg:text-xl font-medium px-2 leading-relaxed">
                        <span className="sr-only">Question {currentQuestionIndex + 1} of {quizQuestions.length}:</span>
                        {currentQuestion?.text}
                    </p>
                    {currentQuestion?.imageUrl && (
                        <div className="bg-white inline-block p-4 rounded-lg shadow-md w-4/5 max-w-[250px] md:max-w-xs md:rounded-lg md:border md:border-gray-300 md:p-6 my-4">
                            <img
                                src={currentQuestion.imageUrl}
                                alt={currentQuestion.text ? `Visual for: ${currentQuestion.text.substring(0, 50)}...` : `Quiz visual aid ${currentQuestion.id}`}
                                className="h-32 md:h-40 w-auto mx-auto object-contain"
                                onError={handleImageError}
                            />
                        </div>
                    )}
                </main>

                <div className="flex justify-center items-center mb-8 md:hidden">
                    <TimerDisplay timeDigits={timeDigits} />
                </div>

                <section className="w-full max-w-sm mx-auto px-4 md:px-0 md:max-w-none md:bg-gradient-to-b from-gray-800 to-black md:p-6 md:rounded-lg md:shadow-inner">
                    <h2 className="sr-only">Choose an answer:</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-2 md:gap-4">
                        {currentQuestion?.answers.map((answer, index) => {
                            const buttonProps = getButtonProps(answer, index);
                            return (
                                <button
                                    key={answer.id}
                                    onClick={() => handleAnswerClick(answer.id)}
                                    disabled={buttonProps.disabled}
                                    className={buttonProps.className}
                                    aria-label={`Answer ${answer.displayKey}: ${answer.text}`}
                                >
                                    <span className="font-bold mr-2">{answer.displayKey}.</span> {answer.text}
                                </button>
                            );
                        })}
                    </div>
                </section>
            </div>

            <CancelModal
                isOpen={showCancelModal}
                onConfirm={handleCancelConfirm}
                onCancel={handleCancelDismiss}
            />
            <FeedbackModal
                isOpen={Boolean(answerFeedback)}
                feedback={answerFeedback}
                onContinue={handleContinueAfterFeedback}
                isLastQuestion={currentQuestionIndex >= quizQuestions.length - 1}
            />
        </div>
    );
}

export default DoingQuiz;