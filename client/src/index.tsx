import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import * as serviceWorker from './serviceWorker';


ReactDOM.render(
    <App />,
    document.getElementById('root') as HTMLElement
);

serviceWorker.unregister();
