import React from "react";
import AvatarDropdown from "./AvatarDropdown";

const Navbar = () => {
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
          {/* avatar */}
          <div className="">
            <AvatarDropdown></AvatarDropdown>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
