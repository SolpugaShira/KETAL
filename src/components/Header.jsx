// src/components/Header.jsx

import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { useTheme } from '../context/ThemeContext';
import { FaFire, FaHeart, FaStar, FaUser, FaMoon, FaSun, FaUsers, FaPenNib } from 'react-icons/fa';

const Header = () => {
    const { totalXP, streak, hearts } = useContext(UserContext);
    const { darkMode, toggleDarkMode } = useTheme();
    const location = useLocation();

    const navLinks = [
        { path: '/', label: 'Главная', icon: null },
        { path: '/community', label: 'Сообщество', icon: FaUsers },
        { path: '/creator', label: 'Творец', icon: FaPenNib },
    ];

    return (
        <header className="bg-white dark:bg-mountain-800 shadow-md py-4 transition-colors sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center">
                    <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-dawn-500 to-peak-red bg-clip-text text-transparent">
                        Ketal's Peak 🐧
                    </Link>

                    <nav className="hidden md:flex items-center space-x-6">
                        {navLinks.map(link => {
                            const isActive = location.pathname === link.path;
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`flex items-center space-x-1 font-medium transition-colors ${
                                        isActive
                                            ? 'text-dawn-500'
                                            : 'text-gray-600 dark:text-gray-400 hover:text-dawn-500'
                                    }`}
                                >
                                    {link.icon && <link.icon size={18} />}
                                    <span>{link.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="flex items-center space-x-4">
                        <div className="hidden sm:flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                                <FaStar className="text-dawn-500" />
                                <span className="font-semibold text-gray-700 dark:text-gray-300">{totalXP} XP</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <FaFire className="text-orange-500" />
                                <span className="font-semibold text-gray-700 dark:text-gray-300">{streak}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <FaHeart className="text-red-500" />
                                <span className="font-semibold text-gray-700 dark:text-gray-300">{hearts}</span>
                            </div>
                        </div>

                        <Link to="/profile" className="text-mountain-500 dark:text-mountain-300 hover:text-dawn-500 transition">
                            <FaUser size={20} />
                        </Link>

                        <button
                            onClick={toggleDarkMode}
                            className="text-mountain-500 dark:text-mountain-300 hover:text-dawn-500 transition"
                        >
                            {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
                        </button>

                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <Link to="/community" className="text-gray-600 dark:text-gray-400">
                                <FaUsers size={20} />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Mobile navigation */}
                <nav className="md:hidden flex justify-center space-x-4 mt-3 pt-3 border-t border-gray-200 dark:border-mountain-700">
                    {navLinks.map(link => {
                        const isActive = location.pathname === link.path;
                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    isActive
                                        ? 'bg-dawn-500/10 text-dawn-500'
                                        : 'text-gray-600 dark:text-gray-400'
                                }`}
                            >
                                {link.icon && <link.icon size={16} />}
                                <span>{link.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </header>
    );
};

export default Header;