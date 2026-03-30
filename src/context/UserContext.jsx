// src/context/UserContext.jsx

import React, { createContext, useReducer, useEffect, useContext } from 'react';
import { loadUserData, saveUserData } from '../utils/helpers';
import { courses } from '../data/questions';

const initialState = {
    totalXP: 0,
    streak: 0,
    maxStreak: 0,
    hearts: 3,
    completedLessons: [],
    studyDays: [],
    lastLessonDate: null,
};

const userReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_XP':
            return { ...state, totalXP: state.totalXP + action.payload };
        case 'LOSE_HEART':
            return { ...state, hearts: Math.max(0, state.hearts - 1) };
        case 'RESET_HEARTS':
            return { ...state, hearts: 3 };
        case 'COMPLETE_LESSON': {
            const today = new Date().toISOString().split('T')[0];
            const newStudyDays = state.studyDays.includes(today)
                ? state.studyDays
                : [...state.studyDays, today];

            let newStreak = state.streak;
            let newMaxStreak = state.maxStreak;

            if (state.lastLessonDate !== today) {
                const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
                if (state.lastLessonDate === yesterday) {
                    newStreak = state.streak + 1;
                } else {
                    newStreak = 1;
                }
                newMaxStreak = Math.max(newMaxStreak, newStreak);
            }

            return {
                ...state,
                completedLessons: [...state.completedLessons, action.payload],
                lastLessonDate: today,
                studyDays: newStudyDays,
                streak: newStreak,
                maxStreak: newMaxStreak,
            };
        }
        case 'SET_USER':
            return { ...state, ...action.payload };
        default:
            return state;
    }
};

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [state, dispatch] = useReducer(userReducer, initialState);

    useEffect(() => {
        try {
            const saved = loadUserData();
            if (saved) {
                dispatch({ type: 'SET_USER', payload: saved });
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    }, []);

    useEffect(() => {
        try {
            saveUserData(state);
        } catch (error) {
            console.error('Error saving user data:', error);
        }
    }, [state]);

    const updateStreak = () => {};

    // Функция расчета прогресса курса
    const getCourseProgress = (courseId) => {
        if (!courseId) return { completedLessons: [], progress: 0 };

        const course = courses.find(c => c.id === courseId);
        if (!course) return { completedLessons: [], progress: 0 };

        const completedLessons = state.completedLessons.filter(lessonId =>
            course.lessons.some(l => l.id === lessonId)
        );

        const progress = course.lessons.length > 0
            ? Math.round((completedLessons.length / course.lessons.length) * 100)
            : 0;

        return { completedLessons, progress };
    };

    const value = {
        totalXP: state.totalXP,
        streak: state.streak,
        maxStreak: state.maxStreak,
        hearts: state.hearts,
        completedLessons: state.completedLessons,
        studyDays: state.studyDays,
        dispatch,
        updateStreak,
        getCourseProgress,
    };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};