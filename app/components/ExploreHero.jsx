import React from "react";
import ExploreCard from "./ExploreCard";

const ExploreHero = () => {
  return (
    <section className="py-8 container mx-auto px-4 text-center ">
      <h1 className="text-4xl md:text-5xl font-bold py-4">
        Explore cuisine by our own preference
      </h1>
      <p className="text-lg md:text-xl">
        NutriGuide provides nutritional breakdowns for each recipe, helping you
        make informed choices for a balanced lifestyle.{" "}
      </p>
      <ExploreCard />
    </section>
  );
};

export default ExploreHero;
