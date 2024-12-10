import { Plugin, MarkdownView, TFile } from 'obsidian';
import { CypherLinksView } from './view';
import { VIEW_TYPE_CYPHER_LINKS } from './constants';
import { CypherLinks } from './cypher-links-collection';
import { CypherNode } from './cypher-node';

export default class CypherLinksPlugin extends Plugin {
    private _nodes: CypherNode[] = [];

    async onload() {
        this.fillNodes().then(() => {
            console.log(this._nodes);
        });

        this.registerView(
            VIEW_TYPE_CYPHER_LINKS,
            (leaf) => new CypherLinksView(leaf, this)
        )
        this.activateView();

        // Listen for active leaf change
        this.app.workspace.on('active-leaf-change', (leaf) => {
            if (leaf?.view instanceof MarkdownView) {
                this.updateViewContent();
            }
        });
    }

    async fillNodes() {
        this.app.vault.getMarkdownFiles().forEach((file) => {
            CypherNode.fromFile(file, this.app.fileManager).then((node) => {
                this._nodes.push(node);
            });
        });       
    }

    updateViewContent() {
        const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
        if (!activeView || !activeView.file) return;

        const file = activeView.file;
        this.app.workspace.getLeavesOfType(VIEW_TYPE_CYPHER_LINKS).forEach((leaf) => {
            this.app.fileManager.processFrontMatter(file, (frontmatter) => {
                try {
                    const result = CypherLinks.fromFrontmatter(frontmatter).linksAsText;
                    (leaf.view as CypherLinksView).updateWith(result);
                } catch (error) {
                    console.error('Error in processFrontMatter callback:', error);
                }
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
