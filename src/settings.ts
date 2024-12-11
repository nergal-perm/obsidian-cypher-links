import { Plugin, App, PluginSettingTab, Setting } from 'obsidian';
import CypherLinksPlugin from './main';

export class CypherSettings extends PluginSettingTab {
    _plugin: Plugin | null = null;

    constructor(app: App, plugin: Plugin) {
        super(app, plugin);
        this._plugin = plugin;
    }

    public display() {
        let { containerEl } = this;
        containerEl.empty();
        const plugin = this._plugin as CypherLinksPlugin;
        const distinctLinkTypes = [...new Set(plugin.nodes.map(node => node.links.map(link => link._type)).flat())];
        distinctLinkTypes.forEach(linkType => {
            new Setting(containerEl)
                .setName(linkType)
                .addText(text => text
                    .setValue(plugin._settings[linkType])
                    .onChange(async (value) => {
                        plugin._settings[linkType] = value; 
                        await plugin.saveSettings();
                    })
                );
        });
    }
}