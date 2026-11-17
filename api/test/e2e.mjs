// RenderDock API end-to-end test. Run: node test/e2e.mjs <api-key>
import fs from "node:fs";
import path from "node:path";

const KEY = process.argv[2] || process.env.RENDERDOCK_KEY;
if (!KEY) {
  console.error("usage: node test/e2e.mjs <api-key>");
  process.exit(2);
}

const BASE = "http://127.0.0.1:8787";
const here = import.meta.dirname;
const FIXTURES = path.join(here, "fixtures");
const OUT = path.join(here, "output");

fs.mkdirSync(OUT, { recursive: true });

const results = [];
async function check(name, fn) {
  try {
    await fn();
    results.push(["ok", name]);
    console.log(`ok   ${name}`);
  } catch (err) {
    results.push(["FAIL", name]);
    console.log(`FAIL ${name}: ${err.message}`);
  }
}

function post(body, key = KEY) {
  return fetch(`${BASE}/v1/render`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(key ? { authorization: `Bearer ${key}` } : {}),
    },
    body: JSON.stringify(body),
  });
}

const markdown = fs.readFileSync(path.join(FIXTURES, "weekly-report.md"), "utf8");
let quotaHeader = "";

await check("markdown → pdf (200, %PDF magic, quota header)", async () => {
  const res = await post({ markdown, format: "pdf", filename: "weekly-report" });
  quotaHeader = res.headers.get("x-renderdock-quota") || "";
  const buf = Buffer.from(await res.arrayBuffer());
  if (res.status !== 200) throw new Error(`status ${res.status}: ${buf.toString()}`);
  if (buf.subarray(0, 4).toString() !== "%PDF") throw new Error("missing %PDF magic");
  if (buf.length < 1000) throw new Error(`suspiciously small (${buf.length} bytes)`);
  if (!quotaHeader) throw new Error("missing quota header");
  fs.writeFileSync(path.join(OUT, "weekly-report.pdf"), buf);
});

await check(`quota header format (got: "${quotaHeader}")`, async () => {
  if (!/^\d+\/200$/.test(quotaHeader)) throw new Error("expected like N/200");
});

await check("markdown → png (200, PNG magic)", async () => {
  const res = await post({ markdown, format: "png" });
  const buf = Buffer.from(await res.arrayBuffer());
  if (res.status !== 200) throw new Error(`status ${res.status}: ${buf.toString()}`);
  if (buf.subarray(1, 4).toString() !== "PNG") throw new Error("missing PNG magic");
  fs.writeFileSync(path.join(OUT, "weekly-report.png"), buf);
});

await check("html → pdf", async () => {
  const res = await post({ html: "<h1>Hello from HTML</h1><p>direct html input</p>", format: "pdf" });
  const buf = Buffer.from(await res.arrayBuffer());
  if (res.status !== 200) throw new Error(`status ${res.status}: ${buf.toString()}`);
  if (buf.subarray(0, 4).toString() !== "%PDF") throw new Error("missing %PDF magic");
});

await check("template + data → pdf", async () => {
  const res = await post({
    template: "<h1>Invoice for {{company}}</h1><p>{{amount}}</p>",
    data: { company: "Acme GmbH", amount: "€120.00" },
    format: "pdf",
  });
  const buf = Buffer.from(await res.arrayBuffer());
  if (res.status !== 200) throw new Error(`status ${res.status}: ${buf.toString()}`);
  if (buf.subarray(0, 4).toString() !== "%PDF") throw new Error("missing %PDF magic");
});

await check("missing key → 401", async () => {
  const res = await post({ markdown: "# hi" }, "");
  if (res.status !== 401) throw new Error(`expected 401, got ${res.status}`);
});

await check("invalid key → 401", async () => {
  const res = await post({ markdown: "# hi" }, "rd_wrong");
  if (res.status !== 401) throw new Error(`expected 401, got ${res.status}`);
});

await check("ssrf guard: private url → 400", async () => {
  const res = await post({ url: "http://127.0.0.1:8787/healthz", format: "pdf" });
  const body = await res.json();
  if (res.status !== 400 || !body.error.includes("private")) {
    throw new Error(`expected 400 private-ip rejection, got ${res.status} ${JSON.stringify(body)}`);
  }
});

await check("missing input → 400", async () => {
  const res = await post({ format: "pdf" });
  if (res.status !== 400) throw new Error(`expected 400, got ${res.status}`);
});

await check("markdown as object → 400 (not 500)", async () => {
  const res = await post({ markdown: { value: "# x" }, format: "pdf" });
  if (res.status !== 400) throw new Error(`expected 400, got ${res.status}`);
});

const failed = results.filter(([s]) => s === "FAIL").length;
console.log(`\n${results.length - failed}/${results.length} checks passed`);
process.exit(failed > 0 ? 1 : 0);
