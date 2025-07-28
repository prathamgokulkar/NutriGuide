"use client";
import React from "react";
import Link from "next/link";

const ExploreCard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8 object-contain">
      {[
        "ExploreImage1.jpeg",
        "ExploreImage2.jpeg",
        "ExploreImage3.jpeg",
        "ExploreImage4.jpeg",
      ].map((item, index) => (
        <Link href="/input" key={index}>
          <div className="w-64 h-64 overflow-hidden rounded-lg shadow-md">
            <img
              src={`/${item}`}
              alt="Explore Recipies"
              className="w-full h-full"
            />
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ExploreCard;
