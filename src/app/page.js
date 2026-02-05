"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Footer from '@/components/Footer';
import DatePicker from '@/components/DatePicker';
import TravelersSelector from '@/components/TravelersSelector';
import flightsData from '../../data/flights.json';
import { useEffect, useRef } from 'react';
// ... existing imports




// Simple SVG Icons for the search bar
const TakeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2.293-2.293c.63-.63 1.71-.18 1.71.71v.586l-1 1A2 2 0 0012 5H5v14z" /> {/* Simplified */}
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);

const LandingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    {/* Needs rotation for landing effect, but using same plane for now to keep it simple or rotate via CSS */}
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








// ... existing imports

export default function Home() {
  const router = useRouter();
  const [showFrom, setShowFrom] = useState(false);
  const [fromValue, setFromValue] = useState("");
  const airports = ["SFO", "ATL", "LAX", "STL", "PVG", "MSP", "NRT", "JFK"];

  const [showTo, setShowTo] = useState(false);
  const [tovalue, setToValue] = useState("");
  const airportsTo = ["JFK", "NRT", "LAX", "STL", "PVG", "MSP", "SFO"];

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateValue, setDateValue] = useState("");
  const [rawDate, setRawDate] = useState(null);

  const [showTravelers, setShowTravelers] = useState(false);
  const [adults, setAdults] = useState(1);
  const [minors, setMinors] = useState(0);

  const fromRef = useRef(null);
  const toRef = useRef(null);
  const dateRef = useRef(null);
  const travelersRef = useRef(null);

  const handleSearch = () => {
    // Construct search query
    const params = new URLSearchParams();
    if (fromValue) params.append('from', fromValue);
    if (tovalue) params.append('to', tovalue);

    router.push(`/search?${params.toString()}`);
  };


  const getTravelersText = () => {
    let text = `${adults} Adult${adults !== 1 ? 's' : ''}`;
    if (minors > 0) {
      text += `, ${minors} Minor${minors !== 1 ? 's' : ''}`;
    }
    return text;
  };


  useEffect(() => {
    function handleClickOutside(e) {
      if (fromRef.current && !fromRef.current.contains(e.target)) {
        setShowFrom(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  useEffect(() => {
    function handleClickOutside(e) {
      if (toRef.current && !toRef.current.contains(e.target)) {
        setShowTo(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  useEffect(() => {
    function handleClickOutside(e) {
      if (dateRef.current && !dateRef.current.contains(e.target)) {
        setShowDatePicker(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  useEffect(() => {
    function handleClickOutside(e) {
      if (travelersRef.current && !travelersRef.current.contains(e.target)) {
        setShowTravelers(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  return (
    <main className="min-h-screen relative flex flex-col items-center pt-20 px-4">
      {/* Background Map Placeholder - Using a faint gradient or SVG pattern if possible, 
          but for now relying on cleanwhitespace as requested per "fresh start" */}
      <div className="absolute inset-0 -z-10 bg-slate-50 overflow-hidden">
        {/* Abstract map-like decorative elements could go here */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-20 right-10 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      <h1 className="text-center text-4xl sm:text-5xl md:text-7xl font-bold text-indigo-500 mb-2 leading-tight px-2">
        It's more than <br className="hidden sm:block" />
        <span className="text-indigo-600">just a trip</span>
      </h1>

      <div className="mt-16 w-full max-w-6xl bg-white rounded-xl shadow-md h-16 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-200 overflow-visible bg-">





        {/* From */}
        <div ref={fromRef} className={`relative flex-1 flex items-center px-4 py-4 gap-3 ${showFrom ? 'bg-indigo-50/10 ring-2 ring-indigo-600 z-10' : 'hover:bg-gray-50'}`}>
          <TakeOffIcon />
          <div className="flex flex-col w-full" onClick={() => setShowFrom(!showFrom)}>
            <input
              type="text"
              value={fromValue}
              onChange={(e) => setFromValue(e.target.value)}
              placeholder="From where?"
              className="outline-none text-gray-700 placeholder-gray-500 font-medium bg-transparent w-full cursor-pointer"
              readOnly
            />
          </div>
          {/* Dropdown */}
          {showFrom && (
            <div className="absolute top-full left-0 w-full bg-white shadow-xl rounded-b-lg border border-indigo-100 mt-1 z-50 max-h-60 overflow-y-auto scrollbar-hide">
              {airports.map((airport) => (
                <div
                  key={airport}
                  className="px-4 py-2 hover:bg-indigo-600 hover:text-white text-gray-700 font-medium transition-colors"
                  onClick={() => {
                    setFromValue(airport);
                    setShowFrom(false);
                  }}
                >
                  {airport}
                </div>
              ))}
            </div>
          )}
        </div>






        {/* To */}
        <div ref={toRef} className={`relative flex-1 flex items-center px-4 py-4 gap-3 cursor-pointer ${showTo ? 'bg-indigo-50/10 ring-2 ring-indigo-600 z-10' : 'hover:bg-gray-50'}`}>
          <LandingIcon />
          <div className="flex flex-col w-full" onClick={() => setShowTo(!showTo)}>
            <input
              type="text"
              value={tovalue}
              onChange={(e) => setToValue(e.target.value)}
              placeholder="Where to?"
              className="outline-none text-gray-700 placeholder-gray-500 font-medium bg-transparent w-full cursor-pointer"
              readOnly
            />
          </div>
          {/* Dropdown */}
          {showTo && (
            <div className="absolute top-full left-0 w-full bg-white shadow-xl rounded-b-lg border border-indigo-100 mt-1 z-50 max-h-60 overflow-y-auto scrollbar-hide">
              {airportsTo.map((airport) => (
                <div
                  key={airport}
                  className="px-4 py-2 hover:bg-indigo-600 hover:text-white text-gray-700 font-medium transition-colors"
                  onClick={() => {
                    setToValue(airport);
                    setShowTo(false);
                  }}
                >
                  {airport}
                </div>
              ))}
            </div>
          )}
        </div>









        {/* Date */}
        <div ref={dateRef} className={`relative flex-1 flex items-center px-4 py-4 gap-3 cursor-pointer ${showDatePicker ? 'bg-indigo-50/10 ring-2 ring-indigo-600 z-10' : 'hover:bg-gray-50'}`}>
          <CalendarIcon />
          <div className="flex flex-col w-full" onClick={() => setShowDatePicker(!showDatePicker)}>
            <input
              type="text"
              value={dateValue}
              onChange={(e) => setDateValue(e.target.value)}
              placeholder="Depart - Return"
              className="outline-none text-gray-700 placeholder-gray-500 font-medium bg-transparent w-full cursor-pointer"
              readOnly
            />
          </div>
          {/* Date Picker Dropdown */}
          {showDatePicker && (
            <div className="absolute top-full right-0 md:left-0 mt-2 z-50">
              <DatePicker
                onClose={() => setShowDatePicker(false)}
                onSelect={(value, startDate, endDate) => {
                  setDateValue(value);
                  setRawDate(startDate);
                }}
              />
            </div>
          )}
        </div>









        {/* Travelers */}
        <div ref={travelersRef} className={`relative flex-1 flex items-center px-4 py-4 gap-3 cursor-pointer ${showTravelers ? 'bg-indigo-50/10 ring-2 ring-indigo-600 z-10' : 'hover:bg-gray-50'}`}>
          <UserIcon />
          <div className="flex flex-col w-full" onClick={() => setShowTravelers(!showTravelers)}>
            <input
              type="text"
              value={getTravelersText()}
              readOnly
              className="outline-none text-gray-700 placeholder-gray-500 font-medium bg-transparent w-full cursor-pointer"
            />
          </div>
          {/* Travelers Dropdown */}
          {showTravelers && (
            <div className="absolute top-full right-0 mt-1 z-50">
              <TravelersSelector
                adults={adults}
                setAdults={setAdults}
                minors={minors}
                setMinors={setMinors}
              />
            </div>
          )}
        </div>










        {/* Search Button */}
        <div className="p-1.5 md:my-0">
          <button
            onClick={handleSearch}
            className="h-full w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-8 rounded-md transition-colors shadow-sm"
          >
            Search
          </button>
        </div>

      </div>


      {/* Flight Deals Section */}
      <section className="w-full max-w-6xl mt-24 pb-20">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-xl md:text-2xl text-gray-500 font-medium mt-30">
            Find your next adventure with these <span className="text-indigo-600 font-semibold">flight deals</span>
          </h2>
          <a href="#" className="flex items-center text-gray-400 hover:text-indigo-600 transition-colors cursor-pointer">
            All <span className="ml-2 text-xl">→</span>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Card 1 */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
            <div className="h-64 bg-gray-200 relative">
              <img src="https://images.unsplash.com/photo-1548013146-72479768bada?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80" alt="Shanghai" className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-gray-600 font-medium">The Bund, <span className="text-indigo-600">Shanghai</span></h3>
                <span className="text-gray-800 font-medium">$598</span>
              </div>
              <p className="text-sm text-gray-400">China's most international city</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
            <div className="h-64 bg-gray-200 relative">
              <img src="https://i.natgeofe.com/n/8eba070d-14e5-4d07-8bab-9db774029063/93080_4x3.jpg" />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-gray-600 font-medium">Sydney Opera House, <span className="text-indigo-600">Sydney</span></h3>
                <span className="text-gray-800 font-medium">$981</span>
              </div>
              <p className="text-sm text-gray-400">Take a stroll along the famous harbor</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
            <div className="h-64 bg-gray-200 relative">
              <img src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80" alt="Kyoto" className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-gray-600 font-medium">Kōdaiji Temple, <span className="text-indigo-600">Kyoto</span></h3>
                <span className="text-gray-800 font-medium">$633</span>
              </div>
              <p className="text-sm text-gray-400">Step back in time in the Gion district</p>
            </div>
          </div>
        </div>

        {/* Full Width Card */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
          <div className="h-96 bg-gray-200 relative">
            <img src="https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80" alt="Kenya" className="w-full h-full object-cover" />
          </div>
          <div className="p-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-gray-600 font-medium text-lg">Tsavo East National Park, <span className="text-indigo-600">Kenya</span></h3>
              <span className="text-gray-800 font-medium text-lg">$1,248</span>
            </div>
            <p className="text-sm text-gray-400 ">Named after the Tsavo River, and opened in April 1984, Tsavo East National Park is one of the oldest parks in Kenya. It is located in the semi-arid Taru Desert.</p>
          </div>
        </div>

      </section>

      {/* Places to Stay Section */}
      <section className="w-full max-w-6xl pb-20">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-xl md:text-2xl text-gray-500 font-medium">
            Explore unique <span className="text-teal-400 font-semibold">places to stay</span>
          </h2>
          <a href="#" className="flex items-center text-gray-400 hover:text-teal-400 transition-colors cursor-pointer">
            All <span className="ml-2 text-xl">→</span>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Card 1 - Maldives */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
            <div className="h-80 bg-gray-200 relative">
              <img src="https://images.pexels.com/photos/3601426/pexels-photo-3601426.jpeg?cs=srgb&dl=pexels-asad-photo-maldives-3601426.jpg&fm=jpg" alt="Maldives" className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <h3 className="text-gray-600 font-medium text-lg mb-1">Stay among the atolls in <span className="text-teal-400">Maldives</span></h3>
              <p className="text-sm text-gray-400">From the 2nd century AD, the islands were known as the 'Money Isles' due to the abundance of cowry shells, a currency of the early ages.</p>
            </div>
          </div>

          {/* Card 2 - Morocco */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
            <div className="h-80 bg-gray-200 relative">
              <img src="https://images.unsplash.com/photo-1539020140153-e479b8c22e70?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Morocco" className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <h3 className="text-gray-600 font-medium text-lg mb-1">Experience the Ourika Valley in <span className="text-teal-400">Morocco</span></h3>
              <p className="text-sm text-gray-400">Morocco’s Hispano-Moorish architecture blends influences from Berber culture, Spain, and contemporary artistic currents in the Middle East.</p>
            </div>
          </div>

          {/* Card 3 - Mongolia */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
            <div className="h-80 bg-gray-200 relative">
              <img src="https://images.unsplash.com/photo-1559620192-032c4bc4674e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Mongolia" className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <h3 className="text-gray-600 font-medium text-lg mb-1">Live traditionally in <span className="text-teal-400">Mongolia</span></h3>
              <p className="text-sm text-gray-400">Traditional Mongolian yurts consists of an angled latticework of wood or bamboo for walls, ribs, and a wheel.</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-md transition-colors">
            Explore more stays
          </button>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full max-w-6xl pb-20 mt-10">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-500 mb-16">
          What <span className="text-indigo-600">Tripma</span> users are saying
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Testimonial 1 - Yifei Chen */}
          <div className="flex flex-col">
            <div className="flex items-center gap-4 mb-4">
              <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80" alt="Yifei Chen" className="w-12 h-12 rounded-full object-cover" />
              <div>
                <h4 className="text-gray-600 font-semibold">Yifei Chen</h4>
                <p className="text-gray-400 text-sm">Seoul, South Korea | April 2019</p>
              </div>
            </div>
            <div className="flex text-indigo-500 mb-3">
              {[...Array(5)].map((_, i) => (
                <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-gray-600 leading-relaxed mb-2">
              What a great experience using Tripma! I booked all of my flights for my gap year through Tripma and never had any issues. When I had to cancel a flight because of an emergency, Tripma support helped me <span className="text-indigo-600 cursor-pointer">read more...</span>
            </p>
          </div>

          {/* Testimonial 2 - Kaori Yamaguchi */}
          <div className="flex flex-col">
            <div className="flex items-center gap-4 mb-4">
              <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80" alt="Kaori Yamaguchi" className="w-12 h-12 rounded-full object-cover" />
              <div>
                <h4 className="text-gray-600 font-semibold">Kaori Yamaguchi</h4>
                <p className="text-gray-400 text-sm">Honolulu, Hawaii | February 2017</p>
              </div>
            </div>
            <div className="flex text-indigo-500 mb-3">
              {[...Array(5)].map((_, i) => (
                <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-gray-600 leading-relaxed mb-2">
              My family and I visit Hawaii every year, and we usually book our flights using other services. Tripma was recommened to us by a long time friend, and I'm so glad we tried it out! The process was easy and <span className="text-indigo-600 cursor-pointer">read more...</span>
            </p>
          </div>

          {/* Testimonial 3 - Anthony Lewis */}
          <div className="flex flex-col">
            <div className="flex items-center gap-4 mb-4">
              <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80" alt="Anthony Lewis" className="w-12 h-12 rounded-full object-cover" />
              <div>
                <h4 className="text-gray-600 font-semibold">Anthony Lewis</h4>
                <p className="text-gray-400 text-sm">Berlin, Germany | April 2019</p>
              </div>
            </div>
            <div className="flex text-indigo-500 mb-3">
              {[...Array(5)].map((_, i) => (
                <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-gray-600 leading-relaxed mb-2">
              When I was looking to book my flight to Berlin from LAX, Tripma had the best browsing experiece so I figured I'd give it a try. It was my first time using Tripma, but I'd definitely recommend it to a friend and use it for <span className="text-indigo-600 cursor-pointer">read more...</span>
            </p>
          </div>
        </div>

      </section>


      {/* Footer */}
      <Footer />

    </main>
  );
}