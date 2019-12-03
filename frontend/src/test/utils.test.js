import {hasLeadingZeroes, solveBlock} from "../js/utils";
import BlockNode from "../js/BlockNode";

describe('Test functions in utils', () => {
    const blockA = new BlockNode('guid-a', {
        id: 'check-id-a',
        items: 'items-a',
        cost: 10.99,
        tip: 1.99
    },  null);
    blockA.hash = '67';
    const blockB = new BlockNode('guid-b', {
        id: 'check-id-b',
        items: 'items-b',
        cost: 100,
        tip: 10.56
    },  blockA);
    blockB.hash = '78';

    it('verifies hasLeadingZeroes return values', () =>{
       expect(hasLeadingZeroes('0000', 4)).toBe(true);
       expect(hasLeadingZeroes('0001', 4)).toBe(false);
        expect(hasLeadingZeroes('0', 1)).toBe(true);
        expect(hasLeadingZeroes('00', 1)).toBe(true);
    });

    it('verifies solveBlock calls /solve with correct arguments', () => {
        window.fetch = jest.fn().mockImplementation(() => Promise.resolve(new Response( '42', {'status': 200, "statusText" : "SuperSmashingGreat!"})));
        solveBlock(blockA.hash, blockB.getDataAsString(), 4, 1000);
        const postData = {
            max_tries: 1000,
            block: {
                version: 0,
                parent_hash: '67',
                data: 'check-id-bitems-b10010.56',
                sec_since_epoc: 0,
                target_zeros: 4,
            }
        };
        expect(window.fetch.mock.calls.length).toBe(1);
        expect(window.fetch.mock.calls[0][0]).toBe('/solve');
        expect(window.fetch.mock.calls[0][1]).toStrictEqual({
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(postData),
        });
    });
});