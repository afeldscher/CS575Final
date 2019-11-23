class BlockNode {
    constructor(guid, data, parentNode) {
        this.guid = guid;
        this.data = data;
        this.nonce = 0;
        this.hash = 'xxxx' //todo: Add call to backend to populate this
        this.parent = parentNode ? parentNode.hash : '<none>';
        this.next = null
    }
}

class BlockChain {
    constructor() {
        this.head = null;
        this.tail = null;
        this.size = 0;
    }

    getHead() {
        return this.head;
    }

    getTail() {
        return this.tail();
    }

    add(guid, data) {
        console.log("added block!");
        const block = new BlockNode(guid, data);
        let current;
        if (this.head == null)
            this.head = block;
        else {
            current = this.head;
            while (current.next) {
                current = current.next;
            }
            current.next = block
        }
        block.parent = this.tail;
        this.tail = block;
        this.size++;
        return this;
    }
}

export default BlockNode;