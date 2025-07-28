import React from "react";
import ExploreCard from "./ExploreCard";

const ExploreHero = () => {
  return (
    <section className="py-8 container mx-auto px-4">
      <h1>Explore cuisine by our own preference</h1>
      <p>
        NutriGuide provides nutritional breakdowns for each recipe, helping you
        make informed choices for a balanced lifestyle.{" "}
      </p>
      <ExploreCard />
    </section>
  );
};

export default ExploreHero;
