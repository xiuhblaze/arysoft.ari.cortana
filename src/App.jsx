import { useEffect } from 'react';
import { Navigate, Routes, Route, useLocation } from 'react-router-dom';

import { useAuthStore } from './hooks/useAuthStore';

import Home from './views/home';
import Loading from './views/loading';

import publicRoute from './routes/publicRoutes';
import privateRoute from './routes/privateRoutes';

import './app.css';

function App() {
  const { pathname } = useLocation();
  const { status, checkAuthToken } = useAuthStore();

  useEffect(() => {
    checkAuthToken();
  }, []);
  
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  if (status === 'checking') {
    return (<Loading />)
  }
  
  const renderRoutes = (routes) => {

    if (!!routes) {
      return routes.map( route => {
        if (route.type === 'collapse') {
          return <Route key={ route.key } path={ route.path } element={ route.element } />
        }
        return null;
      });
    }
    return null;
  };

  return (
    <Routes>
      {
        status === 'authenticated' ? (
          <>
            { renderRoutes(privateRoute) }
            <Route path="/home" element={ <Home /> } />
            <Route path="/*" element={ <Navigate to="dashboard" /> } />
          </>
        ) : (
          <>
            { renderRoutes(publicRoute) }
            <Route path="/*" element={ <Navigate to="home" /> } />
          </>
        )
      }
    </Routes>
  )
}

export default App
