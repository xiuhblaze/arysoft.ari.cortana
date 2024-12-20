import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import { ArysoftUIControllerProvider } from './context/context.jsx';

import App from './App.jsx';
import store from './store/store.jsx';
import Loading from './views/loading.jsx';

import './assets/css/soft-ui-dashboard.min.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={ store }>
      <Suspense fallback={ <Loading /> }>
        <BrowserRouter>
          <ArysoftUIControllerProvider>
            <App />
          </ArysoftUIControllerProvider>
        </BrowserRouter>
      </Suspense>
    </Provider>
  </React.StrictMode>,
)
