export class CypherString {
    constructor(
        private _linkName: string,
        private _properties: Record<string, any>
    ) { }

    static fromCypherString(cypher: string): CypherString {
        return new CypherString(
            this.extractLinkName(cypher),
            this.extractLinkProperties(cypher)
        );
    }

    get linkName(): string {
        return this._linkName;
    }

    get linkProperties(): Record<string, any> {
        return this._properties;
    }

    static extractLinkName(cypher: string): string {
        const linkNameMatch = cypher.match(/\[\s*:\s*([A-Za-z_][A-Za-z0-9_]*)\s*\]/);
        if (linkNameMatch && linkNameMatch[1]) {
            return linkNameMatch[1];
        } else {
            return '';
        }
    }

    static extractLinkProperties(cypher: string): Record<string, any> {
        const propsMatch = cypher.match(/.*\[[^\]]*(\{.*\})]?/);
        if (propsMatch && propsMatch[1]) {
            const jsonString = propsMatch[1]
                .replace(/([{,])\s*([^":\s]+)\s*:/g, '$1"$2":') // Quote keys
                .replace(/'/g, '"'); // Replace single quotes with double quotes
            return JSON.parse(jsonString) as Record<string, any>;
        } else {
            return {};
        }
    }
}