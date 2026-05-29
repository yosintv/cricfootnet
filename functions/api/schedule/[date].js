// GET /api/schedule/7days OR GET /api/schedule/:date
// File-based routing: /api/schedule/[date].js handles both
import {
  getAvailableSchedule,
  fetchScheduleData,
  formatDate,
  jsonResponse,
  errorResponse,
} from "../../_shared/utils.js";

export async function onRequestGet({ params }) {
  try {
    const dateParam = params.date;

    // Handle /api/schedule/7days
    if (dateParam === "7days") {
      const schedule = await getAvailableSchedule();
      const formatted = {};

      for (const [dateStr, matches] of Object.entries(schedule)) {
        const { formatted_date, day_name } = formatDate(dateStr);
        formatted[dateStr] = {
          date: formatted_date,
          day_name,
          total_matches: matches.length,
          matches,
        };
      }
      return jsonResponse(formatted);
    }

    // Handle /api/schedule/{YYYYMMDD}
    if (!/^\d{8}$/.test(dateParam)) {
      return errorResponse("Invalid date format. Use YYYYMMDD", 400);
    }

    const matches = await fetchScheduleData(dateParam);
    const { formatted_date, day_name } = formatDate(dateParam);

    return jsonResponse({
      date: dateParam,
      formatted_date,
      day_name,
      total_matches: matches.length,
      matches,
    });
  } catch (e) {
    return errorResponse(e.message);
  }
}
