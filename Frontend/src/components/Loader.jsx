import React from "react";

const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-orange-100 border-t-primary rounded-full animate-spin"></div>
        <h2 className="text-xl font-medium text-gray-600 animate-pulse">
          Loading MindMania...
        </h2>
      </div>
    </div>
  );
};

export default Loader;
