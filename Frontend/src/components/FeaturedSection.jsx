import React from "react";

const FeaturedSection = () => {
  const items = [
    {
      id: 1,
      category: "Quiz",
      title: "Master Javascript Fundamentals",
      image:
        "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=500&h=300&fit=crop&q=80", // Kept (seems ok)
      description:
        "Test your knowledge of closures, hoisting, and async/await.",
    },
    {
      id: 2,
      category: "Article",
      title: "The Future of AI in Education",
      image:
        "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500&h=300&fit=crop&q=80", // Robot/AI
      description:
        "How artificial intelligence is reshaping how we learn and teach.",
    },
    {
      id: 3,
      category: "Quiz",
      title: "World History Challenge",
      image:
        "https://images.unsplash.com/photo-1599930113854-d6d7fd521f10?w=500&h=300&fit=crop&q=80", // Ancient ruins
      description: "Travel through time and see how well you know our past.",
    },
    {
      id: 4,
      category: "Article",
      title: "Top 10 Study Hacks",
      image:
        "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=500&h=300&fit=crop&q=80", // Updated Study image
      description:
        "Boost your productivity and retain more information with these tips.",
    },
  ];

  return (
    <section className="py-20 px-4 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-bold font-stylish italic text-gray-900 mb-2">
              Editor's Picks
            </h2>
            <p className="text-gray-600">Curated content just for you.</p>
          </div>
          <button className="text-primary font-semibold hover:text-orange-700 transition-colors mt-4 md:mt-0">
            View All &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item) => (
            <div key={item.id} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-2xl mb-4">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                {item.title}
              </h3>
              <p className="text-gray-600 line-clamp-2">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;
