// GET /api/channels
import { getAvailableSchedule, extractAllChannels, slugify, jsonResponse, errorResponse } from "../_shared/utils.js";

export async function onRequestGet() {
  try {
    const schedule = await getAvailableSchedule();
    const allMatches = Object.values(schedule).flat();
    const channels = extractAllChannels(allMatches);
    const channelsWithSlugs = channels.map((ch) => ({ name: ch, slug: slugify(ch) }));

    return jsonResponse({
      total: channels.length,
      channels,
      channels_with_slugs: channelsWithSlugs,
    });
  } catch (e) {
    return errorResponse(e.message);
  }
}
