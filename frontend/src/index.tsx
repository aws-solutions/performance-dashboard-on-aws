import React from 'react';
import ReactDOM from 'react-dom';
import Amplify from 'aws-amplify';
import * as serviceWorker from './serviceWorker';
import environment from './env.json';
import App from './App';
import './index.css';

Amplify.configure(environment);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
