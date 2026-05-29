import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import ScheduleTable from "../components/ScheduleTable";
import ChannelGrid from "../components/ChannelGrid";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Home = () => {
  const [channels, setChannels] = useState([]);
  const [schedule, setSchedule] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    document.title = "CricFoot - Live Sports Streaming Guide";
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [channelsRes, scheduleRes] = await Promise.all([
        axios.get(`${API}/channels`),
        axios.get(`${API}/schedule/7days`)
      ]);
      
      setChannels(channelsRes.data.channels || []);
      setSchedule(scheduleRes.data || {});
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
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12" data-testid="hero-section">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            CricFoot - Live Sports Streaming
          </h1>
          <p className="text-xl text-blue-200 mb-6">
            Watch live cricket and football from around the world
          </p>
          <div className="max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search channels..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm text-white placeholder-blue-200 border border-blue-300/30 focus:outline-none focus:ring-2 focus:ring-blue-400"
              data-testid="channel-search"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-400"></div>
          </div>
        ) : (
          <>
            {/* All Channels Section */}
            <section className="mb-16" data-testid="channels-section">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                <span className="bg-blue-600 w-2 h-8 mr-3 rounded"></span>
                All Channels ({filteredChannels.length})
              </h2>
              <ChannelGrid channels={filteredChannels} />
            </section>

            {/* 7-Day Schedule Section */}
            <section data-testid="schedule-section">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                <span className="bg-green-600 w-2 h-8 mr-3 rounded"></span>
                7-Day TV Schedule
              </h2>
              <ScheduleTable schedule={schedule} />
            </section>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900/50 backdrop-blur-sm mt-16 py-8 border-t border-white/10">
        <div className="container mx-auto px-4 text-center text-blue-200">
          <p>© 2026 CricFoot. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
