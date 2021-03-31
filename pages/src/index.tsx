import React from 'react';
import './index.scss';
import * as serviceWorker from './service-worker';
import ReactDOM from 'react-dom';
import App from './App';
import dataProvider from './ra-data-custom';
import i18nProviderBuilder from './i18nProviderBuilder';
import authProvider from './authProvider';

authProvider.init();

const i18nProvider = i18nProviderBuilder(dataProvider, authProvider);
ReactDOM.render(
  <React.StrictMode>
    <App dataProvider={dataProvider}
      i18nProvider={i18nProvider}
      authProvider={authProvider} />
  </React.StrictMode>,
  document.getElementById('root')
);  

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
