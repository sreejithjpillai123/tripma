'use client';
import React, { useState } from 'react';
import { signIn } from 'next-auth/react';

export default function SignIn({ isOpen, onClose, initialMode = 'signin' }) {
    const [mode, setMode] = useState(initialMode);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Update internal mode when prop changes, or when opening
    React.useEffect(() => {
        if (isOpen) {
            setMode(initialMode);
            setError('');
            setSuccess('');
            setName('');
            setEmail('');
            setPassword('');
        }
    }, [isOpen, initialMode]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (mode === 'signup') {
            try {
                const res = await fetch('/api/auth/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password }),
                });

                if (res.ok) {
                    setSuccess('Account created successfully! Please sign in.');
                    // Optionally switch to sign in mode after a brief delay or immediately
                    setTimeout(() => setMode('signin'), 1500);
                } else {
                    const data = await res.json();
                    setError(data.message || 'Something went wrong.');
                }
            } catch (err) {
                setError('Failed to create account.');
            }
        } else {
            // Sign In Logic
            const result = await signIn('credentials', {
                redirect: false,
                email,
                password,
            });

            if (result?.error) {
                setError('Invalid email or password');
            } else {
                onClose();
                console.log("Logged in successfully!");
            }
        }
    };

    const toggleMode = () => {
        setMode(mode === 'signin' ? 'signup' : 'signin');
        setError('');
        setSuccess('');
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 " onClick={onClose}>
            <div
                className="bg-white rounded-lg p-8 w-full max-w-md
             max-h-[90vh] overflow-y-auto
             mx-4 relative shadow-2xl "
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    
                </button>

                {/* Header */}
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {mode === 'signup' ? 'Sign up for Tripma' : 'Sign in to Tripma'}
                </h2>
                <p className="text-gray-500 text-sm mb-6">
                    Tripma is totally free to use. {mode === 'signup' ? 'Sign up' : 'Sign in'} using your email address or phone number below to get started.
                </p>

                {error && (
                    <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                {success && (
                    <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                        <span className="block sm:inline">{success}</span>
                    </div>
                )}

                {/* Form */}
                <form className="space-y-4" onSubmit={handleSubmit}>
                    {/* Name Input (Sign Up Only) */}
                    {mode === 'signup' && (
                        <div>
                            <input
                                type="text"
                                placeholder="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-700"
                                required
                            />
                        </div>
                    )}

                    {/* Email/Phone Input */}
                    <div>
                        <input
                            type="text"
                            placeholder="Email or phone number"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-700"
                            required
                        />
                    </div>

                    {/* Password Input */}
                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-700"
                            required
                        />
                    </div>

                    {/* Checkboxes */}
                    <div className="space-y-3 pt-2">
                        {mode === 'signup' && (
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 border-2 border-gray-300 rounded accent-indigo-600"
                                />
                                <span className="text-sm text-gray-600">I agree to the terms and conditions</span>
                            </label>
                        )}
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                className="w-4 h-4 border-2 border-gray-300 rounded accent-indigo-600"
                            />
                            <span className="text-sm text-gray-600">Send me the latest deal alerts</span>
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-3 rounded-md font-medium hover:bg-indigo-700 transition-colors mt-4"
                    >
                        {mode === 'signup' ? 'Create account' : 'Sign In'}
                    </button>
                </form>

                {/* Divider */}
                <div className="flex items-center my-6">
                    <div className="flex-1 border-t border-gray-200"></div>
                    <span className="px-4 text-sm text-gray-400">or</span>
                    <div className="flex-1 border-t border-gray-200"></div>
                </div>

                {/* Social Login Buttons */}
                <div className="space-y-3">
                    {/* Google */}
                    <button
                        type="button"
                        onClick={() => signIn('google')}
                        className="w-full flex items-center justify-center gap-3 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                        <img src="images/google.png" alt="" />
                        <span className="text-gray-600 font-medium">Continue with Google</span>
                    </button>


                    <button
                        type="button"
                        onClick={() => signIn('google')}
                        className="w-full flex items-center justify-center gap-3 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                        <img src="images/apple.png" alt="" />
                        <span className="text-gray-600 font-medium">Continue with Apple</span>
                    </button>


                    <button
                        type="button"
                        onClick={() => signIn('google')}
                        className="w-full flex items-center justify-center gap-3 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                        <img src="images/facebook.png" alt="" />
                        <span className="text-gray-600 font-medium">Continue with Facebook</span>
                    </button>
                    {/* ... other buttons ... */}
                </div>

                {/* Toggle Mode */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        {mode === 'signup' ? 'Already have an account?' : 'Don\'t have an account?'}
                        {' '}
                        <button onClick={toggleMode} className="text-indigo-600 font-medium hover:underline">
                            {mode === 'signup' ? 'Sign in' : 'Sign up'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}