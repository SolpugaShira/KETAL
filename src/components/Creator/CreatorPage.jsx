import React, { useState, useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import { FaPlus, FaTrash, FaSave, FaDownload, FaUpload, FaCopy, FaCode, FaImage, FaFileAlt } from 'react-icons/fa';

const CreatorPage = () => {
    const { addCreatedCourse, addCreatedLesson, userContent } = useContext(UserContext);

    const [activeTab, setActiveTab] = useState('course');
    const [importJson, setImportJson] = useState('');
    const [notification, setNotification] = useState(null);

    const [courseData, setCourseData] = useState({
        title: '',
        description: '',
        icon: '📚',
        color: 'from-dawn-500 to-dawn-600',
        lessons: [],
    });

    const [lessonData, setLessonData] = useState({
        title: '',
        description: '',
        xpReward: 100,
        content: [],
        questions: [],
    });

    const [newContentBlock, setNewContentBlock] = useState({ type: 'text', value: '' });
    const [newQuestion, setNewQuestion] = useState({
        text: '',
        options: ['', '', '', ''],
        correct: '',
    });

    const colors = [
        'from-green-400 to-emerald-600',
        'from-dawn-500 to-dawn-600',
        'from-blue-400 to-blue-600',
        'from-purple-400 to-purple-600',
        'from-red-400 to-red-600',
        'from-pink-400 to-pink-600',
    ];

    const icons = ['📚', '🐍', '💻', '🎨', '📊', '🔬', '🎵', '🌍'];

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const addLessonToCourse = (lesson) => {
        setCourseData(prev => ({
            ...prev,
            lessons: [...prev.lessons, { ...lesson, id: lesson.id || `lesson-${Date.now()}` }]
        }));
        showNotification('Урок добавлен в курс');
    };

    const removeLessonFromCourse = (index) => {
        setCourseData(prev => ({
            ...prev,
            lessons: prev.lessons.filter((_, i) => i !== index)
        }));
    };

    const saveCourse = () => {
        if (!courseData.title || courseData.title.trim() === '') {
            showNotification('Введите название курса', 'error');
            return;
        }
        if (!courseData.lessons || courseData.lessons.length === 0) {
            showNotification('Добавьте хотя бы один урок в курс', 'error');
            return;
        }
        try {
            const saved = addCreatedCourse(courseData);
            showNotification(`Курс "${saved.title}" сохранён!`);
            setCourseData({
                title: '',
                description: '',
                icon: '📚',
                color: 'from-dawn-500 to-dawn-600',
                lessons: [],
            });
            setImportJson('');
        } catch (error) {
            showNotification('Ошибка сохранения: ' + error.message, 'error');
        }
    };

    const addContentBlock = () => {
        if (!newContentBlock.value || newContentBlock.value.trim() === '') {
            showNotification('Введите содержимое блока', 'error');
            return;
        }
        setLessonData(prev => ({
            ...prev,
            content: [...prev.content, {
                ...newContentBlock,
                id: `content-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                value: newContentBlock.value
            }]
        }));
        setNewContentBlock({ type: 'text', value: '' });
        showNotification('Блок добавлен');
    };

    const removeContentBlock = (index) => {
        setLessonData(prev => ({
            ...prev,
            content: prev.content.filter((_, i) => i !== index)
        }));
    };

    const addQuestion = () => {
        if (!newQuestion.text || newQuestion.text.trim() === '') {
            showNotification('Введите текст вопроса', 'error');
            return;
        }
        if (!newQuestion.correct || newQuestion.correct.trim() === '') {
            showNotification('Выберите правильный ответ', 'error');
            return;
        }
        if (newQuestion.options.some(o => !o || o.trim() === '')) {
            showNotification('Заполните все варианты ответов', 'error');
            return;
        }
        setLessonData(prev => ({
            ...prev,
            questions: [...prev.questions, {
                ...newQuestion,
                id: `question-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                type: 'multiple-choice',
                options: newQuestion.options.map(o => o.trim()),
                correct: newQuestion.correct.trim()
            }]
        }));
        setNewQuestion({ text: '', options: ['', '', '', ''], correct: '' });
        showNotification('Вопрос добавлен');
    };

    const removeQuestion = (index) => {
        setLessonData(prev => ({
            ...prev,
            questions: prev.questions.filter((_, i) => i !== index)
        }));
    };

    const saveLesson = () => {
        if (!lessonData.title || lessonData.title.trim() === '') {
            showNotification('Введите название урока', 'error');
            return;
        }
        try {
            const saved = addCreatedLesson(lessonData);
            showNotification(`Урок "${saved.title}" сохранён!`);
            setLessonData({
                title: '',
                description: '',
                xpReward: 100,
                content: [],
                questions: [],
            });
            setImportJson('');
        } catch (error) {
            showNotification('Ошибка сохранения: ' + error.message, 'error');
        }
    };

    const exportData = () => {
        const data = activeTab === 'course' ? courseData : lessonData;
        try {
            const json = JSON.stringify(data, null, 2);
            setImportJson(json);
            showNotification('JSON экспортирован в поле ниже');
        } catch (error) {
            showNotification('Ошибка экспорта', 'error');
        }
    };

    const importData = () => {
        if (!importJson || importJson.trim() === '') {
            showNotification('Вставьте JSON в поле', 'error');
            return;
        }
        try {
            const parsed = JSON.parse(importJson);
            if (activeTab === 'course') {
                if (!parsed.title || !parsed.lessons) {
                    showNotification('Неверный формат JSON курса', 'error');
                    return;
                }
                setCourseData({
                    title: parsed.title || '',
                    description: parsed.description || '',
                    icon: parsed.icon || '📚',
                    color: parsed.color || 'from-dawn-500 to-dawn-600',
                    lessons: Array.isArray(parsed.lessons) ? parsed.lessons : [],
                });
            } else {
                if (!parsed.title) {
                    showNotification('Неверный формат JSON урока', 'error');
                    return;
                }
                setLessonData({
                    title: parsed.title || '',
                    description: parsed.description || '',
                    xpReward: parsed.xpReward || 100,
                    content: Array.isArray(parsed.content) ? parsed.content : [],
                    questions: Array.isArray(parsed.questions) ? parsed.questions : [],
                });
            }
            showNotification('Данные импортированы!');
        } catch (e) {
            showNotification('Неверный формат JSON: ' + e.message, 'error');
        }
    };

    const copyToClipboard = () => {
        if (importJson) {
            navigator.clipboard.writeText(importJson);
            showNotification('JSON скопирован в буфер');
        }
    };

    const updateOption = (index, value) => {
        const newOptions = [...newQuestion.options];
        newOptions[index] = value;
        setNewQuestion(prev => ({ ...prev, options: newOptions }));
    };

    const importLessonToCourse = () => {
        if (!importJson || importJson.trim() === '') {
            showNotification('Сначала импортируйте JSON урока', 'error');
            return;
        }
        try {
            const parsed = JSON.parse(importJson);
            if (!parsed.title) {
                showNotification('Неверный формат JSON урока', 'error');
                return;
            }
            addLessonToCourse(parsed);
        } catch (e) {
            showNotification('Ошибка импорта урока', 'error');
        }
    };

    const getContentIcon = (type) => {
        switch (type) {
            case 'code': return <FaCode className="text-blue-500" />;
            case 'image': return <FaImage className="text-green-500" />;
            default: return <FaFileAlt className="text-gray-500" />;
        }
    };

    const isLessonValid = lessonData.title && lessonData.title.trim() !== '';

    return (
        <div className="max-w-5xl mx-auto">
            {/* Notification */}
            {notification && (
                <div className={`fixed top-20 right-4 px-6 py-3 rounded-lg shadow-lg z-50 transition-all ${
                    notification.type === 'error'
                        ? 'bg-red-500 text-white'
                        : 'bg-green-500 text-white'
                }`}>
                    {notification.message}
                </div>
            )}

            <h1 className="text-3xl font-bold text-center mb-8 text-mountain-800 dark:text-mountain-100">
                Творец 🎨
            </h1>

            {/* Табы */}
            <div className="flex justify-center mb-8">
                <div className="bg-white dark:bg-mountain-800 rounded-lg p-1 shadow-md inline-flex">
                    <button
                        onClick={() => setActiveTab('course')}
                        className={`px-6 py-2 rounded-md font-medium transition-colors ${
                            activeTab === 'course'
                                ? 'bg-dawn-500 text-white'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-mountain-700'
                        }`}
                    >
                        Создать курс
                    </button>
                    <button
                        onClick={() => setActiveTab('lesson')}
                        className={`px-6 py-2 rounded-md font-medium transition-colors ${
                            activeTab === 'lesson'
                                ? 'bg-dawn-500 text-white'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-mountain-700'
                        }`}
                    >
                        Создать урок
                    </button>
                </div>
            </div>

            {/* Импорт/Экспорт */}
            <div className="bg-white dark:bg-mountain-800 rounded-lg shadow-md p-6 mb-8">
                <h3 className="text-lg font-semibold mb-4">Импорт / Экспорт JSON</h3>
                <div className="flex gap-2 mb-2 flex-wrap">
                    <button
                        onClick={exportData}
                        className="flex items-center gap-2 bg-mountain-500 hover:bg-mountain-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        <FaDownload /> Экспорт
                    </button>
                    <button
                        onClick={importData}
                        className="flex items-center gap-2 bg-dawn-500 hover:bg-dawn-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        <FaUpload /> Импорт
                    </button>
                    {importJson && (
                        <button
                            onClick={copyToClipboard}
                            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            <FaCopy /> Копировать
                        </button>
                    )}
                    {activeTab === 'course' && importJson && (
                        <button
                            onClick={importLessonToCourse}
                            className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            <FaPlus /> Добавить урок в курс
                        </button>
                    )}
                </div>
                <textarea
                    value={importJson}
                    onChange={(e) => setImportJson(e.target.value)}
                    className="w-full h-32 bg-mountain-900 text-gray-100 rounded-lg p-3 font-mono text-sm border border-mountain-700 focus:border-dawn-500 focus:outline-none"
                    placeholder="JSON появится здесь после экспорта или вставьте JSON для импорта..."
                />
            </div>

            {activeTab === 'course' ? (
                <div className="space-y-6">
                    <div className="bg-white dark:bg-mountain-800 rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold mb-4">Основная информация</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Название курса *</label>
                                <input
                                    type="text"
                                    value={courseData.title}
                                    onChange={(e) => setCourseData(prev => ({ ...prev, title: e.target.value }))}
                                    className="w-full bg-gray-50 dark:bg-mountain-700 border border-gray-300 dark:border-mountain-600 rounded-lg px-4 py-2 focus:border-dawn-500 focus:outline-none"
                                    placeholder="Например: Python для начинающих"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Описание</label>
                                <input
                                    type="text"
                                    value={courseData.description}
                                    onChange={(e) => setCourseData(prev => ({ ...prev, description: e.target.value }))}
                                    className="w-full bg-gray-50 dark:bg-mountain-700 border border-gray-300 dark:border-mountain-600 rounded-lg px-4 py-2 focus:border-dawn-500 focus:outline-none"
                                    placeholder="Краткое описание курса"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Иконка</label>
                                <div className="flex gap-2 flex-wrap">
                                    {icons.map(icon => (
                                        <button
                                            key={icon}
                                            onClick={() => setCourseData(prev => ({ ...prev, icon }))}
                                            className={`text-2xl p-2 rounded-lg transition-colors ${
                                                courseData.icon === icon
                                                    ? 'bg-dawn-500 text-white'
                                                    : 'bg-gray-100 dark:bg-mountain-700 hover:bg-gray-200 dark:hover:bg-mountain-600'
                                            }`}
                                        >
                                            {icon}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Цвет</label>
                                <div className="flex gap-2 flex-wrap">
                                    {colors.map(color => (
                                        <button
                                            key={color}
                                            onClick={() => setCourseData(prev => ({ ...prev, color }))}
                                            className={`w-8 h-8 rounded-lg bg-gradient-to-r ${color} transition-all ${
                                                courseData.color === color ? 'ring-2 ring-white dark:ring-mountain-500 scale-110' : ''
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-mountain-800 rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold mb-4">Уроки в курсе ({courseData.lessons?.length || 0})</h2>
                        {(!courseData.lessons || courseData.lessons.length === 0) ? (
                            <div className="text-center py-8">
                                <p className="text-gray-500 dark:text-gray-400 mb-4">
                                    В курсе пока нет уроков
                                </p>
                                <div className="text-sm text-gray-400 dark:text-gray-500">
                                    <p>1. Перейдите на вкладку "Создать урок"</p>
                                    <p>2. Создайте урок и нажмите "Экспорт"</p>
                                    <p>3. Скопируйте JSON и вернитесь сюда</p>
                                    <p>4. Вставьте JSON в поле импорта выше</p>
                                    <p>5. Нажмите "Добавить урок в курс"</p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {courseData.lessons.map((lesson, idx) => (
                                    <div key={lesson.id || idx} className="flex justify-between items-center bg-gray-50 dark:bg-mountain-700 p-3 rounded-lg">
                                        <div>
                                            <p className="font-semibold text-gray-800 dark:text-gray-100">{lesson.title || 'Без названия'}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {(lesson.content?.length || 0)} блоков, {(lesson.questions?.length || 0)} вопросов
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => removeLessonFromCourse(idx)}
                                            className="text-red-500 hover:text-red-600 p-2"
                                            title="Удалить урок"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={saveCourse}
                        disabled={!courseData.title || !courseData.lessons || courseData.lessons.length === 0}
                        className="w-full bg-dawn-500 hover:bg-dawn-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center gap-2"
                    >
                        <FaSave /> Сохранить курс
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="bg-white dark:bg-mountain-800 rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold mb-4">Основная информация</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Название урока *</label>
                                <input
                                    type="text"
                                    value={lessonData.title}
                                    onChange={(e) => setLessonData(prev => ({ ...prev, title: e.target.value }))}
                                    className="w-full bg-gray-50 dark:bg-mountain-700 border border-gray-300 dark:border-mountain-600 rounded-lg px-4 py-2 focus:border-dawn-500 focus:outline-none"
                                    placeholder="Например: Переменные в Python"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Описание</label>
                                <input
                                    type="text"
                                    value={lessonData.description}
                                    onChange={(e) => setLessonData(prev => ({ ...prev, description: e.target.value }))}
                                    className="w-full bg-gray-50 dark:bg-mountain-700 border border-gray-300 dark:border-mountain-600 rounded-lg px-4 py-2 focus:border-dawn-500 focus:outline-none"
                                    placeholder="Краткое описание урока"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">XP награда</label>
                                <input
                                    type="number"
                                    value={lessonData.xpReward}
                                    onChange={(e) => setLessonData(prev => ({ ...prev, xpReward: parseInt(e.target.value) || 0 }))}
                                    className="w-full bg-gray-50 dark:bg-mountain-700 border border-gray-300 dark:border-mountain-600 rounded-lg px-4 py-2 focus:border-dawn-500 focus:outline-none"
                                    min="0"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-mountain-800 rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold mb-4">
                            Теоретический контент ({lessonData.content?.length || 0})
                            <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
                                (все блоки отображаются на одной странице)
                            </span>
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                            <select
                                value={newContentBlock.type}
                                onChange={(e) => setNewContentBlock(prev => ({ ...prev, type: e.target.value }))}
                                className="bg-gray-50 dark:bg-mountain-700 border border-gray-300 dark:border-mountain-600 rounded-lg px-4 py-2 focus:border-dawn-500 focus:outline-none"
                            >
                                <option value="text">Текст</option>
                                <option value="code">Код</option>
                                <option value="image">Изображение (URL)</option>
                            </select>
                            <input
                                type="text"
                                value={newContentBlock.value}
                                onChange={(e) => setNewContentBlock(prev => ({ ...prev, value: e.target.value }))}
                                className="md:col-span-2 bg-gray-50 dark:bg-mountain-700 border border-gray-300 dark:border-mountain-600 rounded-lg px-4 py-2 focus:border-dawn-500 focus:outline-none"
                                placeholder={newContentBlock.type === 'image' ? 'URL изображения' : 'Содержимое блока'}
                            />
                            <button
                                onClick={addContentBlock}
                                className="flex items-center justify-center gap-2 bg-mountain-500 hover:bg-mountain-600 text-white px-4 py-2 rounded-lg transition-colors"
                            >
                                <FaPlus /> Добавить
                            </button>
                        </div>

                        {lessonData.content && lessonData.content.length > 0 && (
                            <div className="space-y-2 max-h-64 overflow-y-auto border border-gray-200 dark:border-mountain-700 rounded-lg p-3">
                                {lessonData.content.map((block, idx) => (
                                    <div key={block.id || idx} className="flex justify-between items-start bg-gray-50 dark:bg-mountain-700 p-3 rounded-lg">
                                        <div className="flex items-center gap-3 flex-1">
                                            {getContentIcon(block.type)}
                                            <div className="flex-1">
                                                <span className="text-xs font-semibold text-dawn-500 uppercase">{block.type}</span>
                                                <p className="text-sm mt-1 line-clamp-2 text-gray-700 dark:text-gray-300">{block.value}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeContentBlock(idx)}
                                            className="text-red-500 hover:text-red-600 ml-2 p-2"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="bg-white dark:bg-mountain-800 rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold mb-4">Вопросы ({lessonData.questions?.length || 0})</h2>

                        <div className="space-y-4 mb-4">
                            <input
                                type="text"
                                value={newQuestion.text}
                                onChange={(e) => setNewQuestion(prev => ({ ...prev, text: e.target.value }))}
                                className="w-full bg-gray-50 dark:bg-mountain-700 border border-gray-300 dark:border-mountain-600 rounded-lg px-4 py-2 focus:border-dawn-500 focus:outline-none"
                                placeholder="Текст вопроса"
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {newQuestion.options.map((opt, idx) => (
                                    <input
                                        key={idx}
                                        type="text"
                                        value={opt}
                                        onChange={(e) => updateOption(idx, e.target.value)}
                                        className="bg-gray-50 dark:bg-mountain-700 border border-gray-300 dark:border-mountain-600 rounded-lg px-4 py-2 focus:border-dawn-500 focus:outline-none"
                                        placeholder={`Вариант ${idx + 1}`}
                                    />
                                ))}
                            </div>

                            <select
                                value={newQuestion.correct}
                                onChange={(e) => setNewQuestion(prev => ({ ...prev, correct: e.target.value }))}
                                className="w-full bg-gray-50 dark:bg-mountain-700 border border-gray-300 dark:border-mountain-600 rounded-lg px-4 py-2 focus:border-dawn-500 focus:outline-none"
                            >
                                <option value="">Выберите правильный ответ</option>
                                {newQuestion.options.filter(o => o && o.trim() !== '').map((opt, idx) => (
                                    <option key={idx} value={opt}>{opt}</option>
                                ))}
                            </select>

                            <button
                                onClick={addQuestion}
                                className="flex items-center gap-2 bg-mountain-500 hover:bg-mountain-600 text-white px-4 py-2 rounded-lg transition-colors"
                            >
                                <FaPlus /> Добавить вопрос
                            </button>
                        </div>

                        {lessonData.questions && lessonData.questions.length > 0 && (
                            <div className="space-y-2 max-h-64 overflow-y-auto border border-gray-200 dark:border-mountain-700 rounded-lg p-3">
                                {lessonData.questions.map((q, idx) => (
                                    <div key={q.id || idx} className="flex justify-between items-start bg-gray-50 dark:bg-mountain-700 p-3 rounded-lg">
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{q.text}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                ✓ {q.correct}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => removeQuestion(idx)}
                                            className="text-red-500 hover:text-red-600 ml-2 p-2"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={saveLesson}
                        disabled={!isLessonValid}
                        className="w-full bg-dawn-500 hover:bg-dawn-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center gap-2"
                    >
                        <FaSave /> Сохранить урок
                    </button>
                </div>
            )}
        </div>
    );
};

export default CreatorPage;