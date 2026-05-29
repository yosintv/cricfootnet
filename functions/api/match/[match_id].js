// GET /api/match/:match_id
import { getAvailableSchedule, formatDate, jsonResponse, errorResponse } from "../../_shared/utils.js";

export async function onRequestGet({ params }) {
  try {
    const matchId = parseInt(params.match_id, 10);
    if (isNaN(matchId)) {
      return errorResponse("Invalid match ID", 400);
    }

    const schedule = await getAvailableSchedule();

    for (const [dateStr, matches] of Object.entries(schedule)) {
      for (const match of matches) {
        if (match.match_id === matchId) {
          // Sort tv_channels by country alphabetically
          if (match.tv_channels) {
            match.tv_channels.sort((a, b) => (a.country || "").localeCompare(b.country || ""));
          }
          const { formatted_date, day_name } = formatDate(dateStr);
          return jsonResponse({
            match,
            date: dateStr,
            formatted_date,
            day_name,
          });
        }
      }
    }

    return errorResponse("Match not found", 404);
  } catch (e) {
    return errorResponse(e.message);
  }
}
