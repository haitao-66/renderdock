"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenderDockApi = void 0;
class RenderDockApi {
    constructor() {
        this.name = 'renderdockApi';
        this.displayName = 'RenderDock API';
        this.icon = { light: 'file:renderdock.svg', dark: 'file:renderdock.dark.svg' };
        this.documentationUrl = 'https://renderdock.dev/docs/';
        this.properties = [
            {
                displayName: 'API URL',
                name: 'apiUrl',
                type: 'string',
                default: 'https://api.renderdock.dev/v1/render',
                description: 'The RenderDock render endpoint',
            },
            {
                displayName: 'API Key',
                name: 'apiKey',
                type: 'string',
                typeOptions: {
                    password: true,
                },
                default: '',
                description: 'Your RenderDock API key (starts with rd_)',
            },
        ];
        this.authenticate = {
            type: 'generic',
            properties: {
                headers: {
                    Authorization: '=Bearer {{$credentials.apiKey}}',
                },
            },
        };
        this.test = {
            request: {
                method: 'POST',
                url: '={{$credentials.apiUrl}}',
                body: { format: 'pdf', markdown: '# RenderDock credential test' },
            },
        };
    }
}
exports.RenderDockApi = RenderDockApi;
//# sourceMappingURL=RenderDockApi.credentials.js.map