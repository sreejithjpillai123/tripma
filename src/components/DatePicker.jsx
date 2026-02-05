import React, { useState, useEffect } from 'react';

const DatePicker = ({ onClose, onSelect }) => {
    const [tripType, setTripType] = useState('round'); // 'round' or 'one'
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [focusedInput, setFocusedInput] = useState('start'); // 'start' | 'end'

    // Helper to format date "Feb 25"
    const formatDate = (date) => {
        if (!date) return "";
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const getMonthData = (year, month) => {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startingDayOfWeek = firstDay.getDay(); // 0 is Sunday
        const daysInMonth = lastDay.getDate();
        return { startingDayOfWeek, daysInMonth, monthName: firstDay.toLocaleDateString('en-US', { month: 'long' }), year: firstDay.getFullYear() };
    };

    const isSameDay = (d1, d2) => {
        if (!d1 || !d2) return false;
        return d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();
    };

    const handleDateClick = (day, monthOffset) => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth() + monthOffset;
        const clickedDate = new Date(year, month, day);

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (clickedDate < today) return;

        if (tripType === 'one') {
            setStartDate(clickedDate);
            setEndDate(null);
        } else {
            // Round Trip Logic with focused input
            if (focusedInput === 'start') {
                setStartDate(clickedDate);
                // If we picked a start date after the current end date, reset end date
                if (endDate && clickedDate > endDate) {
                    setEndDate(null);
                }
                setFocusedInput('end'); // Move focus to end
            } else {
                // Focused on End
                if (clickedDate < startDate) {
                    // If clicked before start, assume they meant to fix start
                    setStartDate(clickedDate);
                    setFocusedInput('end'); // Keep looking for end
                } else {
                    setEndDate(clickedDate);
                    // Optional: Close or just stay? Let's stay to allow correction
                }
            }
        }
    };

    const handleDone = () => {
        let result = "";
        if (startDate) {
            result = formatDate(startDate);
            if (endDate) {
                result += ` - ${formatDate(endDate)}`;
            }
        }
        onSelect(result, startDate, endDate);
        onClose();
    };

    const renderCalendar = (monthOffset) => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth() + monthOffset;
        const { startingDayOfWeek, daysInMonth, monthName, year: displayYear } = getMonthData(year, month);

        const days = [];
        const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

        // Empty slots
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(<div key={`empty-${i}`} className="w-7 h-7"></div>);
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let d = 1; d <= daysInMonth; d++) {
            const currentDate = new Date(year, month, d);
            const isSelected = isSameDay(currentDate, startDate) || isSameDay(currentDate, endDate);
            const isRange = startDate && endDate && currentDate > startDate && currentDate < endDate;
            const isDisabled = currentDate < today;
            const isStart = isSameDay(currentDate, startDate);
            const isEnd = isSameDay(currentDate, endDate);

            days.push(
                <div
                    key={d}
                    className={`w-7 h-7 flex items-center justify-center text-xs cursor-pointer relative z-10
                    ${isDisabled ? 'text-gray-300 cursor-not-allowed' : ''}
                    ${isSelected ? 'bg-indigo-600 text-white' : ''}
                    ${isStart ? 'rounded-l-full' : ''}
                    ${isEnd ? 'rounded-r-full' : ''}
                    ${!isRange && isSelected ? 'rounded-full' : ''}
                    ${isRange ? 'bg-indigo-50 text-indigo-900 rounded-none' : ''}
                    ${!isSelected && !isRange && !isDisabled ? 'text-gray-700 hover:bg-gray-100 rounded-full' : ''}
                `}
                    onClick={() => !isDisabled && handleDateClick(d, monthOffset)}
                >
                    {d}
                </div>
            )
        }

        return (
            <div className="flex flex-col gap-2 w-56">
                <h3 className="font-bold text-gray-800 text-sm mb-2 text-center">{monthName} {displayYear}</h3>
                <div className="grid grid-cols-7 gap-1 mb-1">
                    {weekDays.map((day, index) => (
                        <div key={index} className="text-xs text-center font-medium text-gray-500 w-8">{day}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-y-1 gap-x-0">
                    {days}
                </div>
            </div>
        );
    };

    return (
        <div
            className="p-4 bg-white shadow-2xl rounded-2xl border border-gray-100 flex flex-col gap-4 w-full max-w-[95vw] md:w-[580px] select-none"
            onClick={(e) => e.stopPropagation()}
        >
            {/* Header / Controls */}
            <div className="flex flex-col md:flex-row justify-between items-center border-b border-gray-100 pb-5 gap-4 md:gap-0">
                <div className="flex gap-6">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                            type="radio"
                            name="tripType"
                            checked={tripType === 'round'}
                            onChange={() => {
                                setTripType('round');
                                setFocusedInput('start');
                                setEndDate(null);
                            }}
                            className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                        />
                        <span className="text-xs  text-gray-600 ">Round trip</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                            type="radio"
                            name="tripType"
                            checked={tripType === 'one'}
                            onChange={() => {
                                setTripType('one');
                                setFocusedInput('start');
                                setEndDate(null);
                            }}
                            className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                        />
                        <span className="text-xs  text-gray-600">One way</span>
                    </label>
                </div>

                <div className="flex gap-3 items-center">
                    <div className="border border-indigo-100 rounded-lg px-4 py-2 flex items-center gap-3 text-gray-700 text-xs min-w-[220px] justify-center bg-indigo-50/30">
                        <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <div className="flex items-center gap-2">
                            <span
                                className={` ${focusedInput === 'start' ? 'text-indigo-600 font-bold bg-white shadow-sm ring-1 ring-indigo-200' : 'hover:bg-white/50'}`}
                                onClick={() => setFocusedInput('start')}
                            >
                                {startDate ? formatDate(startDate) : "Depart"}
                            </span>
                            {tripType === 'round' && (
                                <>
                                    <span className="text-gray-300">|</span>
                                    <span
                                        className={` ${focusedInput === 'end' ? 'text-indigo-600 font-bold bg-white shadow-sm ring-1 ring-indigo-200' : 'hover:bg-white/50'}`}
                                        onClick={() => setFocusedInput('end')}
                                    >
                                        {endDate ? formatDate(endDate) : "Arrive"}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                    <button
                        type="button"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase tracking-widest px-6 py-2.5 rounded-lg shadow-md hover:shadow-indigo-200 transition-all active:scale-95"
                        onClick={handleDone}
                    >
                        Done
                    </button>
                </div>
            </div>

            {/* Calendars Area */}
            <div className="relative flex items-center justify-center py-2">
                {/* Prev Arrow */}
                <button
                    type="button"
                    className="absolute left-0 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-indigo-600 transition-all z-20 active:scale-90"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
                    }}
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                {/* Calendar Months Container */}
                <div className="flex flex-col md:flex-row gap-4 w-full justify-center px-2">
                    <div key={`month-0-${currentMonth.getTime()}`} className="flex-shrink-0">
                        {renderCalendar(0)}
                    </div>
                    <div key={`month-1-${currentMonth.getTime()}`} className="hidden md:block flex-shrink-0">
                        {renderCalendar(1)}
                    </div>
                </div>

                {/* Next Arrow */}
                <button
                    type="button"
                    className="absolute right-0 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-indigo-600 transition-all z-20 active:scale-90"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
                    }}
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default DatePicker;
