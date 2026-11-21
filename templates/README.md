# RenderDock Template Packs

Production documents, ready to fill in. Each pack is a self-contained
Handlebars template (`template.hbs`) plus an example payload (`sample.json`).
Send both to the RenderDock API and get a designed A4 PDF or PNG back.

Live gallery and PDF samples: <https://renderdock.dev/templates/>

## Packs

| Pack | File | For |
| --- | --- | --- |
| Invoice | `invoice/template.hbs` | billing, receipts, quotes |
| Certificate | `certificate/template.hbs` | courses, awards, verification |
| Report | `report/template.hbs` | monthly briefings, usage reports, summaries |

## Use it

The fastest way is the included CLI (Node 20+):

```bash
export RENDERDOCK_API_KEY=rd_your_api_key
node templates/render.mjs invoice
# -> invoice.pdf, rendered with the sample data

node templates/render.mjs report --data my-data.json --format png --out report.png
```

Or call the API directly — one request, `template` plus `data`:

```bash
curl -X POST https://api.renderdock.dev/v1/render \
  -H "Authorization: Bearer rd_your_api_key" \
  -H "Content-Type: application/json" \
  -d "$(jq -n --rawfile t invoice/template.hbs '{template: $t, data: {}}' \
        | jq '.data = $data' --argfile data invoice/sample.json)" \
  -o invoice.pdf
```

Templates also work through the MCP server (`npx @renderdock/mcp`) and the
n8n node (`n8n-nodes-renderdock`) — pass the template string and data object
to the `render` tool / node the same way.

## Writing your own data

Templates use only built-in Handlebars helpers (`#if`, `#each`), and there are
no custom helpers — **precompute formatted values** (currency strings, dates,
totals) in your data. Missing fields are skipped, so you can drop any section
by omitting it from the JSON.

## Rebuilding previews

`landing/templates/previews/` holds the iframe previews and PDF samples shown
on the gallery page. Regenerate after editing a template:

```bash
tools\node\node.exe templates\build.mjs
```

(The build uses the API's own Playwright + Handlebars, so previews always
match real render output.)
