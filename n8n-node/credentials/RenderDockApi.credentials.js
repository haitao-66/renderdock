"use strict";

class RenderDockApi {
  constructor() {
    this.name = "renderdockApi";
    this.displayName = "RenderDock API";
    this.documentationUrl = "https://renderdock.dev/docs/";
    this.properties = [
      {
        displayName: "API URL",
        name: "apiUrl",
        type: "string",
        default: "https://api.renderdock.dev/v1/render",
        description: "The RenderDock render endpoint",
      },
      {
        displayName: "API Key",
        name: "apiKey",
        type: "string",
        typeOptions: { password: true },
        default: "",
        description: "Your RenderDock API key (starts with rd_)",
      },
    ];
    this.authenticate = {
      type: "generic",
      properties: {
        headers: {
          Authorization: "=Bearer {{$credentials.apiKey}}",
        },
      },
    };
    this.test = {
      request: {
        method: "POST",
        url: "={{$credentials.apiUrl}}",
        body: { format: "pdf", markdown: "# RenderDock credential test" },
      },
    };
  }
}

module.exports = { RenderDockApi };
