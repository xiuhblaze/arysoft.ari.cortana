import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { setMiniSidenav, setOpenConfigurator, setTransparentNavbar, useArysoftUIController } from '../../context/context';

import { faBars, faGear, faHome, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Breadcrums } from '../Breadcrumbs';

const navbarTypeStyckyStyle = 'navbar navbar-main navbar-expand-lg px-0 mx-4 shadow-none border-radius-xl position-sticky blur shadow-blur mt-4 left-auto top-1 z-index-sticky';
const navbarTypeStaticStyle = 'navbar navbar-main navbar-expand-lg px-0 mx-4 shadow-none border-radius-xl';

export const Navbar = ({ title }) => {
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useArysoftUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator } = controller;

  const fullRoute = useLocation().pathname.split('/').slice(1);
  const route = fullRoute.filter(item => item !== '');

  useEffect(() => {
    if (fixedNavbar) {
      setNavbarType('sticky');
    } else {
      setNavbarType('static');
    }

    const onTransparentNavbar = () => {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);      
      //console.log('onTransparentNavbar', (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    };

    window.addEventListener("scroll", onTransparentNavbar);

    onTransparentNavbar();
  
    return () => window.removeEventListener("scroll", onTransparentNavbar);
  }, [dispatch, fixedNavbar]);
  

  const onMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
  const onConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  return (
    <nav 
      className={ transparentNavbar ? navbarTypeStaticStyle : navbarTypeStyckyStyle } 
      navbar-scroll={ !transparentNavbar ? 'false' : 'true' }
    >
      <div className="container-fluid py-1 px-3">
        <Breadcrums 
          icon={ faHome }
          title={ !!title ? title : route[route.length - 1]}
          route={ route }
        />

        <div className="navbar-collapse mt-sm-0 mt-2 me-md-0 me-sm-4">
          {/* <div className="ms-md-auto pe-md-3 d-flex align-items-center">
            <div className="input-group">
              <span className="input-group-text text-body">
                <FontAwesomeIcon icon={ faSearch }></FontAwesomeIcon>
              </span>
              <input type="text" className="form-control" placeholder="Buscar..."></input>
            </div>
          </div> */}

          <ul className="navbar-nav d-flex flex-row justify-content-end ms-md-auto">
              <li className="nav-item d-flex align-items-center">
                <a href="#" className="nav-link text-body font-weight-bold px-0">
                  <FontAwesomeIcon icon={ faUser } className="me-sm-1" />
                  <span className="d-sm-inline d-none">adrian.castillo</span>
                </a>
              </li>
              <li className="nav-item d-xl-none ps-3 d-flex align-items-center">
                <a className="nav-link text-body p-0" onClick={ onMiniSidenav }>
                  <FontAwesomeIcon icon={ faBars } />
                </a>
              </li>
              <li className="nav-item ps-3 d-flex align-items-center">
                <a href="#" className="nav-link text-body p-0">
                  <FontAwesomeIcon icon={ faGear } />
                </a>
              </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar;