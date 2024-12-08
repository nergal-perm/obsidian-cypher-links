import { CypherLink } from '../cypher-link';

describe('CypherLink', () => {
    let target: CypherLink;

    describe('fromCypherString', () => {
        it.each([
            // [input,                  expectedType]
            ['-[:LINK]->(:tag)',       'LINK'],
            ['-[ :LINK ]->(:tag)',     'LINK'],
            ['-[:LINK_TYPE]->(:tag)',  'LINK_TYPE'],
            ['<-[:LINK]-(:tag)',       'LINK'],
            ['-[:LINK]->',             'LINK'],
            ['[:LINK]',                'LINK'],
            ['[ : LINK ]',             'LINK'],
        ])('should extract type from "%s"', (input, expectedType) => {
            target = CypherLink.fromCypherString(input);
            expect(target.type).toBe(expectedType);
        });

        // Keep existing test for asString if needed
        it('should be created from a cypher string', () => {
            target = CypherLink.fromCypherString('-[:link]->(:tag)');
            expect(target.asString).toBe('-[:link]->(:tag)');
        });
    });
});