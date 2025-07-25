import React from "react";

const HeroSection = () => {
  return (
    <section className="py-8 container mx-auto px-4">
      <div className="flex flex-col-reverse md:flex-row md:justify-between items-center">
        {/* Hero text */}
        <div className="text-center md:text-left md:w-1/2">
          <h1 className="text-4xl md:text-5xl font-bold py-4">
            Cook <span className="primary ">Smart</span>. Cook{" "}
            <span className="primary ">Fast</span>. Discover recipes with what
            you have.
          </h1>
          <p>
            NutriGuide provides nutritional breakdowns for each recipe, helping
            you make informed choices for a balanced lifestyle.
          </p>
        </div>

        {/* Hero Image */}
        <div className="md:w-1/2">
          <img
            src="./HeroImage.png"
            alt="Img"
            className="w-full max-h-[500px] object-contain "
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
