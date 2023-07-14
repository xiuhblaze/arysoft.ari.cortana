import { faBars, faGear, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { setMiniSidenav, setOpenConfigurator, setTransparentNavbar, useArysoftUIController } from '../../context/context';
import { useEffect, useState } from 'react';

export const Navbar = () => {
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useArysoftUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator } = controller;

  useEffect(() => {
    if (fixedNavbar) {
      setNavbarType('sticky');
    } else {
      setNavbarType('static');
    }

    const onTransparentNavbar = () => {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);      
      console.log('onTransparentNavbar', (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    };

    window.addEventListener("scroll", onTransparentNavbar);

    onTransparentNavbar();
  
    return () => window.removeEventListener("scroll", onTransparentNavbar);
  }, [dispatch, fixedNavbar]);
  

  const onMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
  const onConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  return (
    <nav className="navbar navbar-main navbar-expand-lg px-0 mx-4 shadow-none border-radius-xl" navbar-scroll="true">
      <div className="container-fluid py-1 px-3">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0 me-sm-6 me-5">
            <li className="breadcrumb-item text-sm"><a className="opacity-5 text-dark" href="#">Pages</a></li>
            <li className="breadcrumb-item text-sm text-dark active" aria-current="page">Dashboard</li>
          </ol>
          <h6 className="font-weight-bolder mb-0">Titulo de la página</h6>
        </nav>

        <div className="collapse navbar-collapse mt-sm-0 mt-2 me-md-0 me-sm-4">
          {/* <div className="ms-md-auto pe-md-3 d-flex align-items-center">
            <div className="input-group">
              <span className="input-group-text text-body">
                <FontAwesomeIcon icon={ faSearch }></FontAwesomeIcon>
              </span>
              <input type="text" className="form-control" placeholder="Buscar..."></input>
            </div>
          </div> */}

          <ul className="navbar-nav justify-content-end ms-md-auto">
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