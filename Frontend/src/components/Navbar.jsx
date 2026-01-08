import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">
              M
            </div>
            <h1 className="text-2xl font-stylish italic text-primary font-bold">
              MindMania
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-primary transition-colors font-medium"
            >
              Home
            </Link>
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

            {/* Login/Register Icon */}
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
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
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
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full left-0 top-16 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col items-center">
            <Link
              to="/"
              className="block px-3 py-2 text-gray-700 hover:text-primary font-medium"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="block px-3 py-2 text-gray-700 hover:text-primary font-medium"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="block px-3 py-2 text-gray-700 hover:text-primary font-medium"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
            <Link
              to="/login"
              className="mt-2 flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-orange-100 text-primary transition-colors"
              title="Login / Register"
              onClick={() => setIsOpen(false)}
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
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
