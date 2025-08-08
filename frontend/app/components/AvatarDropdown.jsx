"use client";
import Link from "next/link";
import { useState } from "react";
import React from "react";
import { signOut, useSession } from "next-auth/react";

const AvatarDropdown = () => {
  const [open, setOpen] = useState(false);
  const { data: session, status } = useSession();

  if (status === "loading") return null;

  return (
    <div className="relative flex items-center gap-8">
      {!session?.user ? (
        <Link href={"/login"}>
          <button className="bg-primary text-white py-2 px-4 rounded-lg cursor-pointer font-bold hover:bg-amber-600">
            Login
          </button>
        </Link>
      ) : (
        <>
          {/* Avatar button */}
          <button
            onClick={() => setOpen(!open)}
            className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden focus:outline-none border border-gray-400 cursor-pointer"
          >
            <img
              src={"/Avatar.jpeg"}
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          </button>

          {/* Dropdown menu */}
          {open && (
            <div className="absolute right-2 mt-30 bg-[#f6f6f6] rounded-lg shadow-lg border border-primary z-50">
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
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    type="button"
                    className="block w-full text-left px-4 py-2 text-black hover:bg-orange-200"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AvatarDropdown;
