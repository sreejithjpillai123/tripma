import React from 'react';

const FlightSummary = ({ selectedFlights, onActionClick, actionLabel = "Passenger information" }) => {

    // Helper to get airline color/logo simulation (duplicated helper for now, or could be utils)
    // For simplicity and self-containment, defining it here.
    const getAirlineLogo = (flight) => {
        if (!flight || !flight.airline) return null;
        // Logic from SearchPage
        let bgColor = "bg-gray-200";
        let textColor = "text-gray-600";
        let initial = flight.airline[0];

        if (flight.airline.includes("Hawaiian")) { bgColor = "bg-purple-100"; textColor = "text-purple-600"; }
        else if (flight.airline.includes("Japan")) { bgColor = "bg-red-100"; textColor = "text-red-600"; }
        else if (flight.airline.includes("Delta")) { bgColor = "bg-red-50"; textColor = "text-red-700"; }
        else if (flight.airline.includes("Qantas")) { bgColor = "bg-red-50"; textColor = "text-red-800"; }

        return (
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${bgColor} ${textColor} font-bold text-sm`}>
                {/* Simplified logo logic for summary - or copy full logic if needed */}
                {flight.logo === 'hawaiian' && '🌺'}
                {flight.logo === 'japan' && '🇯🇵'}
                {flight.logo === 'delta' && '🔺'}
                {flight.logo === 'qantas' && '🦘'}
                {!['hawaiian', 'japan', 'delta', 'qantas'].includes(flight.logo) && initial}
            </div>
        );
    };

    if (!selectedFlights || selectedFlights.length === 0) return null;

    const subtotal = Math.round(selectedFlights.reduce((acc, curr) => acc + curr.price, 0) * 0.82);
    const taxes = Math.round(selectedFlights.reduce((acc, curr) => acc + curr.price, 0) * 0.18);
    const total = selectedFlights.reduce((acc, curr) => acc + curr.price, 0);

    return (
        <div className="space-y-6">
            {/* Details Card */}
            <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
                {selectedFlights.map((flight, idx) => (
                    <div key={flight.id} className={`${idx !== 0 ? 'mt-6 pt-6 border-t border-gray-100' : ''}`}>
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                {/* Logo Wrapper */}
                                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 relative">
                                    {getAirlineLogo(flight)}
                                </div>
                                <div className="text-left">
                                    <div className="text-gray-900 font-medium text-sm">{flight.airline}</div>
                                    <div className="text-indigo-400 text-xs">{flight.flightNumber || "FIG4312"}</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-gray-900 font-medium text-sm">{flight.duration} {flight.arrivalTime.includes('+1') ? '(+1d)' : ''}</div>
                                <div className="text-gray-500 text-xs my-1">{flight.departureTime} - {flight.arrivalTime}</div>
                                <div className="text-gray-400 text-xs">{flight.stopsDetails || '2h 45m in HNL'}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Price Breakdown - Outside Card */}
            <div className="flex flex-col items-end space-y-2">
                <div className="flex items-center justify-end gap-12 w-full max-w-xs">
                    <span className="text-gray-600 text-sm">Subtotal</span>
                    <span className="text-gray-900 font-medium text-sm w-16 text-right">${subtotal}</span>
                </div>
                <div className="flex items-center justify-end gap-12 w-full max-w-xs">
                    <span className="text-gray-600 text-sm">Taxes and Fees</span>
                    <span className="text-gray-900 font-medium text-sm w-16 text-right">${taxes}</span>
                </div>
                <div className="flex items-center justify-end gap-12 w-full max-w-xs pt-1">
                    <span className="text-gray-800 font-medium text-base">Total</span>
                    <span className="text-gray-900 font-bold text-base w-16 text-right">${total}</span>
                </div>
            </div>

            {/* Action Button - Outside Card */}
            {onActionClick && (
                <div className="flex justify-end mt-4">
                    <button
                        onClick={onActionClick}
                        className="bg-indigo-600 text-white rounded-lg py-3 px-6 hover:bg-indigo-700 font-medium transition-colors shadow-lg shadow-indigo-100 active:scale-95"
                    >
                        {actionLabel}
                    </button>
                </div>
            )}
        </div>
    );
};

export default FlightSummary;
