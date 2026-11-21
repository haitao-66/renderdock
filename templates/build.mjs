// Build previews and the gallery page for the template packs.
// Usage: node templates/build.mjs   (run with the project-local Node in tools/node)
// Output:
//   landing/templates/previews/<pack>.png   (gallery preview image)
//   landing/templates/previews/<pack>.pdf   (downloadable PDF sample)
//   landing/templates/index.html            (gallery page, sources injected)
import { createRequire } from "node:module";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(new URL("../api/package.json", import.meta.url));
const Handlebars = require("handlebars");
const { templateToHtml, htmlToPdf, htmlToPng } = await import(new URL("../api/src/renderer.js", import.meta.url));

const here = path.dirname(fileURLToPath(import.meta.url));
const packs = ["invoice", "certificate", "report"];
const outDir = path.join(here, "..", "landing", "templates", "previews");
await mkdir(outDir, { recursive: true });

for (const pack of packs) {
  const dir = path.join(here, pack);
  const template = await readFile(path.join(dir, "template.hbs"), "utf8");
  const data = JSON.parse(await readFile(path.join(dir, "sample.json"), "utf8"));

  const html = templateToHtml(template, data);
  await rm(path.join(outDir, `${pack}.html`), { force: true });

  const png = await htmlToPng(html, { width: 794 });
  await writeFile(path.join(outDir, `${pack}.png`), png);

  const pdf = await htmlToPdf(html, { paper: "A4" });
  await writeFile(path.join(outDir, `${pack}.pdf`), pdf);

  console.log(`built ${pack}: preview.png + sample.pdf`);
}

// Gallery page: inject template + data sources into the page template.
let page = await readFile(path.join(here, "gallery.page.html"), "utf8");
const srcRe = /%%SRC:([^%]+)%%/g;
for (const m of page.matchAll(srcRe)) {
  const content = await readFile(path.join(here, "..", m[1]), "utf8");
  const escaped = content.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
  page = page.replace(m[0], () => escaped);
}
await writeFile(path.join(here, "..", "landing", "templates", "index.html"), page, "utf8");
console.log("built gallery page: landing/templates/index.html");
console.log("done");
process.exit(0); // Playwright keeps the event loop alive otherwise
