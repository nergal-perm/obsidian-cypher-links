export class CypherString {
    constructor(
        private _linkName: string,
        private _linkProperties: Record<string, any>,
        private _nodeLabels: string[] = [],
        private _nodeProperties: Record<string, any> = {}
    ) { }

    static fromCypherString(cypher: string): CypherString {
        return new CypherString(
            this.extractLinkName(cypher),
            this.extractLinkProperties(cypher),
            this.extractNodeLabels(cypher),
            this.extractNodeProperties(cypher)
        );
    }

    get linkName(): string {
        return this._linkName;
    }

    get linkProperties(): Record<string, any> {
        return this._linkProperties;
    }

    get nodeLabels(): string[] {
        return this._nodeLabels;
    }

    get nodeProperties(): Record<string, any> {
        return this._nodeProperties;
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
        const propsMatch = cypher.match(/.*\[[^\]]*(\{[^\]]*\})]?/);
        if (propsMatch && propsMatch[1]) {
            const jsonString = propsMatch[1]
                .replace(/([{,])\s*([^":\s]+)\s*:/g, '$1"$2":') // Quote keys
                .replace(/'/g, '"'); // Replace single quotes with double quotes
            try {
                return JSON.parse(jsonString) as Record<string, any>;
            } catch (error) {
                throw new Error("Error parsing JSON: " + jsonString);
            }
        } else {
            return {};
        }
    }

    static extractNodeLabels(cypher: string): string[] {
        const labelsMatch = cypher.match(/\(\s*((?::[A-Za-z_][A-Za-z0-9_]*)*)\s*/); 
        if (labelsMatch && labelsMatch[1]) {
            return labelsMatch[1].split(':').slice(1);
        } else {
            return [];
        }
    }

    static extractNodeProperties(cypher: string): Record<string, any> {
        const propsMatch = cypher.match(/.*\([^\)]*(\{[^\)]*\})]?/);
        if (propsMatch && propsMatch[1]) {
            const jsonString = propsMatch[1]
                .replace(/([{,])\s*([^":\s]+)\s*:/g, '$1"$2":') // Quote keys
                .replace(/'/g, '"'); // Replace single quotes with double quotes
            try {
                return JSON.parse(jsonString) as Record<string, any>;
            } catch (error) {
                throw new Error("Error parsing JSON: " + jsonString);
            }
        } else {
            return {};
        }
    }
}