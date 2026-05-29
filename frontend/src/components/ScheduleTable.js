import React from "react";

const ScheduleTable = ({ schedule }) => {
  if (!schedule || Object.keys(schedule).length === 0) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 text-center border border-white/10">
        <p className="text-blue-200 text-lg">No schedule data available</p>
      </div>
    );
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  return (
    <div className="space-y-6" data-testid="schedule-table">
      {Object.entries(schedule).map(([dateKey, dayData]) => (
        <div key={dateKey} className="bg-slate-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10">
          {/* Day Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
            <h3 className="text-xl font-bold text-white flex items-center justify-between">
              <span>
                {dayData.day_name}, {dayData.date}
              </span>
              <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                {dayData.total_matches} matches
              </span>
            </h3>
          </div>

          {/* Matches */}
          <div className="p-4">
            {dayData.matches && dayData.matches.length > 0 ? (
              <div className="space-y-3">
                {dayData.matches.slice(0, 5).map((match) => (
                  <div 
                    key={match.match_id} 
                    className="bg-slate-900/50 rounded-lg p-4 hover:bg-slate-900/70 transition-colors border border-white/5"
                    data-testid={`match-${match.match_id}`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="flex-1">
                        <div className="text-white font-semibold mb-1">{match.fixture}</div>
                        <div className="text-blue-300 text-sm">{match.league}</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-green-400 font-medium text-sm">
                          {formatTime(match.kickoff)}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {match.tv_channels && match.tv_channels.slice(0, 3).map((tv, idx) => (
                            <div key={idx}>
                              {tv.channels && tv.channels.slice(0, 2).map((channel, chIdx) => (
                                <span 
                                  key={chIdx} 
                                  className="inline-block bg-blue-600/30 text-blue-200 text-xs px-2 py-1 rounded mr-1 mb-1"
                                >
                                  {channel}
                                </span>
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {dayData.matches.length > 5 && (
                  <div className="text-center text-blue-300 text-sm pt-2">
                    + {dayData.matches.length - 5} more matches
                  </div>
                )}
              </div>
            ) : (
              <p className="text-blue-200 text-center py-4">No matches scheduled</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScheduleTable;
