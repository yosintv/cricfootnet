// GET /api/
import { jsonResponse } from "../_shared/utils.js";

export async function onRequestGet() {
  return jsonResponse({ message: "CricFoot TV Guide API" });
}
