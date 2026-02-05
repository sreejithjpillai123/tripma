"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Footer from '@/components/Footer';
import DatePicker from '@/components/DatePicker';
import TravelersSelector from '@/components/TravelersSelector';
import FlightSummary from '@/components/FlightSummary';
import flightsData from '../../../data/flights.json';

// Icons
const TakeOffIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2.293-2.293c.63-.63 1.71-.18 1.71.71v.586l-1 1A2 2 0 0012 5H5v14z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
);

const LandingIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
);

const CalendarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

export default function SearchPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [fromValue, setFromValue] = useState(searchParams.get('from') || "");
    const [toValue, setToValue] = useState(searchParams.get('to') || "");
    const [dateValue, setDateValue] = useState("Depart - Return");
    const [adults, setAdults] = useState(1);
    const [minors, setMinors] = useState(0);

    const [selectedFlights, setSelectedFlights] = useState([]);
    const datePickerRef = useRef(null);

    const [showFrom, setShowFrom] = useState(false);
    const [showTo, setShowTo] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTravelers, setShowTravelers] = useState(false);

    const airports = ["SFO", "ATL", "LAX", "STL", "PVG", "MSP", "NRT", "JFK"];

    const getTravelersText = () => {
        let text = `${adults} adult${adults !== 1 ? 's' : ''}`;
        if (minors > 0) {
            text += `, ${minors} minor${minors !== 1 ? 's' : ''}`;
        }
        return text;
    };

    // Helper to get airline color/logo simulation
    const getAirlineLogo = (flight) => {
        if (!flight || !flight.airline) return null;
        const logoName = flight.logo || flight.airline.toLowerCase().split(' ')[0];

        let bgColor = "bg-gray-200";
        let textColor = "text-gray-600";
        let initial = flight.airline[0];

        if (flight.airline.includes("Hawaiian")) { bgColor = "bg-purple-100"; textColor = "text-purple-600"; }
        else if (flight.airline.includes("Japan")) { bgColor = "bg-red-100"; textColor = "text-red-600"; }
        else if (flight.airline.includes("Delta")) { bgColor = "bg-red-50"; textColor = "text-red-700"; }
        else if (flight.airline.includes("Qantas")) { bgColor = "bg-red-50"; textColor = "text-red-800"; }

        return (
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${bgColor} ${textColor} font-bold text-xl`}>
                {flight.logo === 'hawaiian' && '🌺'}
                {flight.logo === 'japan' && '🇯🇵'}
                {flight.logo === 'delta' && '🔺'}
                {flight.logo === 'qantas' && '🦘'}
                {!['hawaiian', 'japan', 'delta', 'qantas'].includes(flight.logo) && initial}
            </div>
        );
    };

    // Filter flights
    const filteredFlights = flightsData.filter(flight => {
        const fromMatch = !fromValue ||
            (flight.origin?.code?.toLowerCase().includes(fromValue.toLowerCase()) ||
                flight.origin?.city?.toLowerCase().includes(fromValue.toLowerCase()));

        const toMatch = !toValue ||
            (flight.destination?.code?.toLowerCase().includes(toValue.toLowerCase()) ||
                flight.destination?.city?.toLowerCase().includes(toValue.toLowerCase()));

        return fromMatch && toMatch;
        return fromMatch && toMatch;
    });

    useEffect(() => {
        function handleClickOutside(event) {
            if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
                setShowDatePicker(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleFlightClick = (flight) => {
        setSelectedFlights(prev => {
            const isSelected = prev.find(f => f.id === flight.id);
            if (isSelected) {
                return prev.filter(f => f.id !== flight.id);
            } else {
                if (prev.length < 2) {
                    return [...prev, flight];
                } else {

                    return [prev[0], flight];
                }
            }
        });
    };

    const handlePassengerClick = () => {
        const flightIds = selectedFlights.map(f => f.id).join(',');
        router.push(`/passenger?flights=${flightIds}`);
    };

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* ... (Search Bar and Filters remain same) ... */}
            <main className="flex-grow w-full max-w-7xl mx-auto px-4 py-8">

                {/* Search Bar Container */}
                <div className="flex flex-col mb-8 w-full max-w-4xl ">
                    <div className="flex flex-col md:flex-row w-full bg-white  border-gray-100 divide-y md:divide-y-0 md:divide-x divide-gray-100 ring-4 ring-indigo-50 overflow-hidden">
                        {/* From */}
                        <div className="flex-1 relative">
                            <div
                                className="flex items-center px-4 py-3 gap-3 cursor-pointer hover:bg-gray-50 h-full"
                                onClick={() => setShowFrom(!showFrom)}
                            >
                                <TakeOffIcon />
                                <input
                                    type="text"
                                    value={fromValue}
                                    onChange={(e) => setFromValue(e.target.value)}
                                    className="outline-none text-gray-700 font-medium bg-transparent w-full cursor-pointer"
                                    placeholder="From"
                                />
                            </div>
                            {showFrom && (
                                <div className="absolute top-full left-0 w-full bg-white shadow-xl rounded-b-lg border border-indigo-100 mt-1 z-50 max-h-60 overflow-y-auto">
                                    {airports.map((airport) => (
                                        <div key={airport} className="px-4 py-2 hover:bg-indigo-600 hover:text-white cursor-pointer" onClick={() => { setFromValue(airport); setShowFrom(false); }}>{airport}</div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* To */}
                        <div className="flex-1 relative">
                            <div
                                className="flex items-center px-4 py-3 gap-3 cursor-pointer hover:bg-gray-50 h-full"
                                onClick={() => setShowTo(!showTo)}
                            >
                                <LandingIcon />
                                <input
                                    type="text"
                                    value={toValue}
                                    onChange={(e) => setToValue(e.target.value)}
                                    className="outline-none text-gray-700 font-medium bg-transparent w-full cursor-pointer"
                                    placeholder="To"
                                />
                            </div>
                            {showTo && (
                                <div className="absolute top-full left-0 w-full bg-white shadow-xl rounded-b-lg border border-indigo-100 mt-1 z-50 max-h-60 overflow-y-auto">
                                    {airports.map((airport) => (
                                        <div key={airport} className="px-4 py-2 hover:bg-indigo-600 hover:text-white cursor-pointer" onClick={() => { setToValue(airport); setShowTo(false); }}>{airport}</div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Dates */}
                        <div className="flex-1 relative" ref={datePickerRef}>
                            <div
                                className="flex items-center px-4 py-3 gap-3 cursor-pointer hover:bg-gray-50 h-full"
                                onClick={() => setShowDatePicker(!showDatePicker)}
                            >
                                <CalendarIcon />
                                <span className="text-gray-700 font-medium truncate">{dateValue}</span>
                            </div>
                            {showDatePicker && (
                                <div className="absolute top-full left-0 mt-1 z-50">
                                    <DatePicker onClose={() => setShowDatePicker(false)} onSelect={(val) => setDateValue(val)} />
                                </div>
                            )}
                        </div>

                        {/* Travelers */}
                        <div className="flex-1 relative">
                            <div
                                className="flex items-center px-4 py-3 gap-3 cursor-pointer hover:bg-gray-50 h-full"
                                onClick={() => setShowTravelers(!showTravelers)}
                            >
                                <UserIcon />
                                <span className="text-gray-700 font-medium">{getTravelersText()}</span>
                            </div>
                            {showTravelers && (
                                <div className="absolute top-full right-0 mt-1 z-50">
                                    <TravelersSelector adults={adults} setAdults={setAdults} minors={minors} setMinors={setMinors} />
                                </div>
                            )}
                        </div>

                        {/* Search Button */}
                        <div className="p-0">
                            <button className="h-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-4 transition-all w-full md:w-auto active:scale-95">
                                Search
                            </button>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-3 mb-8 justify-start w-full">

                    {["Max price", "Shops", "Times", "Airlines", "Seat class", "More"].map((filter) => (
                        <button key={filter} className="px-4 py-2 bg-white border border-gray-200 rounded-md text-gray-600 text-sm font-medium flex items-center gap-2">
                            {filter}
                            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                    ))}
                </div>

                {/* Main Content Grid */}
                <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">

                    {/* Left Column: Filtered Flight List */}
                    <div className="lg:col-span-3 space-y-6">
                        <h2 className="text-xl text-gray-600 font-medium">Choose a <span className="text-indigo-600">departing</span> flight</h2>

                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                            {filteredFlights.length > 0 ? (
                                filteredFlights.map((flight, index) => (
                                    <div
                                        key={flight.id}
                                        className={`bg-white p-4 sm:p-6 hover:bg-gray-50 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6 cursor-pointer ${index !== filteredFlights.length - 1 ? 'border-b border-gray-200' : ''} ${selectedFlights.some(f => f.id === flight.id) ? 'bg-indigo-50 border-indigo-100 ring-1 ring-indigo-200' : ''}`}
                                        onClick={() => handleFlightClick(flight)}
                                    >
                                        {/* Airline Info */}
                                        <div className="flex items-center gap-4 w-full md:w-1/4">
                                            {getAirlineLogo(flight)}
                                            <div className="flex-1">
                                                <div className="text-gray-900 font-bold text-base sm:text-lg">{flight.duration}</div>
                                                <div className="text-gray-400 text-xs sm:text-sm italic">{flight.airline}</div>
                                            </div>
                                        </div>

                                        {/* Time and Price (Mobile Row) */}
                                        <div className="flex flex-row md:flex-col items-center justify-between w-full md:w-1/4">
                                            <div className="text-gray-800 font-semibold text-sm sm:text-lg">{flight.departureTime} - {flight.arrivalTime}</div>
                                            <div className="md:hidden text-indigo-600 font-bold text-lg">${flight.price}</div>
                                        </div>

                                        {/* Stops */}
                                        <div className="flex flex-col items-start md:items-center w-full md:w-1/4">
                                            <div className="text-gray-600 font-medium text-sm sm:text-lg">{flight.stops}</div>
                                            <div className="text-gray-400 text-xs sm:text-sm">{flight.stopsDetails}</div>
                                        </div>

                                        {/* Price (Desktop Only) */}
                                        <div className="hidden md:flex flex-col items-end w-1/4">
                                            <div className="text-gray-800 font-bold text-xl">${flight.price}</div>
                                            <div className="text-gray-400 text-xs uppercase tracking-wider">{flight.type}</div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center text-gray-500">
                                    No flights found matching your criteria.
                                </div>
                            )}

                            {/* Show all flights footer */}
                            <div className="p-4 bg-white border-t border-gray-200 flex justify-end">
                                <button className="text-indigo-600 font-medium hover:underline border border-indigo-600 rounded px-6 py-2">
                                    Show all flights
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Dynamic Content */}
                    <div className="lg:col-span-1 space-y-8">

                        {selectedFlights.length > 0 ? (
                            /* Selected Flights Detail View */
                            <FlightSummary
                                selectedFlights={selectedFlights}
                                onActionClick={handlePassengerClick}
                                actionLabel="Passenger information"
                            />
                        ) : (
                            /* Default Widgets */
                            <>
                                {/* Price Grid */}
                                <div>
                                    <h3 className="text-gray-600 font-medium mb-4">Price grid (flexible dates)</h3>
                                    <div className="border border-gray-200 rounded-lg overflow-hidden text-sm">
                                        <div className="grid grid-cols-6 border-b border-gray-200 bg-gray-50">
                                            <div className="p-2"></div>
                                            {['2/12', '2/13', '2/14', '2/15', '2/16'].map(d => <div key={d} className="p-2 text-center text-gray-500 font-medium">{d}</div>)}
                                        </div>
                                        {[
                                            { date: '3/7', prices: ['$837', '$592', '$592', '$1.308', '$837'] },
                                            { date: '3/8', prices: ['$837', '$592', '$592', '$837', '$1.308'] },
                                            { date: '3/9', prices: ['$624', '$592', '$624', '$592', '$592'] },
                                            { date: '3/10', prices: ['$1.308', '$624', '$624', '$837', '$837'] },
                                            { date: '3/11', prices: ['$592', '$624', '$1.308', '$837', '$624'] },
                                        ].map((row, i) => (
                                            <div key={i} className={`grid grid-cols-6 ${i !== 4 ? 'border-b border-gray-100' : ''}`}>
                                                <div className="p-2 font-medium text-gray-500 bg-gray-50 text-center flex items-center justify-center">{row.date}</div>
                                                {row.prices.map((price, idx) => (
                                                    <div key={idx} className="p-2 text-center text-gray-400 text-xs flex items-center justify-center">{price}</div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Price History */}
                                <div>
                                    <h3 className="text-gray-600 font-medium mb-4">Price history</h3>
                                    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                                        <img
                                            src="/images/price history.png"
                                            alt="Price history chart"
                                            className="w-full h-auto object-contain"
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                    </div>
                </div>



                {/* Price Rating Section */}
                <div className="w-full max-w-7xl mx-auto mt-12 mb-12">
                    <div className="flex flex-col md:flex-row bg-white rounded-lg  overflow-hidden ">
                        {/* Map Visualization (Left) */}
                        <div className="w-full md:w-2/3 h-40 bg-indigo-100 relative overflow-hidden flex-shrink-0 ">
                            {/* Abstract Map Background */}
                            <img
                                src="https://simplemaps.com/static/demos/resources/svg-library/svgs/world.svg"
                                alt="World Map"
                                className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-multiply"
                            />
                            {/* Flight Path Overlay */}
                            <img
                                src="/images/Map.png"
                                alt="Flight path"
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        </div>
                        {/* Price Rating Info (Right) */}
                        {selectedFlights.length === 0 && (
                            <div className="w-full md:w-1/3 px-8 pt-0 pb-8 flex flex-col">
                                <div className="flex items-center gap-4 mb-4">
                                    <h3 className="text-gray-600 font-medium text-lg">Price rating</h3>
                                    <span className="bg-teal-400 text-white text-xs font-bold px-3 py-1 rounded">Buy soon</span>
                                </div>
                                <p className="text-gray-500 text-sm leading-relaxed mb-4">
                                    We recommend booking soon. The average cost of this flight is <span className="font-medium text-gray-800">$750</span>, but could rise 18% to <span className="font-medium text-gray-800">$885</span> in two weeks.
                                </p>
                                <p className="text-gray-400 text-xs">
                                    Tripma analyzes thousands of flights, prices, and trends to ensure you get the best deal.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
                {/* Places to stay Section */}
                <div className="w-full max-w-7xl mx-auto mb-20">
                    <div className="flex justify-between items-end mb-6">
                        <h2 className="text-xl md:text-2xl text-gray-600 font-medium">
                            Find <span className="text-indigo-600 font-semibold">places to stay</span> in {toValue === "NRT" || toValue === "HND" ? "Japan" : toValue}
                        </h2>
                        <a href="#" className="text-gray-400 hover:text-indigo-600 font-medium flex items-center transition-colors">
                            All <span className="ml-2">→</span>
                        </a>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Hotel 1 */}
                        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100 overflow-hidden flex flex-col h-full">
                            <div className="h-48 bg-gray-200 relative">
                                <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Ryokan" className="w-full h-full object-cover" />
                            </div>
                            <div className="p-4 flex flex-col flex-grow">
                                <h3 className="text-indigo-600 font-medium text-lg mb-2">Hotel Kaneyamaen and Bessho SASA</h3>
                                <p className="text-sm text-gray-500 leading-relaxed flex-grow">
                                    Located at the base of Mount Fuji, Hotel Kaneyamaen is a traditional japanese ryokan with a modern twist. Enjoy a private onsen bath and a private multi-course kaiseki dinner.
                                </p>
                            </div>
                        </div>

                        {/* Hotel 2 */}
                        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100 overflow-hidden flex flex-col h-full">
                            <div className="h-48 bg-gray-200 relative">
                                <img src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Modern Hotel" className="w-full h-full object-cover" />
                            </div>
                            <div className="p-4 flex flex-col flex-grow">
                                <h3 className="text-indigo-600 font-medium text-lg mb-2">HOTEL THE FLAG 大阪市</h3>
                                <p className="text-sm text-gray-500 leading-relaxed flex-grow">
                                    Make a stop in Osaka and stay at HOTEL THE FLAG, just a few minutes walk to experience the food culture surrounding Dontonbori. Just one minute away is the Shinsaibashi shopping street.
                                </p>
                            </div>
                        </div>

                        {/* Hotel 3 */}
                        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100 overflow-hidden flex flex-col h-full">
                            <div className="h-48 bg-gray-200 relative">
                                <img src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Capsule Hotel" className="w-full h-full object-cover" />
                            </div>
                            <div className="p-4 flex flex-col flex-grow">
                                <h3 className="text-indigo-600 font-medium text-lg mb-2">9 Hours Shinjuku</h3>
                                <p className="text-sm text-gray-500 leading-relaxed flex-grow">
                                    Experience a truly unique stay in an authentic Japanese capsule hotel. 9 Hours Shinjuku is minutes from one of Japan's busiest train stations. Just take the NEX train from Narita airport!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>



                {/* People also searched Section */}
                <div className="w-full max-w-7xl mx-auto mb-20">
                    <div className="flex justify-between items-end mb-6">
                        <h2 className="text-xl md:text-2xl text-gray-600 font-medium">
                            People in <span className="text-indigo-600 font-semibold">{fromValue === "SFO" || fromValue === "LAX" ? "San Francisco" : fromValue}</span> also searched for
                        </h2>
                        <a href="#" className="text-gray-400 hover:text-indigo-600 font-medium flex items-center transition-colors">
                            All <span className="ml-2">→</span>
                        </a>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Destination 1 */}
                        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100 overflow-hidden flex flex-col h-full">
                            <div className="h-64 bg-gray-200 relative">
                                <img src="https://images.unsplash.com/photo-1548013146-72479768bada?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Shanghai" className="w-full h-full object-cover" />
                            </div>
                            <div className="p-4 flex flex-col flex-grow">
                                <div className="flex justify-between items-center mb-1">
                                    <h3 className="text-gray-600 font-medium text-lg">Shanghai, <span className="text-indigo-600">China</span></h3>
                                    <span className="text-gray-600 font-medium">$598</span>
                                </div>
                                <p className="text-sm text-gray-400 leading-relaxed">
                                    An international city rich in culture
                                </p>
                            </div>
                        </div>

                        {/* Destination 2 */}
                        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100 overflow-hidden flex flex-col h-full">
                            <div className="h-64 bg-gray-200 relative">
                                <img src="https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Nairobi" className="w-full h-full object-cover" />
                            </div>
                            <div className="p-4 flex flex-col flex-grow">
                                <div className="flex justify-between items-center mb-1">
                                    <h3 className="text-gray-600 font-medium text-lg">Nairobi, <span className="text-indigo-600">Kenya</span></h3>
                                    <span className="text-gray-600 font-medium">$1,248</span>
                                </div>
                                <p className="text-sm text-gray-400 leading-relaxed">
                                    Dubbed the Safari Capital of the World
                                </p>
                            </div>
                        </div>

                        {/* Destination 3 */}
                        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100 overflow-hidden flex flex-col h-full">
                            <div className="h-64 bg-gray-200 relative">
                                <img src="https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Seoul" className="w-full h-full object-cover" />
                            </div>
                            <div className="p-4 flex flex-col flex-grow">
                                <div className="flex justify-between items-center mb-1">
                                    <h3 className="text-gray-600 font-medium text-lg">Seoul, <span className="text-indigo-600">South Korea</span></h3>
                                    <span className="text-gray-600 font-medium">$589</span>
                                </div>
                                <p className="text-sm text-gray-400 leading-relaxed">
                                    This modern city is a traveler's dream
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </main >
            <Footer />
        </div >
    );
}
