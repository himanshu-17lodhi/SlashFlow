import { App, PluginSettingTab, Setting, Modal } from 'obsidian';
import SlashFlowPlugin from '@/main';
import { SlashCommand } from '@/types';

export class SlashFlowSettingTab extends PluginSettingTab {
	plugin: SlashFlowPlugin;

	constructor(app: App, plugin: SlashFlowPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		containerEl.createEl('h2', { text: 'SlashFlow Settings' });

		new Setting(containerEl)
			.setName('Add Command')
			.setDesc('Create a new slash command')
			.addButton((button) => {
				button.setButtonText('Add Command').onClick(() => {
					new CommandModal(this.app, (result) => {
						this.plugin.settings.commands.push(result);
						this.plugin.saveSettings();
						this.display();
					}).open();
				});
			});

		containerEl.createEl('h3', { text: 'Current Commands' });

		this.plugin.settings.commands.forEach((command, index) => {
			const s = new Setting(containerEl)
				.setName(command.title)
				.setDesc(`Trigger: /${command.trigger}`);

			s.addButton((button) => {
				button.setIcon('pencil').setTooltip('Edit').onClick(() => {
					new CommandModal(this.app, (result) => {
						this.plugin.settings.commands[index] = result;
						this.plugin.saveSettings();
						this.display();
					}, command).open();
				});
			});

			s.addButton((button) => {
				button.setIcon('trash').setTooltip('Delete').onClick(async () => {
					this.plugin.settings.commands.splice(index, 1);
					await this.plugin.saveSettings();
					this.display();
				});
			});
		});
	}
}

class CommandModal extends Modal {
	result: SlashCommand;
	onSubmit: (result: SlashCommand) => void;
	editMode: boolean;

	constructor(app: App, onSubmit: (result: SlashCommand) => void, command?: SlashCommand) {
		super(app);
		this.onSubmit = onSubmit;
		this.editMode = !!command;
		this.result = command || {
			id: Math.random().toString(36).substring(2, 8),
			trigger: '',
			title: '',
			template: '',
			category: '',
		};
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.createEl('h2', { text: this.editMode ? 'Edit Command' : 'New Command' });

		new Setting(contentEl).setName('Title').addText((text) => {
			text.setValue(this.result.title).onChange((value) => {
				this.result.title = value;
			});
		});

		new Setting(contentEl).setName('Trigger').addText((text) => {
			text.setPlaceholder('e.g. todo')
				.setValue(this.result.trigger)
				.onChange((value) => {
					this.result.trigger = value;
				});
		});

		new Setting(contentEl).setName('Category').addText((text) => {
			text.setValue(this.result.category || '').onChange((value) => {
				this.result.category = value;
			});
		});

		new Setting(contentEl).setName('Template').setDesc('Supports {{date}}, {{time}}, {{title}}, {{cursor}}').addTextArea((text) => {
			text.setValue(this.result.template).onChange((value) => {
				this.result.template = value;
			});
			text.inputEl.rows = 5;
			text.inputEl.cols = 40;
		});

		new Setting(contentEl).addButton((button) => {
			button
				.setButtonText('Save')
				.setCta()
				.onClick(() => {
					this.close();
					this.onSubmit(this.result);
				});
		});
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}
