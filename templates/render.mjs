// Render a template pack through the RenderDock API.
// Usage:
//   node templates/render.mjs invoice                     # sample data -> invoice.pdf
//   node templates/render.mjs report --data my-data.json --format png --out report.png
// Env:
//   RENDERDOCK_API_KEY   (required)
//   RENDERDOCK_API_URL   (optional, default https://api.renderdock.dev/v1/render)
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const pack = args[0];
const packs = ["invoice", "certificate", "report"];
if (!packs.includes(pack)) {
  console.error(`usage: node templates/render.mjs <${packs.join("|")}> [--data file.json] [--format pdf|png] [--out file]`);
  process.exit(1);
}

const opt = (name, fallback) => {
  const i = args.indexOf(name);
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback;
};
const dataFile = opt("--data", path.join(here, pack, "sample.json"));
const format = opt("--format", "pdf");
const out = opt("--out", `${pack}.${format}`);
const url = process.env.RENDERDOCK_API_URL || "https://api.renderdock.dev/v1/render";
const key = process.env.RENDERDOCK_API_KEY;
if (!key) {
  console.error("set RENDERDOCK_API_KEY first");
  process.exit(1);
}

const template = await readFile(path.join(here, pack, "template.hbs"), "utf8");
const data = JSON.parse(await readFile(dataFile, "utf8"));

const res = await fetch(url, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ template, data, format, filename: pack }),
});

if (!res.ok) {
  const text = await res.text();
  console.error(`render failed (${res.status}): ${text}`);
  process.exit(1);
}

await writeFile(out, Buffer.from(await res.arrayBuffer()));
console.log(`wrote ${out} (${res.headers.get("x-renderdock-quota") || "quota n/a"} quota used)`);
