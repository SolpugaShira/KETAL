import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { courses } from '../data/questions';
import { FaCheckCircle, FaBook, FaStar } from 'react-icons/fa';

const Home = () => {
    const context = useContext(UserContext);

    if (!context) {
        return <div className="text-center py-10">Загрузка...</div>;
    }

    const { completedLessons, getCourseProgress } = context;

    if (!courses || !Array.isArray(courses)) {
        return <div className="text-center py-10 text-red-500">Ошибка загрузки курсов</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-center mb-4 text-mountain-800 dark:text-mountain-100">
                Официальные курсы
            </h1>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                Пройдите путь от новичка до мастера. Каждый курс состоит из последовательных уроков
                с теорией и практическими заданиями.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
                {courses.map((course) => {
                    if (!course) return null;

                    const progress = getCourseProgress(course.id, course.lessons);
                    const completedCount = progress.completedLessons?.length || 0;
                    const totalCount = course.lessons?.length || 0;
                    const isCompleted = totalCount > 0 && completedCount === totalCount;

                    return (
                        <div
                            key={course.id}
                            className="bg-white dark:bg-mountain-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-mountain-700"
                        >
                            <div className={`bg-gradient-to-r ${course.color || 'from-dawn-500 to-dawn-600'} p-6 text-white`}>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <span className="text-4xl mb-2 block">{course.icon || '📚'}</span>
                                        <h2 className="text-xl font-bold">{course.title}</h2>
                                        <p className="text-white/90 text-sm mt-1">{course.description}</p>
                                        <p className="text-white/70 text-xs mt-1">by {course.author || 'KETAL'}</p>
                                    </div>
                                    {isCompleted && (
                                        <FaCheckCircle className="text-white text-3xl" />
                                    )}
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="mb-4">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-600 dark:text-gray-400">Прогресс</span>
                                        <span className="font-semibold text-dawn-500">{progress.progress || 0}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-mountain-700 rounded-full h-3">
                                        <div
                                            className={`bg-gradient-to-r ${course.color || 'from-dawn-500 to-dawn-600'} h-3 rounded-full transition-all duration-500`}
                                            style={{ width: `${progress.progress || 0}%` }}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        {completedCount} из {totalCount} уроков пройдено
                                    </p>
                                </div>

                                <div className="flex justify-between items-center mb-4 text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">
                                        <FaBook className="inline mr-1" />
                                        {totalCount} уроков
                                    </span>
                                    <span className="text-gray-600 dark:text-gray-400">
                                        {course.lessons?.reduce((sum, l) => sum + (l.xpReward || 0), 0) || 0} XP всего
                                    </span>
                                </div>

                                <Link
                                    to={`/course/${course.id}`}
                                    className={`block w-full text-center py-3 rounded-lg font-semibold transition-colors ${
                                        isCompleted
                                            ? 'bg-green-500 hover:bg-green-600 text-white'
                                            : 'bg-dawn-500 hover:bg-dawn-600 text-white'
                                    }`}
                                >
                                    {isCompleted ? 'Повторить курс' : 'Начать курс'}
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Home;