// SSRF guard for URL rendering mode: only public, non-credentialed http(s) URLs.
import dns from "node:dns/promises";
import { URL } from "node:url";

function isPrivateIp(ip) {
  const v4 = ip.includes(".") ? ip.split(".").map(Number) : null;
  if (v4) {
    if (v4.length !== 4 || v4.some((n) => Number.isNaN(n))) return true;
    if (v4[0] === 10 || v4[0] === 127 || v4[0] === 0) return true;
    if (v4[0] === 172 && v4[1] >= 16 && v4[1] <= 31) return true;
    if (v4[0] === 192 && v4[1] === 168) return true;
    if (v4[0] === 169 && v4[1] === 254) return true;
    if (v4[0] >= 224) return true; // multicast/reserved
    return false;
  }
  const v6 = ip.toLowerCase();
  if (v6 === "::" || v6 === "::1") return true;
  if (v6.startsWith("fe80:") || v6.startsWith("fc") || v6.startsWith("fd")) return true;
  if (!v6.includes(":") || v6.includes("%")) return true;
  return false;
}

export async function assertPublicUrl(rawUrl) {
  let parsed;
  try {
    parsed = new URL(rawUrl);
  } catch {
    throw new Error("invalid url");
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error("only http and https are allowed");
  }
  if (parsed.username || parsed.password) {
    throw new Error("urls with credentials are not allowed");
  }
  const resolved = await dns.lookup(parsed.hostname, { all: true, verbatim: true });
  if (!resolved || resolved.length === 0) {
    throw new Error("host did not resolve");
  }
  for (const r of resolved) {
    if (isPrivateIp(r.address)) {
      throw new Error("private network addresses are not allowed");
    }
  }
  return parsed;
}
