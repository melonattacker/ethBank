import React from 'react';
import ReactDOM from 'react-dom';
import DepositForm from './components/depositForm';
import HistoryPage from './components/historyPage';
import { BrowserRouter as Router, Route } from "react-router-dom";
import * as serviceWorker from './serviceWorker';


ReactDOM.render(
    <Router>
        <div>
            <Route exact path="/" component={DepositForm} />
            <Route exact path="/history" component={HistoryPage} />
        </div>
    </Router>
    ,document.getElementById('root') as HTMLElement
);

serviceWorker.unregister();
