// Smoke test for the RenderDock MCP server: connects over stdio, lists tools,
// calls "render" with markdown, and checks the output file was written.
// Run: node test/run-test.mjs <api-key>   (expects the API on 127.0.0.1:8787)
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import fs from "node:fs";
import path from "node:path";

const KEY = process.argv[2];
if (!KEY) {
  console.error("usage: node test/run-test.mjs <api-key>");
  process.exit(2);
}

const here = import.meta.dirname;
const transport = new StdioClientTransport({
  command: "node",
  args: [path.join(here, "..", "src", "index.js")],
  env: {
    ...process.env,
    RENDERDOCK_API_URL: "http://127.0.0.1:8787",
    RENDERDOCK_API_KEY: KEY,
  },
  cwd: path.join(here, ".."),
});

const client = new Client({ name: "renderdock-mcp-test", version: "1.0.0" });
await client.connect(transport);

const tools = await client.listTools();
console.log("tools:", tools.tools.map((t) => t.name).join(", "));
if (!tools.tools.some((t) => t.name === "render")) {
  throw new Error("render tool not listed");
}

const res = await client.callTool({
  name: "render",
  arguments: {
    markdown: "# Hello from MCP\n\nThis PDF was rendered through the RenderDock MCP tool.",
    format: "pdf",
    filename: "mcp-test",
    out_dir: path.join(here, "output"),
  },
});

if (res.isError) {
  throw new Error(`tool returned error: ${res.content[0]?.text}`);
}
const text = res.content[0]?.text || "";
console.log("tool result:", text);

const expected = path.join(here, "output", "mcp-test.pdf");
if (!fs.existsSync(expected)) {
  throw new Error(`output file not written: ${expected}`);
}
const stat = fs.statSync(expected);
console.log(`output exists: ${expected} (${stat.size} bytes)`);

const bad = await client.callTool({
  name: "render",
  arguments: { markdown: "# a", html: "<p>b</p>", format: "pdf" },
});
if (!bad.isError) {
  throw new Error("expected isError for multiple inputs");
}
console.log("multi-input rejection:", bad.content[0]?.text);

await client.close();
console.log("MCP smoke test passed");
