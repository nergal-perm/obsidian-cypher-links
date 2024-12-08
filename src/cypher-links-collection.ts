import { CypherLink } from "./cypher-link";

export class CypherLinks {
    private constructor(private readonly _links: CypherLink[]) {
    }

    get linksAsText(): string[] {
        return this._links.map(link => link.asString);
    }

    static fromFrontmatter(frontmatter: Record<string, unknown>): CypherLinks {
        return new CypherLinks(
            Array.isArray(frontmatter['links'])
                ? (frontmatter['links'] as string[]).map(CypherLink.fromCypherString)
                : []
        );
    }
}