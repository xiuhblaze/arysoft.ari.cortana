import React from 'react';
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { ArysoftUIControllerProvider } from './context/context.jsx';
import App from './App.jsx';
import store from './store/store.jsx';

import './assets/css/soft-ui-dashboard.min.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={ store }>
      <BrowserRouter>
        <ArysoftUIControllerProvider>
          <App />
        </ArysoftUIControllerProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
)
