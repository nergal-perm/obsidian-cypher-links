import {CypherLinks} from '../cypher-links-collection';

describe('CypherLinks', () => {
    let target: CypherLinks;

    describe('fromFrontmatter', () => {
        it('should be created empty from frontmatter without links', () => {
            target = CypherLinks.fromFrontmatter({});
            expect(target.linksAsText).toStrictEqual([]);
        });
        it('should be created with links from frontmatter', () => {
            target = CypherLinks.fromFrontmatter({links: ['link1', 'link2']});
            expect(target.linksAsText).toStrictEqual(['link1', 'link2']);
        });
    });

});