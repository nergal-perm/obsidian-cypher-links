import { ItemView, WorkspaceLeaf } from 'obsidian';
import { VIEW_TYPE_CYPHER_LINKS } from './constants';
import CypherLinksPlugin from './main';
import { CypherNode } from './cypher-node';

export class CypherLinksView extends ItemView {
    plugin: CypherLinksPlugin;

    constructor(leaf: WorkspaceLeaf, plugin: CypherLinksPlugin) {
        super(leaf);
        this.plugin = plugin;
    }

    getViewType() {
        return VIEW_TYPE_CYPHER_LINKS;
    }

    getDisplayText() {
        return 'Cypher Links View';
    }

    getIcon() {
        return 'link';
    }

    async onOpen() {
        // do nothing
    }

    updateFor(node: CypherNode, nodes: CypherNode[]) {
        const container = this.containerEl.children[1]
        container.empty()
        container.createEl('h4', { text: 'Cypher links' })

        const ul = container.createEl('ul')
        node.addLinksAsHtmlListItems(ul, nodes);
    }

    async onClose() {
        // Nothing to clean up
    }
}
