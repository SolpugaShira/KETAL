import React from 'react';
import { useUser } from '../context/UserContext';
import Calendar from './Calendar';
import { FaFire, FaStar, FaTrophy } from 'react-icons/fa';

const ProfilePage = () => {
    const { totalXP, streak, maxStreak } = useUser();

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-8 text-mountain-800 dark:text-mountain-100">
                Профиль Кетала
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-mountain-800 rounded-lg shadow-md p-6 flex items-center space-x-4">
                    <FaStar className="text-dawn-500 text-3xl" />
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Всего XP</p>
                        <p className="text-2xl font-bold">{totalXP}</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-mountain-800 rounded-lg shadow-md p-6 flex items-center space-x-4">
                    <FaFire className="text-orange-500 text-3xl" />
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Текущий стрик</p>
                        <p className="text-2xl font-bold">{streak} дней</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-mountain-800 rounded-lg shadow-md p-6 flex items-center space-x-4">
                    <FaTrophy className="text-yellow-500 text-3xl" />
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Лучший стрик</p>
                        <p className="text-2xl font-bold">{maxStreak} дней</p>
                    </div>
                </div>
            </div>

            <Calendar />
        </div>
    );
};

export default ProfilePage;