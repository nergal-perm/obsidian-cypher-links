export class CypherLinks {
    private constructor(private readonly _links: string[]) {
    }

    get links(): string[] {
        return this._links;
    }

    static fromFrontmatter(frontmatter: Record<string, unknown>): CypherLinks {
        return new CypherLinks(
            Array.isArray(frontmatter['links'])
                ? frontmatter['links'] as string[]
                : []
        );
    }
}