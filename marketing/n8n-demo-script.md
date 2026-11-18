# n8n 演示视频脚本（提交给 n8n 人工审核用）

目标：≤5 分钟、无剪辑、按官方要求逐条覆盖。录屏：Win+G → 捕获 → 开始录制。

## 准备清单

- [ ] n8n 已在本机启动（http://localhost:5678）
- [ ] 生产 API key 在手（.secrets/production-key.txt）
- [ ] Groq API key（AI 工具演示用）
- [ ] 演示素材：下方"演示数据"

## 录制流程

### 第 0 步（可选）：一句话开场
"Hi, this is RenderDock, an n8n community node that renders Markdown, HTML, URLs, and templates into PDF and PNG files. I'll walk through installing it, credentials, common actions, and using it as an AI agent tool."

### 第 1 步：安装节点（官方要求：从 npm 装，版本一致 = 0.1.4）
1. 打开 n8n → 左下角 **Settings** → **Community Nodes**
2. Install → 输入 `n8n-nodes-renderdock` → 确认
3. 安装完成后说明："This installs version 0.1.4 from npm — the same version submitted for verification."

### 第 2 步：创建新工作流并插入节点
1. **New workflow**
2. 节点面板搜索 **RenderDock** → 拖到画布
3. 说明四个 Resource 选项：Markdown / HTML / URL / Template

### 第 3 步：凭据 + 凭据测试
1. 点 **Create New Credential** → 类型 RenderDock API
2. 填 API URL（https://api.renderdock.dev/v1/render）+ API Key（生产 key）
3. 点 **Test**（凭据测试会真实渲染一页）→ 显示 "Connection tested successfully"
4. 说明："The credential test performs a live one-page render."

### 第 4 步：功能演示（两个最常见动作）

**动作 A：Markdown → PDF**
1. Resource 选 Markdown，粘贴下方"演示 Markdown"
2. Format 选 PDF，点 **Execute**
3. 展示输出：json（format/pdf 文件名/大小）+ **binary 文件**（点开显示 PDF）

**动作 B：Template + Data → PDF（发票）**
1. Resource 选 Template，粘贴下方"发票模板"，Additional Fields → Data (JSON) 粘贴"发票数据"
2. Execute，展示生成的发票 PDF

### 第 5 步：作为 AI Agent 的工具使用
1. 新建 **AI Agent** 节点（在 LangChain 分类下），Provider 选 Groq，配好 Groq 凭据
2. 在 Agent 节点里选择工具：勾选 **RenderDock** 节点作为工具
3. 给 Agent 一个提示词："Write a short weekly report in Markdown about our product launch, then use the RenderDock tool to render it as a PDF and tell me the filename."
4. 执行 → Agent 调用了 RenderDock 工具 → 展示生成的 PDF 文件
5. 说明："The node is registered as an AI tool (usableAsTool), so agents can render documents through it."

### 收尾
一句："That covers installation, credentials, common actions, and agent usage. Thanks for reviewing."

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
