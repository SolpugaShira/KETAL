import React, { useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { courses } from '../data/questions';
import { FaCheckCircle, FaArrowLeft, FaBook, FaStar } from 'react-icons/fa';

const CoursePage = () => {
    const { courseId } = useParams();
    const { completedLessons, getCourseProgress, userContent } = useContext(UserContext);

    // Ищем курс сначала в официальных, потом в пользовательских
    let course = courses.find(c => c.id === courseId);
    let isOfficial = true;

    if (!course) {
        const userCourses = userContent?.courses || [];
        course = userCourses.find(c => c.id === courseId);
        isOfficial = false;
    }

    if (!course) {
        return (
            <div className="text-center py-10 text-gray-700 dark:text-gray-300">
                <h2 className="text-2xl font-bold mb-4">Курс не найден</h2>
                <Link to="/" className="text-dawn-500 hover:underline">← Вернуться к курсам</Link>
            </div>
        );
    }

    const progress = getCourseProgress(courseId, course.lessons);
    const totalLessons = course.lessons?.length || 0;
    const completedCount = progress.completedLessons.length;

    return (
        <div className="max-w-4xl mx-auto">
            <Link
                to={isOfficial ? "/" : "/community"}
                className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-dawn-500 mb-6 transition-colors"
            >
                <FaArrowLeft className="mr-2" />
                {isOfficial ? 'Назад к курсам' : 'Назад в сообщество'}
            </Link>

            <div className={`bg-gradient-to-r ${course.color} rounded-xl p-8 text-white mb-8`}>
                <div className="flex items-start justify-between">
                    <div>
                        <span className="text-5xl mb-4 block">{course.icon}</span>
                        <h1 className="text-3xl font-bold">{course.title}</h1>
                        <p className="text-white/90 mt-2 text-lg">{course.description}</p>
                        <p className="text-white/70 mt-1 text-sm">by {course.author || 'KETAL'}</p>
                    </div>
                </div>

                <div className="mt-6">
                    <div className="flex justify-between text-sm mb-2">
                        <span>Общий прогресс</span>
                        <span className="font-bold">{progress.progress}%</span>
                    </div>
                    <div className="w-full bg-white/30 rounded-full h-4">
                        <div
                            className="bg-white h-4 rounded-full transition-all duration-500"
                            style={{ width: `${progress.progress}%` }}
                        />
                    </div>
                    <p className="text-sm mt-2 text-white/80">
                        {completedCount} из {totalLessons} уроков пройдено
                    </p>
                </div>
            </div>

            <div className="space-y-3">
                <h2 className="text-xl font-bold text-mountain-800 dark:text-mountain-100 mb-4">
                    Программа курса
                </h2>

                {course.lessons?.map((lesson, index) => {
                    const isCompleted = completedLessons.includes(lesson.id);
                    const isNext = index === completedCount;
                    const isLocked = index > completedCount && !isCompleted;

                    return (
                        <Link
                            key={lesson.id}
                            to={`/lesson/${lesson.id}`}
                            className={`block p-4 rounded-lg border-2 transition-all duration-200 ${
                                isCompleted
                                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20 hover:border-green-600'
                                    : isNext
                                        ? 'border-dawn-500 bg-dawn-50 dark:bg-dawn-900/20 hover:border-dawn-600'
                                        : 'border-gray-200 dark:border-mountain-700 bg-white dark:bg-mountain-800 hover:border-gray-300 dark:hover:border-mountain-600'
                            } ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                                        isCompleted
                                            ? 'bg-green-500 text-white'
                                            : isNext
                                                ? 'bg-dawn-500 text-white'
                                                : 'bg-gray-200 dark:bg-mountain-700 text-gray-600 dark:text-gray-400'
                                    }`}>
                                        {isCompleted ? <FaCheckCircle /> : index + 1}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                                            {lesson.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {lesson.description}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                                        <FaStar className="text-yellow-500 mr-1" />
                                        {lesson.xpReward} XP
                                    </span>
                                    <span className="text-xs text-gray-400 dark:text-gray-500">
                                        {lesson.questions?.length || 0} вопросов
                                    </span>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default CoursePage;