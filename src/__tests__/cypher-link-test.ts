import { CypherLink } from '../cypher-link';

describe('CypherLink', () => {
    let target: CypherLink;

    describe('fromCypherString',() => {
        it('should be created from a cypher string', () => {
            target = CypherLink.fromCypherString('-[:link]->(:tag)');
            expect(target.asString).toBe('-[:link]->(:tag)');
        });
    });
});