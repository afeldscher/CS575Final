import React from 'react';

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
                            <input onChange={this.props.resetBlockFunction} defaultValue={this.DEFAULT_ZEROES} min="1"
                                   max="32" id="numZeroes" type="number"/>
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
                            <AddBlockForm/>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <a id="addItemModalButton" href="#" onClick={this.props.addBlockFunction}
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

function AddBlockForm() {
    return (
        <div>
            <div className="input-field">
                <input placeholder="Enter check ID" id="checkId" type="text"/>
                <label htmlFor="checkId">Check Id</label>
            </div>
            <div className="input-field">
                <textarea className="materialize-textarea" placeholder="Enter items on bill" id="checkItems"/>
                <label htmlFor="checkItems">Items</label>
            </div>
            <div className="input-field">
                <input placeholder="Enter total bill ($)" id="checkCost" step="any" type="number"/>
                <label htmlFor="checkCost">Total Bill</label>
            </div>
            <div className="input-field">
                <input placeholder="Enter tip" id="checkTip" type="number" step="any"/>
                <label htmlFor="checkTip">Tip</label>
            </div>
        </div>

    )
}

export default HeaderRow;