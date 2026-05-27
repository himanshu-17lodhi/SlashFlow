import {
	App,
	Editor,
	EditorPosition,
	EditorSuggest,
	EditorSuggestContext,
	EditorSuggestTriggerInfo,
	TFile,
	setIcon,
} from 'obsidian';
import Fuse from 'fuse.js';
import { SlashCommand } from '@/types';
import { TemplateEngine } from '@/template/TemplateEngine';

export class SlashSuggest extends EditorSuggest<SlashCommand> {
	private commands: SlashCommand[];
	private fuse: Fuse<SlashCommand>;

	constructor(app: App, commands: SlashCommand[]) {
		super(app);
		this.commands = commands;
		this.updateFuse();
	}

	updateCommands(commands: SlashCommand[]) {
		this.commands = commands;
		this.updateFuse();
	}

	private updateFuse() {
		this.fuse = new Fuse(this.commands, {
			keys: ['trigger', 'title', 'category'],
			threshold: 0.4,
		});
	}

	onTrigger(cursor: EditorPosition, editor: Editor, _file: TFile): EditorSuggestTriggerInfo | null {
		const line = editor.getLine(cursor.line);
		const sub = line.substring(0, cursor.ch);

		// Trigger on / at the start of a line or after a space
		const match = sub.match(/(^|\s)\/(\S*)$/);
		if (match) {
			const trigger = match[2];
			const startCh = cursor.ch - trigger.length - 1;
			return {
				start: { line: cursor.line, ch: startCh },
				end: cursor,
				query: trigger,
			};
		}

		return null;
	}

	getSuggestions(context: EditorSuggestContext): SlashCommand[] {
		if (context.query === '') {
			return this.commands;
		}

		return this.fuse.search(context.query).map((result) => result.item);
	}

	renderSuggestion(command: SlashCommand, el: HTMLElement): void {
		const container = el.createDiv({ cls: 'slashflow-suggestion-item' });
		
		const iconContainer = container.createDiv({ cls: 'slashflow-suggestion-icon' });
		setIcon(iconContainer, command.icon || 'zap');

		const content = container.createDiv({ cls: 'slashflow-suggestion-content' });
		content.createDiv({ cls: 'slashflow-suggestion-title', text: command.title });
		if (command.category) {
			content.createDiv({ cls: 'slashflow-suggestion-category', text: command.category });
		}
	}

	selectSuggestion(command: SlashCommand, _evt: MouseEvent | KeyboardEvent): void {
		if (!this.context) return;

		const { editor, file, start, end } = this.context;
		
		// Render template
		const { content, cursorOffset } = TemplateEngine.render(command.template, file);

		// Replace the /trigger with the content
		editor.replaceRange(content, start, end);

		// Move cursor if needed
		if (cursorOffset !== -1) {
			const newOffset = editor.posToOffset(start) + cursorOffset;
			const newPos = editor.offsetToPos(newOffset);
			editor.setCursor(newPos);
		}
	}
}
