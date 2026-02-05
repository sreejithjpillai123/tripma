'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import SignIn from './Signin';

const Nav = () => {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const userEmail = searchParams.get('email') || "";
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [authMode, setAuthMode] = useState('signin'); // 'signin' or 'signup'
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Mock "logged in" state based on path for this demo
    const isLoggedIn = pathname === '/success' || pathname === '/user';

    const openSignIn = () => {
        setAuthMode('signin');
        setIsAuthOpen(true);
    };

    const openSignUp = () => {
        setAuthMode('signup');
        setIsAuthOpen(true);
    };

    if (pathname === '/seats') return null;

    return (
        <>
            <nav className="flex justify-between items-center px-6 md:px-10 py-5 bg-white  ">
                <div className="logo">
                    <Link href="/" className="text-2xl font-bold text-indigo-600">
                        Tripma
                    </Link>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    <Link href="/flights" className="text-gray-500 hover:text-indigo-600 text-base font-medium transition-colors">
                        Flights
                    </Link>
                    <Link href="/hotels" className="text-gray-500 hover:text-indigo-600 text-base font-medium transition-colors">
                        Hotels
                    </Link>
                    <Link href="/packages" className="text-gray-500 hover:text-indigo-600 text-base font-medium transition-colors">
                        Packages
                    </Link>
                    {isLoggedIn ? (
                        <div
                            onClick={() => router.push(`/user?email=${encodeURIComponent(userEmail)}`)}
                            className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white cursor-pointer hover:bg-indigo-700 transition-colors shadow-sm overflow-hidden border-2 border-indigo-100"
                            title="My Profile"
                        >
                            <img
                                src={userEmail === "abc@gmail.com"
                                    ? "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
                                    : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
                                }
                                alt="User Avatar"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ) : (
                        <>
                            <button onClick={openSignIn} className="text-gray-500 hover:text-indigo-600 text-base font-medium transition-colors">
                                Sign in
                            </button>
                            <button
                                onClick={openSignUp}
                                className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 font-bold transition-all shadow-lg shadow-indigo-100 active:scale-95"
                            >
                                Sign up
                            </button>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                </button>
            </nav>

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] md:hidden transition-opacity"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <div className={`fixed top-0 left-0 h-full w-4/5 max-w-sm bg-white z-[110] md:hidden transform transition-transform duration-300 ease-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} shadow-2xl flex flex-col`}>
                <div className="p-6 border-b flex justify-between items-center">
                    <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent">Tripma</span>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-400 hover:text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <Link href="/flights" onClick={() => setIsMobileMenuOpen(false)} className="block text-lg font-semibold text-gray-700 hover:text-indigo-600">Flights</Link>
                    <Link href="/hotels" onClick={() => setIsMobileMenuOpen(false)} className="block text-lg font-semibold text-gray-700 hover:text-indigo-600">Hotels</Link>
                    <Link href="/packages" onClick={() => setIsMobileMenuOpen(false)} className="block text-lg font-semibold text-gray-700 hover:text-indigo-600">Packages</Link>
                </div>

                <div className="p-6 space-y-4 border-t bg-gray-50">
                    {!isLoggedIn ? (
                        <>
                            <button
                                onClick={() => { setIsMobileMenuOpen(false); openSignIn(); }}
                                className="w-full py-3 text-indigo-600 font-bold border-2 border-indigo-600 rounded-xl active:scale-95 transition-all"
                            >
                                Sign in
                            </button>
                            <button
                                onClick={() => { setIsMobileMenuOpen(false); openSignUp(); }}
                                className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 active:scale-95 transition-all"
                            >
                                Sign up
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => { setIsMobileMenuOpen(false); router.push(`/user?email=${encodeURIComponent(userEmail)}`); }}
                            className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl flex items-center justify-center gap-3 active:scale-95 transition-all"
                        >
                            <div className="w-6 h-6 rounded-full overflow-hidden border border-white/50">
                                <img
                                    src={userEmail === "abc@gmail.com"
                                        ? "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
                                        : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
                                    }
                                    alt="Avatar"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            My Profile
                        </button>
                    )}
                </div>
            </div>

            {/* Sign Up / Sign In Modal */}
            <SignIn isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} initialMode={authMode} />
        </>
    );
};

export default Nav;
