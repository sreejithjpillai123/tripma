"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Footer from '@/components/Footer';
import FlightSummary from '@/components/FlightSummary';
import flightsData from '../../../data/flights.json';

export default function PassengerPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const flightIds = searchParams.get('flights')?.split(',') || [];

    // Find the flight objects from data
    const selectedFlights = flightsData.filter(f => flightIds.includes(f.id.toString()));

    const [passengerData, setPassengerData] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        suffix: '',
        dob: '',
        email: '',
        phone: '',
        redressNumber: '',
        knownTravelerNumber: '',
        emergencyFirstName: '',
        emergencyLastName: '',
        emergencyEmail: '',
        emergencyPhone: '',
        sameAsPassenger: false,
        bagChecked: 1
    });

    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setPassengerData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\+?[\d\s-]{10,}$/; // Basic phone validation

        // Passenger 1 Validation
        if (!passengerData.firstName.trim()) newErrors.firstName = "First name is required";
        if (!passengerData.lastName.trim()) newErrors.lastName = "Last name is required";
        if (!passengerData.dob.trim()) newErrors.dob = "Date of birth is required";

        if (!passengerData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!emailRegex.test(passengerData.email)) {
            newErrors.email = "Invalid email format";
        }

        if (!passengerData.phone.trim()) {
            newErrors.phone = "Phone is required";
        } else if (!phoneRegex.test(passengerData.phone)) {
            newErrors.phone = "Invalid phone format";
        }

        if (!passengerData.knownTravelerNumber.trim()) newErrors.knownTravelerNumber = "Known traveler number is required"; // Marked with * in UI

        // Emergency Contact Validation
        if (!passengerData.emergencyFirstName.trim()) newErrors.emergencyFirstName = "First name is required";
        if (!passengerData.emergencyLastName.trim()) newErrors.emergencyLastName = "Last name is required";

        if (!passengerData.emergencyEmail.trim()) {
            newErrors.emergencyEmail = "Email is required";
        } else if (!emailRegex.test(passengerData.emergencyEmail)) {
            newErrors.emergencyEmail = "Invalid email format";
        }

        if (!passengerData.emergencyPhone.trim()) {
            newErrors.emergencyPhone = "Phone is required";
        } else if (!phoneRegex.test(passengerData.emergencyPhone)) {
            newErrors.emergencyPhone = "Invalid phone format";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            alert("Form submitted successfully! (Placeholder for Save action)");
            // Proceed with next steps (e.g., API call, navigation)
        } else {
            // Scroll to top or first error could be added here
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleSelectSeats = () => {
        if (validateForm()) {
            const passengerName = `${passengerData.firstName} ${passengerData.lastName}`;
            const query = `flights=${flightIds.join(',')}&p1=${encodeURIComponent(passengerName)}&email=${encodeURIComponent(passengerData.email)}`;
            router.push(`/seats?${query}`);
        } else {
            alert("Please fill in all required fields correctly.");
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        if (passengerData.sameAsPassenger) {
            setPassengerData(prev => ({
                ...prev,
                emergencyFirstName: prev.firstName,
                emergencyLastName: prev.lastName,
                emergencyEmail: prev.email,
                emergencyPhone: prev.phone
            }));
        } else if (!passengerData.sameAsPassenger && passengerData.emergencyFirstName === passengerData.firstName) {
            // Clear if unchecked? Or keep? Keeping is usually better UX, avoiding data loss.
            // But for strict "linked" behavior, maybe clear. Let's just update on check.
        }
    }, [passengerData.sameAsPassenger, passengerData.firstName, passengerData.lastName, passengerData.email, passengerData.phone]);


    return (
        <div className="min-h-screen bg-white text-gray-800">
            <main className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

                    {/* Left Column: Form */}
                    <div className="md:col-span-2 space-y-8 max-w-2xl">

                        <div className="text-center md:text-left">
                            <h1 className="text-2xl sm:text-3xl font-bold text-indigo-600 mb-2">Passenger information</h1>
                            <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
                                Enter the required information for each traveler and be sure that it exactly matches the government-issued ID presented at the airport.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-lg font-medium text-gray-600 mb-4">Passenger 1 (Adult)</h2>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="flex flex-col">
                                        <input type="text" name="firstName" placeholder="First name*" className={`border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded px-4 py-3 w-full focus:border-indigo-500 outline-none`} value={passengerData.firstName} onChange={handleInputChange} />
                                        {errors.firstName && <span className="text-red-500 text-xs mt-1">{errors.firstName}</span>}
                                    </div>
                                    <div className="flex flex-col">
                                        <input type="text" name="middleName" placeholder="Middle" className="border border-gray-300 rounded px-4 py-3 w-full focus:border-indigo-500 outline-none" value={passengerData.middleName} onChange={handleInputChange} />
                                    </div>
                                    <div className="flex flex-col">
                                        <input type="text" name="lastName" placeholder="Last name*" className={`border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded px-4 py-3 w-full focus:border-indigo-500 outline-none`} value={passengerData.lastName} onChange={handleInputChange} />
                                        {errors.lastName && <span className="text-red-500 text-xs mt-1">{errors.lastName}</span>}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input type="text" name="suffix" placeholder="Suffix" className="border border-gray-300 rounded px-4 py-3 w-full focus:border-indigo-500 outline-none" value={passengerData.suffix} onChange={handleInputChange} />
                                    <div className="relative flex flex-col">
                                        <input type="text" name="dob" placeholder="Date of birth*" className={`border ${errors.dob ? 'border-red-500' : 'border-gray-300'} rounded px-4 py-3 w-full focus:border-indigo-500 outline-none`} value={passengerData.dob} onChange={handleInputChange} />
                                        <span className="text-xs text-gray-400 absolute right-4 top-1/2 transform -translate-y-1/2">MM/DD/YY</span>
                                        {errors.dob && <span className="text-red-500 text-xs mt-1">{errors.dob}</span>}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex flex-col">
                                        <input type="email" name="email" placeholder="Email address*" className={`border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded px-4 py-3 w-full focus:border-indigo-500 outline-none`} value={passengerData.email} onChange={handleInputChange} />
                                        {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email}</span>}
                                    </div>
                                    <div className="flex flex-col">
                                        <input type="tel" name="phone" placeholder="Phone number*" className={`border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded px-4 py-3 w-full focus:border-indigo-500 outline-none`} value={passengerData.phone} onChange={handleInputChange} />
                                        {errors.phone && <span className="text-red-500 text-xs mt-1">{errors.phone}</span>}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input type="text" name="redressNumber" placeholder="Redress number" className="border border-gray-300 rounded px-4 py-3 w-full focus:border-indigo-500 outline-none" value={passengerData.redressNumber} onChange={handleInputChange} />
                                    <div className="flex flex-col">
                                        <input type="text" name="knownTravelerNumber" placeholder="Known traveller number*" className={`border ${errors.knownTravelerNumber ? 'border-red-500' : 'border-gray-300'} rounded px-4 py-3 w-full focus:border-indigo-500 outline-none`} value={passengerData.knownTravelerNumber} onChange={handleInputChange} />
                                        {errors.knownTravelerNumber && <span className="text-red-500 text-xs mt-1">{errors.knownTravelerNumber}</span>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-lg font-medium text-gray-600 mb-4">Emergency contact information</h2>
                            <div className="flex items-center gap-2 mb-4">
                                <input
                                    type="checkbox"
                                    id="sameAsPassenger"
                                    name="sameAsPassenger"
                                    checked={passengerData.sameAsPassenger}
                                    onChange={handleInputChange}
                                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                />
                                <label htmlFor="sameAsPassenger" className="text-gray-500 text-sm select-none cursor-pointer">Same as Passenger 1</label>
                            </div>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex flex-col">
                                        <input type="text" name="emergencyFirstName" placeholder="First name*" className={`border ${errors.emergencyFirstName ? 'border-red-500' : 'border-gray-300'} rounded px-4 py-3 w-full focus:border-indigo-500 outline-none`} value={passengerData.emergencyFirstName} onChange={handleInputChange} />
                                        {errors.emergencyFirstName && <span className="text-red-500 text-xs mt-1">{errors.emergencyFirstName}</span>}
                                    </div>
                                    <div className="flex flex-col">
                                        <input type="text" name="emergencyLastName" placeholder="Last name*" className={`border ${errors.emergencyLastName ? 'border-red-500' : 'border-gray-300'} rounded px-4 py-3 w-full focus:border-indigo-500 outline-none`} value={passengerData.emergencyLastName} onChange={handleInputChange} />
                                        {errors.emergencyLastName && <span className="text-red-500 text-xs mt-1">{errors.emergencyLastName}</span>}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex flex-col">
                                        <input type="email" name="emergencyEmail" placeholder="Email address*" className={`border ${errors.emergencyEmail ? 'border-red-500' : 'border-gray-300'} rounded px-4 py-3 w-full focus:border-indigo-500 outline-none`} value={passengerData.emergencyEmail} onChange={handleInputChange} />
                                        {errors.emergencyEmail && <span className="text-red-500 text-xs mt-1">{errors.emergencyEmail}</span>}
                                    </div>
                                    <div className="flex flex-col">
                                        <input type="tel" name="emergencyPhone" placeholder="Phone number*" className={`border ${errors.emergencyPhone ? 'border-red-500' : 'border-gray-300'} rounded px-4 py-3 w-full focus:border-indigo-500 outline-none`} value={passengerData.emergencyPhone} onChange={handleInputChange} />
                                        {errors.emergencyPhone && <span className="text-red-500 text-xs mt-1">{errors.emergencyPhone}</span>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-lg font-medium text-gray-600 mb-4">Bag information</h2>
                            <p className="text-gray-500 text-sm mb-6 leading-relaxed text-[16px]">
                                Each passenger is allowed one free carry-on bag and one personal item. First checked bag for each passenger is also free. Second bag check fees are waived for loyalty program members. See the <a href="#" className="text-indigo-600">full bag policy</a>.
                            </p>

                            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                                <div className="col-span-1 text-gray-500 font-medium">Passenger 1</div>
                                <div className="col-span-1 text-gray-500 font-medium text-center">Checked bags</div>

                                <div className="col-span-1 text-gray-800">First Last</div>
                                <div className="col-span-1 flex items-center justify-center gap-4">
                                    <button
                                        className="w-8 h-8 flex items-center justify-center rounded bg-gray-100 text-gray-500 hover:bg-gray-200"
                                        onClick={() => setPassengerData(prev => ({ ...prev, bagChecked: Math.max(0, prev.bagChecked - 1) }))}
                                    >
                                        −
                                    </button>
                                    <span className="text-gray-800 font-medium">{passengerData.bagChecked}</span>
                                    <button
                                        className="w-8 h-8 flex items-center justify-center rounded bg-gray-100 text-indigo-600 hover:bg-gray-200"
                                        onClick={() => setPassengerData(prev => ({ ...prev, bagChecked: prev.bagChecked + 1 }))}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-8">
                            <button
                                onClick={handleSubmit}
                                className="w-full sm:w-auto px-8 py-3 border-2 border-indigo-600 text-indigo-600 font-bold "
                            >
                                Save and close
                            </button>
                            <button
                                onClick={handleSelectSeats}
                                className="w-full sm:w-auto px-8 py-3 bg-indigo-600 text-white font-bold  active:scale-95"
                            >
                                Select seats
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Flight Summary */}
                    <div className="md:col-span-1 mt-[150px]">
                        <FlightSummary
                            selectedFlights={selectedFlights}
                            onActionClick={() => { /* Select seats logic? Or maybe this button acts as "Next" */ }}
                            actionLabel="Select seats"
                        />
                        {/* Luggage Image */}
                        <div className="mt-12 flex justify-center">
                            <img
                                src="/images/Luggage.png"
                                alt="Luggage"
                                className="w-full max-w-[300px] object-contain"
                            />
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
