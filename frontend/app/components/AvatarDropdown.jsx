"use client";

import { useSession, signOut } from "next-auth/react";
import { RxAvatar } from "react-icons/rx";


const AvatarDropdown = () => {
  const { data: session } = useSession();

  if (!session) return null;

  return (
    <div className="dropdown dropdown-end ml-4">
      {/* Avatar Button */}
      <label tabIndex={0} className="btn btn-ghost btn-circle p-0">
        <div className="w-10 h-10 rounded-full border-2 border-amber-500 flex items-center justify-center overflow-hidden bg-gray-100">
          {session.user.image ? (
            <img
              alt="User Avatar"
              src={session.user.image}
              className="w-full h-full object-cover"
            />
          ) : (
            <RxAvatar className="w-6 h-6 text-gray-500" />
          )}
        </div>
      </label>

      {/* Dropdown Content */}
      <ul
        tabIndex={0}
        className="menu dropdown-content mt-3 p-2 shadow bg-white-100 rounded-box w-52"
      >
        
        <li>
          <a
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-red-500 hover:bg-red-100"
          >
            Sign Out
          </a>
        </li>
      </ul>
    </div>
  );
};

export default AvatarDropdown;
