import $ from "jquery";
import React from 'react';

class BlockDataContent extends React.Component {
    constructor(props) {
        super(props);
        this.triggerOnChangeFunction = this.triggerOnChangeFunction.bind(this);
    }

    triggerOnChangeFunction() {
        const blockData = {
            id: $('#checkId-' + this.props.id).val(),
            items: $('#checkItems-' + this.props.id).val(),
            cost: $('#checkCost-' + this.props.id).val(),
            tip: $('#checkTip-' + this.props.id).val()
        };
        this.props.onChangeFct(this.props.id, blockData);
    }

    render() {
        return (
            <div>
                <div className="input-field">
                    <input onChange={this.triggerOnChangeFunction} className="block-field" id={"checkId-" + this.props.id} type="text" value={this.props.checkId}/>
                    <label className="active" htmlFor={"checkId-" + this.props.id}>Check ID</label>
                </div>
                <div className="input-field">
                    <textarea onChange={this.triggerOnChangeFunction} className="materialize-textarea data-textarea" id={"checkItems-" + this.props.id}
                              id={"checkItems-" + this.props.id}>{this.props.checkItems}</textarea>
                    <label className="active" htmlFor={"checkItems-" + this.props.id}>Items</label>
                </div>
                <div className="input-field">
                    <input onChange={this.triggerOnChangeFunction} className="block-field" id={"checkCost-" + this.props.id} type="number" step="any" value={this.props.checkCost}/>
                    <label className="active" htmlFor={"checkCost-" + this.props.id}>Cost</label>
                </div>
                <div className="input-field">
                    <input onChange={this.triggerOnChangeFunction} className="block-field" id={"checkTip-" + this.props.id} type="number" step="any" value={this.props.checkTip}/>
                    <label className="active" htmlFor={"checkTip-" + this.props.id}>Tip</label>
                </div>
            </div>
        )
    }
}

export default BlockDataContent;