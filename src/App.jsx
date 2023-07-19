import { Navigate, Routes, Route, useLocation } from 'react-router-dom';

import './app.css';

import publicRoute from './routes/publicRoutes';
import { useEffect } from 'react';
import Home from './views/home';

function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);
  

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
      { renderRoutes(publicRoute) }
      <Route path="/home" element={ <Home /> } />
      <Route path="/*" element={ <Navigate to="dashboard" /> } />
    </Routes>
  )
}

export default App
