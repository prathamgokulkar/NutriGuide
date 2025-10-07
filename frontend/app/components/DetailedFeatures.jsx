"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const features = [
  {
    title: "Conversational Recipe Assistant",
    description:
      "Just ask! Our AI assistant understands natural language to find the perfect recipes based on your goals and chat history.",
    image: "/sliding_img1.png",
  },
  {
    title: "Interactive Progress Dashboard",
    description:
      "Stay motivated by visually tracking your daily calories, protein, carbs, and fats against your personalized targets.",
    image: "/sliding_img2.png",
  },
  {
    title: "Goal-Oriented Planning",
    description:
      "Whether your goal is weight loss or muscle gain, every suggestion is tailored to help you succeed.",
    image: "/sliding_img3.png",
  },
];

const SlidingFeatures = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Features You'll Love
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            A smarter, more personal way to manage your nutrition.
          </p>
        </div>

        <Swiper
          // 3. Configure Swiper
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={30}
          slidesPerView={1}
          loop={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          className="w-full h-full"
        >
          {features.map((feature, index) => (
            <SwiperSlide key={index}>
              <div className="card lg:card-side bg-white-100 shadow-xl border rounded-2xl">
                <figure className="lg:w-1/2">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="object-cover w-full h-64 lg:h-full"
                  />
                </figure>
                <div className="card-body lg:w-1/2 justify-center p-8 lg:p-12">
                  
                  <h2 className="card-title text-2xl font-bold text-center lg:text-left">
                    {feature.title}
                  </h2>
                  <p className="text-gray-600 mt-2 text-center lg:text-left">
                    {feature.description}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default SlidingFeatures;
