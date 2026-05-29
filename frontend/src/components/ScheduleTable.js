import React from "react";
import { Link } from "react-router-dom";

const ScheduleTable = ({ schedule }) => {
  if (!schedule || Object.keys(schedule).length === 0) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 sm:p-8 text-center border border-white/10">
        <p className="text-blue-200 text-base sm:text-lg">No schedule data available</p>
      </div>
    );
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  return (
    <div className="space-y-4 sm:space-y-6" data-testid="schedule-table">
      {Object.entries(schedule).map(([dateKey, dayData]) => (
        <div key={dateKey} className="bg-slate-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10">
          {/* Day Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 sm:p-4">
            <h3 className="text-base sm:text-xl font-bold text-white flex items-center justify-between gap-2">
              <span className="truncate">
                {dayData.day_name}, {dayData.date}
              </span>
              <span className="text-xs sm:text-sm bg-white/20 px-2 sm:px-3 py-1 rounded-full whitespace-nowrap flex-shrink-0">
                {dayData.total_matches} matches
              </span>
            </h3>
          </div>

          {/* Matches - Show ALL */}
          <div className="p-2 sm:p-4">
            {dayData.matches && dayData.matches.length > 0 ? (
              <div className="space-y-2 sm:space-y-3">
                {dayData.matches.map((match) => (
                  <Link
                    key={match.match_id}
                    to={`/match/${match.match_id}`}
                    className="block bg-slate-900/50 rounded-lg p-3 sm:p-4 hover:bg-slate-900/70 transition-all border border-white/5 hover:border-blue-400/50 cursor-pointer"
                    data-testid={`match-${match.match_id}`}
                  >
                    <div className="flex flex-col gap-2">
                      {/* Top row: Time + Fixture */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="text-white font-semibold text-sm sm:text-base mb-1 hover:text-blue-300 transition-colors line-clamp-2">
                            {match.fixture}
                          </div>
                          <div className="text-blue-300 text-xs sm:text-sm truncate">{match.league}</div>
                          {match.venue && (
                            <div className="text-blue-200/60 text-xs mt-0.5 truncate">{match.venue}</div>
                          )}
                        </div>
                        <div className="text-green-400 font-medium text-xs sm:text-sm whitespace-nowrap flex-shrink-0">
                          {formatTime(match.kickoff)}
                        </div>
                      </div>
                      
                      {/* Bottom row: Channel tags */}
                      <div className="flex flex-wrap gap-1">
                        {match.tv_channels && match.tv_channels.slice(0, 2).map((tv, idx) => (
                          <div key={idx} className="flex flex-wrap gap-1">
                            {tv.channels && tv.channels.slice(0, 2).map((channel, chIdx) => (
                              <span 
                                key={chIdx} 
                                className="inline-block bg-blue-600/30 text-blue-200 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded"
                              >
                                {channel}
                              </span>
                            ))}
                          </div>
                        ))}
                        {match.tv_channels && match.tv_channels.length > 2 && (
                          <span className="inline-block bg-purple-600/30 text-purple-200 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                            +{match.tv_channels.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-blue-200 text-center py-4 text-sm sm:text-base">No matches scheduled</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScheduleTable;
