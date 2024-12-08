import { Plugin, MarkdownView } from 'obsidian';
import { CypherLinksView } from './view';
import { VIEW_TYPE_CYPHER_LINKS } from './constants';
import { CypherLinks } from './cypher-links';

export default class CypherLinksPlugin extends Plugin {
    async onload() {
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

    updateViewContent() {
        const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
        if (!activeView || !activeView.file) return;

        const file = activeView.file;
        this.app.workspace.getLeavesOfType(VIEW_TYPE_CYPHER_LINKS).forEach((leaf) => {
            this.app.fileManager.processFrontMatter(file, (frontmatter) => {
                try {
                    const result = CypherLinks.fromFrontmatter(frontmatter).links;
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
