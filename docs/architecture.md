# RenderDock 技术架构

版本：v1 草案 · 2026-11-17 · 状态：第 1 周定稿，随开发更新

## 1. 产品范围（MVP 及近期）

**核心**：一个渲染 API，把 Markdown / HTML / JSON（+模板）渲染成 PDF 和 PNG，通过三种形态交付：

1. **REST API**：`POST /v1/render`，API key 鉴权，用量计量
2. **MCP server**（第 3 周）：AI Agent 直接调用，返回文件路径/base64，不占 Agent 上下文
3. **n8n 社区节点**（第 4 周）：自动化工作流内嵌渲染能力

**支撑**：落地页 + 等待列表（第 1 周）；渲染结果托管在 Cloudflare R2（免费 10GB）；垂直模板包（发票/报告，第 5 周起）。

**差异点**：Markdown 优先（Agent 输出 Markdown，我们负责排版成精美 PDF）；Agent 生态分发（MCP 目录 + n8n 社区），绕开 SEO 红海。

## 2. 技术选型

| 层 | 选择 | 理由 |
| --- | --- | --- |
| 语言 | TypeScript（Node 20+）全栈 | API、MCP server、n8n 节点共享一套 SDK；MCP/n8n 生态 TS 工具链最成熟 |
| Web 框架 | Fastify | 低开销、Schema 校验内建、API 产品常用 |
| 渲染引擎 | Playwright（Chromium headless） | print-to-PDF 质量高；截图/PDF 统一 |
| Markdown 排版 | markdown-it + 自有 CSS 排版主题 | **核心差异点**：排版质量即产品力 |
| 模板 | Handlebars | JSON 数据 + 模板 → HTML（发票/报告场景） |
| 数据库 | SQLite（Node 24 内置 `node:sqlite`） | 单机起步零外部依赖；本机无 C++ 工具链，用内置模块免原生编译 |
| 认证 | GitHub OAuth（控制台登录）+ API key（机器访问） | 开发者受众，免费，无密码体系 |
| 计费 | Paddle（MoR） | 代缴全球税；webhook 同步订阅状态；大陆个人待验证（备选 Creem） |
| 对象存储 | Cloudflare R2 | 渲染结果托管 URL，免费 10GB |
| 部署 | 单台 VPS $5/月（Vultr/Hostinger，支持支付宝）+ Docker Compose | app 与 chromium 分容器 |
| CI/CD | GitHub Actions → SSH 部署 | GitHub 账号由用户周 3-4 注册 |
| MCP SDK | @modelcontextprotocol/sdk | 官方 TS SDK |

## 3. 系统设计

```
请求流：
Client/Agent → API（Fastify）→ 鉴权（API key）+ 限额检查
            → 渲染队列（内存队列 + 并发池，MVP 阶段）
            → Playwright worker（Chromium 沙箱）
            → 输出：二进制响应 或 R2 托管 URL
            → 用量写入 SQLite
```

**安全（Agent 场景的显性卖点）**：
- SSRF 防护：URL 渲染模式下解析 DNS 后校验，拒绝私网/环回地址
- DNS-rebinding 防御：解析结果与连接目标一致性校验
- 渲染超时（15s）、输出大小限制（PDF ≤ 25MB）、Chromium 沙箱、按 key 速率限制

**可观测**：结构化日志 + `/healthz`；告警后置。

## 4. 定价（初版假设，第 3 周上线时校准）

| 档 | 价格 | 渲染次数/月 |
| --- | --- | --- |
| Free | $0 | 200 |
| Starter | $19 | 5,000 |
| Pro | $79 | 25,000 |
| 超额 | $10 / 5,000 | — |

## 5. 里程碑

| 周 | 内容 | 状态 |
| --- | --- | --- |
| 1 | 命名/域名、项目骨架、架构文档、落地页 | 进行中 |
| 2 | Node 工具链、渲染核心、API + key + 计量 | 进行中 |
| 3 | 免费档、定价页、MCP server、首批 SEO 内容 | 进行中（MCP 完成、定价页上线、首篇博客已发） |
| 4 | n8n 节点、目录上架、Beta 招募 | 未开始 |
| 5+ | 分发、迭代、垂直模板包 | 未开始 |

**止损线**：第 8 周无 Beta 用户或需求信号 → 切垂直文档工具（方向 B），渲染核心可复用 80%。

## 6. 环境说明

- **本机 Node 工具链**：已装 Node 24.22.3 到 `tools/node/`（2026-11-17，项目本地，gitignored）。系统里的 node.exe 来自 Unity 安装且不带 npm，不要使用。
- **域名 renderdock.dev**：待用户注册（Cloudflare Registrar 或 Namecheap，~$12/年，支持国际信用卡/PayPal）。
- **收款账号（Paddle + 派安盈）**：用户第 2~3 周注册验证，免费。若 Paddle 拒大陆个人，改 Creem。
- **命名撞车**：RenderDock Studio（乌克兰 3D 美术外包，不同行业）——接受现状，规模化前重评。

## 7. 开放问题

- VPS 规格与并发渲染上限的匹配测试（周 2 做基准）
- Paddle 大陆个人主体审核结果（周 2-3）
- 免费档额度（200/月）是否足以驱动口碑传播（Beta 期观察）
- R2 公开读 URL 是否需要鉴权签名（默认公开，内容敏感场景提供私有模式）
