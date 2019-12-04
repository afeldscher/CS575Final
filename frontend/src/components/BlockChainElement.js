import M from "materialize-css";
import React from 'react';
import BlockNode from "../js/BlockNode";
import {hasLeadingZeroes, solveBlock, uuidv4} from "../js/utils";
import $ from "jquery";
import HeaderRow from './HeaderRow';
import {Block} from "./Block";

class BlockChainElement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {blocks: []};
        this.addBlock = this.addBlock.bind(this);
        this.mineBlock = this.mineBlock.bind(this);
        this.recalculateAllHashes = this.recalculateAllHashes.bind(this);
        this.handleTamper = this.handleTamper.bind(this);
        this.propagateChanges = this.propagateChanges.bind(this);
        this.resetAllBlocks = this.resetAllBlocks.bind(this);
    }

    addBlock() {
        const blockData = getNewBlockData();
        if(blockData.id === '' || blockData.items === '') {
            M.toast({html: `Cannot add block without an ID or bill items.`, classes: 'red'});
        } else {
            const parent = this.state.blocks[this.state.blocks.length - 1];
            let blockNode = new BlockNode(uuidv4(), blockData, parent);
            blockNode.getHash().then(response => {
                blockNode.hash = response.hash;
                this.setState(state => ({
                    blocks: [...state.blocks, blockNode]
                }));
            });
        }
    }

    resetAllBlocks() {
        let rootBlock = this.state.blocks[0];
        if(rootBlock) {
            rootBlock.getHash().then(response => {
                rootBlock.hash = response.hash;
                rootBlock.mined = hasLeadingZeroes(response.hash, $("#numZeroes").val());
                this.propagateChanges(0, rootBlock);
            });
        }
    }

    mineBlock(id) {
        const block = this.state.blocks[id];
        const zeroes = $("#numZeroes").val();
        const numTries = $('#numTries').val();
        solveBlock(block.parent, block.getDataAsString(), zeroes, numTries).then(response => {
            if (response.solved) {
                console.log("here");
                block.nonce = response.nonce;
                block.hash = response.hash;
                block.mined = true;
                this.propagateChanges(id, block);
            } else {
                M.toast({html: `Unable to solve block #${id + 1} after ${numTries} attempts`, classes: 'red'});
            }
        });
        M.toast({html: `Mining Block #${id + 1}...`, classes: 'green darken-1'});
    }

    async recalculateAllHashes(id, blockArr) {
        for (let i = id; i < this.state.blocks.length - 1; i++) {
            const parentHash = blockArr[i].hash;
            let currentBlock = blockArr[i + 1];
            currentBlock.parent = parentHash;
            const response = await currentBlock.getHash();
            currentBlock.hash = response.hash;
            currentBlock.mined = hasLeadingZeroes(response.hash, $("#numZeroes").val());
            blockArr[i + 1] = currentBlock;
        }
        return blockArr;
    }

    handleTamper(id, newData) {
        const block = this.state.blocks[id];
        block.checkId = newData.id;
        block.checkItems = newData.items;
        block.checkCost = newData.cost;
        block.checkTip = newData.tip;
        block.getHash().then(response => {
            block.hash = response.hash;
            block.mined = hasLeadingZeroes(response.hash, $("#numZeroes").val());
            this.propagateChanges(id, block);
        });
    }

    propagateChanges(id, block) {
        let blockArr = this.state.blocks;
        blockArr[id] = block;
        if (id + 1 === this.state.blocks.length) {
            this.setState(state => ({
                blocks: blockArr,
            }));
        } else {
            this.recalculateAllHashes(id, blockArr).then(newBlocks => {
                this.setState(state => ({
                    blocks: blockArr,
                }));
            });
        }
    }

    render() {
        let blocks = this.state.blocks;
        return (
            <div>
                <HeaderRow resetBlockFunction={this.resetAllBlocks} addBlockFunction={this.addBlock}/>
                <div className="row">
                    {blocks.map((it, idx) => (
                        <Block key={idx} id={idx} guid={it.guid} parent={it.parent} nonce={it.nonce}
                               hash={it.hash} mineFunction={this.mineBlock} mined={it.mined}
                               textareaOnChange={this.handleTamper} checkId={it.checkId} checkItems={it.checkItems}
                               checkCost={it.checkCost} checkTip={it.checkTip}
                        />
                    ))}
                </div>
            </div>
        );
    }
}

function getNewBlockData() {
    let data = {
        id: $('#checkId').val(),
        items: $('#checkItems').val(),
        cost: $('#checkCost').val(),
        tip: $('#checkTip').val()
    };
    $('#checkId').val("");
    $('#checkItems').val("");
    $('#checkCost').val("");
    $('#checkTip').val("");
    return data;
}

export default BlockChainElement;