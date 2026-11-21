# RenderDock 项目注册账号清单

最后更新：2026-11-19

## 核心账号（按重要性排序）

| # | 网站 | 账号/身份 | 功能 | 状态 |
| --- | --- | --- | --- | --- |
| 1 | cloudflare.com（Cloudflare） | haitao0209@outlook.com | 域名注册（renderdock.dev）、DNS 管理、网站托管（Pages）、CDN 与 HTTPS、邮箱转发（hello@ → Outlook） | ✅ 正常 |
| 2 | aliyun.com（阿里云国内站） | 你的支付宝实名 | 云服务器（轻量应用服务器，新加坡 47.236.31.106），跑生产渲染 API | ✅ 运行中（约 ¥56/月） |
| 3 | npmjs.com（npm） | 用户名 renderdock | 包发布平台：@renderdock/mcp、n8n-nodes-renderdock | ✅ 正常 |
| 4 | github.com（GitHub） | 用户名 haitao-66 | 代码仓库（renderdock、n8n-nodes-renderdock）、CI/发布管道、目录上架的身份验证 | ✅ 正常 |
| 5 | paddle.com（Paddle） | 你本人（个人主体） | 收款平台（MoR），代缴全球税，客户付款入口 | ✅ 已激活 + 提现信息已填（2026-11-20） |
| 6 | payoneer.com.cn（派安盈） | 你本人 | 提现通道：Paddle 的钱 → 国内银行卡 | ✅ 注册完成 |
| 7 | creators.n8n.io（n8n 创作者门户） | GitHub 登录 | n8n 社区节点验证提交与审核进度 | ⏳ 人工审核中（~4 周） |
| 8 | openrouter.ai（OpenRouter） | GitHub 登录 | AI 模型 API 中转（n8n 演示用的免费模型） | ✅ 正常（免费额度） |
| 9 | glama.ai（Glama） | GitHub 登录 | MCP 服务器目录，RenderDock 已上架 | ✅ 已上架 |
| 10 | registry.modelcontextprotocol.io（官方 MCP Registry） | GitHub OAuth | 官方 MCP 目录，io.github.haitao-66/renderdock 已发布 | ✅ 已发布 |
| 11 | mcprush.com（MCP 市场，自动收录） | 未认领（可选） | 第三方 MCP 市场自动上架了 @renderdock/mcp；认领可选，变现功能不使用 | 📋 已自动上架 |

## 尝试过但未使用/失败的

- **Vultr**（vultr.com）：对比过价格，最终选了阿里云
- **Groq**（groq.com）：注册被拒（不收 outlook 邮箱），改用 OpenRouter
- **Hostinger**：浏览过，两年预付超预算，未购买
- **PulseMCP**（pulsemcp.com）：目录暂停收件，恢复后会自动从官方 Registry 同步，无需注册

## 重要凭证存放位置（本机，勿上传）

- D:\Cloud code\renderdock\.secrets\ 目录（git 已忽略）：
  - cloudflare-token.txt（Cloudflare API token）
  - github-token.txt（GitHub fine-grained token）
  - npm-token.txt + npmrc（npm 发布 token）
  - production-key.txt（生产 API key：rd_1PB_...）
  - openrouter-key.txt（OpenRouter key）
  - server-credentials.txt（服务器 root 密码）
- SSH 密钥：C:\Users\haita\.ssh\id_ed25519（已加到 GitHub 和服务器）

## 关键邮件与转发

- hello@renderdock.dev → 转发到 haitao0209@outlook.com（客户/审核联系入口）
- 等待中的邮件：n8n 审核结果（Paddle 已于 2026-11-20 完成激活与提现配置）
