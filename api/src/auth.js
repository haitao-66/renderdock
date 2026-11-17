import { findKey, usageFor, currentMonth } from "./db.js";

const RATE_LIMIT = 30; // renders per minute per key
const RATE_WINDOW_MS = 60_000;
const rateWindows = new Map(); // key_hash -> array of timestamps

export function authorize(req) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) {
    return { error: "missing bearer token", status: 401 };
  }
  const record = findKey(token);
  if (!record) {
    return { error: "invalid api key", status: 401 };
  }
  return { record };
}

export function checkRateLimit(keyHash) {
  const now = Date.now();
  const arr = (rateWindows.get(keyHash) || []).filter((t) => now - t < RATE_WINDOW_MS);
  if (arr.length >= RATE_LIMIT) {
    rateWindows.set(keyHash, arr);
    return false;
  }
  arr.push(now);
  rateWindows.set(keyHash, arr);
  return true;
}

export function checkQuota(record) {
  const used = usageFor(record.id, currentMonth());
  if (used >= record.monthly_quota) {
    return { ok: false, used, quota: record.monthly_quota };
  }
  return { ok: true, used, quota: record.monthly_quota };
}
