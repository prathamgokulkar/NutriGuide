"use client";
import React from "react";
import AvatarDropdown from "./AvatarDropdown";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();
  const authRoutes = ["/login", "/signup"];

  const showDropdown = !authRoutes.includes(pathname);
  return (
    <>
      <nav className="shadow-md">
        <div className="navbar flex justify-between items-center h-16 px-4 ">
          {/* Logo */}
          <div>
            <a href="/" className="text-4xl primary font-bold px-8">
              NutriGuide
            </a>
          </div>
          {showDropdown && (
            <div>
              <AvatarDropdown></AvatarDropdown>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
