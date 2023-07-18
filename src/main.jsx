import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx';

import { ArysoftUIControllerProvider } from './context/context.jsx';

import './assets/css/soft-ui-dashboard.min.css';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ArysoftUIControllerProvider>
        <App />
      </ArysoftUIControllerProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
