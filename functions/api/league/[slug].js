// GET /api/league/:slug
import { getAvailableSchedule, slugify, formatDate, jsonResponse, errorResponse } from "../../_shared/utils.js";

export async function onRequestGet({ params }) {
  try {
    const leagueSlug = params.slug;
    const schedule = await getAvailableSchedule();

    const leagueSchedule = [];
    let leagueName = null;

    for (const [dateStr, matches] of Object.entries(schedule)) {
      const dayMatches = [];
      for (const match of matches) {
        if (slugify(match.league || "") === leagueSlug) {
          dayMatches.push(match);
          if (!leagueName) leagueName = match.league;
        }
      }
      if (dayMatches.length > 0) {
        const { formatted_date, day_name } = formatDate(dateStr);
        leagueSchedule.push({
          date: dateStr,
          formatted_date,
          day_name,
          matches: dayMatches,
        });
      }
    }

    if (!leagueName) {
      return errorResponse("League not found", 404);
    }

    const totalMatches = leagueSchedule.reduce((sum, day) => sum + day.matches.length, 0);

    return jsonResponse({
      league_name: leagueName,
      slug: leagueSlug,
      total_days: leagueSchedule.length,
      total_matches: totalMatches,
      schedule: leagueSchedule,
    });
  } catch (e) {
    return errorResponse(e.message);
  }
}
