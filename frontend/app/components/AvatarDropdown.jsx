"use client";
import { useSession, signOut } from 'next-auth/react';

const AvatarDropdown = () => {
    const { data: session } = useSession();

    if (!session) return null;

    return (
        <div className="dropdown dropdown-end ml-4">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                    <img
                        alt="User Avatar"
                        src={session.user.image || `https://ui-avatars.com/api/?name=${session.user.name}&background=random`}
                    />
                </div>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                <li>
                    <a className="justify-between">
                        Profile
                        <span className="badge">New!</span>
                    </a>
                </li>
                <li><a>Settings</a></li>
                <li>
                    <button onClick={() => signOut({ callbackUrl: '/' })}>
                        Sign Out
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default AvatarDropdown;