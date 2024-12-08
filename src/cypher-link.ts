export class CypherLink {
    _type: string;
    _direction: any;

    private constructor(private _cypher: string) {
        this._type = CypherLink.extractType(_cypher);
        this._direction = CypherLink.extractDirection(_cypher);
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

    static extractDirection(cypher: string): string {
        if (cypher.includes('<')) {
            return 'in';
        } else if (cypher.includes('>')) {
            return 'out';
        } else {
            return 'none';
        }
    }
}