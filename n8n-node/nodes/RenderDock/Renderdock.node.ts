import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

export class RenderDock implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'RenderDock',
		name: 'renderdock',
		icon: { light: 'file:renderdock.svg', dark: 'file:renderdock.dark.svg' },
		group: ['transform'],
		version: [1],
		subtitle: '={{$parameter["format"]}}',
		description:
			'Render Markdown, HTML, a public URL, or a Handlebars template with data into a PDF or PNG file',
		defaults: {
			name: 'RenderDock',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 'renderdockApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Markdown', value: 'markdown', action: 'Render Markdown' },
					{ name: 'HTML', value: 'html', action: 'Render HTML' },
					{ name: 'URL', value: 'url', action: 'Render URL' },
					{ name: 'Template', value: 'template', action: 'Render Template' },
				],
				default: 'markdown',
				description: 'What to render',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Render', value: 'render', action: 'Render' },
				],
				default: 'render',
			},
			{
				displayName: 'Markdown',
				name: 'markdown',
				type: 'string',
				typeOptions: { rows: 8 },
				default: '',
				displayOptions: { show: { resource: ['markdown'] } },
				description: 'Markdown source text',
			},
			{
				displayName: 'HTML',
				name: 'html',
				type: 'string',
				typeOptions: { rows: 8 },
				default: '',
				displayOptions: { show: { resource: ['html'] } },
				description: 'Raw HTML',
			},
			{
				displayName: 'URL',
				name: 'url',
				type: 'string',
				default: '',
				displayOptions: { show: { resource: ['url'] } },
				description: 'Public http(s) URL to render; private addresses are blocked',
			},
			{
				displayName: 'Template',
				name: 'template',
				type: 'string',
				typeOptions: { rows: 8 },
				default: '',
				displayOptions: { show: { resource: ['template'] } },
				description: 'Handlebars template',
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				default: {},
				displayOptions: { show: { resource: ['template'] } },
				options: [
					{
						displayName: 'Data (JSON)',
						name: 'data',
						type: 'json',
						default: '{}',
						description: 'Data merged into the template',
					},
				],
			},
			{
				displayName: 'Format',
				name: 'format',
				type: 'options',
				options: [
					{ name: 'PDF', value: 'pdf' },
					{ name: 'PNG', value: 'png' },
				],
				default: 'pdf',
				description: 'Output format',
			},
			{
				displayName: 'Paper Size',
				name: 'paper',
				type: 'options',
				options: [
					{ name: 'A4', value: 'A4' },
					{ name: 'Letter', value: 'Letter' },
					{ name: 'Legal', value: 'Legal' },
					{ name: 'A3', value: 'A3' },
				],
				default: 'A4',
				displayOptions: { show: { format: ['pdf'] } },
				description: 'Page size for PDF output',
			},
			{
				displayName: 'Filename',
				name: 'filename',
				type: 'string',
				default: '',
				placeholder: 'weekly-report',
				description: 'Base name for the output file, without extension',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				const resource = this.getNodeParameter('resource', itemIndex) as string;
				const format = this.getNodeParameter('format', itemIndex) as string;
				const filename = this.getNodeParameter('filename', itemIndex) as string;

				const credentials = await this.getCredentials('renderdockApi');
				const apiUrl =
					(credentials.apiUrl as string) || 'https://api.renderdock.dev/v1/render';

				const body: Record<string, unknown> = { format };
				if (resource === 'markdown') {
					body.markdown = this.getNodeParameter('markdown', itemIndex);
				}
				if (resource === 'html') {
					body.html = this.getNodeParameter('html', itemIndex);
				}
				if (resource === 'url') {
					body.url = this.getNodeParameter('url', itemIndex);
				}
				if (resource === 'template') {
					body.template = this.getNodeParameter('template', itemIndex);
					const additionalFields = this.getNodeParameter('additionalFields', itemIndex) as {
						data?: object;
					};
					body.data = additionalFields.data ?? {};
				}
				if (filename) {
					body.filename = filename;
				}
				if (format === 'pdf') {
					body.paper = this.getNodeParameter('paper', itemIndex);
				}

				const response = await this.helpers.httpRequestWithAuthentication.call(
					this,
					'renderdockApi',
					{
						method: 'POST',
						url: apiUrl,
						body,
						json: true,
						encoding: 'arraybuffer',
					},
				);

				const buffer = Buffer.isBuffer(response) ? response : Buffer.from(response);
				const mime = format === 'pdf' ? 'application/pdf' : 'image/png';
				const name = `${(filename || 'renderdock').replace(/[^a-zA-Z0-9._-]/g, '_')}.${format}`;
				const binaryData = await this.helpers.prepareBinaryData.call(
					this,
					buffer,
					name,
					mime,
				);

				returnData.push({
					json: { format, filename: name, size: buffer.length },
					binary: { data: binaryData },
					pairedItem: { item: itemIndex },
				});
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: (error as Error).message },
						pairedItem: { item: itemIndex },
					});
					continue;
				}
				throw new NodeOperationError(this.getNode(), error as Error, { itemIndex });
			}
		}

		return [returnData];
	}
}
