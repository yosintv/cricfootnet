import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { slugify } from "../lib/slugify";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const MatchDetail = () => {
  const { matchId } = useParams();
  const [matchData, setMatchData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatchData();
  }, [matchId]);

  const fetchMatchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/match/${matchId}`);
      setMatchData(response.data);
      
      if (response.data.match) {
        document.title = `${response.data.match.fixture} - ${response.data.match.league} | CricFoot`;
      }
    } catch (error) {
      console.error("Error fetching match data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <Navbar />
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-4 border-b-4 border-blue-400"></div>
        </div>
      </div>
    );
  }

  if (!matchData || !matchData.match) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <Navbar />
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-7xl">
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-6 sm:p-8 text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Match Not Found</h2>
            <p className="text-red-200 mb-4 text-sm sm:text-base">The match you're looking for doesn't exist or has been removed.</p>
            <Link to="/" className="text-blue-400 hover:text-blue-300 underline text-sm sm:text-base">
              Go back to home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { match, formatted_date, day_name } = matchData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Navbar />
      
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-7xl">
        {/* Back Button */}
        <Link to="/" className="text-blue-200 hover:text-white mb-4 sm:mb-6 inline-flex items-center text-sm sm:text-base">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>

        {/* Match Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl sm:rounded-2xl p-5 sm:p-8 mb-6 sm:mb-8 shadow-2xl" data-testid="match-header">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3 sm:mb-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 leading-tight">
                {match.fixture}
              </h1>
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 text-white/90 text-xs sm:text-sm md:text-base">
                <div className="flex items-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span className="font-semibold">{match.league}</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{formatTime(match.kickoff)}</span>
                </div>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 sm:px-4 py-2 self-start whitespace-nowrap">
              <div className="text-white text-xs sm:text-sm font-medium">{day_name}</div>
              <div className="text-white/80 text-[10px] sm:text-xs">{formatted_date}</div>
            </div>
          </div>
          
          {match.venue && (
            <div className="flex items-start text-white/90 bg-white/10 rounded-lg p-2.5 sm:p-3 mt-3 sm:mt-4 text-xs sm:text-sm">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span><strong>Venue:</strong> {match.venue}</span>
            </div>
          )}
        </div>

        {/* Broadcasting Channels by Country */}
        <section data-testid="broadcasting-section">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6 flex items-center">
            <span className="bg-purple-600 w-1.5 sm:w-2 h-6 sm:h-8 mr-2 sm:mr-3 rounded"></span>
            Broadcasting Channels by Country (A-Z)
          </h2>
          
          {match.tv_channels && match.tv_channels.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {match.tv_channels.map((tv, idx) => (
                <div 
                  key={idx} 
                  className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/10 hover:border-blue-400/50 transition-all"
                  data-testid={`country-${tv.country}`}
                >
                  <div className="flex items-start">
                    <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-full p-2 sm:p-3 mr-3 sm:mr-4 flex-shrink-0">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-xl font-bold text-white mb-2 sm:mb-3 break-words">{tv.country}</h3>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {tv.channels && tv.channels.map((channel, chIdx) => (
                          <Link
                            key={chIdx}
                            to={`/channel/${slugify(channel)}`}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium text-xs sm:text-sm transition-all shadow-lg break-words"
                            data-testid={`channel-link-${channel}`}
                          >
                            {channel}
                          </Link>
                        ))}
                      </div>
                      {tv.channels && tv.channels.length > 1 && (
                        <div className="text-blue-300 text-xs mt-2">
                          {tv.channels.length} channels available
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 sm:p-8 text-center border border-white/10">
              <p className="text-blue-200 text-base sm:text-lg">No broadcasting information available</p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default MatchDetail;
