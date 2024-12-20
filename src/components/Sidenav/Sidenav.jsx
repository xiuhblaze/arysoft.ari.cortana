import { faHome, faLandmark, faTimes, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { setMiniSidenav, useArysoftUIController } from "../../context/context";
import { useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

const openTransparentStyles = 'sidenav navbar navbar-vertical navbar-expand-xs border-0 border-radius-xl my-3 fixed-start ms-3';
const openWhiteStyles = 'sidenav navbar navbar-vertical navbar-expand-xs border-0 border-radius-xl my-3 fixed-start ms-3 bg-white';

const openStyle = () => ({
  transform: 'translateX(0)',
  transition: '0.5s',
});

const closeStyle = () => ({
  transform: 'translateX(-250px)',
});

export const Sidenav = ({ brand, brandName, routes, ...props }) => {
  const [controller, dispatch] = useArysoftUIController();
  const { miniSidenav, transparentSidenav } = controller;
  const location = useLocation();
  //const collapseName = location.pathname.split('/').slice(1)[0];

  const closeSidenav = () => setMiniSidenav(dispatch, true);

  useEffect(() => {
    const onMiniSidenav = () => {
      setMiniSidenav(dispatch, window.innerWidth < 1200);
    };
  
    window.addEventListener("resize", onMiniSidenav);
    onMiniSidenav();

    return () => {
      window.removeEventListener("resize", onMiniSidenav);
    }
  }, [dispatch, location]);

  const renderRoutes = !routes ? [] : routes.map(({type, icon, title, key, path }) => {
    let returnValue;

    switch (type) {
      case 'collapse': 
        returnValue = (
          <li key={ key } className="nav-item">
            <NavLink to={ path.replace('*', '') } className="nav-link">
              <div className="icon icon-shape icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
                <FontAwesomeIcon icon={ icon } />
              </div>
              <span className="nav-link-text ms-1">
                { title }
              </span>
            </NavLink>
          </li>
        )
      break;
      case 'title':
        returnValue = (
          <li key={ key } className="nav-item mt-3">
            <h6 className="ps-4 ms-2 text-uppercase text-xs font-weight-bolder opacity-6">{ title }</h6>
          </li>
        )
      break;
    }

    return returnValue;
  }); // renderRoutes

  return (
    <aside 
      { ...props }
      className={ transparentSidenav ? (miniSidenav ? openTransparentStyles : openWhiteStyles) : openWhiteStyles } 
      style={ miniSidenav ? closeStyle() : openStyle() } 
    >
      <div className="sidenav-header">
        { !miniSidenav && <FontAwesomeIcon icon={ faTimes } className="p-3 cursor-pointer text-secondary opacity-5 position-absolute end-0 top-0 d-xl-none" onClick={ closeSidenav } /> }
        <Link to="/" className="navbar-brand m-0">
          <div className="d-flex align-items-center">
            {
              !!brand ? (
                <img className="navbar-brand-img h-100" src={ brand } alt="imagen principal" />
              ) : null
            }
            <div className="d-flex flex-column justify-content-center">
              <span className="ms-2 font-weight-bold">American <br />Registration Inc</span>
            </div>
          </div>
          {/* <span className="ms-2 font-weight-bold">{ brandName }</span> */}
        </Link>
      </div>
      <hr className="horizontal dark mt-0" />
      <div className="collapse navbar-collapse w-auto">
        <ul className="navbar-nav">
          { renderRoutes }
        </ul>
      </div>
    </aside>
  )
}

export default Sidenav;