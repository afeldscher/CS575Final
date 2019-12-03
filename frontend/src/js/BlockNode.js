import $ from "jquery";

class BlockNode {
    constructor(guid, data, parentNode) {
        this.guid = guid;
        this.checkId = data.id;
        this.checkItems = data.items;
        this.checkCost = data.cost;
        this.checkTip = data.tip;
        this.nonce = 0;
        this.parent = parentNode ? parentNode.hash : '0000000000000000000000000000000000000000000000000000000000000000';
        this.mined = false;
    }

    getDataAsString() {
        return this.checkId + this.checkItems + this.checkCost + this.checkTip;
    }

    async getHash() {
        const postData = {
            version: 0,
            parent_hash: this.parent,
            data: this.getDataAsString(),
            sec_since_epoc: 0,
            nonce: this.nonce,
            target_zeros: $("#numZeroes").val() ? $("#numZeroes").val().toString() : '4'
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