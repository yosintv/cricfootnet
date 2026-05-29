import React from "react";

const SEOKeywords = ({ channelName }) => {
  const keywords = [
    `${channelName} Live Stream Free`,
    `Watch ${channelName} Live Online`,
    `${channelName} Live TV Free`,
    `${channelName} Football Live Stream`,
    `Watch Football on ${channelName}`,
    `${channelName} Soccer Live TV`,
    `${channelName} Sports Channel Live`,
    `${channelName} HD Live Stream`,
    `${channelName} Live Match Today`,
    `${channelName} Football Today`,
    `${channelName} TV Guide Today`,
    `${channelName} Live Football Schedule`,
    `${channelName} Match Fixtures Today`,
    `${channelName} Live Sports TV`,
    `${channelName} UEFA Champions League Live`,
    `${channelName} Premier League Live`,
    `${channelName} La Liga Live Stream`,
    `${channelName} Serie A Live`,
    `${channelName} Bundesliga Live TV`,
    `${channelName} FIFA Match Live`,
    `${channelName} World Cup Live Stream`,
    `${channelName} TV Listings`,
    `${channelName} Football Coverage`,
    `${channelName} Sports Schedule`,
    `${channelName} Live Soccer Match`,
    `${channelName} Football Streaming Channel`,
    `${channelName} Watch Live Football Free`,
    `${channelName} Match Broadcast Today`,
    `${channelName} Live Football on TV`,
    `${channelName} Today Football Match`,
    `${channelName} Sports TV Guide`,
    `${channelName} Streaming Now`,
    `${channelName} Online TV Channel`,
    `${channelName} Live Event Streaming`,
    `${channelName} Matchday Live`,
    `${channelName} Free Sports Streaming`,
    `${channelName} Football Highlights Today`,
    `${channelName} Live Sports Coverage`,
    `${channelName} Football Fixtures & Results`,
    `${channelName} Live Commentary`,
    `${channelName} International Football Live`,
    `${channelName} 24/7 Sports Channel`,
    `${channelName} Mobile Live Stream`,
    `${channelName} Live TV App`,
    `${channelName} Streaming Football Worldwide`,
    `${channelName} Multi-language Football Stream`,
    `${channelName} Football Channel Online`,
    `${channelName} Soccer TV Listings`,
    `${channelName} Match Schedule Today`,
  ];

  return (
    <section className="mt-8 sm:mt-16 bg-slate-800/30 backdrop-blur-sm rounded-xl p-4 sm:p-8 border border-white/10" data-testid="seo-keywords-section">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 flex items-center">
        <span className="bg-yellow-600 w-1.5 sm:w-2 h-6 sm:h-8 mr-2 sm:mr-3 rounded"></span>
        About {channelName}
      </h2>
      <div className="text-blue-200 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6 space-y-2">
        <p>
          <strong className="text-white">{channelName}</strong> is a popular sports channel that broadcasts live football matches, UEFA Champions League, Premier League, La Liga, Serie A, Bundesliga, and international football coverage. 
          Find the complete <strong className="text-white">{channelName} TV guide</strong>, match fixtures, and live football schedule on CricFoot.
        </p>
        <p>
          Get the latest <strong className="text-white">{channelName} football today</strong> updates, match broadcast times, and sports coverage. CricFoot provides comprehensive TV listings for {channelName} including international football, World Cup, FIFA matches, and more.
        </p>
      </div>
      
      <div className="border-t border-white/10 pt-4 sm:pt-6">
        <h3 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3">Popular Searches for {channelName}:</h3>
        <div className="flex flex-wrap gap-1.5 sm:gap-2" data-testid="keywords-list">
          {keywords.map((keyword, idx) => (
            <span 
              key={idx} 
              className="inline-block bg-slate-700/50 text-blue-200 text-[10px] sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-full hover:bg-slate-600/50 transition-colors cursor-default"
              data-testid={`keyword-${idx}`}
            >
              {keyword}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SEOKeywords;
