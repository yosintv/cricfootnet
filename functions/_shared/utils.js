// Shared utilities for Cloudflare Pages Functions
// Note: We use Cloudflare Cache API for caching across requests

const DATA_BASE_URL = "https://livesoccertv.pages.dev/date";
const CACHE_DURATION = 3600; // 1 hour in seconds

/**
 * Convert text to URL-friendly slug
 * "TyC Sports" -> "tyc-sports"
 */
export function slugify(text) {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Get date string in YYYYMMDD format
 */
export function getDateString(daysOffset = 0) {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

/**
 * Format date for display
 */
export function formatDate(dateStr) {
  const year = dateStr.substring(0, 4);
  const month = dateStr.substring(4, 6);
  const day = dateStr.substring(6, 8);
  const date = new Date(`${year}-${month}-${day}T00:00:00`);
  return {
    formatted_date: date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
    day_name: date.toLocaleDateString("en-US", { weekday: "long" }),
  };
}

/**
 * Fetch schedule data from external URL with Cloudflare cache
 */
export async function fetchScheduleData(dateStr) {
  const url = `${DATA_BASE_URL}/${dateStr}.json`;

  try {
    const response = await fetch(url, {
      cf: {
        cacheTtl: CACHE_DURATION,
        cacheEverything: true,
      },
    });

    if (response.status === 404) {
      return [];
    }
    if (!response.ok) {
      return [];
    }
    return await response.json();
  } catch (e) {
    console.error(`Error fetching data for ${dateStr}:`, e);
    return [];
  }
}

/**
 * Get schedule with graceful fallback
 * Looks forward 7 days, then backward if not enough data
 */
export async function getAvailableSchedule(maxDays = 7) {
  const schedule = {};

  // Try today + future days
  const forwardPromises = [];
  for (let i = 0; i < maxDays; i++) {
    const dateStr = getDateString(i);
    forwardPromises.push(fetchScheduleData(dateStr).then((matches) => ({ dateStr, matches })));
  }
  const forwardResults = await Promise.all(forwardPromises);

  for (const { dateStr, matches } of forwardResults) {
    if (matches && matches.length > 0) {
      schedule[dateStr] = matches;
    }
  }

  // If we don't have enough days, look backward
  if (Object.keys(schedule).length < maxDays) {
    const daysNeeded = maxDays - Object.keys(schedule).length;
    const backwardPromises = [];
    for (let i = 1; i <= daysNeeded + 5; i++) {
      const dateStr = getDateString(-i);
      if (!schedule[dateStr]) {
        backwardPromises.push(fetchScheduleData(dateStr).then((matches) => ({ dateStr, matches })));
      }
    }
    const backwardResults = await Promise.all(backwardPromises);
    let added = 0;
    for (const { dateStr, matches } of backwardResults) {
      if (matches && matches.length > 0 && added < daysNeeded) {
        schedule[dateStr] = matches;
        added++;
      }
    }
  }

  // Sort by date
  const sortedKeys = Object.keys(schedule).sort();
  const sorted = {};
  for (const key of sortedKeys) {
    sorted[key] = schedule[key];
  }
  return sorted;
}

/**
 * Extract unique channels from matches
 */
export function extractAllChannels(matches) {
  const channels = new Set();
  for (const match of matches) {
    for (const tv of match.tv_channels || []) {
      for (const channel of tv.channels || []) {
        channels.add(channel);
      }
    }
  }
  return Array.from(channels).sort();
}

/**
 * Extract unique countries from matches
 */
export function extractAllCountries(matches) {
  const countries = new Set();
  for (const match of matches) {
    for (const tv of match.tv_channels || []) {
      if (tv.country) countries.add(tv.country);
    }
  }
  return Array.from(countries).sort();
}

/**
 * Extract unique leagues from matches with match count
 */
export function extractAllLeagues(matches) {
  const leaguesMap = {};
  for (const match of matches) {
    const leagueName = match.league;
    if (leagueName) {
      if (!leaguesMap[leagueName]) {
        leaguesMap[leagueName] = {
          name: leagueName,
          league_id: match.league_id,
          slug: slugify(leagueName),
          match_count: 0,
        };
      }
      leaguesMap[leagueName].match_count++;
    }
  }
  return Object.values(leaguesMap).sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Filter matches by channel name
 */
export function filterMatchesByChannel(matches, channelName) {
  return matches.filter((match) => {
    return (match.tv_channels || []).some((tv) => (tv.channels || []).includes(channelName));
  });
}

/**
 * Find original channel name from slug
 */
export async function findChannelBySlug(slug) {
  const schedule = await getAvailableSchedule();
  const allMatches = Object.values(schedule).flat();
  const channels = extractAllChannels(allMatches);

  // Exact slug match
  for (const channel of channels) {
    if (slugify(channel) === slug) return channel;
  }

  // URL-decoded fallback
  const decoded = decodeURIComponent(slug);
  for (const channel of channels) {
    if (channel === decoded) return channel;
  }

  return null;
}

/**
 * Standard JSON response with CORS
 */
export function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Cache-Control": "public, max-age=300",
    },
  });
}

/**
 * Error response
 */
export function errorResponse(message, status = 500) {
  return jsonResponse({ error: message }, status);
}
