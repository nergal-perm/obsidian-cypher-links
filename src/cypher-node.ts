import {CypherLink} from "./cypher-link";
import {FileManager, TFile} from "obsidian";

export class CypherNode {
    private _name: string;
    private _labels: string[];
    private _file: TFile;

    constructor(private _properties: Record<string, any>, file: TFile) {
        this._name = _properties.name ?? '';
        this._labels = _properties.labels ?? [];
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

    getAllLinksUsing(nodes: CypherNode[]): CypherLink[] {
        const cypherStrings = this.property('links');
        if (!cypherStrings || !Array.isArray(cypherStrings)) {
            return [];
        }
        return cypherStrings.map ( (cypherString: string) => {
            return CypherLink.fromCypherStringWithNodes(cypherString, nodes);
        });
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

export class NotExistingNode extends CypherNode {
    constructor() {
        super({
            name: 'Not existing node',
            labels: []
        }, new TFile());
    }
}