# 周报：渲染队列上线 / Weekly Report: Rendering Queue Live

本周我们把渲染队列推上了生产环境，数字如下，背景在表格之后。

| 指标 Metric | 上周 | 本周 |
| ----------- | ---- | ---- |
| 渲染次数 Renders | 4,210 | 6,870 |
| P50 延迟 | 1.4s | 0.9s |
| 失败数 | 12 | 3 |

> The agent drafts the words. We handle the paper.

## 下周计划

1. 发票与证书模板包
2. MCP server 发布
3. n8n 节点上架

代码示例：

    const res = await fetch("https://api.renderdock.dev/v1/render", {
      method: "POST",
      body: JSON.stringify({ markdown: src, format: "pdf" })
    });
