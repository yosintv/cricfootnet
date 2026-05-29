import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Terms = () => {
  useEffect(() => {
    document.title = "Terms of Service - CricFoot";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-8 shadow-2xl">
            <h1 className="text-4xl font-bold text-white mb-2">Terms of Service</h1>
            <p className="text-blue-100">Last updated: January 2026</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-white/10 text-blue-200 space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-white mb-3">Acceptance of Terms</h2>
              <p>By accessing and using CricFoot, you accept and agree to be bound by the terms and provisions of this agreement.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">Service Description</h2>
              <p>CricFoot is a free TV listings and sports schedule service. We provide information about where matches are broadcasted. We do not stream, host, or broadcast any content.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">No Streaming Service</h2>
              <p>CricFoot is a TV guide only. We are not affiliated with any broadcaster or streaming service. To watch matches, please subscribe to the respective TV channels.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">Accuracy of Information</h2>
              <p>While we strive to provide accurate schedules, broadcast times and channels may change without notice. Please verify with official broadcasters before making plans.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">User Conduct</h2>
              <p>Users agree not to misuse our services, attempt to disrupt functionality, or use our content for commercial purposes without permission.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">Changes to Terms</h2>
              <p>We reserve the right to modify these terms at any time. Continued use of our service after changes constitutes acceptance of the new terms.</p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;
