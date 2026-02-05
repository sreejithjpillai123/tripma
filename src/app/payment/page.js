"use client";

import React, { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import flightsData from '../../../data/flights.json';
import Footer from '@/components/Footer';

// Icons
const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);

const InfoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export default function PaymentPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const flightIds = searchParams.get('flights')?.split(',') || [];
    const passengerName = searchParams.get('p1') || "Guest";
    const selectedSeat = searchParams.get('seat') || "9F";
    const email = searchParams.get('email') || "";

    // Load flight data
    const selectedFlights = flightsData.filter(f => flightIds.includes(f.id.toString()));

    // State
    const [paymentMethod, setPaymentMethod] = useState('credit-card');
    const [saveCard, setSaveCard] = useState(false);
    const [formData, setFormData] = useState({
        nameOnCard: '',
        cardNumber: '',
        expirationDate: '',
        cvv: '',
        email: '',
        password: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Calculate pricing
    const subtotal = selectedFlights.reduce((sum, flight) => sum + (flight.price || 500), 0);
    const taxesAndFees = Math.round(subtotal * 0.12);
    const total = subtotal + taxesAndFees;

    // Form Validation
    const isCreditCardValid =
        formData.nameOnCard.trim() !== '' &&
        formData.cardNumber.trim() !== '' &&
        formData.expirationDate.trim() !== '' &&
        formData.cvv.trim() !== '';

    const isFormValid = paymentMethod === 'credit-card' ? isCreditCardValid : true;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Left Column: Payment Form */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Payment Method */}
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">Payment method</h2>
                            <p className="text-sm text-gray-500 mb-6">
                                Select a payment method below. Tripma processes your payment securely with end-to-end encryption.
                            </p>

                            {/* Payment Method Buttons */}
                            <div className="flex flex-wrap md:flex-nowrap border border-indigo-200 rounded-lg overflow-hidden mb-8 min-h-[48px] w-[700px]">

                                {[
                                    { id: 'credit-card', label: 'Credit card', icon: <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> },
                                    { id: 'google-pay', label: 'Google Pay', icon: <span className="font-bold text-lg leading-none">G</span> },
                                    { id: 'apple-pay', label: 'Apple pay', icon: <span className="text-xl leading-none"></span> },
                                    { id: 'paypal', label: 'Paypal', icon: <span className="font-bold italic text-lg leading-none">P</span> },
                                    { id: 'crypto', label: 'Crypto', icon: <div className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center text-[10px] font-bold">B</div> }
                                ].map((method, idx, arr) => (
                                    <button
                                        key={method.id}
                                        onClick={() => setPaymentMethod(method.id)}
                                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-all min-w-[120px] md:min-w-0 ${paymentMethod === method.id
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-white text-indigo-400 hover:bg-indigo-50'
                                            } ${idx !== arr.length - 1 ? 'border-r border-indigo-100' : ''}`}
                                    >
                                        {method.icon}
                                        <span>{method.label}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Credit Card Form */}
                            {paymentMethod === 'credit-card' && (
                                <>
                                    <h3 className="text-base font-medium text-gray-800 mb-4">Credit card details</h3>

                                    <div className="flex items-start gap-2 mb-4 p-3 rounded text-sm text-indigo-700">
                                        <InfoIcon />
                                        <span>Billing address is same as Passenger 1</span>
                                    </div>

                                    <div className="space-y-4 w-full max-w-md">
                                        <div>
                                            <input
                                                type="text"
                                                name="nameOnCard"
                                                placeholder="Name on card"
                                                className="w-full border border-gray-300 rounded px-4 py-3 focus:border-indigo-500 outline-none"
                                                value={formData.nameOnCard}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div>
                                            <input
                                                type="text"
                                                name="cardNumber"
                                                placeholder="Card number"
                                                className="w-full border border-gray-300 rounded px-4 py-3 focus:border-indigo-500 outline-none"
                                                value={formData.cardNumber}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <input
                                                type="text"
                                                name="expirationDate"
                                                placeholder="Expiration date"
                                                className="border border-gray-300 rounded px-4 py-3 focus:border-indigo-500 outline-none"
                                                value={formData.expirationDate}
                                                onChange={handleInputChange}
                                            />
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    name="cvv"
                                                    placeholder="CVV"
                                                    className="w-full border border-gray-300 rounded px-4 py-3 focus:border-indigo-500 outline-none"
                                                    value={formData.cvv}
                                                    onChange={handleInputChange}
                                                />
                                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                                    <InfoIcon />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Create an Account */}
                        <div >
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">Create an account</h2>
                            <p className="text-sm text-gray-500 mb-6 max-w-2xl">
                                Tripma is free to use as a guest, but if you create an account today, you can save and view flights, manage your trips, earn rewards and more.
                            </p>

                            <div className="flex items-center gap-2 mb-6">
                                <input
                                    type="checkbox"
                                    id="saveCard"
                                    checked={saveCard}
                                    onChange={(e) => setSaveCard(e.target.checked)}
                                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                />
                                <label htmlFor="saveCard" className="text-sm text-gray-700">
                                    Save card and create account for later
                                </label>
                            </div>

                            <div className="space-y-4 mb-6 w-full max-w-md">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email address or phone number"
                                    className="w-full border border-gray-300 rounded px-4 py-3 focus:border-indigo-500 outline-none"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                />
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    className="w-full border border-gray-300 rounded px-4 py-3 focus:border-indigo-500 outline-none"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                />
                            </div>

                            {/* Social Login */}
                            <div className="space-y-3 w-full max-w-md">
                                <button className="w-full border border-blue px-4 py-3 text-sm  text-blue-700  flex items-center justify-center gap-2 active:scale-95   ">
                                    <span className="text-lg"><img src="/images/google.png" alt="" /></span> Sign up with Google
                                </button>
                                <button className="w-full border border-blue px-4 py-3 text-sm  text-blue-700  flex items-center justify-center gap-2 active:scale-95">
                                    <span className="text-lg"><img src="/images/apple.png" alt="" /></span> Continue with Apple
                                </button>
                                <button className="w-full border border-blue  px-4 py-3 text-sm  text-blue-700  flex items-center justify-center gap-2 active:scale-95">
                                    <span className="text-lg"><img src="/images/facebook.png" alt="" /></span> Continue with Facebook
                                </button>
                            </div>
                        </div>

                        {/* Cancellation Policy */}
                        <div >
                            <h3 className="text-base font-medium text-gray-800 mb-3">Cancellation policy</h3>
                            <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">
                                This flight has a flexible cancellation policy. If you cancel or change your flight up to 30 days before the departure date, you are eligible for a free refund. All flights booked on Tripma are backed by our satisfaction guarantee, however cancellation policies vary by airline. See the full cancellation policy for this flight.
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <button
                                onClick={() => router.back()}
                                className="w-full sm:w-auto px-8 py-3 border-2 border-indigo-600 text-indigo-600 font-bold   active:scale-95"
                            >
                                Back to seat select
                            </button>
                            <button
                                disabled={!isFormValid}
                                onClick={() => {
                                    if (!isFormValid) return;
                                    const finalEmail = formData.email || email;
                                    router.push(`/success?flights=${flightIds.join(',')}&p1=${encodeURIComponent(passengerName)}&seat=${selectedSeat}&email=${encodeURIComponent(finalEmail)}`)
                                }}
                                className={`w-full sm:w-auto px-12 py-3 font-bold rounded-xl transition-all ${isFormValid
                                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100 active:scale-95'
                                    : 'bg-gray-100 text-gray-400 border border-gray-300 cursor-not-allowed'
                                    }`}
                            >
                                Confirm and pay
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Price Summary */}
                    <div className="lg:col-span-1">
                        <div className="border border-gray-200  p-5 bg-white  mb-6">
                            {/* Flight Summary */}
                            {selectedFlights.map((flight, index) => (
                                <div key={flight.id} className={`${index !== selectedFlights.length - 1 ? 'border-b border-gray-100 mb-6 pb-6' : ''}`}>
                                    <div className="flex items-start justify-between">
                                        <div className="flex gap-4">
                                            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 relative">
                                                {/* Use image if available, else fallback to colored div */}
                                                <div className="w-full h-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                                                    {flight.airline?.charAt(0) || 'HA'}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-base font-medium text-gray-800">
                                                    {flight.airline || 'Hawaiian Airlines'}
                                                </div>
                                                <div className="text-sm text-indigo-400 mt-1">
                                                    {flight.flightNumber || `FIG4312`}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-base font-normal text-gray-800">16h 45m (+1d)</div>
                                            <div className="text-base font-normal text-gray-800 mt-1">{flight.departureTime || '7:00 AM'} - {flight.arrivalTime || '4:15 PM'}</div>
                                            <div className="text-sm text-gray-400 mt-1">2h 45m in HNL</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Price Breakdown */}
                        <div className="flex flex-col items-end space-y-3 mb-8 px-2">
                            <div className="flex items-center justify-end gap-16 text-gray-600 w-full">
                                <span>Seat upgrade</span>
                                <span className="font-medium text-gray-900 w-16 text-right">$199</span>
                            </div>
                            <div className="flex items-center justify-end gap-16 text-gray-600 w-full">
                                <span>Subtotal</span>
                                <span className="font-medium text-gray-900 w-16 text-right">${subtotal}</span>
                            </div>
                            <div className="flex items-center justify-end gap-16 text-gray-600 w-full">
                                <span>Taxes and Fees</span>
                                <span className="font-medium text-gray-900 w-16 text-right">${taxesAndFees}</span>
                            </div>
                            <div className="flex items-center justify-end gap-16 text-lg font-semibold text-gray-800 pt-2 w-full">
                                <span>Total</span>
                                <span className="w-16 text-right">${total}</span>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                disabled={!isFormValid}
                                onClick={() => {
                                    if (!isFormValid) return;
                                    const finalEmail = formData.email || email;
                                    router.push(`/success?flights=${flightIds.join(',')}&p1=${encodeURIComponent(passengerName)}&seat=${selectedSeat}&email=${encodeURIComponent(finalEmail)}`)
                                }}
                                className={`px-8 py-3 font-medium rounded-lg transition-colors ${isFormValid
                                    ? 'bg-indigo-600 text-white '
                                    : 'bg-gray-100 text-gray-400 border border-gray-300 cursor-not-allowed'
                                    }`}
                            >
                                Confirm and pay
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
