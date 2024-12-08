export class CypherLink {
    type: string;

    private constructor(private _cypher: string) {
        this.type = CypherLink.extractType(_cypher);
    }

    get asString(): string {
        return this._cypher;
    } 

    static fromCypherString(cypher: string): CypherLink {
        return new CypherLink(cypher);
    }

    static extractType(cypher: string): string {
        const typeMatch = cypher.match(/\[\s*:\s*([A-Za-z_][A-Za-z0-9_]*)\s*\]/);
        if (typeMatch) {
            return typeMatch[1];
        } else {
            throw new Error("Invalid cypher format");
        }
    }
}