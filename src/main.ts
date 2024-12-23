import {App, MarkdownView, Plugin, PluginManifest, TAbstractFile, WorkspaceLeaf} from 'obsidian';
import {CypherLinksView} from './view';
import {VIEW_TYPE_CYPHER_LINKS} from './constants';
import {CypherNode} from './cypher-node';
import {CypherSettings} from './settings';
import {PluginCore} from "./plugin/plugin-core";

export default class CypherLinksPlugin extends Plugin {
    private _nodes: CypherNode[] = [];
    private _pluginCore: PluginCore;
    _settings: any = {};

    constructor(app: App, manifest: PluginManifest) {
        super(app, manifest);
        this._pluginCore = PluginCore.create(app.workspace);
    }

    get nodes(): CypherNode[] {
        return this._nodes;
    }

    public settings(key: string): any {
        return this._settings[key];
    }

    override async onload() {
        this.fillNodes();

        await this.loadSettings();
        this.addSettingTab(new CypherSettings(this.app, this));

        this.registerView(
            VIEW_TYPE_CYPHER_LINKS,
            (leaf) => new CypherLinksView(leaf, this)
        )
        this.activateView();

        // Listen for active leaf change
        this.registerEvent(
            this._pluginCore.onLeafChange((leaf) => {
                if (leaf?.view instanceof MarkdownView) {
                    this.updateViewContent(leaf.view.file);
                }
            })
        );
        this.registerEvent(
            this.app.vault.on('modify', async (file) => {
                await this.fillNodes();
                this.updateViewContent(file);
            })
        );
        this.registerEvent(
            this.app.vault.on('rename', async (file) => {
                await this.fillNodes();
                this.updateViewContent(file);
            })
        );
    }

    async loadSettings() {
        this._settings = Object.assign({}, await this.loadData())
    }

    async saveSettings() {
        await this.saveData(this._settings)
    }

    async fillNodes() {
        this._nodes = [];
        const promises = this.app.vault.getMarkdownFiles().map((file) => {
            this.app.vault.cachedRead(file).then((content) => {
                if (content.startsWith('---')) {

                    return CypherNode.fromFile(file, this.app.fileManager)
                        .then((node) => {
                            if (node) {
                                this._nodes.push(node);
                            }
                        })
                        .catch((error) => { /* do nothing, swallow the error */ });
                } else {
                    return Promise.resolve();
                }
            });
        });

        // Wait for all promises to resolve
        await Promise.all(promises);
    }

    updateViewContent(file: TAbstractFile | null) {
        if (!file) {
            return;
        }
        this.app.workspace.getLeavesOfType(VIEW_TYPE_CYPHER_LINKS).forEach((leaf) => {
            const cypherLinksView = leaf.view as CypherLinksView;
            this._nodes.forEach((node) => {
                if (node.file.path === file.path) {
                    cypherLinksView?.updateFor(node, this._nodes);
                }
            });
        });
    }

    async activateView() {
        const { workspace } = this.app

        let leaf: WorkspaceLeaf | null;
        const leaves = workspace.getLeavesOfType(VIEW_TYPE_CYPHER_LINKS)

        if (leaves.length > 0) {
            // A leaf with our view already exists, use that
            leaf = leaves[0] as WorkspaceLeaf
        } else {
            // Our view could not be found in the workspace, create a new leaf
            // in the right sidebar for it
            leaf = workspace.getRightLeaf(false)
            if (leaf) {
                await leaf.setViewState({ type: VIEW_TYPE_CYPHER_LINKS, active: true })
            }
        }

        if (leaf) {
            // "Reveal" the leaf in case it is in a collapsed sidebar
            workspace.revealLeaf(leaf)
        }
    }
}
