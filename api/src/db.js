import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const DATA_DIR = process.env.RENDERDOCK_DATA || path.join(import.meta.dirname, "..", "data");
mkdirSync(DATA_DIR, { recursive: true });

const db = new DatabaseSync(path.join(DATA_DIR, "renderdock.db"));

db.exec(`
CREATE TABLE IF NOT EXISTS api_keys (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key_hash TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL DEFAULT 'default',
  plan TEXT NOT NULL DEFAULT 'free',
  monthly_quota INTEGER NOT NULL DEFAULT 200,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS usage (
  key_id INTEGER NOT NULL,
  month TEXT NOT NULL,
  renders INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (key_id, month)
);
`);

export function hashKey(key) {
  return crypto.createHash("sha256").update(key).digest("hex");
}

export function createKey(name = "default", plan = "free", quota = 200) {
  const key = "rd_" + crypto.randomBytes(24).toString("base64url");
  db.prepare(
    "INSERT INTO api_keys (key_hash, name, plan, monthly_quota) VALUES (?, ?, ?, ?)"
  ).run(hashKey(key), name, plan, quota);
  return key;
}

export function findKey(key) {
  return db.prepare("SELECT * FROM api_keys WHERE key_hash = ?").get(hashKey(key));
}

export function currentMonth() {
  return new Date().toISOString().slice(0, 7);
}

export function usageFor(keyId, month) {
  const row = db.prepare("SELECT renders FROM usage WHERE key_id = ? AND month = ?").get(keyId, month);
  return row ? row.renders : 0;
}

export function incrementUsage(keyId, month) {
  db.prepare(
    `INSERT INTO usage (key_id, month, renders) VALUES (?, ?, 1)
     ON CONFLICT(key_id, month) DO UPDATE SET renders = renders + 1`
  ).run(keyId, month);
}
