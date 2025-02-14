import React from 'react'
import { useState, useEffect, useRef } from "react";
import { useClerk, useUser } from "@clerk/clerk-react";

const CustomUserButton = () => {
    const { openUserProfile, signOut } = useClerk();
    const { user, isLoaded } = useUser();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Ensure user is available before accessing properties
    const displayName = isLoaded && user
        ? user.username || user.firstName || user.fullName || "User"
        : "Loading...";

    // Toggle dropdown open/close
    const toggleDropdown = () => {
        setDropdownOpen((prev) => !prev);
    };

    // Close dropdown when clicking outside of it
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative inline-block">
            <button
                onClick={toggleDropdown}
                className="flex items-center  transition"
            >
                {isLoaded && user?.profileImageUrl ? (
                    <img
                        src={user.profileImageUrl}
                        alt="User Avatar"
                        className="h-12 w-12 rounded-full object-cover"
                    />
                ) : (
                    <div className="h-9 w-9 rounded-full bg-blue-500 text-white flex items-center justify-center">
                        {displayName.charAt(0).toUpperCase()}
                    </div>
                )}
                <span className="text-white mx-2">Hi, {displayName}</span>
            </button>

            {/* Dropdown */}
            {dropdownOpen && isLoaded && (
                <div
                    ref={dropdownRef}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50"
                >
                    <button
                        onClick={() => {
                            openUserProfile();
                            setDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 "
                    >
                        Manage Account
                    </button>
                    <button
                        onClick={async () => {
                            await signOut({ redirectUrl: "/" });
                            setDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 "
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default CustomUserButton;
