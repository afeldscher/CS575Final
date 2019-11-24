import React from 'react';
import './App.css';
import BlockNode from "./BlockChain";
import $ from 'jquery';

function App() {
    return (
        <div className="App">
            <nav>
                <div className="nav-wrapper"><a href="#" className="brand-logo">Blockchain Simulator</a></div>
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
        this.propagateChanges = this.propagateChanges.bind(this);

    }

    renderModal() {
        return (
            <div className="container">
                <div className=" header-row row">
                    <div className="col s4"><a href="#addItemModal"
                                               className="waves-effect waves-light btn modal-trigger">Add
                        a block</a></div>
                </div>
                <div className="modal" id="addItemModal">
                    <div className="modal-content">
                        <h4>Add a block</h4>
                        <div className="input-field add-block-textarea-wrapper"><textarea
                            className="materialize-textarea"
                            id="blockDataTextArea"></textarea><label
                            className="active">Block Data</label></div>
                    </div>
                    <div className="modal-footer"><a href="#!" onClick={this.addBlock}
                                                     className="modal-close waves-effect waves-green btn-flat">Add</a>
                    </div>
                </div>
            </div>
        );
    }

    addBlock() {
        const blockData = $('#blockDataTextArea').val();
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

    mineBlock(id) {
        const block = this.state.blocks[id];
        solveBlock(block.parent, block.data, 1).then(response => {
            if (response.solved) {
                block.nonce = response.nonce;
                block.hash = response.hash;
                block.mined = true;
                let blockArr = this.state.blocks;
                blockArr[id] = block;
                if (id + 1 == this.state.blocks.length) {
                    this.setState(state => ({
                        blocks: blockArr,
                    }));
                } else {
                    this.propagateChanges(id, blockArr);
                }
            }
        });
    }

    propagateChanges(id, blockArr) {
        for (let i = id; i < this.state.blocks.length - 1; i++) {
            const parentHash = blockArr[i].hash;
            let currentBlock = blockArr[i + 1];
            currentBlock.parent = parentHash;
            currentBlock.mined = false;
            currentBlock.getHash().then(response => {
                currentBlock.hash = response.hash;
                blockArr[i + 1] = currentBlock;
                this.setState(state => ({
                    blocks: blockArr,
                }));
            })
        }
    }

    render() {
        let blocks = this.state.blocks;
        return (
            <div>
                {this.renderModal()}
                <div className="row">
                    {blocks.map((it, idx) => (
                        <Block id={idx} guid={it.guid} parent={it.parent} data={it.data} nonce={it.nonce}
                               hash={it.hash} mineFunction={this.mineBlock} mined={it.mined}/>
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
        if (this.props.mined) {
            backgroundClass += " mined-block"
        } else {
            backgroundClass += " bad-block"
        }
        return (
            <div
                className={backgroundClass}>
                <div>
                    <TextBoxInput id={"guid"} value={this.props.guid} label={"GUID"} isDisabled={true}></TextBoxInput>
                    <TextBoxInput id={"parent"} value={this.props.parent} label={"Parent"}
                                  isDisabled={true}></TextBoxInput>
                    <TextAreaInput id={"data"} value={this.props.data} label={"Block Data"}
                                   classes={"materialize-textarea data-textarea"}></TextAreaInput>
                    <TextBoxInput id={"nonce"} value={this.props.nonce} label={"Nonce"}
                                  isDisabled={true}></TextBoxInput>
                    <DisabledTextAreaInput id={"hash"} label={"Hash"} value={this.props.hash}
                                   classes={"materialize-textarea hash-textarea"}></DisabledTextAreaInput>
                    <button className="waves-effect waves-light btn mine-btn" onClick={this.triggerMine}>Mine</button>
                </div>
            </div>)
    }
}



function TextBoxInput(props) {
    return (
        <div className="input-field">
            <input className="block-field" type="text" id={props.id} disabled={props.isDisabled} value={props.value}/>
            <label className="active">{props.label}</label>
        </div>);
}

function DisabledTextAreaInput(props) {
    return (
        <div className="input-field">
            <textarea readonly className={props.classes} id={props.id} value={props.value}
            ></textarea>
            <label className="active">{props.label}</label>
        </div>);
}

function TextAreaInput(props) {
    return (
        <div className="input-field">
            <textarea className={props.classes} id={props.id}
            >{props.value}</textarea>
            <label className="active">{props.label}</label>
        </div>);
}

// https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

async function solveBlock(parent, data, zeroes) {
    const postData = {
        max_tries: 10000000,
        block: {
            version: 0,
            parent_hash: parent,
            data: data,
            sec_since_epoc: parseInt(new Date().getTime() / 1000),
            target_zeros: zeroes,
        }
    };
    const response = await fetch('http://localhost:8080/solve', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(postData),
    });
    return await response.json();
}

//todo: fix this so that modal doesn't need to be a part of BlockChainElement
function Modal() {
    return (
        <div>
            <div className=" header-row row">
                <div className="col s4"><a href="#addItemModal"
                                           className="waves-effect waves-light btn modal-trigger">Add
                    a block</a></div>
            </div>
            <div className="modal" id="addItemModal">
                <div className="modal-content">
                    <h4>Add a block</h4>
                    <div className="input-field add-block-textarea-wrapper"><textarea
                        className="materialize-textarea"
                        id="blockDataTextArea"></textarea><label
                        className="active">Block Data</label></div>
                </div>
                <div className="modal-footer"><a href="#!"
                                                 className="modal-close waves-effect waves-green btn-flat">Add</a></div>
            </div>
        </div>
    );
}

export default App;
