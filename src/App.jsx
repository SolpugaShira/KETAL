// src/App.jsx

import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import Home from './components/Home';
import ProfilePage from './components/ProfilePage';
import Lesson from './components/Lesson';
import CoursePage from './components/CoursePage';

import CommunityPage from './components/CommunityPage';
import CreatorPage from './components/Creator/CreatorPage.jsx';

// Временные заглушки для новых страниц
// const CoursePage = () => <div className="text-center py-10">Страница курса</div>;
// const Lesson = () => <div className="text-center py-10">Урок</div>;
// const CommunityPage = () => <div className="text-center py-10">Сообщество</div>;
// const CreatorPage = () => <div className="text-center py-10">Творец</div>;

function App() {
    return (
        <ThemeProvider>
            <UserProvider>
                <Router>
                    <div className="min-h-screen bg-gray-100 dark:bg-mountain-900 transition-colors">
                        <Header />
                        <main className="container mx-auto px-4 py-8">
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/course/:courseId" element={<CoursePage />} />
                                <Route path="/lesson/:lessonId" element={<Lesson />} />
                                <Route path="/profile" element={<ProfilePage />} />
                                <Route path="/community" element={<CommunityPage />} />
                                <Route path="/creator" element={<CreatorPage />} />
                            </Routes>
                        </main>
                    </div>
                </Router>
            </UserProvider>
        </ThemeProvider>
    );
}

export default App;