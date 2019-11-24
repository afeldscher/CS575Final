class BlockNode {
    constructor(guid, data, parentNode) {
        this.guid = guid;
        this.data = data;
        this.nonce = 0;
        this.parent = parentNode ? parentNode.hash : '0000000000000000000000000000000000000000000000000000000000000000';
        this.mined = false;
    }

    async getHash() {
        const postData = {
            version: 0,
            parent_hash: this.parent,
            data: this.data,
            sec_since_epoc: parseInt(new Date().getTime() / 1000),
            target_zeros: 3,
            nonce: this.nonce
        };
        const response = await fetch('/hash', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(postData),
        });
        return await response.json();
    }
}

export default BlockNode;