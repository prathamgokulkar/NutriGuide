"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react"; 
import { motion } from "framer-motion";
import Button from './Button';

// Isolated component so useSearchParams is inside a Suspense boundary.
// Next.js 15 requires any component calling useSearchParams() to be
// wrapped in <Suspense> for static prerendering to succeed.
const WelcomeToast = () => {
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
    }, [searchParams, router]);

    if (!welcomeMessage) return null;

    return (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-out">
            Welcome to NutriGuide!
        </div>
    );
};

const HeroSection = () => {
    const { data: session } = useSession(); 

    return (
        <section className=" py-16 md:py-24">
            {/* Suspense boundary required by Next.js 15 for useSearchParams */}
            <Suspense fallback={null}>
                <WelcomeToast />
            </Suspense>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                {/* Hero text */}
                <motion.div 
                    className="text-center md:text-left p-6 md:p-12"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-4xl md:text-5xl font-bold py-4">
                        Cook <span className="primary ">Smart</span>. Cook{" "}
                        <span className="primary ">Fast</span>. Discover recipes with what you have.
                    </h1>
                    <p className="mt-6 text-lg text-gray-600">
                        NutriGuide is your AI-powered assistant that finds delicious recipes based on the ingredients you already have. Save time, reduce waste, and achieve your health goals.
                    </p>
                    <div className="mt-8">
                        <Button href={session ? "/dashboard" : "/signup"}>
                            {session ? "Go to Dashboard" : "Get Started"}
                        </Button>
                    </div>
                </motion.div>

                {/* Hero Image */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <img
                        src="./HeroImage.png"
                        alt="Healthy food bowl"
                        className="w-full max-h-[500px] object-contain"
                    />
                </motion.div>
            </div>
        </section>
    );
};

export default HeroSection;