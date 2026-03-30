import React, { useState, useEffect } from 'react';

const QuestionCard = ({ question, onAnswer, disabled, showFeedback }) => {
    const [selectedOption, setSelectedOption] = useState(null);
    const [feedback, setFeedback] = useState(null);

    const handleSelect = (option) => {
        if (disabled) return;
        setSelectedOption(option);
        const isCorrect = option === question.correct;
        setFeedback(isCorrect ? 'correct' : 'wrong');
        onAnswer(isCorrect);
    };

    useEffect(() => {
        setSelectedOption(null);
        setFeedback(null);
    }, [question]);

    return (
        <div className="bg-white dark:bg-mountain-800 rounded-lg shadow-md p-6 transition-colors">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-100">{question.text}</h2>
            <div className="grid gap-3">
                {question.options.map((option, idx) => {
                    let buttonClass = 'w-full text-left p-3 rounded-lg border transition-colors ';
                    if (disabled && feedback) {
                        if (option === question.correct) {
                            buttonClass += 'bg-green-100 dark:bg-green-900/30 border-green-500 dark:border-green-400 text-gray-800 dark:text-gray-200';
                        } else if (selectedOption === option && feedback === 'wrong') {
                            buttonClass += 'bg-red-100 dark:bg-red-900/30 border-red-500 dark:border-red-400 text-gray-800 dark:text-gray-200';
                        } else {
                            buttonClass += 'bg-gray-50 dark:bg-mountain-700 border-gray-200 dark:border-mountain-600 text-gray-500 dark:text-gray-400';
                        }
                    } else {
                        buttonClass += 'bg-gray-50 dark:bg-mountain-700 hover:bg-gray-100 dark:hover:bg-mountain-600 border-gray-200 dark:border-mountain-600 text-gray-800 dark:text-gray-200';
                    }
                    return (
                        <button
                            key={idx}
                            onClick={() => handleSelect(option)}
                            disabled={disabled}
                            className={buttonClass}
                        >
                            {option}
                        </button>
                    );
                })}
            </div>
            {showFeedback && feedback && (
                <div className={`mt-4 p-3 rounded-lg ${
                    feedback === 'correct'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                        : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                }`}>
                    {feedback === 'correct' ? '✅ Правильно!' : '❌ Неправильно. Правильный ответ: ' + question.correct}
                </div>
            )}
        </div>
    );
};

export default QuestionCard;