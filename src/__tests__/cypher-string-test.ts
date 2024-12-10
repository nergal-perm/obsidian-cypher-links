import { CypherString } from '../cypher-string';

describe('CypherString', () => {
    let target: CypherString;

    describe('fromCypherString', () => {
        it.each([
            // [input,                  expectedLinkName]
            ['-[:LINK]->(:tag)', 'LINK'],
            ['-[ :LINK ]->(:tag)', 'LINK'],
            ['-[:LINK_TYPE]->(:tag)', 'LINK_TYPE'],
            ['<-[:LINK]-(:tag)', 'LINK'],
            ['-[:LINK]->', 'LINK'],
            ['[:LINK]', 'LINK'],
            ['[ : LINK ]', 'LINK'],
        ])('should extract link name from a cypher string', (input, expectedLinkName) => {
            target = CypherString.fromCypherString(input);
            expect(target.linkName).toBe(expectedLinkName);
        });

        it.each([
            // [input, expectedProperties]
            ['-[:LINK {prop: 1}]->(:tag)', { prop: 1 }],
            ['-[ :LINK{ prop: 1, hello: "world" }]->(:tag)', { prop: 1, hello: "world" }],
        ])('should extract link properties', (input, expectedProperties) => {
            target = CypherString.fromCypherString(input);
            expect(target.linkProperties).toEqual(expectedProperties);
        });
    });
});