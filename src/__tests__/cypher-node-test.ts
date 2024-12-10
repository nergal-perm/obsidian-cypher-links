import { CypherNode } from '../cypher-node';

describe('CypherNode', () => {
    let target: CypherNode;

    describe('fromCypherString', () => {
        it('should be created from a frontmatter', () => {
            const frontmatter: Record<string, any> = {
                id: 202412091309,
                name: '2024',
                labels: ['Year'],
                status: 'ongoing',
            };
            target = CypherNode.fromFrontmatter(frontmatter);
            expect(target.name).toBe('2024');
            expect(target.labels).toEqual(['Year']);
            expect(target.property('status')).toEqual('ongoing');
        });
    });
});