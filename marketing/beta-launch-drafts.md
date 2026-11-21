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

## 5. Hacker News (Show HN)

> 2026-11-21 实测：Reddit / Indie Hackers 被当前出口 IP 拦截（403），HN 可访问。**同日再测：新账号发 Show HN 被临时限制**（HN 官方提示"massive influx"，要求先熟悉社区、积累历史后再发）。策略：账号正常用 1-2 周（浏览、投票、认真评论）后再试。

**Title:** Show HN: RenderDock — one API that turns Markdown into polished PDFs

**Post:** 链接帖，URL 填 https://renderdock.dev，标题如上。

**首条评论（发帖后立即自己发）：**

```
Hi HN — I built RenderDock, an API that turns Markdown, HTML, URLs, or
Handlebars templates + JSON into designed PDFs and PNGs.

Why: agents and automation workflows are great at producing
documents-in-spirit and terrible at producing documents. The missing step
is a renderer with opinions about typography — hairline tables, page
numbers, A4 geometry.

- One endpoint: POST /v1/render
- MCP server, so Claude and other agents get a render tool that returns
  file paths instead of eating context
- n8n community node for workflow automation
- Free tier: 200 renders/month, no card. Beta is open.

Stack: Fastify + Playwright on one small VPS, SQLite for keys and
metering, Cloudflare Pages for the site. Solo, bootstrapped, about three
weeks of work.

I'm looking for 10-20 beta users who automate documents. Try the demo at
renderdock.dev, or grab one of the template packs (invoice / certificate /
report) at renderdock.dev/templates.

Feedback I'd love: which input format matters to you (Markdown vs
template + JSON), and whether the pricing feels right. Roast away.
```

---

## 6. V2EX（分享创造节点）

> 2026-11-21 实测可访问。中文开发者社区，用户需有 V2EX 账号（新号在部分节点发帖有限制，视情况）。

**标题：** 分享创造：RenderDock —— 把 Markdown/模板渲染成精美 PDF 的 API（给 AI Agent 的"最后一步"）

**正文：**

```
做给 AI Agent 用的渲染 API：Agent 写文档很强，交付文件很弱——写完的
Markdown 还得人肉贴进 Word 排版。RenderDock 补上这一步：一个请求，
把 Markdown、HTML、URL 或 Handlebars 模板 + JSON 渲染成排版精致的
A4 PDF / PNG。

三种接入方式：
- REST API：POST /v1/render，任何语言可用
- MCP server：npx @renderdock/mcp，Agent 直接获得 render 工具，
  返回文件路径、不占上下文
- n8n 社区节点：n8n-nodes-renderdock，自动化工作流里直接出单据

排版是产品核心：发丝线表格、页码、A4 版面，开箱即用。内置三套模板包
（发票 / 证书 / 报告），附示例数据，复制即改。

技术栈：Fastify + Playwright（headless Chromium）+ SQLite 计量，
一台 $5 VPS，Cloudflare Pages 放官网。独立开发，三周从零到 beta。

免费档 200 次/月，无需信用卡。Beta 刚开放，欢迎来拍：
renderdock.dev （模板包：renderdock.dev/templates）

想听大家的看法：定价（$19 起）合理吗？输入格式你们会优先用
Markdown 还是模板 + JSON？
```

---

## 发布清单（按顺序）

1. Beta 正式开放（VPS 部署 API + 计费接入）
2. 上架 MCP 目录：PulseMCP、Glama（需要公开 GitHub 仓库）
3. 上架 n8n 社区节点列表（需要 npm 发布）
4. 按顺序发上述帖子（同一周内错开发，不要一天全发）
5. 在 waitlist 邮件列表发开通通知
6. （可选）HN Show HN —— 2026-11-21 实测当前出口 IP 被 Reddit/Indie Hackers 拦截，HN 可用，可插队先发
