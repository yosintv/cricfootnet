import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-slate-900/80 backdrop-blur-sm mt-8 sm:mt-16 border-t border-white/10" data-testid="footer">
      <div className="container mx-auto px-3 sm:px-4 py-8 sm:py-12 max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* About Section */}
          <div className="sm:col-span-2">
            <Link to="/" className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-1.5 sm:p-2">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-white text-lg sm:text-xl font-bold">CricFoot</span>
            </Link>
            <p className="text-blue-200 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed">
              CricFoot is your ultimate TV guide for live football and cricket matches. Find comprehensive schedules, match fixtures, and channel listings for all major leagues including Premier League, UEFA Champions League, La Liga, Serie A, Bundesliga, and international tournaments.
            </p>
            <p className="text-blue-300/70 text-[10px] sm:text-xs">
              We provide TV listings and schedules only. We do not stream or broadcast content.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Quick Links</h3>
            <ul className="space-y-1.5 sm:space-y-2">
              <li>
                <Link to="/" className="text-blue-200 hover:text-white text-xs sm:text-sm transition-colors" data-testid="footer-home">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-blue-200 hover:text-white text-xs sm:text-sm transition-colors" data-testid="footer-about">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-blue-200 hover:text-white text-xs sm:text-sm transition-colors" data-testid="footer-contact">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-blue-200 hover:text-white text-xs sm:text-sm transition-colors" data-testid="footer-privacy">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-blue-200 hover:text-white text-xs sm:text-sm transition-colors" data-testid="footer-terms">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Popular Leagues</h3>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              <li className="text-blue-200">UEFA Champions League</li>
              <li className="text-blue-200">Premier League</li>
              <li className="text-blue-200">La Liga</li>
              <li className="text-blue-200">Serie A</li>
              <li className="text-blue-200">Bundesliga</li>
              <li className="text-blue-200">FIFA World Cup</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-4 sm:pt-6 flex flex-col sm:flex-row justify-between items-center text-blue-300/70 text-[10px] sm:text-xs gap-2">
          <p>© 2026 CricFoot. All rights reserved.</p>
          <p>
            <a href={`${process.env.REACT_APP_BACKEND_URL}/api/sitemap.xml`} className="hover:text-white transition-colors" data-testid="footer-sitemap" target="_blank" rel="noopener noreferrer">
              Sitemap
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
