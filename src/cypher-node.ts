import { CypherLink } from "./cypher-link";
import { FileManager, TFile } from "obsidian";

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

    public property(key: string): any {
        return this._properties[key];
    }

    addLinksAsHtmlListItems(ul: HTMLUListElement, nodes: CypherNode[]) {
        const cypherStrings = this.property('links');
        if (!cypherStrings || !Array.isArray(cypherStrings)) {
            return;
        }
        for (const cypherString of cypherStrings) {
            console.log(CypherLink.fromCypherStringWithNodes(cypherString, nodes));
            const li = ul.createEl('li')
            const linkElement = li.createEl('a', { text: cypherString })
        }
    }

    static fromFrontmatter(frontmatter: Record<string, any>): CypherNode {
        return new CypherNode(frontmatter, new TFile());
    }

    static fromFile(file: TFile, fileManager: FileManager): Promise<CypherNode> {
        return new Promise<CypherNode>((resolve) => {
            fileManager.processFrontMatter(file, (frontmatter) => {
                resolve(new CypherNode(frontmatter, file));
            });
        });
    }
}