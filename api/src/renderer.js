import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";
import MarkdownIt from "markdown-it";
import Handlebars from "handlebars";
import { assertPublicUrl } from "./security.js";

const THEMES_DIR = path.join(import.meta.dirname, "..", "themes");
const DEFAULT_THEME = "report";
const MAX_CONCURRENT = 3;
const GOTO_TIMEOUT_MS = 15_000;

const md = new MarkdownIt({ html: false, linkify: true, typographer: true });

/* ---------- small helpers ---------- */

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

async function loadTheme(theme) {
  const file = path.join(THEMES_DIR, `${theme}.css`);
  return fs.readFile(file, "utf8");
}

function documentShell(body, title, css) {
  return `<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(title || "")}</title><style>${css}</style></head><body><article class="markdown-body">${body}</article></body></html>`;
}

/* ---------- chromium pool ---------- */

class Pool {
  constructor(size) {
    this.size = size;
    this.active = 0;
    this.waiters = [];
  }
  async acquire() {
    if (this.active < this.size) {
      this.active += 1;
      return;
    }
    await new Promise((resolve) => this.waiters.push(resolve));
    this.active += 1;
  }
  release() {
    this.active -= 1;
    const next = this.waiters.shift();
    if (next) next();
  }
}

const pool = new Pool(MAX_CONCURRENT);
let browserPromise = null;

function getBrowser() {
  if (!browserPromise) {
    const args = process.platform === "linux"
      ? ["--no-sandbox", "--disable-dev-shm-usage"]
      : [];
    browserPromise = chromium.launch({ args });
    browserPromise.catch(() => {
      browserPromise = null;
    });
  }
  return browserPromise;
}

async function withPage(html, fn) {
  await pool.acquire();
  try {
    const browser = await getBrowser();
    const page = await browser.newPage();
    try {
      await page.setContent(html, { waitUntil: "load", timeout: 30_000 });
      return await fn(page);
    } finally {
      await page.close();
    }
  } finally {
    pool.release();
  }
}

/* ---------- inputs ---------- */

export async function markdownToHtml(markdown, { theme = DEFAULT_THEME, title = "" } = {}) {
  const body = md.render(markdown);
  const css = await loadTheme(theme);
  return documentShell(body, title, css);
}

export function templateToHtml(template, data = {}) {
  const compiled = Handlebars.compile(template);
  return compiled(data);
}

/* ---------- outputs ---------- */

export function htmlToPdf(html, opts = {}) {
  return withPage(html, async (page) => {
    await page.emulateMedia({ media: "print" });
    return page.pdf({
      format: opts.paper || "A4",
      printBackground: true,
      preferCSSPageSize: true,
    });
  });
}

export function htmlToPng(html, opts = {}) {
  return withPage(html, async (page) => {
    await page.setViewportSize({ width: opts.width || 1280, height: opts.height || 900 });
    await page.emulateMedia({ media: "screen" });
    return page.screenshot({ fullPage: true, type: "png" });
  });
}

export async function urlToPdf(rawUrl, opts = {}) {
  const parsed = await assertPublicUrl(rawUrl);
  await pool.acquire();
  try {
    const browser = await getBrowser();
    const page = await browser.newPage();
    try {
      await page.goto(parsed.href, { waitUntil: "networkidle", timeout: GOTO_TIMEOUT_MS });
      await page.emulateMedia({ media: "print" });
      return page.pdf({
        format: opts.paper || "A4",
        printBackground: true,
        preferCSSPageSize: true,
      });
    } finally {
      await page.close();
    }
  } finally {
    pool.release();
  }
}

export async function urlToPng(rawUrl, opts = {}) {
  const parsed = await assertPublicUrl(rawUrl);
  await pool.acquire();
  try {
    const browser = await getBrowser();
    const page = await browser.newPage();
    try {
      await page.goto(parsed.href, { waitUntil: "networkidle", timeout: GOTO_TIMEOUT_MS });
      await page.setViewportSize({ width: opts.width || 1280, height: opts.height || 900 });
      await page.emulateMedia({ media: "screen" });
      return page.screenshot({ fullPage: true, type: "png" });
    } finally {
      await page.close();
    }
  } finally {
    pool.release();
  }
}

/* ---------- dispatcher ---------- */

function assertString(value, name) {
  if (value !== undefined && typeof value !== "string") {
    throw new Error(`${name} must be a string`);
  }
}

export async function render(input, format) {
  assertString(input.markdown, "markdown");
  assertString(input.html, "html");
  assertString(input.url, "url");
  assertString(input.template, "template");
  if (input.data !== undefined && (typeof input.data !== "object" || input.data === null)) {
    throw new Error("data must be an object");
  }
  if (input.markdown !== undefined) {
    const html = await markdownToHtml(input.markdown, input);
    return format === "png" ? htmlToPng(html, input) : htmlToPdf(html, input);
  }
  if (input.html !== undefined) {
    return format === "png" ? htmlToPng(input.html, input) : htmlToPdf(input.html, input);
  }
  if (input.url !== undefined) {
    return format === "png" ? urlToPng(input.url, input) : urlToPdf(input.url, input);
  }
  if (input.template !== undefined) {
    const html = templateToHtml(input.template, input.data || {});
    return format === "png" ? htmlToPng(html, input) : htmlToPdf(html, input);
  }
  throw new Error("one of markdown, html, url or template is required");
}
