import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import ScheduleTable from "../components/ScheduleTable";
import ChannelGrid from "../components/ChannelGrid";
import LeaguesGrid from "../components/LeaguesGrid";
import Footer from "../components/Footer";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Home = () => {
  const [channels, setChannels] = useState([]);
  const [schedule, setSchedule] = useState({});
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    document.title = "CricFoot - Football Live TV Channels | Football Live Stream Free Channels";
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [channelsRes, scheduleRes, leaguesRes] = await Promise.all([
        axios.get(`${API}/channels`),
        axios.get(`${API}/schedule/7days`),
        axios.get(`${API}/leagues`)
      ]);
      
      setChannels(channelsRes.data.channels || []);
      setSchedule(scheduleRes.data || {});
      setLeagues(leaguesRes.data.leagues || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredChannels = channels.filter(channel =>
    channel.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Navbar />
      
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12" data-testid="hero-section">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 leading-tight">
            CricFoot - Football Live TV Channels
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-blue-200 mb-2 px-2">
            Football Live Stream Free Channels
          </p>
          <p className="text-sm sm:text-base text-blue-300/70 mb-4 sm:mb-6 px-2">
            Watch live cricket and football schedule from around the world
          </p>
          <div className="max-w-md mx-auto px-2">
            <input
              type="text"
              placeholder="Search channels..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base rounded-full bg-white/10 backdrop-blur-sm text-white placeholder-blue-200 border border-blue-300/30 focus:outline-none focus:ring-2 focus:ring-blue-400"
              data-testid="channel-search"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-4 border-b-4 border-blue-400"></div>
          </div>
        ) : (
          <>
            {/* All Channels Section */}
            <section className="mb-10 sm:mb-16" data-testid="channels-section">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6 flex items-center">
                <span className="bg-blue-600 w-1.5 sm:w-2 h-6 sm:h-8 mr-2 sm:mr-3 rounded"></span>
                All Channels ({filteredChannels.length})
              </h2>
              <ChannelGrid channels={filteredChannels} />
            </section>

            {/* 7-Day Schedule Section */}
            <section className="mb-10 sm:mb-16" data-testid="schedule-section">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6 flex items-center">
                <span className="bg-green-600 w-1.5 sm:w-2 h-6 sm:h-8 mr-2 sm:mr-3 rounded"></span>
                Live Football Schedule
              </h2>
              <ScheduleTable schedule={schedule} />
            </section>

            {/* All Leagues Section */}
            <section className="mb-10 sm:mb-16" data-testid="leagues-section">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-3 flex items-center">
                <span className="bg-purple-600 w-1.5 sm:w-2 h-6 sm:h-8 mr-2 sm:mr-3 rounded"></span>
                All Football Leagues from Around the World ({leagues.length})
              </h2>
              <p className="text-blue-200 text-xs sm:text-sm mb-4 sm:mb-6">
                Click any league to see all upcoming matches, fixtures and TV broadcasts
              </p>
              <LeaguesGrid leagues={leagues} />
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Home;
