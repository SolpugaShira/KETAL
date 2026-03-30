import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { lessons } from '../data/questions';
import QuestionCard from './QuestionCard';
import { FaHeart } from 'react-icons/fa';

const Lesson = () => {
    const { lessonId } = useParams();
    const navigate = useNavigate();
    const { hearts, dispatch, updateStreak, completedLessons } = useContext(UserContext);
    const lesson = lessons.find(l => l.id === lessonId);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);
    const [showNextButton, setShowNextButton] = useState(false);
    const [isAnswered, setIsAnswered] = useState(false);
    const [lessonFailed, setLessonFailed] = useState(false);
    const [showSummary, setShowSummary] = useState(false);

    if (!lesson) {
        return <div className="text-center py-10 text-gray-700 dark:text-gray-300">Урок не найден</div>;
    }

    const currentQuestion = lesson.questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === lesson.questions.length - 1;

    const handleAnswer = (isCorrect) => {
        if (isAnswered) return;

        setIsAnswered(true);
        if (isCorrect) {
            dispatch({ type: 'ADD_XP', payload: 10 });
            setCorrectCount(prev => prev + 1);
            setShowNextButton(true);
        } else {
            dispatch({ type: 'LOSE_HEART' });
            if (hearts - 1 <= 0) {
                setLessonFailed(true);
            } else {
                setShowNextButton(true);
            }
        }
    };

    const handleNext = () => {
        if (!showNextButton) return;

        if (isLastQuestion) {
            setShowSummary(true);
        } else {
            setCurrentQuestionIndex(prev => prev + 1);
            setShowNextButton(false);
            setIsAnswered(false);
        }
    };

    const finishLessonSuccess = () => {
        dispatch({ type: 'ADD_XP', payload: lesson.xpReward });
        dispatch({ type: 'COMPLETE_LESSON', payload: lesson.id });
        updateStreak();
        dispatch({ type: 'RESET_HEARTS' });
        navigate('/');
    };

    const finishLessonFail = () => {
        dispatch({ type: 'RESET_HEARTS' });
        navigate('/');
    };

    useEffect(() => {
        if (completedLessons.includes(lesson.id)) {
            navigate('/');
        }
    }, [completedLessons, lesson.id, navigate]);

    if (lessonFailed) {
        return (
            <div className="bg-white dark:bg-mountain-800 rounded-lg shadow-md p-8 text-center transition-colors">
                <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Урок провален!</h2>
                <p className="mb-6 text-gray-700 dark:text-gray-300">У вас закончились жизни. Попробуйте ещё раз.</p>
                <button
                    onClick={finishLessonFail}
                    className="bg-dawn-500 hover:bg-dawn-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                    Вернуться к урокам
                </button>
            </div>
        );
    }

    if (showSummary) {
        const totalQuestions = lesson.questions.length;
        const passed = correctCount / totalQuestions >= 0.5;
        return (
            <div className="bg-white dark: bg-mountain-800 rounded-lg shadow-md p-8 text-center transition-colors">
                <h2 className="text-2xl font-bold text-mountain-800 dark:text-mountain-100 mb-4">Результаты урока</h2>
                <p className="text-lg mb-2 text-gray-700 dark:text-gray-300">
                    Правильных ответов: {correctCount} из {totalQuestions}
                </p>
                {passed ? (
                    <>
                        <p className="text-green-600 dark:text-green-400 mb-4">Поздравляем! Вы прошли урок!</p>
                        <p className="mb-4 text-gray-700 dark:text-gray-300">
                            Вы получили +{lesson.xpReward} XP за урок и +{correctCount * 10} XP за ответы.
                        </p>
                        <button
                            onClick={finishLessonSuccess}
                            className="bg-dawn-500 hover:bg-dawn-600 text-white px-6 py-2 rounded-lg transition-colors"
                        >
                            Продолжить
                        </button>
                    </>
                ) : (
                    <>
                        <p className="text-red-600 dark:text-red-400 mb-4">
                            К сожалению, вы не набрали достаточно баллов для прохождения урока.
                        </p>
                        <button
                            onClick={finishLessonFail}
                            className="bg-dawn-500 hover:bg-dawn-600 text-white px-6 py-2 rounded-lg transition-colors"
                        >
                            Попробовать снова
                        </button>
                    </>
                )}
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-4 flex justify-between items-center">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                    Вопрос {currentQuestionIndex + 1} из {lesson.questions.length}
                </div>
                <div className="flex items-center space-x-1">
                    <FaHeart className="text-red-500" />
                    <span className="font-semibold text-gray-800 dark:text-gray-200">{hearts}</span>
                </div>
            </div>
            {/* Прогресс-бар в цветах рассвета */}
            <div className="w-full bg-gray-200 dark:bg-mountain-700 rounded-full h-2 mb-6">
                <div
                    className="bg-gradient-to-r from-dawn-400 to-dawn-600 h-2 rounded-full transition-all"
                    style={{ width: `${((currentQuestionIndex + (isAnswered ? 1 : 0)) / lesson.questions.length) * 100}%` }}
                />
            </div>
            <QuestionCard
                question={currentQuestion}
                onAnswer={handleAnswer}
                disabled={isAnswered}
                showFeedback={true}
            />
            {showNextButton && (
                <div className="mt-6 text-center">
                    <button
                        onClick={handleNext}
                        className="bg-dawn-500 hover:bg-dawn-600 text-white px-8 py-3 rounded-full text-lg font-semibold transition-colors"
                    >
                        {isLastQuestion ? 'Завершить урок' : 'Следующий вопрос'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default Lesson;