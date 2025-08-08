"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

const HeroSection = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [welcomeMessage, setWelcomeMessage] = useState(false);

  useEffect(() => {
    const welcome = searchParams.get("welcome");
    if (welcome === "true") {
      setWelcomeMessage(true);
      const timer = setTimeout(() => {
        setWelcomeMessage(false);
        router.replace("/", { scroll: false });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  return (
    <section className="py-8 container mx-auto px-4">
      {welcomeMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded shadow-md z-50 transition-opacity duration-1000 opacity-100 animate-fade-out">
          Welcome!!
        </div>
      )}
      <div className="flex flex-col-reverse md:flex-row md:justify-between items-center">
        {/* Hero text */}
        <div className="text-center md:text-left md:w-1/2">
          <h1 className="text-4xl md:text-5xl font-bold py-4">
            Cook <span className="primary ">Smart</span>. Cook{" "}
            <span className="primary ">Fast</span>. Discover recipes with what
            you have.
          </h1>
          <p className="text-lg md:text-xl">
            NutriGuide helps you find delicious recipes based on the ingredients
            you already have. Save time, reduce waste, and cook like a pro.
          </p>
          <Link
            href={"/recipeform"}
            type="button"
            className="bg-primary inline-block mt-4 text-white py-2 px-6 rounded-lg font-bold transition-colors hover:bg-amber-600"
          >
            Get Started !
          </Link>
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
