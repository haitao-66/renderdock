import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	Icon,
	INodeProperties,
} from 'n8n-workflow';

export class RenderDockApi implements ICredentialType {
	name = 'renderdockApi';

	displayName = 'RenderDock API';

	icon: Icon = { light: 'file:renderdock.svg', dark: 'file:renderdock.dark.svg' };

	documentationUrl = 'https://renderdock.dev/docs/';

	properties: INodeProperties[] = [
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

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			method: 'POST',
			url: '={{$credentials.apiUrl}}',
			body: { format: 'pdf', markdown: '# RenderDock credential test' },
		},
	};
}
