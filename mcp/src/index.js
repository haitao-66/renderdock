#!/usr/bin/env node
// RenderDock MCP server: exposes a single "render" tool that agents call to
// turn Markdown / HTML / URLs / templates into PDF or PNG files.
//
// Configuration (environment variables):
//   RENDERDOCK_API_KEY  (required)  your RenderDock API key
//   RENDERDOCK_API_URL  (optional)  default http://127.0.0.1:8787
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import fs from "node:fs";
import path from "node:path";

const API_BASE = process.env.RENDERDOCK_API_URL || "http://127.0.0.1:8787";
const API_KEY = process.env.RENDERDOCK_API_KEY || "";

const server = new McpServer({ name: "renderdock", version: "0.1.0" });

server.registerTool(
  "render",
  {
    title: "Render to PDF or PNG",
    description:
      "Render Markdown, HTML, a public URL, or a Handlebars template with data into a PDF or PNG file. " +
      "Exactly one of markdown, html, url, or template is required. " +
      "Returns the local path of the written output file (response_mode: path, default) or the file as base64 (response_mode: base64).",
    inputSchema: {
      markdown: z.string().optional().describe("Markdown source text"),
      html: z.string().optional().describe("Raw HTML"),
      url: z.string().optional().describe("Public http(s) URL to render"),
      template: z.string().optional().describe("Handlebars template"),
      data: z.record(z.unknown()).optional().describe("Data merged into the template"),
      format: z.enum(["pdf", "png"]).optional().describe("Output format (default pdf)"),
      paper: z.string().optional().describe("Paper size, e.g. A4, Letter (default A4)"),
      width: z.number().int().positive().optional().describe("PNG viewport width in px (default 1280)"),
      height: z.number().int().positive().optional().describe("PNG viewport height in px (default 900)"),
      filename: z.string().optional().describe("Base name for the output file, without extension"),
      out_dir: z.string().optional().describe("Directory for the output file (default ./renders)"),
      response_mode: z.enum(["path", "base64"]).optional().describe("How to return the file (default path)"),
    },
  },
  async (args) => {
    const provided = ["markdown", "html", "url", "template"].filter((k) => typeof args[k] === "string");
    if (provided.length !== 1) {
      return { content: [{ type: "text", text: `Error: exactly one of markdown, html, url, template is required (got: ${provided.join(", ") || "none"})` }], isError: true };
    }
    if (!API_KEY) {
      return { content: [{ type: "text", text: "Error: RENDERDOCK_API_KEY environment variable is required" }], isError: true };
    }

    const format = args.format === "png" ? "png" : "pdf";
    const body = { [provided[0]]: args[provided[0]], format };
    if (args.data !== undefined) body.data = args.data;
    if (args.paper) body.paper = args.paper;
    if (args.width) body.width = args.width;
    if (args.height) body.height = args.height;
    if (args.filename) body.filename = args.filename;

    try {
      const res = await fetch(`${API_BASE}/v1/render`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${API_KEY}`,
          "content-type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const buf = Buffer.from(await res.arrayBuffer());
      if (!res.ok) {
        return { content: [{ type: "text", text: `Error: render failed with ${res.status}: ${buf.toString()}` }], isError: true };
      }

      if (args.response_mode === "base64") {
        return { content: [{ type: "text", text: buf.toString("base64") }] };
      }

      const outDir = path.resolve(args.out_dir || path.join(process.cwd(), "renders"));
      fs.mkdirSync(outDir, { recursive: true });
      const base = (args.filename || `render-${Date.now()}`).replace(/[^a-zA-Z0-9._-]/g, "_");
      const filePath = path.join(outDir, `${base}.${format}`);
      fs.writeFileSync(filePath, buf);
      return { content: [{ type: "text", text: `Rendered ${format} (${buf.length} bytes) to ${filePath}` }] };
    } catch (err) {
      return { content: [{ type: "text", text: `Error: ${err.message}` }], isError: true };
    }
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
