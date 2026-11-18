# Beta 邀请邮件模板

主题：Your RenderDock beta access

正文：

Hi there,

You asked for early access to RenderDock — it's ready.

RenderDock turns Markdown, HTML, URLs, and Handlebars templates into polished PDF and PNG files through one API, built for AI agents and automations.

Your beta access:

- API: https://api.renderdock.dev/v1/render
- Free tier: 200 renders/month (no card needed)
- Docs: https://renderdock.dev/docs/
- MCP server: npx @renderdock/mcp (set RENDERDOCK_API_KEY)
- n8n node: n8n-nodes-renderdock (Settings → Community Nodes)

Two things we'd love in return:

1. Tell us what you're rendering — a one-line reply helps us prioritize templates and features.
2. Report anything that breaks. Beta means bugs are expected; being told about them is the point.

The beta is free. Paid tiers open later, and you'll hear from us before anything changes.

— RenderDock
hello@renderdock.dev

---

## 发送方式

- 从 waitlist 记录（landing/waitlist.json 本地 / KV / 邮件）逐人发送
- 建议用个人邮箱手工发送前几批（量小），后续接入 Resend 类服务批量发
- 每封附上收件人的专属 API key：`cd api && npm run create-key -- <email>`
