"use client";
import { useSession } from 'next-auth/react';
import ChatAction from './ChatAction';
import BrowseAction from './BrowseAction';

const LoggedInHero = () => {
    const { data: session, status } = useSession();

    // Only render this component if the user is authenticated
    if (status !== 'authenticated') {
        return null;
    }

    return (
        <div className="container mx-auto px-4 py-12 text-center">
            <h2 className="text-3xl font-bold">Welcome back, {session.user.name}!</h2>
            <p className="text-lg text-gray-600 mt-2">Ready to find your next meal?</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 max-w-2xl mx-auto">
                <ChatAction />
                <BrowseAction />
            </div>
        </div>
    );
};

export default LoggedInHero;