import React from 'react';
import './App.css';
import BlockChainElement from "./components/BlockChainElement";

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

export default App;
