// Utility functions for the app

/**
 * Convert channel name to URL-friendly slug
 * "TyC Sports" -> "tyc-sports"
 */
export const slugify = (text) => {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")    // Remove special chars except spaces and hyphens
    .replace(/[\s_]+/g, "-")     // Replace spaces/underscores with hyphens
    .replace(/-+/g, "-")         // Collapse multiple hyphens
    .replace(/^-+|-+$/g, "");    // Trim leading/trailing hyphens
};
