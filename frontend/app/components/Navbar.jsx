"use client";

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import AvatarDropdown from './AvatarDropdown';
import { FiMenu } from 'react-icons/fi';

const Navbar = () => {
    const { data: session, status } = useSession();

    // While the session is loading, show a simple placeholder to prevent layout shifts
    if (status === 'loading') {
        return <div className="navbar bg-white-100 h-16 shadow-sm border-b"></div>;
    }

    

    return (
        <header className="navbar bg-white-100 shadow-sm border-b px-4 sm:px-6 lg:px-8">
            {/* Left Side: Logo */}
            <div className="flex-1">
                <Link href={session ? "/dashboard" : "/"} className="btn btn-ghost text-3xl text-[#f78c11] font-bold normal-case">
                    NutriGuide
                </Link>
            </div>

            {/* Right Side: Conditional rendering */}
            <div className="flex-none gap-2">
                {session ? (
                    // --- Logged-In View ---
                    <>
                        
                        <AvatarDropdown />

                        {/* Mobile Hamburger Menu */}
                        <div className="dropdown dropdown-end lg:hidden">
                            <div tabIndex={0} role="button" className="btn btn-ghost">
                                <FiMenu size={24} />
                            </div>
                            
                        </div>
                    </>
                ) : (
                    // --- Logged-Out View ---
                    <div className="flex items-center gap-2">
                        <Link href="/login" className="btn btn-ghost">Login</Link>
                        <Link href="/signup" className="btn btn-[#f78c11]">Sign Up</Link>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Navbar;