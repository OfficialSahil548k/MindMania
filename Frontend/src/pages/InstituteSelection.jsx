import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchInstitutes } from "../api/axios";
import Loader from "../components/Loader";

const InstituteSelection = () => {
  const [institutes, setInstitutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInstitutesData = async () => {
      try {
        const { data } = await fetchInstitutes();
        setInstitutes(data);
      } catch (error) {
        console.error("Failed to load institutes", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInstitutesData();
  }, []);

  const handleSelect = (id) => {
    navigate(`/institutes/${id}/quizzes`);
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-10">
          Select an Institute
        </h1>

        {institutes.length === 0 ? (
          <div className="text-center text-gray-500 text-lg">
            No institutes available at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {institutes.map((inst) => (
              <div
                key={inst._id}
                onClick={() => handleSelect(inst._id)}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer border border-transparent hover:border-indigo-100 transform hover:-translate-y-1"
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-indigo-100 p-3 rounded-full">
                      <svg
                        className="w-6 h-6 text-indigo-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {inst.name}
                  </h3>
                  <p className="text-gray-600 line-clamp-3">
                    {inst.description ||
                      "Explore quizzes offered by this institute."}
                  </p>
                  <div className="mt-6 flex items-center text-indigo-600 font-medium">
                    <span>View Quizzes</span>
                    <svg
                      className="w-4 h-4 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InstituteSelection;
