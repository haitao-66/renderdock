# RenderDock 生产部署手册

目标：把渲染 API 部署到一台 Linux VPS，通过 api.renderdock.dev 对外服务，TLS 由 Cloudflare 代理提供。

## 0. 服务器选型

- 规格：**2GB 内存 / 1-2 vCPU** 即可（基准：单渲染 p50 251ms，5 并发 0.8s）
- 推荐：Vultr（支持支付宝）Ubuntu 24.04，$6/月档；或 Hostinger KVM 2（$4.99/月）
- 位置：美国西海岸或新加坡（对 API 延迟影响小）

## 1. 初始化服务器（SSH 登录后执行）

```bash
apt update && apt install -y docker.io docker-compose-v2 git
systemctl enable --now docker
```

## 2. 部署代码

```bash
mkdir -p /opt/renderdock && cd /opt/renderdock
git clone https://github.com/haitao-66/renderdock.git .
cd api
docker compose up -d --build
```

（首次 build 约 5-10 分钟，会下载 Chromium）

## 3. 生成生产 API key

```bash
docker compose exec api node scripts/create-key.js production
```

把输出的 key 存好（一次性显示）。此 key 用于 Beta 用户开通和 MCP/n8n 配置。

## 4. 健康检查

```bash
curl http://localhost:8787/healthz
# {"ok":true,"service":"renderdock-api"}
```

## 5. DNS + HTTPS

在 Cloudflare DNS 添加记录：
- 类型 A，名称 `api`，指向 VPS 公网 IP，**开启代理（橙云）**

**端口与 TLS 架构（重要）**：
- 服务在宿主机监听 **80 端口**（docker 映射 80→8787），因阿里云轻量默认防火墙仅放行 22/3389，需在控制台**防火墙**添加 TCP 80 规则
- Cloudflare 免费版源站端口不支持 8787；源站用 80 + Cloudflare **SSL/TLS 模式改为 Flexible（灵活）**（访问者到 CF 是 HTTPS，CF 到源站是 HTTP，源站无需维护证书）
- 之后测试：`curl https://api.renderdock.dev/healthz`

## 6. 运维要点

- 日志：`docker compose logs -f api`
- 数据：`/app/data` 挂载在 docker volume（SQLite + key 都在里面），备份 = 备份 volume
- 升级：`git pull && docker compose up -d --build`
- 更新网站文档中 API 地址为 https://api.renderdock.dev/v1/render（当前文档页已写此地址）
- 监控：/healthz 用 UptimeRobot 类免费服务挂一个每分钟检查

## 7. Beta 开放检查单

- [ ] VPS 部署并健康检查通过
- [ ] api.renderdock.dev 走 Cloudflare 代理 + HTTPS 可访问
- [ ] 生产 key 生成并妥善保存
- [ ] 网站等待列表（mailto 兜底已可用；KV 后端可选）
- [ ] 按 marketing/beta-launch-drafts.md 发招募帖
- [ ] 给等待列表用户发 Beta 邀请（模板见 marketing/beta-invite-email.md）
