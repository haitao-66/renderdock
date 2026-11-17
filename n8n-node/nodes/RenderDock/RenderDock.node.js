"use strict";

class RenderDock {
  constructor() {
    this.description = {
      displayName: "RenderDock",
      name: "renderdock",
      icon: "file:renderdock.svg",
      group: ["transform"],
      version: 1,
      subtitle: '={{$parameter["format"]}}',
      description:
        "Render Markdown, HTML, a public URL, or a Handlebars template with data into a PDF or PNG file",
      defaults: { name: "RenderDock" },
      inputs: ["main"],
      outputs: ["main"],
      credentials: [{ name: "renderdockApi", required: true }],
      properties: [
        {
          displayName: "Input Type",
          name: "inputType",
          type: "options",
          options: [
            { name: "Markdown", value: "markdown" },
            { name: "HTML", value: "html" },
            { name: "URL", value: "url" },
            { name: "Template + Data", value: "template" },
          ],
          default: "markdown",
          description: "What to render",
        },
        {
          displayName: "Markdown",
          name: "markdown",
          type: "string",
          typeOptions: { rows: 8 },
          default: "",
          displayOptions: { show: { inputType: ["markdown"] } },
          description: "Markdown source text",
        },
        {
          displayName: "HTML",
          name: "html",
          type: "string",
          typeOptions: { rows: 8 },
          default: "",
          displayOptions: { show: { inputType: ["html"] } },
          description: "Raw HTML",
        },
        {
          displayName: "URL",
          name: "url",
          type: "string",
          default: "",
          displayOptions: { show: { inputType: ["url"] } },
          description: "Public http(s) URL to render",
        },
        {
          displayName: "Template",
          name: "template",
          type: "string",
          typeOptions: { rows: 8 },
          default: "",
          displayOptions: { show: { inputType: ["template"] } },
          description: "Handlebars template",
        },
        {
          displayName: "Data (JSON)",
          name: "data",
          type: "json",
          default: "{}",
          displayOptions: { show: { inputType: ["template"] } },
          description: "Data merged into the template",
        },
        {
          displayName: "Format",
          name: "format",
          type: "options",
          options: [
            { name: "PDF", value: "pdf" },
            { name: "PNG", value: "png" },
          ],
          default: "pdf",
          description: "Output format",
        },
        {
          displayName: "Paper Size",
          name: "paper",
          type: "options",
          options: [
            { name: "A4", value: "A4" },
            { name: "Letter", value: "Letter" },
            { name: "Legal", value: "Legal" },
            { name: "A3", value: "A3" },
          ],
          default: "A4",
          displayOptions: { show: { format: ["pdf"] } },
          description: "Page size for PDF output",
        },
        {
          displayName: "Filename",
          name: "filename",
          type: "string",
          default: "",
          placeholder: "weekly-report",
          description: "Base name for the output file, without extension",
        },
      ],
    };
  }

  async execute() {
    const inputType = this.getNodeParameter("inputType", 0);
    const format = this.getNodeParameter("format", 0);
    const filename = this.getNodeParameter("filename", 0);
    const credentials = await this.getCredentials("renderdockApi");
    const apiUrl = credentials.apiUrl || "https://api.renderdock.dev/v1/render";

    const body = { format };
    if (inputType === "markdown") body.markdown = this.getNodeParameter("markdown", 0);
    if (inputType === "html") body.html = this.getNodeParameter("html", 0);
    if (inputType === "url") body.url = this.getNodeParameter("url", 0);
    if (inputType === "template") {
      body.template = this.getNodeParameter("template", 0);
      body.data = this.getNodeParameter("data", 0);
    }
    if (filename) body.filename = filename;
    if (format === "pdf") body.paper = this.getNodeParameter("paper", 0);

    const response = await this.helpers.httpRequestWithAuthentication.call(
      this,
      "renderdockApi",
      {
        method: "POST",
        url: apiUrl,
        body,
        json: true,
        encoding: null,
      }
    );

    const buffer = Buffer.isBuffer(response) ? response : Buffer.from(response);
    const mime = format === "pdf" ? "application/pdf" : "image/png";
    const name = `${(filename || "renderdock").replace(/[^a-zA-Z0-9._-]/g, "_")}.${format}`;
    const prepared = await Promise.resolve(
      this.helpers.prepareBinaryData.call(this, buffer, name, mime)
    );

    return [
      [
        {
          json: { format, filename: name, size: buffer.length },
          binary: { data: prepared },
        },
      ],
    ];
  }
}

module.exports = { RenderDock };
