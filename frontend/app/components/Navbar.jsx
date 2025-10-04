"use client";

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import AvatarDropdown from './AvatarDropdown';
import { FiMenu } from 'react-icons/fi';

const Navbar = () => {
    const { data: session, status } = useSession();

    // While the session is loading, show a simple placeholder to prevent layout shifts
    if (status === 'loading') {
        return <div className="navbar bg-base-100 h-16 shadow-sm border-b"></div>;
    }

    // Define the navigation links for logged-in users to avoid repetition
    const loggedInLinks = (
        <>
            <li><Link href="/dashboard">Dashboard</Link></li>
            <li><Link href="/recipes">Explore Recipes</Link></li>
            <li><Link href="/recipes/chat">AI Assistant</Link></li>
        </>
    );

    return (
        <header className="navbar bg-base-100 shadow-sm border-b px-4 sm:px-6 lg:px-8">
            {/* Left Side: Logo */}
            <div className="flex-1">
                <Link href={session ? "/dashboard" : "/"} className="btn btn-ghost text-2xl text-primary font-bold normal-case">
                    NutriGuide
                </Link>
            </div>

            {/* Right Side: Conditional rendering */}
            <div className="flex-none gap-2">
                {session ? (
                    // --- Logged-In View ---
                    <>
                        {/* Desktop Menu */}
                        <ul className="menu menu-horizontal px-1 hidden lg:flex">
                            {loggedInLinks}
                        </ul>
                        
                        {/* Profile Avatar */}
                        <AvatarDropdown />

                        {/* Mobile Hamburger Menu */}
                        <div className="dropdown dropdown-end lg:hidden">
                            <div tabIndex={0} role="button" className="btn btn-ghost">
                                <FiMenu size={24} />
                            </div>
                            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                                {loggedInLinks}
                            </ul>
                        </div>
                    </>
                ) : (
                    // --- Logged-Out View ---
                    <div className="flex items-center gap-2">
                        <Link href="/login" className="btn btn-ghost">Login</Link>
                        <Link href="/signup" className="btn btn-primary">Sign Up</Link>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Navbar;