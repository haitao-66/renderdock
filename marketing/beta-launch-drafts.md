# RenderDock Beta 招募帖草稿

状态：待发布（等 GitHub/npm 账号就绪 + Beta 正式开放）。发布时间目标：Beta 开放日。

---

## 1. Reddit r/SideProject

**Title:** I built RenderDock — an API that turns Markdown into polished PDFs, built for AI agents (free tier, beta open)

**Body:**

Agents are great at drafting and terrible at delivering. Mine kept writing beautiful reports that someone then had to paste into Word. So I built the missing layer.

RenderDock is one endpoint: Markdown, HTML, a URL, or a Handlebars template + JSON goes in; a designed PDF or PNG comes out. A4 layout, hairline tables, page numbers, the works.

What makes it agent-native:
- MCP server — Claude and other agents get a `render` tool that returns file paths
- n8n community node — invoices, reports, screenshots on a schedule
- REST API from any language

Stack: Fastify + Playwright on one small VPS, SQLite for keys/metering, Cloudflare Pages for the site. Solo, bootstrapped, built over two weeks.

Beta is open: 200 renders/month free forever. I'm looking for 10-20 people who automate documents and will tell me what's broken.

Try it: renderdock.dev — happy to answer questions.

---

## 2. Reddit r/n8n

**Title:** Render any data to a designed PDF inside n8n — community node, free tier, looking for feedback

**Body:**

I built an n8n community node that renders Markdown, HTML, URLs, or Handlebars templates + JSON into PDF/PNG files — the use case I had in mind is the classic "spreadsheet row → invoice PDF → email" loop, but it also does reports, certificates, and web page screenshots.

- Node: `n8n-nodes-renderdock` (Settings → Community Nodes)
- Free tier: 200 renders/month
- Outputs binary data so it drops straight into Email/Google Drive nodes

It's in beta and I'm looking for workflow builders to stress-test it. If you try it and something doesn't work the way you'd expect, tell me and I'll fix it.

Docs: renderdock.dev/docs

---

## 3. Indie Hackers

**Title:** RenderDock — rendering API for AI agents (MCP + n8n + REST)

**Body:**

What: an API that turns Markdown / HTML / URLs / Handlebars templates into production-quality PDFs and screenshots. Built for agent and automation workflows.

Why: after watching agents draft documents that never make it to a deliverable, I built the "final mile" layer — the thing that turns a draft into a file you can send a client.

Numbers so far: solo, bootstrapped, ~2 weeks of build time, $0 marketing, $0 spend beyond the domain. Beta open with a 200-render/month free tier.

What I'm hoping to learn here: which input format people reach for first (Markdown vs template+JSON), and whether the MCP angle matters or people just want the REST API.

Ask me anything — especially roast the pricing.

---

## 4. X / Twitter thread

1/ Agents can draft. They can't deliver. RenderDock is the missing step: one API that turns Markdown, HTML, URLs, and templates into polished PDFs.

2/ Built agent-native from day one:
→ REST API for pipelines
→ MCP server so Claude gets a `render` tool
→ n8n node for workflow automation

3/ Free tier: 200 renders/month, no card. Beta is open — break it and tell me.

4/ renderdock.dev

---

## 发布清单（按顺序）

1. Beta 正式开放（VPS 部署 API + 计费接入）
2. 上架 MCP 目录：PulseMCP、Glama（需要公开 GitHub 仓库）
3. 上架 n8n 社区节点列表（需要 npm 发布）
4. 按顺序发上述帖子（同一周内错开发，不要一天全发）
5. 在 waitlist 邮件列表发开通通知
