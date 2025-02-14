import React from 'react'
import { Home, CloudSun, Store, Users, GraduationCap, Moon, Sun, User,Sprout } from 'lucide-react';
import { useState, useEffect } from 'react';
import { SignedIn, SignedOut, useClerk } from "@clerk/clerk-react";
import CustomUserButton from "./CustomUserButton";
import { Link } from "react-router-dom";

const Navbar = () => {
    const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');
    const { openSignIn } = useClerk();

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    return (
        <nav className="bg-white dark:bg-gray-900 shadow-lg w-full z-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between h-16 items-center">
                    
                    {/* Brand Name */}
                    <div className="flex items-center">
                        <span className="text-green-600 dark:text-green-400 font-bold text-2xl">Bhoomitra</span>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex space-x-6 items-center">
                        {[
                            { name: 'Home', icon: Home, path: '/' },
                            { name: 'Recommendation', icon: Sprout, path: '/predict' },
                            { name: 'Store', icon: Store, path: '/store' },
                            { name: 'Vendors', icon: Users, path: '/vendors' },
                            { name: 'Experts', icon: GraduationCap, path: '/experts' },
                            { name: 'Weather Update', icon: CloudSun, path: 'https://jazzy-sprinkles-727ae3.netlify.app/' }, 
                        ].map((item) => (
                            <Link
                                key={item.name}
                                to={item.path}
                                className="flex items-center px-3 py-2 text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                            >
                                <item.icon className="w-5 h-5 mr-1" />
                                <span>{item.name}</span>
                            </Link>
                        ))}

                        {/* Authentication UI */}
                        <div className="ml-auto flex items-center space-x-4">
                            <SignedIn>
                                <CustomUserButton />
                            </SignedIn>
                            <SignedOut>
                                <button
                                    onClick={() => openSignIn({ redirectUrl: "/" })}
                                    className="flex items-center px-3 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                                >
                                    <User className="w-5 h-5 mr-1" />
                                    <span>Signup</span>
                                </button>
                            </SignedOut>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

