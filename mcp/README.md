# @renderdock/mcp

Give your AI agent a `render` tool — RenderDock turns Markdown, HTML, public URLs, and Handlebars templates into polished PDF and PNG files.

## Install & run

```bash
npm install -g @renderdock/mcp
renderdock-mcp
```

Or with npx:

```bash
npx @renderdock/mcp
```

## Configuration

| Variable | Required | Description |
| --- | --- | --- |
| `RENDERDOCK_API_KEY` | yes | Your RenderDock API key (starts with `rd_`) |
| `RENDERDOCK_API_URL` | no | Render endpoint (default `http://127.0.0.1:8787`) |

## Tools

### `render`

Renders exactly one of `markdown`, `html`, `url`, or `template` (+ `data`) into `pdf` (default) or `png`.

Returns the local path of the written file (default) or base64 with `response_mode: "base64"`.

Example arguments:

```json
{ "markdown": "# Weekly report\n\nShipped the queue.", "format": "pdf", "filename": "weekly-report" }
```

```json
{ "template": "<h1>Invoice for {{company}}</h1>", "data": { "company": "Acme GmbH" }, "format": "pdf" }
```

## Adding to Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "renderdock": {
      "command": "npx",
      "args": ["@renderdock/mcp"],
      "env": { "RENDERDOCK_API_KEY": "rd_your_key", "RENDERDOCK_API_URL": "https://api.renderdock.dev/v1/render" }
    }
  }
}
```

Get an API key: https://renderdock.dev
