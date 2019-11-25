import React from 'react';
import M from 'materialize-css';
import $ from 'jquery';
import './App.css';
import BlockNode from "./js/BlockNode";
import {solveBlock, uuidv4, hasLeadingZeroes} from './js/utils';

function App() {
    return (
        <div className="App">
            <nav>
                <div className="nav-wrapper light-blue center">
                    <a href="#" className="app-title">Blockchain Simulator</a>
                    <ul id="nav-mobile" className="right hide-on-med-and-down">
                        <a className="modal-trigger" href="#infoModal">
                            <i title="About" className="material-icons">info_outline</i>
                        </a>
                    </ul>
                </div>
            </nav>
            <div className="container">
                <BlockChainElement/>
            </div>
        </div>
    );
}

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
        const blockData = $('#blockDataTextArea').val();
        if (blockData.length === 0) { //todo: Delete this if this is desirable functionality
            M.toast({html: 'Cannot add an empty block.', classes: 'red'});
            return;
        }
        $('#blockDataTextArea').val("");
        const parent = this.state.blocks[this.state.blocks.length - 1];
        let blockNode = new BlockNode(uuidv4(), blockData, parent);
        blockNode.getHash().then(response => {
            blockNode.hash = response.hash;
            this.setState(state => ({
                blocks: [...state.blocks, blockNode]
            }));
        });
    }

    resetAllBlocks() {
        let rootBlock = this.state.blocks[0];
        rootBlock.getHash().then(response => {
            rootBlock.hash = response.hash;
            rootBlock.mined = hasLeadingZeroes(response.hash, $("#numZeroes").val());
            this.propagateChanges(0, rootBlock);
        });
    }

    mineBlock(id) {
        const block = this.state.blocks[id];
        const zeroes = $("#numZeroes").val();
        const numTries = $('#numTries').val();
        solveBlock(block.parent, block.data, zeroes, numTries).then(response => {
            if (response.solved) {
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
            const parentHash = i === 0 ? '0000000000000000000000000000000000000000000000000000000000000000' : blockArr[i].hash;
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
        block.data = newData;
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
                        <Block key={idx} id={idx} guid={it.guid} parent={it.parent} data={it.data} nonce={it.nonce}
                               hash={it.hash} mineFunction={this.mineBlock} mined={it.mined}
                               textareaOnChange={this.handleTamper}/>
                    ))}
                </div>
            </div>
        );
    }
}

class Block extends React.Component {
    constructor(props) {
        super(props);
        this.triggerMine = this.triggerMine.bind(this);
    }

    triggerMine() {
        this.props.mineFunction(this.props.id);
    }

    render() {
        let backgroundClass = "block col s11 m5 l5";
        let statusString = "";
        if (this.props.mined) {
            backgroundClass += " mined-block";
            statusString = "Good";
        } else {
            backgroundClass += " bad-block";
            statusString = "Bad"
        }
        return (
            <div
                className={backgroundClass}>
                <div>
                    <div className="block-header">
                        <span className="block-title">Block #{this.props.id + 1}</span><br/>
                        <span>Status: {statusString}</span>
                    </div>
                    <TextBoxInput id={"guid"} value={this.props.guid} label={"GUID"}/>
                    <DisabledTextAreaInput id={"parent"} value={this.props.parent} label={"Parent"}/>
                    <TextAreaInput blockId={this.props.id} id={"data"} value={this.props.data} label={"Block Data"}
                                   onChangeFct={this.props.textareaOnChange}/>
                    <TextBoxInput id={"nonce"} value={this.props.nonce} label={"Nonce"}/>
                    <DisabledTextAreaInput id={"hash"} label={"Hash"} value={this.props.hash}/>
                    <button className="waves-effect waves-light btn mine-btn green darken-1"
                            onClick={this.triggerMine}>Mine
                    </button>
                </div>
            </div>)
    }
}


function TextBoxInput(props) {
    return (
        <div className="input-field">
            <input className="block-field" type="text" id={props.id} disabled={true} value={props.value}/>
            <label className="active">{props.label}</label>
        </div>);
}

function DisabledTextAreaInput(props) {
    return (
        <div className="input-field">
            <textarea readOnly className="materialize-textarea hash-textarea" id={props.id} value={props.value}/>
            <label className="active">{props.label}</label>
        </div>);
}

class TextAreaInput extends React.Component {
    constructor(props) {
        super(props);
        this.triggerOnChangeFunction = this.triggerOnChangeFunction.bind(this);
        this.id = this.props.id + "-" + this.props.blockId;
    }

    triggerOnChangeFunction() {
        const blockData = $('#' + this.id).val();
        this.props.onChangeFct(this.props.blockId, blockData);
    }

    render() {
        return (
            <div className="input-field">
            <textarea onChange={this.triggerOnChangeFunction} className="materialize-textarea data-textarea"
                      id={this.id}>{this.props.value}</textarea>
                <label className="active">{this.props.label}</label>
            </div>);
    }
}

export class HeaderRow extends React.Component {
    DEFAULT_ZEROES = 4;
    DEFAULT_NUM_TRIES = 10000000;

    render() {
        return (
            <div>
                <div className=" header-row row">
                    <div className="col s4">
                        <a title="Click to add a block to the blockchain"
                           href="#addItemModal" className="green darken-1 waves-effect waves-light btn modal-trigger">
                            Add a block
                        </a>
                    </div>
                    <div className="col s4">
                        <div title="Specifies the difficulty for the hash solving algorithm" className="input-field">
                            <input onChange={this.props.resetBlockFunction} defaultValue={this.DEFAULT_ZEROES} min="1" max="32" id="numZeroes" type="number"/>
                            <label htmlFor="numZeroes">Number of Leading Zeroes</label>
                        </div>
                    </div>
                    <div className="col s4">
                        <div title="The maximum number of nonce values to try" className="input-field">
                            <input defaultValue={this.DEFAULT_NUM_TRIES} min="100" id="numTries" type="number"/>
                            <label htmlFor="numTries">Max Tries Per Mine</label>
                        </div>
                    </div>
                </div>
                <div className="modal" id="addItemModal">
                    <div className="modal-content">
                        <h5>Enter data for new block</h5>
                        <div className="input-field add-block-textarea-wrapper">
                            <textarea placeholder="Enter data here" className="materialize-textarea" id="blockDataTextArea"/>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <a href="#" onClick={this.props.addBlockFunction}
                           className="modal-close waves-effect btn-flat">
                            Add
                        </a>
                    </div>
                </div>
                <div className="modal" id="infoModal">
                    <div className="modal-content">
                        <h4>About this Application</h4>
                        <p>This application is a blockchain simulator that uses a proof-of-work consensus algorithm.
                            The specific hashing function is based on the
                            <a href="https://en.bitcoin.it/wiki/Block_hashing_algorithm"> bitcoin hashing algorithm.</a>
                        </p>
                    </div>
                    <div className="modal-footer">
                        <a href="#" className="modal-close waves-effect btn-flat">Close</a>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
