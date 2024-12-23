import {ItemView, WorkspaceLeaf} from 'obsidian';
import {VIEW_TYPE_CYPHER_LINKS} from './constants';
import CypherLinksPlugin from './main';
import {CypherNode} from './cypher-node';

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

    override getIcon() {
        return 'link';
    }

    override async onOpen() {
        // do nothing
    }

    updateFor(node: CypherNode, nodes: CypherNode[]) {
        const container = this.containerEl.children[1] as HTMLElement
        container.empty()
        container.createEl('h4', {text: 'Cypher links'})

        const ul = container.createEl('ul')
        node.getAllLinksUsing(nodes).forEach(cypherLink => {
            const li = ul.createEl('li')
            li.createEl('strong', {text: cypherLink._direction});
            let linkElement: HTMLElement;
            if (cypherLink.node != null) {
                if (cypherLink._direction == 'in') {
                    li.appendText(': ');
                    linkElement = li.createEl('a', {text: cypherLink.node.name});
                    li.appendText(' ' + this.plugin._settings[cypherLink._type] + ' ');
                } else {
                    li.appendText(': ' + this.plugin._settings[cypherLink._type] + ' ');
                    linkElement = li.createEl('a', {text: cypherLink.node.name});
                }
                const linkPath = cypherLink.node.file.path;
                if (linkPath != null) {
                    linkElement.addEventListener("click", (event) => {
                        event.preventDefault() // Prevent default link behavior
                        this.plugin.app.workspace.openLinkText(linkPath, "", false) // Open the note
                    })
                }
            }
        });
    }
}
