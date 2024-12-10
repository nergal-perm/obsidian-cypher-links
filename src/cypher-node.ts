export class CypherNode {
    private _name: string;
    private _labels: string[];

    constructor(private _properties: Record<string, any>) {
        this._name = _properties.name;
        this._labels = _properties.labels;
    }

    public get name() : string {
        return this._name;
    }
    
    public get labels() : string[] {
        return this._labels;
    }

    public property(key: string): any {
        return this._properties[key];
    }

    static fromFrontmatter(frontmatter: Record<string, any>): CypherNode {
        return new CypherNode(frontmatter);
    }
}