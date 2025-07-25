"use client";
import Link from "next/link";
import { useState } from "react";
import React from "react";

const AvatarDropdown = () => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      {/* Avatar button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden focus:outline-none border border-gray-400 cursor-pointer"
      >
        <img
          src="/Avatar.jpeg"
          alt="User Avatar"
          className="w-full h-full object-cover"
        />
      </button>

      {/* Dropdown menu */}
      {open && (
        <div className="absolute right-2 mt-0 bg-[#f6f6f6] rounded-lg shadow-lg border border-primary">
          <ul>
            <li>
              <Link
                href="/bookmarks"
                className="block px-4 py-2 text-black hover:bg-orange-200"
              >
                Bookmarks
              </Link>
            </li>
            <li>
              <Link
                href="/logout"
                className="block w-full text-left px-4 py-2 text-black hover:bg-orange-200"
                onClick={() => alert("Logging out")}
              >
                Logout
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default AvatarDropdown;
