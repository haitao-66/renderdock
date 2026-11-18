# n8n-nodes-renderdock

RenderDock node for n8n — turn Markdown, HTML, public URLs, or Handlebars templates with JSON data into designed PDF and PNG files, inside any workflow.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/) workflow automation platform.

- [Installation](#installation)
- [Operations](#operations)
- [Credentials](#credentials)
- [Usage](#usage)
- [Resources](#resources)
- [Version history](#version-history)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation. In n8n: **Settings → Community Nodes → Install** and enter `n8n-nodes-renderdock`.

## Operations

Renders exactly one of four inputs to a PDF (default) or PNG file:

- **Markdown** — rendered with RenderDock's print theme (A4 layout, hairline tables, page numbers)
- **HTML** — raw HTML
- **URL** — a public http(s) page; private network addresses are blocked
- **Template + Data** — a Handlebars template merged with JSON data (invoices, certificates, reports)

The output is returned as binary data, ready for Email, Google Drive, or any downstream node.

## Credentials

Create RenderDock API credentials in n8n:

| Field | Description |
| --- | --- |
| API URL | Render endpoint, default `https://api.renderdock.dev/v1/render` |
| API Key | Your RenderDock API key (starts with `rd_`) |

Get an API key at https://renderdock.dev. The credential includes a connection test that performs a one-page render.

## Usage

Typical workflow: data source → RenderDock (Template + Data) → Send Email. Every input item becomes one rendered file.

## Resources

- [RenderDock API docs](https://renderdock.dev/docs/)
- [RenderDock](https://renderdock.dev)
- [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)

## Version history

- 0.1.1: TypeScript rewrite on the official @n8n/node-cli scaffold, strict mode, dark icon
- 0.1.0: initial release (plain JavaScript implementation)
