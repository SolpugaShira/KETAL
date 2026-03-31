import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';

const Calendar = () => {
    const { studyDays, isLoaded } = useContext(UserContext);

    if (!isLoaded) {
        return (
            <div className="bg-white dark:bg-mountain-800 rounded-lg shadow-md p-4 text-center">
                <p className="text-gray-500 dark:text-gray-400">Загрузка календаря...</p>
            </div>
        );
    }

    const safeStudyDays = Array.isArray(studyDays) ? studyDays : [];
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const startDayOfWeek = firstDayOfMonth.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const daysArray = [];
    for (let i = 0; i < startDayOfWeek; i++) {
        daysArray.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(i).padStart(2,'0')}`;
        daysArray.push({ day: i, date: dateStr });
    }

    const weekdays = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

    return (
        <div className="bg-white dark:bg-mountain-800 rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold mb-2 text-center text-gray-800 dark:text-gray-200">
                {today.toLocaleString('ru', { month: 'long', year: 'numeric' })}
            </h3>
            <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium mb-2 text-gray-600 dark:text-gray-400">
                {weekdays.map(day => <div key={day}>{day}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
                {daysArray.map((item, idx) => (
                    <div key={idx} className="aspect-square flex items-center justify-center text-sm">
                        {item && (
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                safeStudyDays.includes(item.date)
                                    ? 'bg-dawn-500 text-white font-bold'
                                    : 'bg-gray-100 dark:bg-mountain-700 text-gray-800 dark:text-gray-200'
                            }`}>
                                {item.day}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Calendar;