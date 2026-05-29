// GET /api/countries
import { getAvailableSchedule, extractAllCountries, jsonResponse, errorResponse } from "../_shared/utils.js";

export async function onRequestGet() {
  try {
    const schedule = await getAvailableSchedule();
    const allMatches = Object.values(schedule).flat();
    const countries = extractAllCountries(allMatches);

    return jsonResponse({
      total: countries.length,
      countries,
    });
  } catch (e) {
    return errorResponse(e.message);
  }
}
