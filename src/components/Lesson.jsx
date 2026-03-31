import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { courses } from '../data/questions';
import QuestionCard from './QuestionCard';
import { FaHeart, FaBook, FaCheckCircle, FaCode, FaImage } from 'react-icons/fa';

const Lesson = () => {
    const { lessonId } = useParams();
    const navigate = useNavigate();
    const { hearts, dispatch, completedLessons, userContent } = useContext(UserContext);

    let lesson = null;
    let course = null;

    // Поиск в официальных курсах
    for (const c of (courses || [])) {
        const found = (c.lessons || []).find(l => l.id === lessonId);
        if (found) {
            lesson = found;
            course = c;
            break;
        }
    }

    // Поиск в пользовательских курсах
    if (!lesson && userContent?.courses) {
        for (const c of (userContent.courses || [])) {
            const found = (c.lessons || []).find(l => l.id === lessonId);
            if (found) {
                lesson = found;
                course = c;
                break;
            }
        }
    }

    if (!lesson) {
        return (
            <div className="text-center py-10 text-gray-700 dark:text-gray-300">
                <h2 className="text-2xl font-bold mb-4">Урок не найден</h2>
                <button
                    onClick={() => navigate('/')}
                    className="text-dawn-500 hover:underline"
                >
                    ← Вернуться на главную
                </button>
            </div>
        );
    }

    const content = lesson.content || [];
    const questions = lesson.questions || [];

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);
    const [showNextButton, setShowNextButton] = useState(false);
    const [isAnswered, setIsAnswered] = useState(false);
    const [lessonFailed, setLessonFailed] = useState(false);
    const [showSummary, setShowSummary] = useState(false);
    const [mode, setMode] = useState(content.length > 0 ? 'content' : 'questions');
    const [contentScrolled, setContentScrolled] = useState(false);

    const currentQuestion = questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex >= questions.length - 1;

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

    const handleContentComplete = () => {
        if (questions.length > 0) {
            setMode('questions');
            setCurrentQuestionIndex(0);
            setShowNextButton(false);
            setIsAnswered(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            setShowSummary(true);
        }
    };

    const handleContentScroll = () => {
        if (!contentScrolled && window.scrollY > 500) {
            setContentScrolled(true);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleContentScroll);
        return () => window.removeEventListener('scroll', handleContentScroll);
    }, [contentScrolled]);

    const finishLessonSuccess = () => {
        dispatch({ type: 'ADD_XP', payload: lesson.xpReward || 100 });
        dispatch({ type: 'COMPLETE_LESSON', payload: lesson.id });
        dispatch({ type: 'RESET_HEARTS' });
        // Возврат на страницу курса, а не на главную
        if (course && course.id) {
            navigate(course.isOfficial ? `/course/${course.id}` : '/community');
        } else {
            navigate('/');
        }
    };

    const finishLessonFail = () => {
        dispatch({ type: 'RESET_HEARTS' });
        if (course && course.id) {
            navigate(course.isOfficial ? `/course/${course.id}` : '/community');
        } else {
            navigate('/');
        }
    };

    if (lessonFailed) {
        return (
            <div className="bg-white dark:bg-mountain-800 rounded-lg shadow-md p-8 text-center transition-colors max-w-2xl mx-auto mt-10">
                <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Урок провален!</h2>
                <p className="mb-6 text-gray-700 dark:text-gray-300">У вас закончились жизни. Попробуйте ещё раз.</p>
                <button
                    onClick={finishLessonFail}
                    className="bg-dawn-500 hover:bg-dawn-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                    Вернуться к курсу
                </button>
            </div>
        );
    }

    if (showSummary) {
        const totalQuestions = questions.length;
        const passed = totalQuestions === 0 || (correctCount / Math.max(totalQuestions, 1) >= 0.5);
        return (
            <div className="bg-white dark:bg-mountain-800 rounded-lg shadow-md p-8 text-center transition-colors max-w-2xl mx-auto mt-10">
                <h2 className="text-2xl font-bold text-mountain-800 dark:text-mountain-100 mb-4">Результаты урока</h2>
                {totalQuestions > 0 ? (
                    <p className="text-lg mb-2 text-gray-700 dark:text-gray-300">
                        Правильных ответов: {correctCount} из {totalQuestions}
                    </p>
                ) : (
                    <p className="text-lg mb-2 text-gray-700 dark:text-gray-300">
                        Теоретический урок завершён
                    </p>
                )}
                {passed ? (
                    <>
                        <p className="text-green-600 dark:text-green-400 mb-4">Поздравляем! Вы прошли урок!</p>
                        <p className="mb-4 text-gray-700 dark:text-gray-300">
                            Вы получили +{lesson.xpReward || 100} XP за урок {totalQuestions > 0 ? `и +${correctCount * 10} XP за ответы` : ''}.
                        </p>
                        <button
                            onClick={finishLessonSuccess}
                            className="bg-dawn-500 hover:bg-dawn-600 text-white px-6 py-2 rounded-lg transition-colors"
                        >
                            Вернуться к курсу
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

    const progressPercent = mode === 'content'
        ? 50
        : mode === 'questions' && questions.length > 0
            ? 50 + ((currentQuestionIndex + 1) / questions.length) * 50
            : 0;

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-4 flex justify-between items-center">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                    {mode === 'content'
                        ? 'Теория'
                        : mode === 'questions' && questions.length > 0
                            ? `Вопрос ${currentQuestionIndex + 1} из ${questions.length}`
                            : 'Урок'
                    }
                </div>
                <div className="flex items-center space-x-1">
                    <FaHeart className="text-red-500" />
                    <span className="font-semibold text-gray-800 dark:text-gray-200">{hearts}</span>
                </div>
            </div>

            {/* Прогресс-бар */}
            <div className="w-full bg-gray-200 dark:bg-mountain-700 rounded-full h-2 mb-6">
                <div
                    className="bg-gradient-to-r from-dawn-400 to-dawn-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                />
            </div>

            {mode === 'content' && content.length > 0 ? (
                <div className="bg-white dark:bg-mountain-800 rounded-lg shadow-md p-6 transition-colors">
                    <div className="flex items-center space-x-2 mb-6">
                        <FaBook className="text-dawn-500" />
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Теоретический материал</h2>
                    </div>

                    {/* Все блоки контента отображаются на одной странице */}
                    <div className="space-y-6">
                        {content.map((block, idx) => (
                            <div key={block.id || idx} className="border-b border-gray-200 dark:border-mountain-700 pb-6 last:border-b-0">
                                {block.type === 'text' && (
                                    <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                                        {block.value}
                                    </p>
                                )}

                                {block.type === 'code' && (
                                    <div className="mt-3">
                                        <div className="flex items-center gap-2 mb-2 text-sm text-gray-500 dark:text-gray-400">
                                            <FaCode />
                                            <span>Код</span>
                                        </div>
                                        <pre className="bg-mountain-900 p-4 rounded-lg overflow-x-auto text-sm font-mono text-gray-100">
                                            <code>{block.value}</code>
                                        </pre>
                                    </div>
                                )}

                                {block.type === 'image' && (
                                    <div className="mt-3">
                                        <div className="flex items-center gap-2 mb-2 text-sm text-gray-500 dark:text-gray-400">
                                            <FaImage />
                                            <span>Изображение</span>
                                        </div>
                                        <img
                                            src={block.value}
                                            alt="Изображение урока"
                                            className="max-w-full rounded-lg my-2"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling && (e.target.nextSibling.style.display = 'block');
                                            }}
                                        />
                                        <p className="text-sm text-red-500 hidden">Не удалось загрузить изображение</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 flex justify-center">
                        <button
                            onClick={handleContentComplete}
                            className="bg-dawn-500 hover:bg-dawn-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
                        >
                            {questions.length > 0 ? (
                                <>
                                    <FaCheckCircle /> Перейти к тесту
                                </>
                            ) : (
                                <>
                                    <FaCheckCircle /> Завершить урок
                                </>
                            )}
                        </button>
                    </div>
                </div>
            ) : mode === 'questions' && questions.length > 0 && currentQuestion ? (
                <div>
                    <div className="flex items-center space-x-2 mb-4">
                        <FaCheckCircle className="text-dawn-500" />
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Проверка знаний</h2>
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
            ) : (
                <div className="bg-white dark:bg-mountain-800 rounded-lg shadow-md p-8 text-center">
                    <h2 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-4">
                        Урок готов к завершению!
                    </h2>
                    <p className="mb-6 text-gray-700 dark:text-gray-300">
                        Вы ознакомились с материалом.
                    </p>
                    <button
                        onClick={() => setShowSummary(true)}
                        className="bg-dawn-500 hover:bg-dawn-600 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                        Получить награду
                    </button>
                </div>
            )}
        </div>
    );
};

export default Lesson;