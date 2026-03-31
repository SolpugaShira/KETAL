import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { FaCheckCircle, FaBook, FaStar, FaUser, FaSearch } from 'react-icons/fa';

const CommunityPage = () => {
    const { getCourseProgress, completedLessons, userContent } = useContext(UserContext);
    const [searchQuery, setSearchQuery] = useState('');

    const allCourses = userContent?.courses || [];

    // Фильтрация курсов по поисковому запросу
    const filteredCourses = allCourses.filter(course => {
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase();
        const titleMatch = (course.title || '').toLowerCase().includes(query);
        const descMatch = (course.description || '').toLowerCase().includes(query);
        const authorMatch = (course.author || '').toLowerCase().includes(query);
        return titleMatch || descMatch || authorMatch;
    });

    if (allCourses.length === 0) {
        return (
            <div className="max-w-4xl mx-auto text-center py-10">
                <h1 className="text-3xl font-bold mb-4 text-mountain-800 dark:text-mountain-100">
                    Сообщество 🐧
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                    Пока нет пользовательских курсов. Будьте первым, кто создаст курс в разделе «Творец»!
                </p>
                <Link to="/creator" className="bg-dawn-500 hover:bg-dawn-600 text-white px-6 py-3 rounded-lg transition-colors inline-block">
                    Создать курс
                </Link>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-center mb-4 text-mountain-800 dark:text-mountain-100">
                Сообщество 🐧
            </h1>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                Курсы, созданные участниками сообщества KETAL. Изучайте, оценивайте и вдохновляйтесь!
            </p>

            {/* Поиск */}
            <div className="max-w-2xl mx-auto mb-8">
                <div className="relative">
                    <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Поиск курсов по названию, описанию или автору..."
                        className="w-full bg-white dark:bg-mountain-800 border border-gray-300 dark:border-mountain-600 rounded-lg pl-12 pr-4 py-3 focus:border-dawn-500 focus:outline-none transition-colors"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                        >
                            ✕
                        </button>
                    )}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
                    Найдено курсов: {filteredCourses.length} из {allCourses.length}
                </div>
            </div>

            {filteredCourses.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-gray-500 dark:text-gray-400 text-lg">
                        {searchQuery
                            ? `Ничего не найдено по запросу "${searchQuery}"`
                            : 'В сообществе пока нет курсов'}
                    </p>
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="mt-4 text-dawn-500 hover:underline"
                        >
                            Сбросить поиск
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
                    {filteredCourses.map((course) => {
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
                                            <div className="flex items-center text-white/70 text-xs mt-1">
                                                <FaUser className="mr-1" />
                                                {course.author || 'Аноним'}
                                            </div>
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
            )}
        </div>
    );
};

export default CommunityPage;