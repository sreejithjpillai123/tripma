"use client";
import Link from 'next/link';
import React, { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import flightsData from '../../../data/flights.json';

// Simple Icons
const ArrowRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
);

const MenuIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);

const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);

export default function SeatsPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const flightIds = searchParams.get('flights')?.split(',') || [];
    const passengerName = searchParams.get('p1') || "Guest";
    const email = searchParams.get('email') || "";

    // Mock Flight Data Loading (using first ID for now to show route)
    const currentFlightId = flightIds[0];
    const flight = flightsData.find(f => f.id.toString() === currentFlightId) || {
        origin: { code: 'SFO', city: 'California, US' },
        destination: { code: 'NRT', city: 'Tokyo, Japan' },
        departureTime: '7:00AM',
        arrivalTime: '12:15PM' // Mock
    };

    // State
    const [selectedSeat, setSelectedSeat] = useState(null); // e.g., "9F"
    const [activeClass, setActiveClass] = useState('economy'); // 'economy' or 'business'
    const [selectedFlightIndex, setSelectedFlightIndex] = useState(0); // 0 for first flight, 1 for second flight
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);



    const renderSeat = (row, colLabel, type, isTaken = false) => {
        const seatId = `${row}${colLabel}`;
        const isSelected = selectedSeat === seatId;
        const isBusiness = type === 'business';

        // Colors
        let bgClass = isBusiness ? "bg-teal-300" : "bg-indigo-500";
        if (isTaken) bgClass = "bg-gray-300 cursor-not-allowed";
        if (isSelected) bgClass = "bg-red-700 ring-2 ring-white";

        // Shape (roughly mimicking the pod shape in image)
        return (
            <div
                key={seatId}
                onClick={() => !isTaken && setSelectedSeat(seatId)}
                className={`
                    w-7 h-9 sm:w-8 sm:h-10 md:w-10 md:h-12 rounded-t-lg mx-0.5 sm:mx-1 relative cursor-pointer transition-all hover:scale-105 active:scale-95
                    ${bgClass}
                    ${isSelected ? 'z-10 shadow-lg scale-110' : 'opacity-90'}
                `}
                title={`${seatId} - ${type}`}
            >
                {/* Visual detail for "seat" look */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-black opacity-10"></div>
            </div>
        );
    };

    const renderRow = (rowNum, type) => {
        const isBusiness = type === 'business';
        return (
            <div key={rowNum} className="flex items-center justify-center mb-4 relative">
                {/* Row Number */}
                <span className="absolute left-2 text-gray-400 text-xs font-mono">{rowNum}</span>

                {/* Left Side */}
                <div className="flex">
                    {renderSeat(rowNum, 'A', type)}
                    {renderSeat(rowNum, 'B', type)}
                    {!isBusiness && renderSeat(rowNum, 'C', type)}
                </div>

                {/* Aisle */}
                <div className="w-6 sm:w-8 md:w-12 text-center text-gray-300 text-xs flex items-center justify-center">
                    {/* Optional aisle content */}
                </div>

                {/* Right Side */}
                <div className="flex">
                    {!isBusiness && renderSeat(rowNum, 'D', type)}
                    {renderSeat(rowNum, isBusiness ? 'C' : 'E', type)}
                    {renderSeat(rowNum, isBusiness ? 'D' : 'F', type)}
                </div>
                <span className="absolute right-2 text-gray-400 text-xs font-mono">{rowNum}</span>
            </div>
        );
    };

    return (
        <>
            {/* Hamburger Menu Button */}
            <button
                onClick={() => setIsSidebarOpen(true)}
                className="absolute top-6 left-6 z-50 p-2.5 bg-white/80 backdrop-blur-md rounded-xl shadow-lg border border-white/20 hover:bg-white transition-all group lg:left-10"
                title="More options"
            >
                <MenuIcon />
            </button>

            {/* Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[60] transition-opacity duration-300"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar Content */}
            <div
                className={`fixed top-0 left-0 h-full w-80 bg-white z-[70] shadow-2xl transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="p-8 h-full flex flex-col">
                    <div className="flex justify-between items-center mb-12">
                        <Link href="/">
                            <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Tripma</div>
                        </Link>
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-gray-600"
                        >
                            <XIcon />
                        </button>
                    </div>

                    <nav className="flex flex-col gap-2">
                        <a href="/flights" className="px-4 py-3 text-lg font-medium text-gray-600">Flights</a>
                        <a href="/hotels" className="px-4 py-3 text-lg font-medium text-gray-600">Hotels</a>
                        <a href="/packages" className="px-4 py-3 text-lg font-medium text-gray-600">Packages</a>
                        <div className="h-px bg-gray-100 my-6 mx-4"></div>
                        <button className="px-4 py-3 text-left text-lg font-medium text-gray-600">Sign in</button>
                        <div className="px-4 pt-4">
                            <button className="w-full bg-indigo-600 text-white px-6 py-4 rounded-2xl font-semibold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-[0.98]">
                                Sign up
                            </button>
                        </div>
                    </nav>

                    <div className="mt-auto">
                        <div className="p-5 bg-gray-50 rounded-3xl border border-gray-100">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                    {email ? email[0].toUpperCase() : 'G'}
                                </div>
                                <div className="flex-1 min-w-0">

                                    <p className="text-sm font-bold text-gray-900 truncate">{passengerName}</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <div className="min-h-screen bg-white flex flex-col md:flex-row overflow-hidden relative">

                {/* Header/Nav (Overlay or part of layout) - kept minimal as per design focus on split screen */}
                {/* For this page, we might want a simple top bar or back button, but design shows full screen app feel */}

                {/* LEFT: Fuselage Scrollable Area */}
                <div className="w-full md:w-[60%] h-[60vh] md:h-screen bg-indigo-50 relative overflow-hidden flex flex-col items-center">


                    <div className="w-full h-32 bg-indigo-100 "></div>


                    <div className="flex-grow overflow-y-auto w-full max-w-lg px-4 pb-32 hide-scrollbar">

                        <div className="mb-12">

                            {[1, 2, 3, 4].map(r => renderRow(r, 'business'))}
                        </div>


                        <div>
                            <div className="text-center text-gray-400 text-xs mb-4 uppercase tracking-widest">Exit Row</div>
                            {[5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map(r => renderRow(r, 'economy'))}
                        </div>
                    </div>


                    <div className="w-[80%] h-48 bg-indigo-100 "></div>
                </div>


                {/* RIGHT: Details Panel */}
                <div className="w-full md:w-[40%] h-[40vh] md:h-screen bg-white shadow-xl z-20 flex flex-col border-l border-gray-200">

                    {/* Flight Route Header */}
                    <div className="w-full flex h-24">
                        {/* Left Section: Route */}
                        <div className="bg-[#1F2029] w-[45%] p-4 flex flex-col justify-center relative">
                            <div className="flex items-center gap-6">
                                <div>
                                    <div className="text-2xl font-bold text-white">{flight.origin?.code}</div>
                                    <div className="text-[10px] text-gray-400 font-light">{flight.origin?.city}</div>
                                </div>
                                <ArrowRightIcon className="text-white" />
                                <div>
                                    <div className="text-2xl font-bold text-white">{flight.destination?.code}</div>
                                    <div className="text-[10px] text-gray-400 font-light">{flight.destination?.city}</div>
                                </div>
                            </div>
                        </div>

                        {/* Middle Section: Departing (Flight 1) */}
                        <div
                            onClick={() => setSelectedFlightIndex(0)}
                            className={`w-[25%] p-4 flex flex-col justify-center border-l border-gray-700 cursor-pointer transition-colors ${selectedFlightIndex === 0 ? 'bg-[#605DEC]' : 'bg-[#2B2D38] hover:bg-[#353742]'
                                }`}
                        >
                            <div className="text-white text-sm font-medium mb-1">Feb 25 | 7:00AM</div>
                            <div className={`text-[10px] ${selectedFlightIndex === 0 ? 'text-white/80' : 'text-gray-400'}`}>Departing</div>

                            {/* Triangle Pointer - only show for selected */}
                            {selectedFlightIndex === 0 && (
                                <div className="absolute -bottom-2 left-[57.5%] transform -translate-x-1/2 w-4 h-4 bg-[#605DEC] rotate-45"></div>
                            )}
                        </div>

                        {/* Right Section: Arriving (Flight 2) */}
                        <div
                            onClick={() => setSelectedFlightIndex(1)}
                            className={`w-[30%] p-4 flex flex-col justify-center relative cursor-pointer transition-colors ${selectedFlightIndex === 1 ? 'bg-[#605DEC]' : 'bg-[#2B2D38] hover:bg-[#353742]'
                                }`}
                        >
                            <div className="text-white text-sm font-medium mb-1">Mar 21 | 12:15PM</div>
                            <div className={`text-[10px] ${selectedFlightIndex === 1 ? 'text-white/80' : 'text-gray-400'}`}>Arriving</div>

                            {/* Triangle Pointer - only show for selected */}
                            {selectedFlightIndex === 1 && (
                                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-[#605DEC] rotate-45"></div>
                            )}
                        </div>
                    </div>

                    {/* Seat Class Info */}
                    <div className="flex-grow overflow-y-auto p-4 sm:p-6">

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                            {/* Economy Column */}
                            <div
                                onClick={() => setActiveClass('economy')}
                                className="rounded-xl p-4 cursor-pointer hover:bg-gray-50 transition-colors group"
                            >
                                {/* Image */}
                                <div className="mb-6 relative h-32 w-full">
                                    <img src="/images/Blue.png" alt="Economy" className="w-full h-full object-contain object-center transform -scale-x-100" />
                                </div>

                                {/* Header */}
                                <div className="mb-4 flex items-center gap-3">
                                    <h3 className="text-lg font-medium text-gray-700">Economy</h3>
                                    {activeClass === 'economy' && (
                                        <span className="bg-[#605DEC] text-white text-[10px] font-bold px-2 py-0.5 rounded">Selected</span>
                                    )}
                                </div>

                                <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                                    Rest and recharge during your flight with extended leg room, personalized service, and a multi-course meal service
                                </p>

                                {/* Divider Line */}
                                <div className="w-8 h-1 bg-[#605DEC] mb-6 opacity-50"></div>

                                {/* Features */}
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3 text-xs text-gray-500">
                                        <div className="mt-1 w-2 h-2 rounded-full bg-[#605DEC] flex-shrink-0"></div>
                                        Built-in entertainment system
                                    </li>
                                    <li className="flex items-start gap-3 text-xs text-gray-500">
                                        <div className="mt-1 w-2 h-2 rounded-full bg-[#605DEC] flex-shrink-0"></div>
                                        Complimentary snacks and drinks
                                    </li>
                                    <li className="flex items-start gap-3 text-xs text-gray-500">
                                        <div className="mt-1 w-2 h-2 rounded-full bg-[#605DEC] flex-shrink-0"></div>
                                        One free carry-on and personal item
                                    </li>
                                </ul>
                            </div>

                            {/* Business Column */}
                            <div
                                onClick={() => setActiveClass('business')}
                                className="rounded-xl p-4 cursor-pointer hover:bg-gray-50 transition-colors group"
                            >
                                {/* Image */}
                                <div className="mb-6 relative h-32 w-full">
                                    <img src="/images/Green.png" alt="Business class" className="w-full h-full object-contain object-center transform -scale-x-100" />
                                </div>

                                {/* Header */}
                                <div className="mb-4 flex items-center gap-3">
                                    <h3 className="text-lg font-medium text-gray-700">Business class</h3>
                                    {activeClass === 'business' && (
                                        <span className="bg-[#30C6A4] text-white text-[10px] font-bold px-2 py-0.5 rounded">Selected</span>
                                    )}
                                </div>

                                <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                                    Rest and recharge during your flight with extended leg room, personalized service, and a multi-course meal service
                                </p>

                                {/* Divider Line */}
                                <div className="w-8 h-1 bg-[#30C6A4] mb-6 opacity-50"></div>

                                {/* Features */}
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3 text-xs text-gray-500">
                                        <div className="mt-0.5 text-[#30C6A4] flex-shrink-0"><CheckIcon /></div>
                                        Extended leg room
                                    </li>
                                    <li className="flex items-start gap-3 text-xs text-gray-500">
                                        <div className="mt-0.5 text-[#30C6A4] flex-shrink-0"><CheckIcon /></div>
                                        First two checked bags free
                                    </li>
                                    <li className="flex items-start gap-3 text-xs text-gray-500">
                                        <div className="mt-0.5 text-[#30C6A4] flex-shrink-0"><CheckIcon /></div>
                                        Priority boarding
                                    </li>
                                    <li className="flex items-start gap-3 text-xs text-gray-500">
                                        <div className="mt-0.5 text-[#30C6A4] flex-shrink-0"><CheckIcon /></div>
                                        Personalized service
                                    </li>
                                    <li className="flex items-start gap-3 text-xs text-gray-500">
                                        <div className="mt-0.5 text-[#30C6A4] flex-shrink-0"><CheckIcon /></div>
                                        Enhanced food and drink service
                                    </li>
                                    <li className="flex items-start gap-3 text-xs text-gray-500">
                                        <div className="mt-0.5 text-[#30C6A4] flex-shrink-0"><CheckIcon /></div>
                                        Seats that recline 40% more than economy
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Footer Controls */}
                    <div className="p-4 sm:p-6 border-t border-gray-200 bg-white">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-0">
                            {/* Left: Passenger Info */}
                            <div className="flex gap-12 w-full sm:w-auto justify-between sm:justify-start">
                                <div>
                                    <div className="text-gray-400 text-[10px] sm:text-xs mb-1 uppercase tracking-wider">Passenger 1</div>
                                    <div className="font-bold text-gray-800 text-sm sm:text-base">{passengerName}</div>
                                </div>
                                <div>
                                    <div className="text-gray-400 text-[10px] sm:text-xs mb-1 uppercase tracking-wider">Seat number</div>
                                    <div className="font-bold text-gray-800 text-sm sm:text-base">{selectedSeat || "9F"}</div>
                                </div>
                            </div>

                            {/* Right: Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                                <button className="w-full sm:w-auto px-6 py-3 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all text-sm active:scale-[0.98]">
                                    Save and close
                                </button>
                                <button
                                    onClick={() => router.push(`/payment?flights=${flightIds.join(',')}&p1=${encodeURIComponent(passengerName)}&seat=${selectedSeat || '9F'}&email=${encodeURIComponent(email)}`)}
                                    className="w-full sm:w-auto px-8 py-3 bg-[#605DEC] text-white font-semibold rounded-xl hover:bg-[#4F4DD9] transition-all text-sm shadow-lg shadow-indigo-100 active:scale-[0.98]"
                                >
                                    {selectedFlightIndex === 0 ? 'Next Flight' : 'Payment method'}
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}
