import BlockNode from "../js/BlockNode";

describe('Test BlockNode class', () => {
    const blockA = new BlockNode('guid-a', {
        id: 'check-id-a',
        items: 'items-a',
        cost: 10.99,
        tip: 1.99
    },  null);

    beforeEach(() => {
        window.fetch = jest.fn().mockImplementation(() => Promise.resolve(new Response( '42', {'status': 200, "statusText" : "SuperSmashingGreat!"})));
    });

    it('creates a new BlockNode with correct data and null parent', () => {
        expect(blockA.guid).toEqual('guid-a');
        expect(blockA.checkId).toEqual('check-id-a');
        expect(blockA.checkItems).toEqual('items-a');
        expect(blockA.checkCost).toEqual(10.99);
        expect(blockA.checkTip).toEqual(1.99);
        expect(blockA.nonce).toEqual(0);
        expect(blockA.parent).toEqual('0000000000000000000000000000000000000000000000000000000000000000');
        expect(blockA.mined).toEqual(false);
    });

    it('creates a new BlockNode with correct data and non-null parent', async () => {
        const response = await blockA.getHash();
        blockA.hash = response.toString();
        const blockB = new BlockNode('guid-b', {
            id: 'check-id-b',
            items: 'items-b',
            cost: 100,
            tip: 10.56
        },  blockA);

        expect(blockB.guid).toEqual('guid-b');
        expect(blockB.checkId).toEqual('check-id-b');
        expect(blockB.checkItems).toEqual('items-b');
        expect(blockB.checkCost).toEqual(100);
        expect(blockB.checkTip).toEqual(10.56);
        expect(blockB.nonce).toEqual(0);
        expect(blockB.parent).toEqual('42');
        expect(blockB.mined).toEqual(false);
    });

    it('returns data as concatenated string', () => {
        expect(blockA.getDataAsString()).toEqual('check-id-aitems-a10.991.99');
    });

    it('calls /hash endpoint with correct arguments', async () => {
        const response = await blockA.getHash();
        blockA.hash = response.toString();
        const postData = {
            version: 0,
            parent_hash: '0000000000000000000000000000000000000000000000000000000000000000',
            data: 'check-id-aitems-a10.991.99',
            sec_since_epoc: 0,
            nonce: 0,
            target_zeros: 4
        };
        expect(window.fetch.mock.calls.length).toBe(1);
        expect(window.fetch.mock.calls[0][0]).toBe('/hash');
        expect(window.fetch.mock.calls[0][1]).toStrictEqual({
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(postData),
        });
    });



});