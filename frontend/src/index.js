import React from 'react';
import ReactDOM from 'react-dom';
import M from 'materialize-css';
import './index.css';
import BlockChainApp from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<BlockChainApp />, document.getElementById('root'));

document.addEventListener('DOMContentLoaded', function() {
    let modalElements = document.querySelectorAll('.modal');
    M.Modal.init(modalElements);
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
