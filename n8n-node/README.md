# n8n-nodes-renderdock

RenderDock node for n8n — turn Markdown, HTML, public URLs, or Handlebars templates with JSON data into designed PDF and PNG files, inside any workflow.

## Install

In n8n: **Settings → Community Nodes → Install** and enter:

```
n8n-nodes-renderdock
```

## Usage

1. Add a **RenderDock** node to a workflow (search "RenderDock" in the node panel)
2. Create credentials: **API Key** (starts with `rd_`) and optional **API URL**
3. Pick an input type — Markdown, HTML, URL, or Template + Data — and a format (PDF/PNG)
4. The node outputs the file as binary data, ready for Email, Google Drive, or any downstream node

Typical workflow: data source → RenderDock (template + data) → Send Email.

## Credentials

| Field | Description |
| --- | --- |
| API URL | Render endpoint, default `https://api.renderdock.dev/v1/render` |
| API Key | Your RenderDock API key |

Get an API key: https://renderdock.dev · Docs: https://renderdock.dev/docs
