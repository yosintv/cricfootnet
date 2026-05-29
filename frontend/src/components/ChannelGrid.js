import React from "react";
import { Link } from "react-router-dom";

const ChannelGrid = ({ channels }) => {
  if (!channels || channels.length === 0) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 text-center border border-white/10">
        <p className="text-blue-200 text-lg">No channels available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4" data-testid="channel-grid">
      {channels.map((channel) => (
        <Link
          key={channel}
          to={`/channel/${encodeURIComponent(channel)}`}
          className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-lg p-4 hover:from-blue-600/80 hover:to-purple-600/80 transition-all duration-300 transform hover:scale-105 hover:shadow-xl border border-white/10 hover:border-blue-400/50 group"
          data-testid={`channel-item-${channel}`}
        >
          <div className="flex flex-col items-center justify-center text-center h-full">
            <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-full p-3 mb-3 group-hover:from-white group-hover:to-blue-200 transition-all">
              <svg className="w-6 h-6 text-white group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-white text-sm font-medium leading-tight line-clamp-2">
              {channel}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ChannelGrid;
