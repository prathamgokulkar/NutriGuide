"use client";
import React from "react";
import Link from "next/link";

const ExploreCard = () => {
  return (
    <div>
      <Link href="/input">
        <img src="./ExploreImage1.jpeg" alt="Explore Recipes" />
      </Link>
      <Link href="/input">
        <img src="./ExploreImage2.jpeg" alt="Explore Recipes" />
      </Link>
      <Link href="/input">
        <img src="./ExploreImage3.jpeg" alt="Explore Recipes" />
      </Link>
    </div>
  );
};

export default ExploreCard;
