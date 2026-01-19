import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Added useNavigate if needed, but maybe not essential
import { uploadProfileImage } from "../api/axios";

const Profile = () => {
  const { id } = useParams();
  // Initialize state from localStorage, but allow updates
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("profile")));
  const [uploading, setUploading] = useState(false);

  // Robust check for user ID (considering both _id and googleId if applicable)
  const currentUserId = user?.result?._id || user?.result?.googleId;

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File size too large. Please select an image under 5MB.");
      return;
    }

    const formData = new FormData();
    formData.append("profileImage", file);

    setUploading(true);
    try {
      const { data } = await uploadProfileImage(formData);

      const updatedUser = { ...user, result: data.result };
      setUser(updatedUser);
      localStorage.setItem("profile", JSON.stringify(updatedUser));
    } catch (error) {
      console.error(error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to upload image.";
      alert(`Upload failed: ${errorMessage}`);
    } finally {
      setUploading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gray-50">
        <p className="text-xl text-gray-600">
          Please log in to view your profile.
        </p>
      </div>
    );
  }

  // Check if viewing own profile
  if (id && currentUserId && id !== currentUserId) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Profile Not Found
          </h2>
          <p className="text-gray-600">
            You do not have permission to view this profile or the user does not
            exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-primary px-6 py-8 sm:px-10">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">My Profile</h1>
            <div className="relative h-20 w-20">
              <div className="h-full w-full rounded-full bg-white border-4 border-orange-200 overflow-hidden shadow-md">
                <img
                  src={
                    user?.result?.profileImage ||
                    `https://api.dicebear.com/9.x/micah/svg?seed=${
                      user?.result?.name || "User"
                    }`
                  }
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <label
                htmlFor="profile-image-upload"
                className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-lg cursor-pointer hover:bg-gray-100 transition-colors border border-gray-200"
                title="Update Profile Picture"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4 text-gray-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
                  />
                </svg>
              </label>
              <input
                type="file"
                id="profile-image-upload"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
              />
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                </div>
              )}
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
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Role
                </label>
                <div className="mt-1 text-lg text-gray-900 capitalize">
                  {user?.result?.role || "Student"}
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
