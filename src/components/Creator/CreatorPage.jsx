// src/components/CreatorPage.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const CreatorPage = () => {
    return (
        <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4 text-mountain-800 dark:text-mountain-100">
                Творец 🎨
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
                Конструктор курсов в разработке. Скоро сможете создавать свои уроки!
            </p>
            <Link to="/" className="text-dawn-500 hover:underline">
                ← Вернуться к курсам
            </Link>
        </div>
    );
};

export default CreatorPage;