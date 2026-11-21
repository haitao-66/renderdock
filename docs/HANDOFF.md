# RenderDock 项目交接笔记（HANDOFF）

> 用途：换新会话时用 `@docs/HANDOFF.md` 引入，让新会话快速接上下文。
> 最后更新：2026-11-21

## 项目是什么

RenderDock：面向 AI Agent 的渲染 API（Markdown/HTML/URL/模板 → 精美 PDF/PNG），
三形态交付：REST API + MCP server + n8n 社区节点。站点 renderdock.dev，API api.renderdock.dev。
Beta 已开放（免费档 200 渲染/月）。

## 代码与仓库

- 主仓库（monorepo）：`D:\Cloud code\renderdock` → github.com/haitao-66/renderdock（本地积压若干提交，待推）
  - `api/`：Fastify + Playwright 渲染 API（SQLite 密钥/计量、SSRF 防护）
  - `mcp/`：MCP server（@renderdock/mcp，npm 已发布 0.1.1）
  - `landing/`：静态站（Cloudflare Pages），含 pricing/terms/privacy/refund/docs/blog
  - `docs/`：architecture.md、deploy.md、accounts.md、本文件
  - `marketing/`：beta-launch-drafts.md、beta-invite-email.md、n8n-demo-script.md、directory-submissions.md
  - `templates/`：发票/证书/报告模板包（Handlebars + 示例数据 + build.mjs/render.mjs）；画廊页与预览产物在 `landing/templates/`
  - `.secrets/`：全部密钥（git 已忽略）：cloudflare-token、github-token、npm-token+npmrc、production-key、openrouter-key、server-credentials（root 密码见该文件）、n8n-demo-credentials
- 独立仓库：`D:\Cloud code\n8n-nodes-renderdock` → github.com/haitao-66/n8n-nodes-renderdock（n8n 包，根目录布局，npm 0.1.5）

## 生产环境

- 服务器：阿里云轻量（新加坡）47.236.31.106，root（密码见 .secrets/server-credentials.txt），SSH 密钥已配（~/.ssh/id_ed25519）
- API：Docker Compose（api/ 目录），宿主 80→容器 8787；Cloudflare 代理 api.renderdock.dev（SSL 模式 Flexible）
- 网站：Cloudflare Pages（wrangler 部署，token 在 .secrets）
- 本地 Node 工具链：`renderdock\tools\node\`（24.22.3 + npm/pnpm/npx），系统 node 是 Unity 的不可用

## 各战线状态

| 战线 | 状态 |
| --- | --- |
| Paddle 收款 | ✅ 激活 + 提现配置完成（2026-11-20）——资金链闭合 |
| n8n 验证 | ⏳ 人工审核中（~4 周），视频已提交（D:\Cloud code\n8n-demo.mp4） |
| npm | ✅ @renderdock/mcp@0.1.1、n8n-nodes-renderdock@0.1.5（provenance） |
| 目录 | ✅ 官方 MCP Registry（io.github.haitao-66/renderdock）、Glama、mcprush 自动上架；PulseMCP 暂停收件 |
| 邮箱 | hello@renderdock.dev → 用户 Outlook（Cloudflare Email Routing） |

## 待办清单

1. 发 Beta 招募帖（marketing/beta-launch-drafts.md）——Reddit 注册需先换代理节点（2026-11-21 实测出口 IP 被 Reddit/Indie Hackers 拦 403，HN 可访问，Show HN 稿已备可先发）
2. 推送积压提交（本地 git push，或从服务器推）
3. ~~发票/证书模板包（方向 B 弹药）~~ ✅ 已建（2026-11-21）：templates/ 三件套 + /templates/ 画廊页，待推送上线
4. 更多 SEO 文章（已 6 篇：11-21 新增 URL→PDF、MCP 文档输出、模板包上线三篇；选题可继续：证书生成、网页截图 PNG、n8n 工作流案例）
5. 等 Paddle 结算流程实际跑通（第一个付费客户后验证）

## 运维速查（踩过的坑都在这）

- **PowerShell 空格路径**：所有带空格的路径用引号 + `&` 调用符
- **UTF-8 BOM**：写 config/json 用 `[IO.File]::WriteAllText + UTF8Encoding($false)`，别用 `Set-Content -Encoding utf8`（坑过 ssh config 和 package.json）
- **GitHub 推送**：HTTPS 从代理出口被 403（换节点/格式/GCM 全无效）→ 用 SSH over 443（~/.ssh/config：Host github.com → HostName ssh.github.com, Port 443）+ 密钥认证；仓库不配 http.proxy（走 TUN）
- **npm 发布**：走代理 env（HTTPS_PROXY=127.0.0.1:7897 + NPM_CONFIG_USERCONFIG=.secrets/npmrc）；新包先 `npm stage publish` 再网站 Approve（CLI approve 有 bug）
- **pnpm 12**：构建白名单在 pnpm-workspace.yaml；CI 用 `--ignore-scripts` 安装
- **模板重建**：改 templates/ 后运行 `& "D:\Cloud code\renderdock\tools\node\node.exe" templates\build.mjs` 重新生成预览（PNG/PDF + 画廊页）
- **公开仓库密钥（2026-11-21 踩坑）**：GitHub push protection 会拦截历史提交里的密钥（codex-handoff.md 曾含 OpenRouter key）。修复流程 = 当前文件脱敏指向 `.secrets/` → `git filter-branch --tree-filter` 重写全部未推送提交 → `git push --force-with-lease`；tree-filter 脚本路径**不能含空格**（"Cloud code" 会被拆，复制到无空格路径如 `D:\scrub-secrets.sh` 再跑）。密钥一律只放 `.secrets/`
- **n8n 节点发布**：独立仓库推 tag（如 0.1.6）触发 Publish 工作流（provenance）；npm OIDC 信任发布者已指向 n8n-nodes-renderdock 仓库
- **服务器部署**：scp 文件到 /opt/renderdock 或让用户 git push 后服务器 pull；docker compose up -d --build
- **权限边界（重要）**：对外发布类动作（git push、npm publish、目录提交）由**用户点击运行**；代理/隧道搭建不参与（用户已自行搞定，节点地址用 47.236.31.106）
- **用户偏好**：几乎不亲自操作，能代劳的代劳；发布类给 Run 按钮命令；截图用 OCR 读（Windows 自带 OCR，PowerShell WinRT 脚本）

## 新会话开场建议

"读 D:\Cloud code\renderdock\docs\HANDOFF.md，继续推进待办清单第 N 项"
