export interface SlashCommand {
	id: string;
	trigger: string;
	title: string;
	template: string;
	description?: string;
	category?: string;
	icon?: string;
}

export interface SlashFlowSettings {
	commands: SlashCommand[];
}

export const DEFAULT_SETTINGS: SlashFlowSettings = {
	commands: [
		{
			id: 'call.n',
			trigger: 'call.n',
			title: 'Note Callout',
			template: '> [!note]\n> {{cursor}}',
			category: 'Callouts',
			icon: 'info',
		},
		{
			id: 'call.w',
			trigger: 'call.w',
			title: 'Warning Callout',
			template: '> [!warning]\n> {{cursor}}',
			category: 'Callouts',
			icon: 'alert-triangle',
		},
		{
			id: 'call.t',
			trigger: 'call.t',
			title: 'Tip Callout',
			template: '> [!tip]\n> {{cursor}}',
			category: 'Callouts',
			icon: 'flame',
		},
		{
			id: 'code.ts',
			trigger: 'code.ts',
			title: 'TypeScript Code Block',
			template: '```ts\n{{cursor}}\n```',
			category: 'Code',
			icon: 'code',
		},
		{
			id: 'code.js',
			trigger: 'code.js',
			title: 'JavaScript Code Block',
			template: '```js\n{{cursor}}\n```',
			category: 'Code',
			icon: 'code',
		},
		{
			id: 'table',
			trigger: 'table',
			title: 'Table',
			template: '| Header 1 | Header 2 |\n| -------- | -------- |\n| Cell 1   | Cell 2   |\n{{cursor}}',
			category: 'Layout',
			icon: 'table',
		},
		{
			id: 'todo',
			trigger: 'todo',
			title: 'Todo List',
			template: '- [ ] {{cursor}}',
			category: 'Tasks',
			icon: 'check-square',
		},
		{
			id: 'meeting',
			trigger: 'meeting',
			title: 'Meeting Notes',
			template: '# {{title}}\n\nCreated: {{date}}\n\n{{cursor}}',
			category: 'Templates',
			icon: 'calendar',
		},
		{
			id: 'date',
			trigger: 'date',
			title: 'Current Date',
			template: '{{date}}{{cursor}}',
			category: 'Utilities',
			icon: 'clock',
		},
	],
};
