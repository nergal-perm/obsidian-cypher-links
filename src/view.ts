import { ItemView, WorkspaceLeaf } from 'obsidian';
import { VIEW_TYPE_CYPHER_LINKS } from './constants';
import CypherLinksPlugin from './main';
import { CypherLinks } from './cypher-links-collection';

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
        this.registerEvent(
            this.app.vault.on('modify', (file) => {
                this.update();
            })
        );
        this.registerEvent(
            this.app.vault.on('rename', (file) => {
                this.update();
            })
        );
        this.update();
    }

    async update() {
        this.fetchLinks(this.plugin).then((links) => {
            this.updateWith(links);
        });
    }

    async updateWith(links: string[]) {
        const container = this.containerEl.children[1]
        container.empty()
        container.createEl('h4', { text: 'Cypher links' })

        const ul = container.createEl('ul')
        for (const link of links) {
            const li = ul.createEl('li')
            const linkElement = li.createEl('a', { text: link })
        }
    }

    async fetchLinks(plugin: CypherLinksPlugin): Promise<string[]> {
        let allLinks: string[] = [];
        const files = plugin.app.vault.getMarkdownFiles();
        const promises = files.map((file) => {
            return new Promise<void>((resolve) => {
                this.app.fileManager.processFrontMatter(file, (frontmatter) => {
                    const links = CypherLinks.fromFrontmatter(frontmatter).linksAsText;
                    allLinks = allLinks.concat(links);
                    resolve();
                });
            });
        });

        await Promise.all(promises);
        return allLinks;
    }

    async onClose() {
        // Nothing to clean up
    }
}
