// GET /api/sitemap.xml
import { getAvailableSchedule, extractAllChannels, extractAllLeagues, slugify } from "../_shared/utils.js";

export async function onRequestGet({ request }) {
  try {
    // Determine base URL from request
    const url = new URL(request.url);
    const baseUrl = `${url.protocol}//${url.host}`;

    const schedule = await getAvailableSchedule();
    const allMatches = Object.values(schedule).flat();
    const channels = extractAllChannels(allMatches);
    const leagues = extractAllLeagues(allMatches);

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Static pages
    const staticPages = [
      { path: "", priority: "1.0", changefreq: "daily" },
      { path: "/about", priority: "0.7", changefreq: "monthly" },
      { path: "/contact", priority: "0.7", changefreq: "monthly" },
      { path: "/privacy", priority: "0.5", changefreq: "yearly" },
      { path: "/terms", priority: "0.5", changefreq: "yearly" },
    ];

    for (const { path, priority, changefreq } of staticPages) {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}${path}</loc>\n`;
      xml += `    <priority>${priority}</priority>\n`;
      xml += `    <changefreq>${changefreq}</changefreq>\n`;
      xml += `  </url>\n`;
    }

    // Channel pages
    for (const channel of channels) {
      const slug = slugify(channel);
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/channel/${slug}</loc>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `    <changefreq>daily</changefreq>\n`;
      xml += `  </url>\n`;
    }

    // League pages
    for (const league of leagues) {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/league/${league.slug}</loc>\n`;
      xml += `    <priority>0.7</priority>\n`;
      xml += `    <changefreq>daily</changefreq>\n`;
      xml += `  </url>\n`;
    }

    // Match pages
    const matchIds = new Set();
    for (const match of allMatches) {
      if (match.match_id && !matchIds.has(match.match_id)) {
        matchIds.add(match.match_id);
        xml += `  <url>\n`;
        xml += `    <loc>${baseUrl}/match/${match.match_id}</loc>\n`;
        xml += `    <priority>0.6</priority>\n`;
        xml += `    <changefreq>daily</changefreq>\n`;
        xml += `  </url>\n`;
      }
    }

    xml += "</urlset>";

    return new Response(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (e) {
    return new Response(`Error: ${e.message}`, { status: 500 });
  }
}
