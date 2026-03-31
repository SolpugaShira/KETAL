export const STORAGE_KEYS = {
    USER_DATA: 'ketal_user_data',
    USER_CONTENT: 'ketal_user_content',
    THEME: 'ketal_theme',
};

export const saveUserData = (data) => {
    try {
        const serialized = JSON.stringify(data);
        localStorage.setItem(STORAGE_KEYS.USER_DATA, serialized);
        return true;
    } catch (error) {
        console.error('Error saving user data:', error);
        return false;
    }
};

export const loadUserData = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.USER_DATA);
        if (!data) return null;
        return JSON.parse(data);
    } catch (error) {
        console.error('Error loading user ', error);
        return null;
    }
};

export const saveUserContent = (data) => {
    try {
        const serialized = JSON.stringify(data);
        localStorage.setItem(STORAGE_KEYS.USER_CONTENT, serialized);
        return true;
    } catch (error) {
        console.error('Error saving user content:', error);
        return false;
    }
};

export const loadUserContent = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.USER_CONTENT);
        if (!data) return { courses: [], lessons: [] };
        return JSON.parse(data);
    } catch (error) {
        console.error('Error loading user content:', error);
        return { courses: [], lessons: [] };
    }
};

export const calculateStreak = (lastDate, currentStreak) => {
    if (!lastDate) return 1;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const last = new Date(lastDate);
    last.setHours(0, 0, 0, 0);

    const diffTime = today.getTime() - last.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return currentStreak;
    if (diffDays === 1) return currentStreak + 1;
    return 1;
};

export const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
};