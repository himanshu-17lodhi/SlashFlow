import { moment, TFile } from 'obsidian';

export class TemplateEngine {
	static render(template: string, file: TFile | null): { content: string; cursorOffset: number } {
		let content = template;

		// Replace date and time
		const now = moment();
		content = content.replace(/{{date}}/g, now.format('YYYY-MM-DD'));
		content = content.replace(/{{time}}/g, now.format('HH:mm'));

		// Replace title
		const title = file ? file.basename : '';
		content = content.replace(/{{title}}/g, title);

		// Handle cursor
		const cursorMarker = '{{cursor}}';
		const cursorIndex = content.indexOf(cursorMarker);
		let cursorOffset = -1;

		if (cursorIndex !== -1) {
			content = content.replace(cursorMarker, '');
			cursorOffset = cursorIndex;
		} else {
			cursorOffset = content.length;
		}

		return { content, cursorOffset };
	}
}
