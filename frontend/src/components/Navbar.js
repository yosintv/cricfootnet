import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-slate-900/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50" data-testid="navbar">
      <div className="container mx-auto px-3 sm:px-4 max-w-7xl">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3" data-testid="nav-logo">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-1.5 sm:p-2">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-white text-lg sm:text-xl font-bold">CricFoot</span>
          </Link>
          
          <div className="flex items-center space-x-3 sm:space-x-6">
            <Link 
              to="/" 
              className="text-blue-200 hover:text-white transition-colors text-sm sm:text-base"
              data-testid="nav-home"
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className="text-blue-200 hover:text-white transition-colors text-sm sm:text-base"
              data-testid="nav-about"
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className="text-blue-200 hover:text-white transition-colors text-sm sm:text-base"
              data-testid="nav-contact"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
