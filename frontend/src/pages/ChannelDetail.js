import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import MatchCard from "../components/MatchCard";
import Footer from "../components/Footer";
import SEOKeywords from "../components/SEOKeywords";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ChannelDetail = () => {
  const { channelName: channelSlug } = useParams();
  const [channelData, setChannelData] = useState(null);
  const [todayMatches, setTodayMatches] = useState([]);
  const [actualChannelName, setActualChannelName] = useState(channelSlug);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChannelData();
  }, [channelSlug]);

  useEffect(() => {
    if (actualChannelName) {
      document.title = `${actualChannelName} Live Stream Free - Watch ${actualChannelName} Football Today | CricFoot`;
      
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = "description";
        document.head.appendChild(metaDesc);
      }
      metaDesc.content = `Watch ${actualChannelName} Live Stream Free. Find ${actualChannelName} football schedule today, live match fixtures, Premier League, UEFA Champions League, La Liga and more on CricFoot TV guide.`;
    }
  }, [actualChannelName]);

  const fetchChannelData = async () => {
    try {
      setLoading(true);
      const [allMatchesRes, todayRes] = await Promise.all([
        axios.get(`${API}/channel/${channelSlug}`),
        axios.get(`${API}/channel/${channelSlug}/today`)
      ]);
      
      setChannelData(allMatchesRes.data);
      setTodayMatches(todayRes.data.matches || []);
      
      // Use the resolved channel name from backend
      if (allMatchesRes.data.channel_name) {
        setActualChannelName(allMatchesRes.data.channel_name);
      }
    } catch (error) {
      console.error("Error fetching channel data:", error);
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

  const channelName = actualChannelName;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Navbar />
      
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-7xl">
        {/* Channel Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl sm:rounded-2xl p-5 sm:p-8 mb-6 sm:mb-8 shadow-2xl" data-testid="channel-header">
          <Link to="/" className="text-blue-200 hover:text-white mb-3 sm:mb-4 inline-flex items-center text-sm sm:text-base">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 leading-tight" data-testid="channel-title">
            {channelName} Live Stream Free
          </h1>
          <p className="text-blue-100 text-sm sm:text-base md:text-lg mb-2">
            Watch {channelName} Live Online - {channelName} Football Live Stream Today
          </p>
          <p className="text-blue-200/80 text-xs sm:text-sm">
            Find {channelName} TV guide, match fixtures, live football schedule & sports coverage
          </p>
        </div>

        {/* Today's Matches */}
        <section className="mb-8 sm:mb-12" data-testid="today-matches-section">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-4 flex items-center">
            <span className="bg-red-600 w-1.5 sm:w-2 h-6 sm:h-8 mr-2 sm:mr-3 rounded"></span>
            {channelName} Live Match Today ({todayMatches.length})
          </h2>
          <p className="text-blue-200 mb-4 sm:mb-6 text-xs sm:text-sm">
            {channelName} Football Today - {channelName} TV Guide Today - {channelName} Match Fixtures Today
          </p>
          {todayMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {todayMatches.map((match) => (
                <Link key={match.match_id} to={`/match/${match.match_id}`} className="block hover:scale-[1.02] transition-transform">
                  <MatchCard match={match} channelName={channelName} />
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 sm:p-8 text-center border border-white/10">
              <p className="text-blue-200 text-base sm:text-lg">No matches scheduled for today on {channelName}</p>
              <p className="text-blue-300/70 text-xs sm:text-sm mt-2">Check the upcoming schedule below for {channelName} football coverage</p>
            </div>
          )}
        </section>

        {/* Upcoming 7-Day Schedule - ALL MATCHES */}
        <section data-testid="upcoming-schedule-section">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-4 flex items-center">
            <span className="bg-green-600 w-1.5 sm:w-2 h-6 sm:h-8 mr-2 sm:mr-3 rounded"></span>
            {channelName} Live Football Schedule (7 Days)
          </h2>
          <p className="text-blue-200 mb-4 sm:mb-6 text-xs sm:text-sm">
            {channelName} Sports Schedule - {channelName} Match Broadcast - {channelName} Live Football on TV
          </p>
          {channelData && channelData.schedule && channelData.schedule.length > 0 ? (
            <div className="space-y-4 sm:space-y-8">
              {channelData.schedule.map((day) => (
                <div key={day.date} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/10">
                  <h3 className="text-base sm:text-xl md:text-2xl font-semibold text-white mb-3 sm:mb-4 flex items-center flex-wrap gap-2">
                    <span className="bg-blue-500 rounded-full w-2 h-2 sm:w-3 sm:h-3 mr-1 sm:mr-2"></span>
                    <span className="flex-1">{day.day_name}, {day.formatted_date}</span>
                    <span className="text-xs sm:text-sm bg-blue-600 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                      {day.matches.length} matches
                    </span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
                    {day.matches.map((match) => (
                      <Link key={match.match_id} to={`/match/${match.match_id}`} className="block hover:scale-[1.02] transition-transform">
                        <MatchCard match={match} channelName={channelName} compact={true} />
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 sm:p-8 text-center border border-white/10">
              <p className="text-blue-200 text-base sm:text-lg">No upcoming matches in the next 7 days</p>
            </div>
          )}
        </section>

        {/* SEO Keywords Section */}
        <SEOKeywords channelName={channelName} />
      </main>

      <Footer />
    </div>
  );
};

export default ChannelDetail;
