"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import flightsData from '../../../data/flights.json';
import Footer from '@/components/Footer';

export default function SuccessPage() {
    const searchParams = useSearchParams();
    const flightIds = searchParams.get('flights')?.split(',') || [];
    const passengerName = searchParams.get('p1') || "Guest";
    const selectedSeat = searchParams.get('seat') || "9F";
    const userEmail = searchParams.get('email') || "";
    const [confirmationNumber, setConfirmationNumber] = useState(null);

    useEffect(() => {
        setConfirmationNumber(`#${Math.floor(100000000000 + Math.random() * 900000000000)}`);
    }, []);

    // State
    const [showSuccessMessage, setShowSuccessMessage] = useState(true);

    // Load flight data
    const selectedFlights = flightsData.filter(f => flightIds.includes(f.id.toString()));

    // Persistence Logic: Save to localStorage on mount
    useEffect(() => {
        if (typeof window !== 'undefined' && userEmail && flightIds.length > 0 && confirmationNumber) {
            const existingBookingsStr = localStorage.getItem('tripma_bookings');
            const bookings = existingBookingsStr ? JSON.parse(existingBookingsStr) : {};

            if (!bookings[userEmail]) {
                bookings[userEmail] = [];
            }

            // Avoid duplicate confirmation saving if page refreshed (simple check by ID)
            const isAlreadySaved = bookings[userEmail].some(b => b.id === confirmationNumber);

            if (!isAlreadySaved) {
                const newBooking = {
                    id: confirmationNumber,
                    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                    status: "Upcoming",
                    flightIds: flightIds, // Store IDs for consistency with API/User page expectation
                    flights: selectedFlights, // Also store full object for LocalStorage immediate use
                    total: selectedFlights.reduce((sum, flight) => sum + (flight.price || 500), 0) + Math.round(selectedFlights.reduce((sum, flight) => sum + (flight.price || 500), 0) * 0.12),
                    passenger: passengerName
                };

                bookings[userEmail].unshift(newBooking);
                localStorage.setItem('tripma_bookings', JSON.stringify(bookings));

                // Save to Backend API
                fetch('/api/bookings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: userEmail, booking: newBooking })
                }).catch(err => console.error("Failed to save booking to server:", err));
            }
        }
    }, [userEmail, flightIds, selectedFlights, passengerName, confirmationNumber]);

    // Calculate pricing
    const subtotal = selectedFlights.reduce((sum, flight) => sum + (flight.price || 500), 0);
    const taxesAndFees = Math.round(subtotal * 0.12);
    const total = subtotal + taxesAndFees;

    // Mock recommendations data
    const recommendations = [
        {
            title: "Shop Hotels",
            description: "Tripma partners with thousands of hotels to get you the best deal. Save up to 30% when you add a hotel to your trip.",
            image: "/images/img1.png",
            price: null
        },
        {
            title: "Rental Cars",
            description: "Save up to 20% when you book a car with your flight.",
            image: "/images/img2.jpg",
            price: "$624"
        },
        {
            title: "Rental Cars",
            description: "Save up to 20% when you book a car with your flight.",
            image: "/images/img3.jpg",
            price: "$624"
        },
        {
            title: "HOTEL: Hale Koa Hotel",
            description: "A modern hotel in the heart of Honolulu.",
            image: "/images/img1.png",
            price: "$139"
        },
        {
            title: "A Beach Getaway",
            description: "Relax on the pristine beaches of Hawaii.",
            image: "/images/img2.jpg",
            price: "$239"
        },
        {
            title: "Unique Experiences",
            description: "Find unique things to do all around the world.",
            image: "/images/img3.jpg",
            price: null
        },
        {
            title: "Iceland Skydiving",
            description: "A thrilling adventure in Iceland.",
            image: "/images/img2.jpg",
            price: "$99"
        },
        {
            title: "Icelandic Streetwear",
            description: "A modern streetwear brand from Iceland.",
            image: "/images/img3.jpg",
            price: "$39"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="max-w-7xl mx-auto px-4 py-12 ">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-15">

                    {/* Left Column: Booking Details */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Success Message */}
                        {/* Success Message */}
                        {showSuccessMessage && (
                            <div className="bg-teal-50 border border-teal-300 rounded-md p-3 flex items-start gap-2 relative">
                                <svg className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <div className="text-xs text-teal-800 flex-1 pr-4">
                                    Your flight has been booked successfully! Your confirmation number is <strong>{confirmationNumber}</strong>
                                </div>
                                <button
                                    onClick={() => setShowSuccessMessage(false)}
                                    className="absolute top-2 right-2 text-teal-500 hover:text-teal-700 transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none" /><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" /></svg>
                                </button>
                            </div>
                        )}

                        {/* Bon Voyage Greeting */}
                        <div className="bg-white rounded-lg p-6 ">
                            <h2 className="text-2xl font-semibold text-indigo-600 mb-2">{passengerName}!</h2>
                            <p className="text-s text-gray-500 mb-1">
                                Confirmation number: <span className="font-medium text-gray-700">{confirmationNumber}</span>
                            </p>
                            <p className="text-s text-gray-500 ">
                                Thank you for booking your travel with Tripma! Below is a summary of your trip to Narita airport in Tokyo, Japan. We’ve sent a copy of your booking confirmation to your email address. You can also find this page again in My trips.
                            </p>
                        </div>

                        {/* Flight Summary */}
                        <div className="rounded-lg p-6 bg-white">
                            <h3 className="text-xl font-bold text-gray-600 mb-6">Flight summary</h3>

                            {/* Departing Flight */}
                            <div className="mb-8">
                                <div className="text-base font-medium text-gray-500 mb-4">Departing February 25th, 2021</div>
                                <div className="border border-gray-200 rounded-lg p-5 flex flex-col md:flex-row items-center justify-between gap-6 bg-white">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-indigo-900 rounded-full flex items-center justify-center text-white overflow-hidden relative">
                                            <div className="absolute inset-0 bg-indigo-800"></div>
                                            <span className="relative z-10 font-bold text-lg">H</span>
                                            <div className="absolute -right-2 -bottom-2 w-6 h-6 bg-red-400 rounded-full"></div>
                                        </div>
                                        <div>
                                            <div className="text-base font-medium text-gray-900">16h 45m</div>
                                            <div className="text-sm text-gray-400">Hawaiian Airlines</div>
                                        </div>
                                    </div>

                                    <div className="flex-1 w-full md:w-auto grid grid-cols-2 md:grid-cols-3 gap-4 text-center md:text-right">
                                        <div className="text-left md:text-right">
                                            <div className="text-base font-medium text-gray-700">7:00AM - 4:15PM</div>
                                            <div className="text-sm text-gray-400">value</div>
                                        </div>
                                        <div>
                                            <div className="text-base font-medium text-gray-700">1 stop</div>
                                            <div className="text-sm text-gray-400">2h 45m in HNL</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-base font-medium text-gray-700">$624</div>
                                            <div className="text-sm text-gray-400">round trip</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-2 text-sm text-gray-400 pl-1">
                                    Seat 9F (economy, window), 1 checked bag
                                </div>
                            </div>

                            {/* Arriving Flight */}
                            <div>
                                <div className="text-base font-medium text-gray-500 mb-4">Arriving March 21st, 2021</div>
                                <div className="border border-gray-200 rounded-lg p-5 flex flex-col md:flex-row items-center justify-between gap-6 bg-white">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-indigo-900 rounded-full flex items-center justify-center text-white overflow-hidden relative">
                                            <div className="absolute inset-0 bg-indigo-800"></div>
                                            <span className="relative z-10 font-bold text-lg">H</span>
                                            <div className="absolute -right-2 -bottom-2 w-6 h-6 bg-red-400 rounded-full"></div>
                                        </div>
                                        <div>
                                            <div className="text-base font-medium text-gray-900">16h 45m</div>
                                            <div className="text-sm text-gray-400">Hawaiian Airlines</div>
                                        </div>
                                    </div>

                                    <div className="flex-1 w-full md:w-auto grid grid-cols-2 md:grid-cols-3 gap-4 text-center md:text-right">
                                        <div className="text-left md:text-right">
                                            <div className="text-base font-medium text-gray-700">7:00AM - 4:15PM</div>
                                            <div className="text-sm text-gray-400">value</div>
                                        </div>
                                        <div>
                                            <div className="text-base font-medium text-gray-700">1 stop</div>
                                            <div className="text-sm text-gray-400">2h 45m in HNL</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-base font-medium text-gray-700">$624</div>
                                            <div className="text-sm text-gray-400">round trip</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-2 text-sm text-gray-400 pl-1">
                                    Seat 4F (business, window), 1 checked bag
                                </div>
                            </div>
                        </div>

                        {/* Price Breakdown */}
                        <div className="bg-white rounded-lg p-6">
                            <h3 className="text-base font-semibold text-gray-900 mb-4">Price breakdown</h3>

                            <div className="space-y-2">
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-600">Departing Flight</span>
                                    <span className="text-gray-900">$251.50</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-600">Arriving Flight</span>
                                    <span className="text-gray-900">$251.50</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-600">Baggage fees</span>
                                    <span className="text-gray-900">$0</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-600">Seat upgrade (business)</span>
                                    <span className="text-gray-900">$199</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="text-gray-900">$702</span>
                                </div>
                                <div className="flex justify-between text-xs pb-2 border-b border-gray-200">
                                    <span className="text-gray-600">Taxes (9.4%)</span>
                                    <span className="text-gray-900">$66</span>
                                </div>

                                <div className="flex justify-between text-sm font-semibold pt-2">
                                    <span className="text-gray-900">Amount paid</span>
                                    <span className="text-gray-900">$768</span>
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white rounded-lg p-6 ">
                            <h3 className="text-base font-semibold text-gray-900 mb-4">Payment method</h3>

                            <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg p-5 text-white max-w-xs">
                                <div className="flex justify-between items-start mb-8">
                                    <div className="text-xl font-bold">VISA</div>
                                    <div className="text-[10px] opacity-90">Debit</div>
                                </div>
                                <div className="mb-4">
                                    <div className="text-sm">{passengerName}</div>
                                </div>
                                <div className="flex justify-between items-end">
                                    <div className="text-sm">•••• 9042</div>
                                    <div className="text-[10px] opacity-90">05/25</div>
                                </div>
                            </div>
                        </div>



                        {/* Share Itinerary */}
                        <div className="bg-white rounded-lg p-6  ">
                            <h3 className="text-base font-semibold text-gray-900 mb-2">Share your travel itinerary</h3>
                            <p className="text-xs text-gray-500 mb-4">
                                You can email your itinerary to anyone by entering their email address here.
                            </p>

                            <div className="space-y-4 w-full max-w-md">
                                <input
                                    type="email"
                                    placeholder="Email address"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                                />
                                <input
                                    type="email"
                                    placeholder="Email address"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                                />
                                <input
                                    type="email"
                                    placeholder="Email address"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                                />
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button className="flex-1 px-6 py-3 bg-indigo-600 text-white text-sm font-bold  active:scale-95 transition-all">
                                        Email itinerary
                                    </button>
                                    <button className="flex-1 px-6 py-3  text-indigo-600 text-sm font-bold  active:scale-95 transition-all">
                                        Add another
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Flight Route Map */}
                        <div >
                            <h3 className="text-base font-semibold text-gray-900 mb-4">Flight Route</h3>
                            <div className="bg-indigo-100 rounded-lg h-64 flex items-center justify-center relative overflow-hidden">
                                <div className="text-indigo-400 text-xs"><img src="/images/success.png" alt="" /></div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sidebar */}
                    <div className="lg:col-span-1 w-full max-w-[320px] mx-auto lg:mx-0 space-y-12">

                        {/* Shop Hotels Section */}
                        <div>
                            <h3 className="text-xl font-bold text-gray-600 mb-2">Shop <span className="text-indigo-600">hotels</span></h3>
                            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                                Tripma partners with thousands of hotels to get you the best deal. Save up to 30% when you add a hotel to your trip.
                            </p>

                            <div className="space-y-6">
                                {/* Hotel Cards */}
                                {[
                                    { title: "Ryokan Japan", price: "$439", desc: "Enjoy views of the garden from your room", img: "/images/img1.png" },
                                    { title: "Bessho SASA", price: "$529", desc: "Japanese ryokan with private onsen bath", img: "/images/img2.jpg" },
                                    { title: "HOTEL THE FLAG", price: "$139", desc: "Modern hotel in the heart of Osaka", img: "/images/img3.jpg" },
                                    { title: "9 Hours Shinjuku", price: "$59", desc: "A convenient capsule hotel at Shinjuku station", img: "/images/img1.png" }
                                ].map((hotel, i) => (
                                    <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
                                        <div className="h-40 relative">
                                            <img src={hotel.img} alt={hotel.title} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="p-4">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="font-medium text-gray-800 text-sm">{hotel.title}</h4>
                                                <span className="text-sm font-medium text-gray-800">{hotel.price}</span>
                                            </div>
                                            <p className="text-xs text-gray-400">{hotel.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button className="w-[60%] mx-auto block mt-6 px-6 py-3 border border-indigo-600 text-indigo-600 font-medium rounded hover:bg-indigo-50 transition-colors text-sm">
                                Shop all hotels
                            </button>
                        </div>

                        {/* Unique Experiences Section */}
                        <div>
                            <h3 className="text-xl font-bold text-gray-600 mb-2">Find unique <span className="text-indigo-600">experiences</span></h3>
                            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                                Find events and authentic cultural experiences available exclusively to Tripma users.
                            </p>

                            <div className="space-y-6">
                                {[
                                    { title: "Nihon Kimono", price: "$89", desc: "Wear the national dress of Japan around the city", img: "/images/img2.jpg" },
                                    { title: "teamLab Borderless", price: "$39", desc: "A modern sensory experience of light and sound", img: "/images/img3.jpg" }
                                ].map((exp, i) => (
                                    <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
                                        <div className="h-40 relative">
                                            <img src={exp.img} alt={exp.title} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="p-4">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="font-medium text-gray-800 text-sm">{exp.title}</h4>
                                                <span className="text-sm font-medium text-gray-800">{exp.price}</span>
                                            </div>
                                            <p className="text-xs text-gray-400">{exp.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button className="w-[60%] mx-auto block mt-6 px-6 py-3 border border-indigo-600 text-indigo-600 font-medium rounded hover:bg-indigo-50 transition-colors text-sm">
                                View all experiences
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
