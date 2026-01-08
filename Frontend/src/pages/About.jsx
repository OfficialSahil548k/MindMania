import React from "react";
import missionImage from "../assets/mission.png";

const About = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl font-stylish italic">
              About MindMania
            </h1>
            <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
              Empowering evaluations, one quiz at a time. We are dedicated to
              making learning and assessment seamless, secure, and engaging.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Our Mission
            </h2>
            <p className="mt-3 max-w-3xl text-lg text-gray-500">
              At MindMania, we believe that assessment is a crucial part of the
              learning journey. Our mission is to provide a robust, intuitive,
              and accessible platform for educators to create assessments and
              for students to test their knowledge effectively.
            </p>
            <div className="mt-8 sm:flex">
              <div className="rounded-md shadow">
                <a
                  href="#"
                  className="flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
                >
                  Get started
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 lg:mt-0">
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <img
                src={missionImage}
                alt="MindMania Mission"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-orange-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Trusted by users worldwide
            </h2>
            <p className="mt-3 text-xl text-orange-100 sm:mt-4">
              Our platform handles thousands of quizzes daily, ensuring
              reliability and scale.
            </p>
          </div>
          <dl className="mt-10 text-center sm:max-w-3xl sm:mx-auto sm:grid sm:grid-cols-3 sm:gap-8">
            <div className="flex flex-col">
              <dt className="order-2 mt-2 text-lg leading-6 font-medium text-orange-100">
                Active Users
              </dt>
              <dd className="order-1 text-5xl font-extrabold text-white">
                10k+
              </dd>
            </div>
            <div className="flex flex-col mt-10 sm:mt-0">
              <dt className="order-2 mt-2 text-lg leading-6 font-medium text-orange-100">
                Quizzes Created
              </dt>
              <dd className="order-1 text-5xl font-extrabold text-white">
                50k+
              </dd>
            </div>
            <div className="flex flex-col mt-10 sm:mt-0">
              <dt className="order-2 mt-2 text-lg leading-6 font-medium text-orange-100">
                Questions Answered
              </dt>
              <dd className="order-1 text-5xl font-extrabold text-white">
                1M+
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default About;
