import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Privacy = () => {
  useEffect(() => {
    document.title = "Privacy Policy - CricFoot";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-8 shadow-2xl">
            <h1 className="text-4xl font-bold text-white mb-2">Privacy Policy</h1>
            <p className="text-blue-100">Last updated: January 2026</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-white/10 text-blue-200 space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-white mb-3">Information We Collect</h2>
              <p>CricFoot is a TV listings service. We collect minimal information to provide our services, including anonymous usage analytics to improve user experience.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">How We Use Information</h2>
              <p>We use collected information solely to improve our TV guide services, fix bugs, and enhance user experience. We do not sell or share your data with third parties.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">Cookies</h2>
              <p>We use essential cookies to ensure proper website functionality. You can disable cookies in your browser settings.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">Third-Party Links</h2>
              <p>Our website may contain links to third-party broadcasters. We are not responsible for the privacy practices of these external sites.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">Contact Us</h2>
              <p>If you have any questions about our Privacy Policy, please contact us at support@cricfoot.com</p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Privacy;
