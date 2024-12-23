import {CypherString} from "./cypher-string";
import {CypherNode, NotExistingNode} from "./cypher-node";

export class CypherLink {
    _type: string;
    _direction: any;

    private constructor(private _cypher: string, private _node: CypherNode | null = null) {
        this._type = CypherLink.extractType(_cypher);
        this._direction = CypherLink.extractDirection(_cypher);
    }

    get asString(): string {
        return this._cypher;
    }

    get node(): CypherNode | null {
        return this._node;
    }

    static fromCypherString(cypher: string): CypherLink {
        return new CypherLink(cypher);
    }

    static fromCypherStringWithNodes(cypher: string, nodes: CypherNode[]): CypherLink {
        const cypherString = CypherString.fromCypherString(cypher);

        let filteredNodes = nodes.filter((node: CypherNode) =>
            hasAllLabels(node) && hasAllProperties(node)
        );
        let node = filteredNodes.length === 0 ? new NotExistingNode() : filteredNodes[0];
        return new CypherLink(cypher, node);

        function hasAllLabels(node: CypherNode): boolean {
            return cypherString.nodeLabels.length > 0 && cypherString.nodeLabels.every(
                (label) => node.labels.includes(label)
            );
        }

        function hasAllProperties(node: CypherNode): boolean {
            return Object.entries(cypherString.nodeProperties).every(
                ([key, value]) => node.property(key) === value
            );
        }
    }

    static extractType(cypher: string): string {
        const typeMatch = cypher.match(/\[\s*:\s*([A-Za-z_][A-Za-z0-9_]*)\s*\]/);
        if (typeMatch) {
            return typeMatch[1] as string;
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