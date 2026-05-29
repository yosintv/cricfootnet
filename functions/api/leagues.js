// GET /api/leagues
import { getAvailableSchedule, extractAllLeagues, jsonResponse, errorResponse } from "../_shared/utils.js";

export async function onRequestGet() {
  try {
    const schedule = await getAvailableSchedule();
    const allMatches = Object.values(schedule).flat();
    const leagues = extractAllLeagues(allMatches);

    return jsonResponse({
      total: leagues.length,
      leagues,
    });
  } catch (e) {
    return errorResponse(e.message);
  }
}
