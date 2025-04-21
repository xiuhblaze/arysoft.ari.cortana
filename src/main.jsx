import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import { ArysoftUIControllerProvider } from './context/context.jsx';

import App from './App.jsx';
import store from './store/store.jsx';
import Loading from './views/loading.jsx';

import './assets/fontawesome/css/fontawesome.min.css';
import './assets/fontawesome/css/solid.min.css';

import './assets/css/soft-ui-dashboard.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={ store }>
      <Suspense fallback={ <Loading /> }>
        <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
          <ArysoftUIControllerProvider>
            <App />
          </ArysoftUIControllerProvider>
        </BrowserRouter>
      </Suspense>
    </Provider>
  </React.StrictMode>,
)
