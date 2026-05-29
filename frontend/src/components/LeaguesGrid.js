import React from "react";
import { Link } from "react-router-dom";

const LeaguesGrid = ({ leagues }) => {
  if (!leagues || leagues.length === 0) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 sm:p-8 text-center border border-white/10">
        <p className="text-blue-200 text-base sm:text-lg">No leagues available</p>
      </div>
    );
  }

  // Featured/popular leagues at the top
  const popularKeywords = [
    "UEFA Champions League",
    "Premier League",
    "La Liga",
    "Serie A",
    "Bundesliga",
    "Ligue 1",
    "Europa League",
    "FIFA",
    "World Cup",
    "Copa",
    "MLS",
    "Brasileirão",
  ];

  const isPopular = (name) => popularKeywords.some(kw => name.toLowerCase().includes(kw.toLowerCase()));

  const sortedLeagues = [...leagues].sort((a, b) => {
    const aPop = isPopular(a.name);
    const bPop = isPopular(b.name);
    if (aPop && !bPop) return -1;
    if (!aPop && bPop) return 1;
    return b.match_count - a.match_count;
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3" data-testid="leagues-grid">
      {sortedLeagues.map((league) => {
        const popular = isPopular(league.name);
        return (
          <Link
            key={league.slug}
            to={`/league/${league.slug}`}
            className={`group rounded-lg p-3 sm:p-4 transition-all duration-300 transform hover:scale-[1.03] border ${
              popular
                ? "bg-gradient-to-br from-purple-600/30 to-blue-600/30 hover:from-purple-600/50 hover:to-blue-600/50 border-purple-400/30 hover:border-purple-400/70"
                : "bg-slate-800/50 hover:bg-slate-700/50 border-white/10 hover:border-blue-400/50"
            }`}
            data-testid={`league-item-${league.slug}`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center flex-1 min-w-0">
                <div className={`rounded-full p-1.5 sm:p-2 mr-2 sm:mr-3 flex-shrink-0 ${
                  popular ? "bg-gradient-to-br from-yellow-400 to-orange-500" : "bg-gradient-to-br from-blue-500 to-purple-500"
                }`}>
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <span className="text-white text-xs sm:text-sm font-medium leading-tight line-clamp-2 group-hover:text-blue-200">
                  {league.name}
                </span>
              </div>
              <span className="text-[10px] sm:text-xs bg-slate-900/50 text-blue-200 px-1.5 sm:px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0">
                {league.match_count}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default LeaguesGrid;
