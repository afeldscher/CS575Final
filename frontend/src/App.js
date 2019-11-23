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
        const uuid = uuidv4();
        const blockData = $('#blockDataTextArea').val();
        $('#blockDataTextArea').val("");
        const parent = this.state.blocks[this.state.blocks.length - 1];
        this.setState(state => ({
            blocks: [...state.blocks, new BlockNode(uuid, blockData, parent)]
        }));
    }

    render() {
        let blocks = this.state.blocks;
        return (
            <div>
                {this.renderModal()}
                <div className="row">
                    {blocks.map((it) => (
                        <Block guid={it.guid} parent={it.parent} data={it.data} nonce={it.nonce}
                               hash={it.hash}/>
                    ))}
                </div>
            </div>
        );
    }
}

class Block extends React.Component {
    constructor(props) {
        super(props);
        this.state = {status: 'none'};
        this.mineBlock = this.mineBlock.bind(this);
    }

    mineBlock() {
        //todo: add call to backend for solve
        this.setState(state => ({
            status: 'mined'
        }));
    }

    render() {
        let backgroundClass = "block col s11 m5 l5";
        if (this.state.status === "bad") {
            backgroundClass += " bad-block"
        } else if (this.state.status === "mined") {
            backgroundClass += " mined-block"
        }
        return (
            <div
                className={backgroundClass}>
                <div>
                    <TextBoxInput id={"guid"} value={this.props.guid} label={"GUID"} isDisabled={true}></TextBoxInput>
                    <TextBoxInput id={"parent"} value={this.props.parent} label={"Parent"}
                                  isDisabled={true}></TextBoxInput>
                    <TextAreaInput id={"data"} value={this.props.data} label={"Block Data"} isDisabled={false}
                                   classes={"materialize-textarea data-textarea"}></TextAreaInput>
                    <TextBoxInput id={"nonce"} value={this.props.nonce} label={"Nonce"}
                                  isDisabled={true}></TextBoxInput>
                    <TextAreaInput id={"hash"} value={this.props.hash} label={"Hash"} isDisabled={true}
                                   classes={"materialize-textarea hash-textarea"}></TextAreaInput>
                    <button className="waves-effect waves-light btn mine-btn" onClick={this.mineBlock}>Mine</button>
                </div>
            </div>)
    }
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

function TextBoxInput(props) {
    return (
        <div className="input-field">
            <input className="block-field" type="text" id={props.id} disabled={props.isDisabled} value={props.value}/>
            <label className="active">{props.label}</label>
        </div>);
}

function TextAreaInput(props) {
    return (
        <div className="input-field">
            <textarea className={props.classes} id={props.id} disabled={props.isDisabled}
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

export default App;
