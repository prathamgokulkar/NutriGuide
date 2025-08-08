import HeroSection from "./components/HeroSection";
import ExploreHero from "./components/ExploreHero";
import LoginHero from "./components/LoginHero";
import React from "react";

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <HeroSection />
      {/* Login Hero Section */}
      <LoginHero />
      {/* Explore Hero Section */}
      <ExploreHero />
    </div>
  );
}
