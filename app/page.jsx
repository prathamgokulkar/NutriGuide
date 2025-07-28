import HeroSection from "./components/HeroSection";
import ExploreHero from "./components/ExploreHero";
import React from "react";

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <HeroSection />
      {/* Explore Hero Section */}
      <ExploreHero />
    </div>
  );
}
