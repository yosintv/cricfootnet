import React from "react";

const MatchCard = ({ match, channelName, compact = false }) => {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getAllChannels = () => {
    const channels = [];
    if (match.tv_channels) {
      match.tv_channels.forEach(tv => {
        if (tv.channels) {
          tv.channels.forEach(ch => {
            if (!channels.includes(ch)) {
              channels.push(ch);
            }
          });
        }
      });
    }
    return channels;
  };

  const allChannels = getAllChannels();

  if (compact) {
    return (
      <div className="bg-slate-900/50 rounded-lg p-2.5 sm:p-3 border border-white/5 hover:border-blue-500/50 transition-all h-full" data-testid={`match-card-${match.match_id}`}>
        <div className="text-xs sm:text-sm text-green-400 font-medium mb-1">
          {formatTime(match.kickoff)}
        </div>
        <div className="text-white font-medium text-xs sm:text-sm mb-1 line-clamp-2">
          {match.fixture}
        </div>
        <div className="text-blue-300 text-[10px] sm:text-xs line-clamp-1">
          {match.league}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 hover:border-blue-400/50 transition-all hover:shadow-xl h-full" data-testid={`match-card-${match.match_id}`}>
      {/* Match Header */}
      <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 p-3 sm:p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <span className="text-green-400 font-bold text-base sm:text-lg">
            {formatTime(match.kickoff)}
          </span>
          <span className="text-blue-200 text-xs sm:text-sm">
            {formatDate(match.kickoff)}
          </span>
        </div>
      </div>

      {/* Match Details */}
      <div className="p-3 sm:p-4">
        <h3 className="text-white font-bold text-sm sm:text-base md:text-lg mb-2 sm:mb-3 leading-tight line-clamp-2">
          {match.fixture}
        </h3>
        
        <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
          <div className="flex items-start">
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400 mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="text-blue-200 text-xs sm:text-sm line-clamp-1">{match.league}</span>
          </div>
          
          {match.venue && (
            <div className="flex items-start">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400 mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-purple-200 text-xs sm:text-sm line-clamp-2">{match.venue}</span>
            </div>
          )}
        </div>

        {/* Broadcasting Channels */}
        <div className="border-t border-white/10 pt-2 sm:pt-3">
          <div className="text-[10px] sm:text-xs text-blue-300 mb-1.5 sm:mb-2 font-medium">Broadcasting on:</div>
          <div className="flex flex-wrap gap-1">
            {allChannels.slice(0, 3).map((channel, idx) => (
              <span 
                key={idx}
                className={`inline-block text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded ${
                  channel === channelName 
                    ? 'bg-green-600 text-white font-semibold' 
                    : 'bg-blue-600/30 text-blue-200'
                }`}
              >
                {channel}
              </span>
            ))}
            {allChannels.length > 3 && (
              <span className="inline-block bg-slate-700/50 text-blue-300 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                +{allChannels.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchCard;
