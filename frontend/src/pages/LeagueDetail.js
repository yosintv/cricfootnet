import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MatchCard from "../components/MatchCard";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const LeagueDetail = () => {
  const { leagueSlug } = useParams();
  const [leagueData, setLeagueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetchLeagueData();
  }, [leagueSlug]);

  useEffect(() => {
    if (leagueData?.league_name) {
      document.title = `${leagueData.league_name} - Live Matches & Schedule | CricFoot`;
      
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = "description";
        document.head.appendChild(metaDesc);
      }
      metaDesc.content = `Watch ${leagueData.league_name} live matches. Find complete schedule, fixtures, TV channels and broadcasting information for all ${leagueData.league_name} games on CricFoot.`;
    }
  }, [leagueData]);

  const fetchLeagueData = async () => {
    try {
      setLoading(true);
      setNotFound(false);
      const response = await axios.get(`${API}/league/${leagueSlug}`);
      setLeagueData(response.data);
    } catch (error) {
      console.error("Error fetching league data:", error);
      if (error.response?.status === 404) {
        setNotFound(true);
      }
    } finally {
      setLoading(false);
    }
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

  if (notFound || !leagueData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <Navbar />
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-7xl">
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-6 sm:p-8 text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">League Not Found</h2>
            <p className="text-red-200 mb-4 text-sm sm:text-base">The league you're looking for doesn't exist or has no upcoming matches.</p>
            <Link to="/" className="text-blue-400 hover:text-blue-300 underline text-sm sm:text-base">
              Go back to home
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

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

        {/* League Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl sm:rounded-2xl p-5 sm:p-8 mb-6 sm:mb-8 shadow-2xl" data-testid="league-header">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 leading-tight" data-testid="league-title">
                {leagueData.league_name}
              </h1>
              <p className="text-blue-100 text-sm sm:text-base md:text-lg">
                Live Matches, Fixtures & TV Schedule
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 sm:px-4 py-2 text-center flex-shrink-0">
              <div className="text-white text-xl sm:text-2xl font-bold">{leagueData.total_matches}</div>
              <div className="text-white/80 text-[10px] sm:text-xs">matches</div>
            </div>
          </div>
        </div>

        {/* Matches by Day */}
        {leagueData.schedule && leagueData.schedule.length > 0 ? (
          <div className="space-y-4 sm:space-y-8">
            {leagueData.schedule.map((day) => (
              <section key={day.date} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/10">
                <h2 className="text-base sm:text-xl md:text-2xl font-semibold text-white mb-3 sm:mb-4 flex items-center flex-wrap gap-2">
                  <span className="bg-purple-500 rounded-full w-2 h-2 sm:w-3 sm:h-3 mr-1 sm:mr-2"></span>
                  <span className="flex-1">{day.day_name}, {day.formatted_date}</span>
                  <span className="text-xs sm:text-sm bg-purple-600 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                    {day.matches.length} matches
                  </span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {day.matches.map((match) => (
                    <Link key={match.match_id} to={`/match/${match.match_id}`} className="block hover:scale-[1.02] transition-transform">
                      <MatchCard match={match} channelName="" />
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 sm:p-8 text-center border border-white/10">
            <p className="text-blue-200 text-base sm:text-lg">No matches available for this league</p>
          </div>
        )}

        {/* SEO Info */}
        <section className="mt-8 sm:mt-12 bg-slate-800/30 backdrop-blur-sm rounded-xl p-4 sm:p-8 border border-white/10">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 flex items-center">
            <span className="bg-yellow-600 w-1.5 sm:w-2 h-6 sm:h-8 mr-2 sm:mr-3 rounded"></span>
            About {leagueData.league_name}
          </h2>
          <div className="text-blue-200 text-xs sm:text-sm leading-relaxed space-y-2">
            <p>
              <strong className="text-white">{leagueData.league_name}</strong> matches and fixtures are broadcast across multiple TV channels worldwide. 
              Find the complete schedule of {leagueData.league_name} games, including kick-off times, venues, and where to watch on CricFoot.
            </p>
            <p>
              Stay updated with all {leagueData.league_name} live matches today and upcoming fixtures. CricFoot provides comprehensive TV listings for every {leagueData.league_name} game.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LeagueDetail;
