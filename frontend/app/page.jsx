// app/page.jsx
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import SlidingFeatures from "./components/DetailedFeatures";
import LoggedInHero from "./components/LoggedInHero"; 

export default function HomePage() {
  return (
    <div>
      <main>
        <HeroSection />
        <LoggedInHero /> 
        <FeaturesSection />
        <SlidingFeatures />
      </main>
    </div>
  );
}