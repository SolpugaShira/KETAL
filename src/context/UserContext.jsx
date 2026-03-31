import React, { createContext, useReducer, useEffect, useContext } from 'react';
import { loadUserData, saveUserData, loadUserContent, saveUserContent, getTodayDate, calculateStreak } from '../utils/helpers';
import { courses } from '../data/questions';

const initialState = {
    name: null,
    generation: 1,
    totalXP: 0,
    streak: 0,
    maxStreak: 0,
    hearts: 3,
    completedLessons: [],
    studyDays: [],
    lastLessonDate: null,
    ancestors: [],
    createdCourses: [],
    createdLessons: [],
};

const userReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_XP':
            return { ...state, totalXP: state.totalXP + action.payload };
        case 'LOSE_HEART':
            return { ...state, hearts: Math.max(0, state.hearts - 1) };
        case 'RESET_HEARTS':
            return { ...state, hearts: 3 };
        case 'SET_NAME':
            return { ...state, name: action.payload };
        case 'COMPLETE_LESSON': {
            const today = getTodayDate();
            const newStudyDays = state.studyDays.includes(today)
                ? state.studyDays
                : [...state.studyDays, today];

            let newStreak = state.streak;
            let newMaxStreak = state.maxStreak;

            if (state.lastLessonDate !== today) {
                newStreak = calculateStreak(state.lastLessonDate, state.streak);
                newMaxStreak = Math.max(newMaxStreak, newStreak);
            }

            return {
                ...state,
                completedLessons: state.completedLessons.includes(action.payload)
                    ? state.completedLessons
                    : [...state.completedLessons, action.payload],
                lastLessonDate: today,
                studyDays: newStudyDays,
                streak: newStreak,
                maxStreak: newMaxStreak,
            };
        }
        case 'SET_USER':
            return { ...state, ...action.payload };
        case 'RESET_USER':
            return {
                ...initialState,
                ancestors: [
                    ...state.ancestors,
                    {
                        name: state.name || 'Кетал',
                        generation: state.generation,
                        xp: state.totalXP,
                        streak: state.maxStreak,
                        completedLessons: state.completedLessons.length,
                        dates: {
                            birth: state.ancestors[0]?.dates?.birth || new Date().toISOString(),
                            death: new Date().toISOString()
                        }
                    }
                ],
                generation: state.generation + 1,
                totalXP: 0,
                streak: 0,
                hearts: 3,
            };
        case 'ADD_CREATED_COURSE':
            return {
                ...state,
                createdCourses: [...state.createdCourses, action.payload]
            };
        case 'ADD_CREATED_LESSON':
            return {
                ...state,
                createdLessons: [...state.createdLessons, action.payload]
            };
        default:
            return state;
    }
};

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [state, dispatch] = useReducer(userReducer, initialState);
    const [userContent, setUserContent] = React.useState({ courses: [], lessons: [] });
    const [isLoaded, setIsLoaded] = React.useState(false);

    // Загрузка данных пользователя
    useEffect(() => {
        try {
            const saved = loadUserData();
            if (saved) {
                dispatch({ type: 'SET_USER', payload: saved });
            }
            setIsLoaded(true);
        } catch (error) {
            console.error('Error loading user ', error);
            setIsLoaded(true);
        }
    }, []);

    // Загрузка пользовательского контента
    useEffect(() => {
        try {
            const content = loadUserContent();
            setUserContent(content || { courses: [], lessons: [] });
        } catch (error) {
            console.error('Error loading user content:', error);
            setUserContent({ courses: [], lessons: [] });
        }
    }, []);

    // Сохранение данных пользователя
    useEffect(() => {
        if (!isLoaded) return;
        try {
            saveUserData(state);
        } catch (error) {
            console.error('Error saving user ', error);
        }
    }, [state, isLoaded]);

    // Сохранение пользовательского контента
    useEffect(() => {
        if (!isLoaded) return;
        try {
            saveUserContent(userContent);
        } catch (error) {
            console.error('Error saving user content:', error);
        }
    }, [userContent, isLoaded]);

    // Функция расчета прогресса курса
    const getCourseProgress = (courseId, courseLessons) => {
        if (!courseId || !courseLessons || !Array.isArray(courseLessons)) {
            return { completedLessons: [], progress: 0 };
        }

        const completedLessons = (state.completedLessons || []).filter(lessonId =>
            courseLessons.some(l => l && l.id === lessonId)
        );

        const progress = courseLessons.length > 0
            ? Math.round((completedLessons.length / courseLessons.length) * 100)
            : 0;

        return { completedLessons, progress };
    };

    // Добавление созданного курса
    const addCreatedCourse = (course) => {
        if (!course || !course.title || !course.lessons || course.lessons.length === 0) {
            throw new Error('Неверные данные курса');
        }
        const newCourse = {
            ...course,
            id: course.id || `user-${Date.now()}`,
            isOfficial: false,
            author: state.name || 'Кетал',
            lessons: course.lessons.map(l => ({ ...l, id: l.id || `lesson-${Date.now()}-${Math.random()}` }))
        };
        setUserContent(prev => ({
            ...prev,
            courses: [...(prev.courses || []), newCourse]
        }));
        dispatch({ type: 'ADD_CREATED_COURSE', payload: newCourse.id });
        return newCourse;
    };

    // Добавление созданного урока
    const addCreatedLesson = (lesson) => {
        if (!lesson || !lesson.title) {
            throw new Error('Неверные данные урока');
        }
        const newLesson = {
            ...lesson,
            id: lesson.id || `lesson-${Date.now()}-${Math.random()}`,
            content: lesson.content || [],
            questions: lesson.questions || [],
            xpReward: lesson.xpReward || 100
        };
        setUserContent(prev => ({
            ...prev,
            lessons: [...(prev.lessons || []), newLesson]
        }));
        dispatch({ type: 'ADD_CREATED_LESSON', payload: newLesson.id });
        return newLesson;
    };

    // Удаление курса
    const removeCreatedCourse = (courseId) => {
        setUserContent(prev => ({
            ...prev,
            courses: (prev.courses || []).filter(c => c.id !== courseId)
        }));
    };

    // Удаление урока
    const removeCreatedLesson = (lessonId) => {
        setUserContent(prev => ({
            ...prev,
            lessons: (prev.lessons || []).filter(l => l.id !== lessonId)
        }));
    };

    const value = {
        ...state,
        dispatch,
        getCourseProgress,
        addCreatedCourse,
        addCreatedLesson,
        removeCreatedCourse,
        removeCreatedLesson,
        userContent: userContent || { courses: [], lessons: [] },
        setUserContent,
        isLoaded,
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