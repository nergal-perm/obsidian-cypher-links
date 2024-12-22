import { CypherLink } from "./cypher-link";
import { FileManager, TFile } from "obsidian";
import CypherLinksPlugin from "main";

export class CypherNode {
    private _name: string;
    private _labels: string[];
    private _file: TFile;

    constructor(private _properties: Record<string, any>, file: TFile) {
        this._name = _properties.name;
        this._labels = _properties.labels;
        this._file = file;
    }

    public get name(): string {
        return this._name;
    }

    public get labels(): string[] {
        return this._labels;
    }

    public get file(): TFile {
        return this._file;
    }

    public get links(): CypherLink[] {
        const cypherStrings = this.property('links');
        if (!cypherStrings || !Array.isArray(cypherStrings)) {
            return [];
        }
        return cypherStrings.map( (cypherString: string) => 
            CypherLink.fromCypherString(cypherString)
    );
    }

    public property(key: string): any {
        return this._properties[key];
    }

    // @todo #10 Move the html link list creation to the CypherLinksView class
    addLinksAsHtmlListItems(ul: HTMLUListElement, nodes: CypherNode[], plugin: CypherLinksPlugin) {
        const cypherStrings = this.property('links');
        if (!cypherStrings || !Array.isArray(cypherStrings)) {
            return;
        }
        for (const cypherString of cypherStrings) {
            const li = ul.createEl('li')
            const link = CypherLink.fromCypherStringWithNodes(cypherString, nodes);
            li.createEl('strong', { text: link._direction });
            let linkElement: HTMLElement;
            if (link._direction == 'in') {
                li.appendText(': ');
                linkElement = li.createEl('a', { text: link.node?.name });
                li.appendText(' ' + plugin._settings[link._type] + ' ');
            } else {
                li.appendText(': ' + plugin._settings[link._type] + ' ');
                linkElement = li.createEl('a', { text: link.node?.name });

            }
            const linkPath = link.node?.file.path;
            if (linkPath != null) {
                linkElement.addEventListener("click", (event) => {
                    event.preventDefault() // Prevent default link behavior
                    plugin.app.workspace.openLinkText(linkPath, "", false) // Open the note
                })
            }
        }
    }

    static fromFrontmatter(frontmatter: Record<string, any>): CypherNode {
        return new CypherNode(frontmatter, new TFile());
    }

    static fromFile(file: TFile, fileManager: FileManager): Promise<CypherNode> {
        return new Promise<CypherNode>((resolve, reject) => {
            fileManager.processFrontMatter(file, (frontmatter) => {
                const node = new CypherNode(frontmatter, file); // Assign node here
                resolve(node); // Resolve with the node
            }).catch((error) => {
                reject(error);
            });
        });
    }
}