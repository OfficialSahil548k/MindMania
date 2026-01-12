import React from "react";

const Profile = () => {
  const user = JSON.parse(localStorage.getItem("profile"));

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gray-50">
        <p className="text-xl text-gray-600">
          Please log in to view your profile.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-primary px-6 py-8 sm:px-10">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">My Profile</h1>
            <div className="h-20 w-20 rounded-full bg-white border-4 border-orange-200 overflow-hidden shadow-md">
              <img
                src={`https://api.dicebear.com/9.x/micah/svg?seed=${
                  user?.result?.name || "User"
                }`}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
        <div className="px-6 py-8 sm:px-10 space-y-6">
          <div className="border-b border-gray-100 pb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-2">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Full Name
                </label>
                <div className="mt-1 text-lg text-gray-900">
                  {user?.result?.name}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Email Address
                </label>
                <div className="mt-1 text-lg text-gray-900">
                  {user?.result?.email}
                </div>
              </div>
            </div>
          </div>

          {/* Placeholder for future sections */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Account Activity
            </h2>
            <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
              <p className="text-gray-600 text-sm">
                No recent activity. Start a quiz to see your progress here!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
