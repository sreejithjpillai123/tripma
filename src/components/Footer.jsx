import React from 'react';
import Link from 'next/link';

const Footer = () => {
    return (
        <footer className="w-full bg-white border-t border-gray-100 pt-16 pb-8">
            <div className="max-w-6xl mx-auto px-4">

                {/* Top Section */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">

                    {/* Column 1 - Logo */}
                    <div className="col-span-1">
                        <Link href="/" className="text-2xl font-bold text-indigo-600">
                            Tripma
                        </Link>
                    </div>

                    {/* Column 2 - About */}
                    <div className="col-span-1">
                        <h3 className="text-gray-600 font-semibold mb-4">About</h3>
                        <ul className="flex flex-col gap-3">
                            <li><a href="#" className="text-gray-400 hover:text-indigo-600 text-sm">About Tripma</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-indigo-600 text-sm">How it works</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-indigo-600 text-sm">Careers</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-indigo-600 text-sm">Press</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-indigo-600 text-sm">Blog</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-indigo-600 text-sm">Forum</a></li>
                        </ul>
                    </div>

                    {/* Column 3 - Partner with us */}
                    <div className="col-span-1">
                        <h3 className="text-gray-600 font-semibold mb-4">Partner with us</h3>
                        <ul className="flex flex-col gap-3">
                            <li><a href="#" className="text-gray-400 hover:text-indigo-600 text-sm">Partnership programs</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-indigo-600 text-sm">Affiliate program</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-indigo-600 text-sm">Connectivity partners</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-indigo-600 text-sm">Promotions and events</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-indigo-600 text-sm">Integrations</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-indigo-600 text-sm">Community</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-indigo-600 text-sm">Loyalty program</a></li>
                        </ul>
                    </div>

                    {/* Column 4 - Support */}
                    <div className="col-span-1">
                        <h3 className="text-gray-600 font-semibold mb-4">Support</h3>
                        <ul className="flex flex-col gap-3">
                            <li><a href="#" className="text-gray-400 hover:text-indigo-600 text-sm">Help Center</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-indigo-600 text-sm">Contact us</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-indigo-600 text-sm">Privacy policy</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-indigo-600 text-sm">Terms of service</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-indigo-600 text-sm">Trust and safety</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-indigo-600 text-sm">Accessibility</a></li>
                        </ul>
                    </div>

                    {/* Column 5 - Get the app */}
                    <div className="col-span-1">
                        <h3 className="text-gray-600 font-semibold mb-4">Get the app</h3>
                        <ul className="flex flex-col gap-3 mb-6">
                            <li><a href="#" className="text-gray-400 hover:text-indigo-600 text-sm">Tripma for Android</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-indigo-600 text-sm">Tripma for iOS</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-indigo-600 text-sm">Mobile site</a></li>
                        </ul>
                        <div className="flex flex-col gap-2">
                            {/* App Store Button Placeholder */}
                            <button className="bg-black text-white rounded-md px-3 py-1.5 flex items-center gap-2 hover:bg-gray-800 w-fit">
                                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.21-1.96 1.07-3.11-1.06.05-2.36.71-3.11 1.61-.69.77-1.28 2-1.12 3.14 1.19.09 2.43-.81 3.16-1.64z" /></svg>
                                <div className="flex flex-col items-start leading-none">
                                    <span className="text-[0.6rem]">Download on the</span>
                                    <span className="text-xs font-semibold">App Store</span>
                                </div>
                            </button>
                            {/* Google Play Button Placeholder */}
                            <button className="bg-black text-white rounded-md px-3 py-1.5 flex items-center gap-2 hover:bg-gray-800 w-fit">
                                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" /></svg>
                                <div className="flex flex-col items-start leading-none">
                                    <span className="text-[0.6rem]">GET IT ON</span>
                                    <span className="text-xs font-semibold">Google Play</span>
                                </div>
                            </button>
                        </div>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    {/* Social Icons */}
                    <div className="flex gap-4">
                        <a href="#" className="text-gray-400 hover:text-indigo-600">
                            <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
                        </a>
                        <a href="#" className="text-gray-400 hover:text-indigo-600">
                            <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                        </a>
                        <a href="#" className="text-gray-400 hover:text-indigo-600">
                            <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                        </a>
                    </div>

                    {/* Copyright */}
                    <div className="text-gray-400 text-sm">
                        © 2020 Tripma incorporated
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
