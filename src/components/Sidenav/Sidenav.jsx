import { faHome, faLandmark, faTimes, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { setMiniSidenav, useArysoftUIController } from "../../context/context";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const openTransparentStyles = 'sidenav navbar navbar-vertical navbar-expand-xs border-0 border-radius-xl my-3 fixed-start ms-3';
const openWhiteStyles = 'sidenav navbar navbar-vertical navbar-expand-xs border-0 border-radius-xl my-3 fixed-start ms-3 bg-white';

const openStyle = () => ({
  transform: 'translateX(0)',
  transition: '0.5s',
});

const closeStyle = () => ({
  transform: 'translateX(-250px)',
});

export const Sidenav = () => {
  const [controller, dispatch] = useArysoftUIController();
  const { miniSidenav, transparentSidenav } = controller;
  const location = useLocation();

  const closeSidenav = () => setMiniSidenav(dispatch, true);

  useEffect(() => {
    const onMiniSidenav = () => {
      setMiniSidenav(dispatch, window.innerWidth < 1200);
      console.log('setMiniSidenav', window.innerWidth < 1200);
    };
  
    window.addEventListener("resize", onMiniSidenav);
    onMiniSidenav();

    return () => {
      window.removeEventListener("resize", onMiniSidenav);
    }
  }, [dispatch, location]);

  return (
    <aside 
      className={ transparentSidenav ? (miniSidenav ? openTransparentStyles : openWhiteStyles) : openWhiteStyles } 
      style={ miniSidenav ? closeStyle() : openStyle() } 
    >
      <div className="sidenav-header">
        { !miniSidenav && <FontAwesomeIcon icon={ faTimes } className="p-3 cursor-pointer text-secondary opacity-5 position-absolute end-0 top-0 d-xl-none" onClick={ closeSidenav } /> }
        <a className="navbar-brand m-0" href="#">
          <span className="ms-1 font-weight-bold">Zapotlán Admin</span>
        </a>
      </div>
      <hr className="horizontal dark mt-0" />
      <div className="collapse navbar-collapse w-auto">
        <ul className="navbar-nav">
          <li className="nav-item">
            <a className="nav-link" href="#">
              <div className="icon icon-shape icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
                <FontAwesomeIcon icon={ faHome } />
              </div>
              <span className="nav-link-text ms-1">
                Dashboard
              </span>
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link active" href="#">
              <div className="icon icon-shape icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
                <FontAwesomeIcon icon={ faLandmark } />
              </div>
              <span className="nav-link-text ms-1">
                Administraciones
              </span>
            </a>
          </li>
          <li className="nav-item mt-3">
            <h6 className="ps-4 ms-2 text-uppercase text-xs font-weight-bolder opacity-6">Catálogos</h6>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              <div className="icon icon-shape icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
                <FontAwesomeIcon icon={ faUsers } />
              </div>
              <span className="nav-link-text ms-1">
                Empleados
              </span>
            </a>
          </li>
        </ul>
      </div>
    </aside>
  )
}

export default Sidenav;