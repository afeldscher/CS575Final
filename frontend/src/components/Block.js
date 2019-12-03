import BlockDataContent from "./BlockDataContent";
import React from 'react';

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
                    <BlockDataContent id={this.props.id} checkId={this.props.checkId} checkItems={this.props.checkItems}
                                      checkCost={this.props.checkCost} checkTip={this.props.checkTip} onChangeFct={this.props.textareaOnChange}/>
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

export default Block;