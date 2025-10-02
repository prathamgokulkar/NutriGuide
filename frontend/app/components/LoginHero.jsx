import React from "react";
import LoginButton from "./LoginButton";

const LoginHero = () => {
  return (
    <section className="py-8 container mx-auto px-4 text-center ">
      <h1 className="text-4xl md:text-5xl font-bold py-4 text-center">
        Get Started
      </h1>
      <p className="text-lg md:text-xl text-center">
        Create, share, and discover delicious recipes with ease.
      </p>
      <div className="flex justify-center mt-8">
        <LoginButton></LoginButton>
      </div>
    </section>
  );
};

export default LoginHero;
