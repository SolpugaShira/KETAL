// src/components/CommunityPage.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const CommunityPage = () => {
    return (
        <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4 text-mountain-800 dark:text-mountain-100">
                Сообщество 🐧
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
                Раздел в разработке. Здесь будут курсы от пользователей!
            </p>
            <Link to="/" className="text-dawn-500 hover:underline">
                ← Вернуться к курсам
            </Link>
        </div>
    );
};

export default CommunityPage;