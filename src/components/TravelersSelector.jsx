import React from 'react';

const TravelersSelector = ({ adults, setAdults, minors, setMinors }) => {
    return (
        <div className="bg-white shadow-xl rounded-lg border border-indigo-100 p-4 w-64 flex flex-col gap-4">
            {/* Adults Row */}
            <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Adults:</span>
                <div className="flex items-center gap-3">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (adults > 1) setAdults(adults - 1);
                        }}
                        className={`w-8 h-8 flex items-center justify-center rounded bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors ${adults <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={adults <= 1}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                    </button>

                    <span className="text-gray-700 font-medium w-4 text-center">{adults}</span>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setAdults(adults + 1);
                        }}
                        className="w-8 h-8 flex items-center justify-center rounded bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Minors Row */}
            <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Minors:</span>
                <div className="flex items-center gap-3">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (minors > 0) setMinors(minors - 1);
                        }}
                        className={`w-8 h-8 flex items-center justify-center rounded bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors ${minors <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={minors <= 0}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                    </button>

                    <span className="text-gray-700 font-medium w-4 text-center">{minors}</span>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setMinors(minors + 1);
                        }}
                        className="w-8 h-8 flex items-center justify-center rounded bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TravelersSelector;
