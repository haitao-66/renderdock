# RenderDock 分发上架清单

公开仓库：https://github.com/haitao-66/renderdock（已上线，15 个提交）
npm 包：@renderdock/mcp ✅ · n8n-nodes-renderdock ✅（均已正式发布）

以下步骤按优先级排列，均需在浏览器（开代理）操作，每项 2-5 分钟。

## 1. 给仓库加主题标签（可选，帮助目录索引）

github.com/haitao-66/renderdock → 页面右侧齿轮图标（About 区域）→ Topics → 添加：
`mcp` `mcp-server` `pdf` `screenshot` `n8n` `render` `markdown`

## 2. Glama 上架（MCP 目录，自动爬 GitHub）

1. 打开 https://glama.ai/mcp/servers
2. 点 **Add Server**（或 Submit）
3. 粘贴仓库地址：`https://github.com/haitao-66/renderdock`
4. 提交。Glama 会自动抓取仓库信息生成条目（根目录的 glama.json 和 README 已备好）

## 3. PulseMCP 上架

1. 打开 https://www.pulsemcp.com/submit
2. 填表单：名称 RenderDock、仓库地址同上、描述（用 README 第一段）、分类选文档/文件类
3. 提交（若显示暂停收件，过几天再试）

## 4. n8n 节点验证提交（creators.n8n.io）

1. 打开 https://creators.n8n.io/nodes
2. 按提示提交 `n8n-nodes-renderdock`
3. 注意：n8n 要求仓库公开 + MIT 许可（已满足）+ 2026 年 5 月起要求 GitHub Actions 发布。若要求 Actions 工作流，回来告诉我，我补上 `.github/workflows/publish.yml`
4. 提交联系邮箱用 hello@renderdock.dev

## 5. 官方 MCP Registry（可选，Glama/PulseMCP 完成后）

用 mcp-publisher CLI（需要时我来准备命令，你在终端运行）

## 状态跟踪

- [ ] GitHub 主题标签
- [x] Glama 上架（https://glama.ai/mcp/servers/haitao-66/renderdock，2026-11-18 已验证）
- [ ] PulseMCP 上架（暂停收件，恢复后自动从官方 Registry 同步）
- [x] n8n 验证提交（2026-11-18，审核中）
- [x] 官方 MCP Registry（io.github.haitao-66/renderdock v0.1.1，2026-11-18 已发布）
