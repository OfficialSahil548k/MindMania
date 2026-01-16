import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // To trigger re-render on route change

  const user = JSON.parse(localStorage.getItem("profile"));

  const handleLogout = () => {
    localStorage.removeItem("profile");
    navigate("/");
    setIsOpen(false);
  };

  return (
    <nav className="bg-white shadow-md relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">
              M
            </div>
            <h1 className="text-2xl font-stylish italic text-primary font-bold">
              MindMania
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-primary transition-colors font-medium"
            >
              Home
            </Link>
            {user &&
              user?.result?.role !== "instructor" &&
              user?.result?.role !== "admin" && (
                <Link
                  to="/quizzes"
                  className="text-gray-700 hover:text-primary transition-colors font-medium"
                >
                  Quizzes
                </Link>
              )}

            {(user?.result?.role === "instructor" ||
              user?.result?.role === "admin") && (
              <Link
                to={`/${user?.result?._id}/dashboard`}
                className="text-gray-700 hover:text-primary transition-colors font-medium"
              >
                Dashboard
              </Link>
            )}
            <Link
              to="/about"
              className="text-gray-700 hover:text-primary transition-colors font-medium"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 hover:text-primary transition-colors font-medium"
            >
              Contact
            </Link>

            {/* Auth Buttons */}
            {user ? (
              <div className="flex items-center gap-4">
                {!location.pathname.startsWith("/profile") && (
                  <Link
                    to={`/profile/${user?.result?._id}`}
                    className="flex items-center gap-2 transition-transform hover:scale-105"
                    title="Profile"
                  >
                    <div className="w-10 h-10 rounded-full border-2 border-orange-200 overflow-hidden shadow-sm hover:shadow-md hover:border-orange-400 transition-all">
                      <img
                        src={`https://api.dicebear.com/9.x/micah/svg?seed=${
                          user?.result?.name || "User"
                        }`}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-orange-600 transition-colors shadow-md hover:shadow-lg"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-orange-100 text-primary transition-colors"
                title="Login / Register"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            {/* Show mini profile icon on mobile when logged in outside menu? Or just keep in menu. Keeping in menu for simplicity */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full left-0 top-16 shadow-lg z-50">
          <div className="px-4 pt-4 pb-6 space-y-3 flex flex-col items-center">
            <Link
              to="/"
              className="block px-3 py-2 text-gray-700 hover:text-primary font-medium w-full text-center hover:bg-gray-50 rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            {user &&
              user?.result?.role !== "instructor" &&
              user?.result?.role !== "admin" && (
                <Link
                  to="/quizzes"
                  className="block px-3 py-2 text-gray-700 hover:text-primary font-medium w-full text-center hover:bg-gray-50 rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Quizzes
                </Link>
              )}

            {(user?.result?.role === "instructor" ||
              user?.result?.role === "admin") && (
              <Link
                to={`/${user?.result?._id}/dashboard`}
                className="block px-3 py-2 text-gray-700 hover:text-primary font-medium w-full text-center hover:bg-gray-50 rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
            )}
            <Link
              to="/about"
              className="block px-3 py-2 text-gray-700 hover:text-primary font-medium w-full text-center hover:bg-gray-50 rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="block px-3 py-2 text-gray-700 hover:text-primary font-medium w-full text-center hover:bg-gray-50 rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>

            <div className="w-full border-t border-gray-100 my-2"></div>

            {user ? (
              <>
                {!location.pathname.startsWith("/profile") && (
                  <Link
                    to={`/profile/${user?.result?._id}`}
                    className="flex items-center justify-center gap-2 px-3 py-2 text-gray-700 hover:text-primary font-medium w-full hover:bg-gray-50 rounded-lg"
                    title="Profile"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="w-8 h-8 rounded-full border border-orange-200 overflow-hidden">
                      <img
                        src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${
                          user?.result?.name || "User"
                        }`}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    My Profile
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full mt-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-orange-600 transition-colors shadow-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center justify-center gap-2 px-3 py-2 text-gray-700 hover:text-primary font-medium w-full hover:bg-gray-50 rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>
                Login / Register
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
