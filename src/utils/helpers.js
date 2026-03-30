export const saveUserData = (data) => {
    localStorage.setItem('duolingo_user', JSON.stringify(data));
};

export const loadUserData = () => {
    const data = localStorage.getItem('duolingo_user');
    return data ? JSON.parse(data) : null;
};

export const updateStreak = (lastDate, currentStreak) => {
    if (!lastDate) return 1;
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (lastDate === today) return currentStreak;
    if (lastDate === yesterday) return currentStreak + 1;
    return 1;
};