import { lazy, useEffect } from 'react';
import { Navigate, Routes, Route, useLocation } from 'react-router-dom';

import { useAuthStore } from './hooks/useAuthStore';

import Loading from './views/loading';

//import publicRoute from './routes/publicRoutes';
import privateRoute from './routes/privateRoutes';

import './app.css';
import { Login } from './views/Login/Login';
import Profile from './views/profile/Profile';

const LazyUsers = lazy(() => import('./views/users'));

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
            return routes.map(route => {
                if (route.type === 'collapse') {
                    return <Route key={route.key} path={route.path} element={<route.element />} />
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
                        {renderRoutes(privateRoute)}
                        {/* {renderRoutes(publicRoute)} */}
                        <Route path="/profile" element={ <Profile /> } />
                        <Route path="/users/*" element={ <LazyUsers /> } />
                        <Route path="/*" element={<Navigate to={privateRoute[0].path} />} />
                    </>
                ) : (
                    <>
                        <Route path="/login" element={<Login />} />
                        <Route path="/*" element={<Navigate to={ '/login' } />} />
                    </>
                )
            }
        </Routes>
    )
}

export default App
