# Codex 交接指令：为 n8n 审核录制 RenderDock 节点演示视频

你是一段视频的录制执行者。请用你的电脑操作能力，驱动本机运行的 n8n 实例，完成以下全部步骤并**全程录屏**，产出一段 5 分钟以内、无剪辑的演示视频。完成后告诉我视频文件的完整路径。

## 环境事实（不要重新安装任何东西）

- n8n 已在本机运行：http://localhost:5678（owner 账号已存在：haitao0209@outlook.com / REDACTED see .secrets/n8n-demo-credentials.txt）
- 待演示的 npm 包：`n8n-nodes-renderdock`（**必须安装 0.1.5 版**，即 npm 最新版；此版本无需任何修补，请勿修改已安装的副本）
- 生产渲染 API：https://api.renderdock.dev/v1/render
- 生产 API key：REDACTED see .secrets/production-key.txt
- AI 模型服务（用于第 7 步）：OpenRouter，key：REDACTED see .secrets/openrouter-key.txt；首选 `meta-llama/llama-3.3-70b-instruct:free`，若区域不可用换 `meta-llama/llama-3.1-8b-instruct:free`，仍不可用再换任一 `:free` 模型

## 录制要求

- 时长 ≤ 5 分钟，中间**不要剪辑**
- 录屏方式：优先用你自带的屏幕录制能力；若没有，用 PowerShell 调 Windows 内置录屏或安装轻量工具
- 视频保存到 `D:\Cloud code\n8n-demo.mp4`
- 语言：界面英文，无旁白也可以

## 操作步骤（严格按序）

1. **登录**：打开 http://localhost:5678，用上方账号登录（若已登录跳过）。
2. **安装节点**：n8n 左下角 Settings → Community Nodes → 若已安装旧版，先卸载，再安装 `n8n-nodes-renderdock`（安装 npm 最新版 0.1.5，**不要修改已安装文件**）。
3. **新建工作流**：New workflow → 节点面板搜索 RenderDock → 拖入画布。
4. **创建凭据并测试**：节点上 Create New Credential → 类型 RenderDock API → API URL 填 https://api.renderdock.dev/v1/render，API Key 填上面生产 key → 点 Test，展示 "Connection tested successfully"。
5. **演示动作一（Markdown → PDF）**：Resource 选 Markdown，粘贴下面"演示 Markdown"，Format 选 PDF，Execute。展示输出项中的 binary PDF 文件。
6. **演示动作二（Template + Data → 发票 PDF）**：Resource 选 Template，粘贴"发票模板"；Additional Fields → Data (JSON) 粘贴"发票数据"。Execute，展示发票 PDF。
7. **演示 AI Agent 工具用法**：添加 AI Agent 节点，Model 选 OpenRouter（凭据用上面的 OpenRouter key），模型 `meta-llama/llama-3.3-70b-instruct:free`。在 Agent 节点工具列表中勾选 RenderDock 节点作为工具。提示词："Write a short weekly report in Markdown about our product launch, then use the RenderDock tool to render it as a PDF and tell me the filename." 执行，展示 Agent 调用工具并生成 PDF。
8. 结束录制。

## 演示数据

**演示 Markdown：**
```
# Weekly Report — RenderDock Beta

Shipped the public beta this week. Numbers below.

| Metric | Last week | This week |
| ------ | --------- | --------- |
| Renders | 4,210 | 6,870 |
| P50 latency | 1.4s | 0.9s |
| Failures | 12 | 3 |

> The agent drafts the words. We handle the paper.

Next: invoice template packs and certificate generation.
```

**发票模板：**
```
<h1>Invoice {{invoiceNumber}}</h1>
<p>{{companyName}}<br>{{companyAddress}}</p>
<table>
  <thead><tr><th>Item</th><th>Qty</th><th>Amount</th></tr></thead>
  <tbody>
  {{#each lineItems}}
    <tr><td>{{description}}</td><td>{{quantity}}</td><td>{{amount}}</td></tr>
  {{/each}}
  </tbody>
</table>
<p><strong>Total: {{total}}</strong><br>Due by {{dueDate}}</p>
```

**发票数据：**
```json
{
  "invoiceNumber": "INV-2026-0118",
  "companyName": "Acme GmbH",
  "companyAddress": "Alexanderplatz 1, Berlin",
  "lineItems": [
    { "description": "Design review", "quantity": 2, "amount": "€240.00" },
    { "description": "API integration", "quantity": 1, "amount": "€680.00" }
  ],
  "total": "€920.00",
  "dueDate": "2026-12-01"
}
```

## 遇到问题

- 步骤 2 安装失败 → 检查 n8n 的 Settings → Community Nodes 里版本是否为 0.1.4
- 步骤 4 Test 失败 → 检查 API URL 与 key 拼写
- 步骤 7 模型不可用 → 换 `meta-llama/llama-3.1-8b-instruct:free`
- 任何 UI 卡住 → 刷新页面重试当前步骤，不要从头开始

完成后报告：视频路径 + 时长 + 每一步是否成功。
