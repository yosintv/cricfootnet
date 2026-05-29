// GET /api/channel/:name
import {
  getAvailableSchedule,
  filterMatchesByChannel,
  findChannelBySlug,
  slugify,
  formatDate,
  jsonResponse,
  errorResponse,
} from "../../_shared/utils.js";

export async function onRequestGet({ params }) {
  try {
    const channelParam = params.name;

    // Try to resolve slug to actual channel name
    const resolvedName = (await findChannelBySlug(channelParam)) || channelParam;

    const schedule = await getAvailableSchedule();
    const channelMatches = [];

    for (const [dateStr, matches] of Object.entries(schedule)) {
      const filtered = filterMatchesByChannel(matches, resolvedName);
      if (filtered.length > 0) {
        const { formatted_date, day_name } = formatDate(dateStr);
        channelMatches.push({
          date: dateStr,
          formatted_date,
          day_name,
          matches: filtered,
        });
      }
    }

    return jsonResponse({
      channel_name: resolvedName,
      slug: slugify(resolvedName),
      total_days: channelMatches.length,
      schedule: channelMatches,
    });
  } catch (e) {
    return errorResponse(e.message);
  }
}
