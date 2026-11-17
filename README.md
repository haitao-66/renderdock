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
| `api/` | Rendering API — coming in week 2 |
| `.claude/launch.json` | Preview configuration for the Claude desktop app |

## Quick start (local landing preview)

```
node static-server.js
# open http://localhost:4321
```

## Week 1 tasks

- [x] Name + domain availability (renderdock.dev — needs user registration)
- [x] Project scaffold + git
- [x] Architecture doc
- [ ] Landing page + waitlist (local preview)
- [ ] Initial commit
