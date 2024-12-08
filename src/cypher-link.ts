export class CypherLink {
    private constructor(private _cypher: string) {}

    get asString(): string {
        return this._cypher;
    }

    static fromCypherString(cypher: string): CypherLink {
        return new CypherLink(cypher);
    }
}