# RenderDock

**Agent-native rendering API** — turn Markdown, HTML, and JSON into polished PDFs and screenshots. One API, built for AI agents, automations, and developers.

- REST API · MCP server · n8n node
- Free tier: 200 renders/month forever
- Domain: renderdock.dev
- Status: **Week 1** — naming, landing page, architecture (this repo was born 2026-11-17)

## Repository layout

| Path | What it is |
| --- | --- |
| `docs/architecture.md` | Technical architecture and decisions |
| `landing/` | Static landing page + waitlist (served by `static-server.js` for local preview) |
| `static-server.js` | Zero-dependency Node static server (waitlist writes to `landing/waitlist.json`) |
| `api/` | Rendering API — Fastify + Playwright, keys + metering (SQLite) |
| `tools/node/` | Local Node 24 toolchain (gitignored) |
| `.claude/launch.json` | Preview configuration for the Claude desktop app |

## Quick start

```bash
# landing preview (node tools/node/node.exe)
node static-server.js            # http://localhost:4321

# API
cd api
npm install && npx playwright install chromium
npm run create-key               # prints an API key
npm start                        # http://127.0.0.1:8787

curl -X POST http://127.0.0.1:8787/v1/render \
  -H "Authorization: Bearer <key>" \
  -H "Content-Type: application/json" \
  -d '{"markdown": "# Hello", "format": "pdf"}' -o out.pdf
```

## Week 1 tasks

- [x] Name + domain availability (renderdock.dev)
- [x] Project scaffold + git
- [x] Architecture doc
- [x] Landing page + waitlist (local preview)
- [x] Initial commit

## Week 2 tasks

- [x] Local Node toolchain (Node 24.22.3 in `tools/node/`)
- [x] API scaffold: renderer core (markdown/html/url/template → pdf/png)
- [x] Markdown print theme (`api/themes/report.css`)
- [x] API key auth, rate limit, monthly quota (node:sqlite)
- [x] SSRF guard for URL rendering
- [x] End-to-end render test (`api/test/e2e.mjs`, 10/10)
- [ ] Commit
