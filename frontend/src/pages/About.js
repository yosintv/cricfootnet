import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const About = () => {
  useEffect(() => {
    document.title = "About Us - CricFoot Live Sports TV Guide";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-8 shadow-2xl" data-testid="about-hero">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              About CricFoot
            </h1>
            <p className="text-blue-100 text-lg">
              Your trusted TV guide for live football and cricket coverage worldwide
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 mb-8 border border-white/10" data-testid="about-content">
            <h2 className="text-2xl font-bold text-white mb-4">Who We Are</h2>
            <p className="text-blue-200 mb-6 leading-relaxed">
              CricFoot is a comprehensive TV listings and sports schedule platform that helps fans around the world find where to watch their favorite football and cricket matches. We aggregate broadcasting information from hundreds of channels across multiple countries to bring you the most up-to-date match schedules.
            </p>

            <h2 className="text-2xl font-bold text-white mb-4">What We Do</h2>
            <p className="text-blue-200 mb-6 leading-relaxed">
              We provide detailed TV guides for live football matches including Premier League, UEFA Champions League, La Liga, Serie A, Bundesliga, and major international tournaments like the FIFA World Cup. Our platform covers 200+ countries and 280+ TV channels to ensure you never miss a match.
            </p>

            <h2 className="text-2xl font-bold text-white mb-4">Important Notice</h2>
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
              <p className="text-yellow-200 text-sm">
                <strong>CricFoot is a TV listings service.</strong> We do not stream, host, or broadcast any content. We simply provide information about where matches will be aired. To watch matches, you'll need to subscribe to the respective TV channels or streaming services.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
            <p className="text-blue-200 mb-6 leading-relaxed">
              Our mission is to be the world's most accurate and comprehensive sports TV guide. We help fans discover where and when to watch matches, making it easier to follow their favorite teams and leagues regardless of where they live.
            </p>

            <h2 className="text-2xl font-bold text-white mb-4">Features</h2>
            <ul className="text-blue-200 space-y-2 mb-6 list-disc list-inside">
              <li>Comprehensive 7-day match schedule</li>
              <li>280+ TV channels worldwide</li>
              <li>Country-specific broadcasting information</li>
              <li>Match details including venue and league</li>
              <li>Channel-specific schedules and listings</li>
              <li>Mobile-friendly responsive design</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
