"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Footer from '@/components/Footer';
import flightsData from '../../../data/flights.json';


export default function UserProfilePage() {
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || "";
    const [orderHistory, setOrderHistory] = useState([]);

    const [apiBookings, setApiBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchBookings() {
            if (typeof window !== 'undefined' && email) {
                try {
                    // 1. Fetch from API (File System)
                    const res = await fetch('/api/bookings');
                    const allBookings = await res.json();
                    const userApiBookingsCode = allBookings[email] || [];

                    const hydratedApiBookings = userApiBookingsCode.map(booking => {
                        if (booking.flights) return booking; // Already hydrated or legacy
                        const hydratedFlights = (booking.flightIds || []).map(id =>
                            flightsData.find(f => f.id.toString() === id.toString())
                        ).filter(Boolean);
                        return { ...booking, flights: hydratedFlights };
                    });

                    setApiBookings(hydratedApiBookings);
                } catch (e) {
                    console.error("Failed to fetch bookings", e);
                } finally {
                    setLoading(false);
                }
            }
        }
        fetchBookings();
    }, [email]);

    useEffect(() => {
        if (!loading && typeof window !== 'undefined' && email) {
            // 2. Get dynamic bookings from localStorage
            const localDataStr = localStorage.getItem('tripma_bookings');
            const localBookingsMap = localDataStr ? JSON.parse(localDataStr) : {};
            const localData = localBookingsMap[email] || [];

            // 3. Merge and deduplicate (by confirmation ID)
            // API takes precedence/is equal to local storage, they should ideally be synced.
            // We combine both to ensure maximum data availability.
            const combined = [...localData, ...apiBookings];
            const uniqueBookings = combined.reduce((acc, current) => {
                const x = acc.find(item => item.id === current.id);
                if (!x) {
                    return acc.concat([current]);
                } else {
                    return acc;
                }
            }, []);

            setOrderHistory(uniqueBookings);
        }
    }, [loading, email, apiBookings]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Upcoming': return 'bg-teal-100 text-teal-700';
            case 'Completed': return 'bg-gray-100 text-gray-600';
            case 'Cancelled': return 'bg-red-100 text-red-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <main className="flex-grow max-w-5xl mx-auto px-4 py-12 w-full">
                <div className="space-y-8">
                    {/* Header */}
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Flight History</h1>
                        {email && (
                            <p className="text-gray-500 mt-2 font-medium">
                                Showing bookings for <span className="text-indigo-600 font-bold">{email}</span>
                            </p>
                        )}
                    </div>

                    {/* Booking List */}
                    <div className="space-y-6">
                        {orderHistory.map((order) => (
                            <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden ">
                                {/* Order Header */}
                                <div className="px-8 py-5 bg-gray-50/80 border-b border-gray-100 flex flex-wrap justify-between items-center gap-6">
                                    <div className="flex items-center gap-8">
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-extrabold mb-1">Confirmation</p>
                                            <p className="text-sm font-mono font-bold text-gray-800">{order.id}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-extrabold mb-1">Booked On</p>
                                            <p className="text-sm font-bold text-gray-800">{order.date}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-extrabold mb-1">Status</p>
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-extrabold mb-1">Total</p>
                                        <p className="text-lg font-black text-indigo-600">${order.total}</p>
                                    </div>
                                </div>

                                {/* Order Flights */}
                                <div className="p-8 space-y-8">
                                    {order.flights.map((flight, idx) => (
                                        <div key={idx} className={`flex flex-col md:flex-row items-center gap-8 ${idx !== order.flights.length - 1 ? 'pb-8 border-b border-dashed border-gray-100' : ''}`}>
                                            <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-lg flex-shrink-0">
                                                {flight?.airline?.charAt(0)}
                                            </div>

                                            <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-center md:text-left">
                                                <div>
                                                    <p className="text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">{flight?.airline}</p>
                                                    {/* <p className="text-xl font-black text-gray-900 mb-1">{flight?.departureTime} - {flight?.arrivalTime}</p> */}
                                                    <div className="flex items-center justify-center md:justify-start gap-2">
                                                        <span className="text-xs font-black text-gray-700">{flight?.origin?.code}</span>
                                                        <svg className="w-3 h-3 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                                        <span className="text-xs font-black text-gray-700">{flight?.destination?.code}</span>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col justify-center">
                                                    <p className="text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">Duration</p>
                                                    <p className="text-sm font-bold text-gray-700">{flight?.duration}</p>
                                                    <p className="text-[10px] font-bold text-indigo-400 uppercase">{flight?.stops}</p>
                                                </div>

                                                <div className="flex flex-col justify-center">
                                                    <p className="text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">Flight Number</p>
                                                    <p className="text-sm font-mono font-bold text-gray-700">{flight?.flightNumber}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {orderHistory.length === 0 && (
                            <div className="bg-white rounded-3xl p-24 text-center border-2">
                                <h3 className="text-2xl font-black text-gray-800 mb-2 tracking-tight">No Bookings Found</h3>
                                <p className="text-sm font-medium text-gray-400 mb-10">We couldn't find any flight history for {email || 'this account'}.</p>
                                <Link href="/" className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-xl uppercase tracking-widest">
                                    Find a Flight
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
