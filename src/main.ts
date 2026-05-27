import { Plugin } from 'obsidian';
import { SlashFlowSettings, DEFAULT_SETTINGS } from './types';
import { SlashFlowSettingTab } from './settings/SlashFlowSettingTab';
import { SlashSuggest } from './suggest/SlashSuggest';

export default class SlashFlowPlugin extends Plugin {
	settings: SlashFlowSettings;
	suggest: SlashSuggest;

	async onload() {
		await this.loadSettings();

		// Add settings tab
		this.addSettingTab(new SlashFlowSettingTab(this.app, this));

		// Register the slash command suggest
		this.suggest = new SlashSuggest(this.app, this.settings.commands);
		this.registerEditorSuggest(this.suggest);
	}

	onunload() {
		console.log('Unloading SlashFlow plugin');
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
		if (this.suggest) {
			this.suggest.updateCommands(this.settings.commands);
		}
	}
}
