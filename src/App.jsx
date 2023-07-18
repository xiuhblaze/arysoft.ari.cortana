import { Navigate, Routes, Route } from 'react-router-dom';

import './app.css';

import publicRoute from './routes/publicRoutes';

function App() {

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

      <Route path="/*" element={ <Navigate to="dashboard" /> } />
    </Routes>
  )
}

export default App
