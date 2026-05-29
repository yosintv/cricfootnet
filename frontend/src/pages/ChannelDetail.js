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
  const { channelName } = useParams();
  const [channelData, setChannelData] = useState(null);
  const [todayMatches, setTodayMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Update page title for SEO
    document.title = `${channelName} Live Stream Free - Watch ${channelName} Football Today | CricFoot`;
    
    // Update meta description for SEO
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = `Watch ${channelName} Live Stream Free. Find ${channelName} football schedule today, live match fixtures, Premier League, UEFA Champions League, La Liga and more on CricFoot TV guide.`;
    
    fetchChannelData();
  }, [channelName]);

  const fetchChannelData = async () => {
    try {
      setLoading(true);
      const [allMatchesRes, todayRes] = await Promise.all([
        axios.get(`${API}/channel/${encodeURIComponent(channelName)}`),
        axios.get(`${API}/channel/${encodeURIComponent(channelName)}/today`)
      ]);
      
      setChannelData(allMatchesRes.data);
      setTodayMatches(todayRes.data.matches || []);
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
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-400"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Channel Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-8 shadow-2xl" data-testid="channel-header">
          <Link to="/" className="text-blue-200 hover:text-white mb-4 inline-flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2" data-testid="channel-title">
            {channelName} Live Stream Free
          </h1>
          <p className="text-blue-100 text-lg mb-2">
            Watch {channelName} Live Online - {channelName} Football Live Stream Today
          </p>
          <p className="text-blue-200/80 text-sm">
            Find {channelName} TV guide, match fixtures, live football schedule & sports coverage
          </p>
        </div>

        {/* Today's Matches */}
        <section className="mb-12" data-testid="today-matches-section">
          <h2 className="text-3xl font-bold text-white mb-4 flex items-center">
            <span className="bg-red-600 w-2 h-8 mr-3 rounded"></span>
            {channelName} Live Match Today ({todayMatches.length} matches)
          </h2>
          <p className="text-blue-200 mb-6 text-sm">
            {channelName} Football Today - {channelName} TV Guide Today - {channelName} Match Fixtures Today
          </p>
          {todayMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {todayMatches.map((match) => (
                <Link key={match.match_id} to={`/match/${match.match_id}`} className="block hover:scale-105 transition-transform">
                  <MatchCard match={match} channelName={channelName} />
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 text-center border border-white/10">
              <p className="text-blue-200 text-lg">No matches scheduled for today on {channelName}</p>
              <p className="text-blue-300/70 text-sm mt-2">Check the upcoming schedule below for {channelName} football coverage</p>
            </div>
          )}
        </section>

        {/* Upcoming 7-Day Schedule - ALL MATCHES */}
        <section data-testid="upcoming-schedule-section">
          <h2 className="text-3xl font-bold text-white mb-4 flex items-center">
            <span className="bg-green-600 w-2 h-8 mr-3 rounded"></span>
            {channelName} Live Football Schedule (7 Days)
          </h2>
          <p className="text-blue-200 mb-6 text-sm">
            {channelName} Sports Schedule - {channelName} Match Broadcast - {channelName} Live Football on TV
          </p>
          {channelData && channelData.schedule && channelData.schedule.length > 0 ? (
            <div className="space-y-8">
              {channelData.schedule.map((day) => (
                <div key={day.date} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="text-2xl font-semibold text-white mb-4 flex items-center">
                    <span className="bg-blue-500 rounded-full w-3 h-3 mr-3"></span>
                    {day.day_name}, {day.formatted_date}
                    <span className="ml-auto text-sm bg-blue-600 px-3 py-1 rounded-full">
                      {day.matches.length} matches
                    </span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {day.matches.map((match) => (
                      <Link key={match.match_id} to={`/match/${match.match_id}`} className="block hover:scale-105 transition-transform">
                        <MatchCard match={match} channelName={channelName} compact={true} />
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 text-center border border-white/10">
              <p className="text-blue-200 text-lg">No upcoming matches in the next 7 days</p>
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
