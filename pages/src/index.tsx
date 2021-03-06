import "reflect-metadata";
import React from 'react';
import './index.scss';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import ReactDOM from 'react-dom';
import App from './App';
import dataProvider from './ra-data-custom';
import authProvider from './authProvider';

authProvider.init();

ReactDOM.render(
  <React.StrictMode>
    <App dataProvider={dataProvider}
      authProvider={authProvider} />
  </React.StrictMode>,
  document.getElementById('root')
);  

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();
