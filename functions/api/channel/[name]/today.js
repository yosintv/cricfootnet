// GET /api/channel/:name/today
import {
  fetchScheduleData,
  filterMatchesByChannel,
  findChannelBySlug,
  slugify,
  getDateString,
  formatDate,
  jsonResponse,
  errorResponse,
} from "../../../_shared/utils.js";

export async function onRequestGet({ params }) {
  try {
    const channelParam = params.name;
    const resolvedName = (await findChannelBySlug(channelParam)) || channelParam;

    const today = getDateString(0);
    const matches = await fetchScheduleData(today);
    const filtered = filterMatchesByChannel(matches, resolvedName);
    const { formatted_date, day_name } = formatDate(today);

    return jsonResponse({
      channel_name: resolvedName,
      slug: slugify(resolvedName),
      date: today,
      formatted_date,
      day_name,
      total_matches: filtered.length,
      matches: filtered,
    });
  } catch (e) {
    return errorResponse(e.message);
  }
}
