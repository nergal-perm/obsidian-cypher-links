import { Plugin, MarkdownView, TAbstractFile } from 'obsidian';
import { CypherLinksView } from './view';
import { VIEW_TYPE_CYPHER_LINKS } from './constants';
import { CypherNode } from './cypher-node';
import { CypherSettings } from './settings';

export default class CypherLinksPlugin extends Plugin {
    private _nodes: CypherNode[] = [];
    _settings: any = {};

    get nodes(): CypherNode[] {
        return this._nodes;
    } 

    public settings(key: string): any {
        return this._settings[key];
    }

    async onload() {
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
            this.app.workspace.on('active-leaf-change', (leaf) => {
                if (leaf?.view instanceof MarkdownView) {
                    this.updateViewContent(leaf.view.file);
                }
            })
        );
        this.registerEvent(
            this.app.vault.on('modify', (file) => {
                // TODO: fails to parse frontmatter while editing it and reverts changes
                this.fillNodes();
                this.updateViewContent(file);
            })
        );
        this.registerEvent(
            this.app.vault.on('rename', (file) => {
                this.fillNodes();
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

    fillNodes() {
        this._nodes = [];
        this.app.vault.getMarkdownFiles().forEach((file) => {
            CypherNode.fromFile(file, this.app.fileManager).then((node) => {
                this._nodes.push(node);
            });
        });       
    }

    updateViewContent(file: TAbstractFile | null) {
        if (!file) {
            return;
        }
        this.app.workspace.getLeavesOfType(VIEW_TYPE_CYPHER_LINKS).forEach((leaf) => {
            const cypherLinksView = leaf.view as CypherLinksView;
            this._nodes.filter((node) => node.file === file).forEach((node) => {
                cypherLinksView?.updateFor(node, this._nodes);
            });
        });
    }

    async activateView() {
        const { workspace } = this.app

        let leaf = null
        const leaves = workspace.getLeavesOfType(VIEW_TYPE_CYPHER_LINKS)

        if (leaves.length > 0) {
            // A leaf with our view already exists, use that
            leaf = leaves[0]
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
