import React from "react";

import { useNavigate } from "react-router-dom";

const images = [
  "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500&h=300&fit=crop&q=80", // Books/Library
  "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=500&h=300&fit=crop&q=80", // Laptop/Typing
  "https://images.unsplash.com/photo-1583521214690-73421a1829a9?w=500&h=300&fit=crop&q=80", // Coding
  "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=500&h=300&fit=crop&q=80", // Group Study
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&h=300&fit=crop&q=80", // Online learning
  "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=500&h=300&fit=crop&q=80", // Coffee/Study
];

const Hero = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("profile"));

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-gray-50 overflow-hidden relative">
      <div className="text-center z-10 px-4 mb-15">
        <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-orange-500 mb-6 drop-shadow-sm">
          Challenge Your Mind.
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
          Join the ultimate quiz platform to test your knowledge, compete with
          friends, and learn something new every day.
        </p>
        {!user && (
          <button
            onClick={() => navigate("/signup")}
            className="mt-8 px-8 py-3 bg-primary text-white rounded-full font-semibold shadow-lg hover:bg-orange-600 hover:shadow-xl transition-all transform hover:-translate-y-1"
          >
            Get Started
          </button>
        )}
      </div>

      {/* Marquee Section */}
      <div className="w-full mt-8 overflow-hidden relative">
        <div className="flex w-max animate-marquee">
          {/* First set of images */}
          <div className="flex gap-4 mx-2">
            {images.map((src, index) => (
              <img
                key={`imgA-${index}`}
                src={src}
                alt={`Slide ${index}`}
                className="w-80 h-56 object-cover rounded-xl shadow-md"
              />
            ))}
          </div>
          {/* Duplicate set for seamless loop */}
          <div className="flex gap-4 mx-2">
            {images.map((src, index) => (
              <img
                key={`imgB-${index}`}
                src={src}
                alt={`Slide ${index}`}
                className="w-80 h-56 object-cover rounded-xl shadow-md"
              />
            ))}
          </div>
        </div>

        {/* Gradient Overlays for smooth edges */}
        <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none" />
      </div>
    </div>
  );
};

export default Hero;
