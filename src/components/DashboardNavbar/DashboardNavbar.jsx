import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { setMiniSidenav, setOpenConfigurator, setTransparentNavbar, useArysoftUIController } from '../../context/context';

import { faArrowRightFromBracket, faBars, faBell, faClock, faFile, faGear, faHome, faLock, faUser, faUserCircle, faUserGear } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Breadcrums } from '../Breadcrumbs';
import { NavDropdown } from 'react-bootstrap';
import { useAuthStore } from '../../hooks/useAuthStore';
import ChangePwdModal from '../../views/users/components/ChangePwdModal';

const navbarTypeStyckyStyle = 'navbar navbar-main navbar-expand-lg px-0 mx-4 shadow-none border-radius-xl position-sticky blur shadow-blur mt-4 left-auto top-1 z-index-sticky';
const navbarTypeStaticStyle = 'navbar navbar-main navbar-expand-lg px-0 mx-4 shadow-none border-radius-xl';

export const DashboardNavbar = () => {
    const navigate = useNavigate();
    const [navbarType, setNavbarType] = useState();
    const [showChangePwd, setShowChangePwd] = useState(false);
    const [controller, dispatch] = useArysoftUIController();
    const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator, navbarTitle } = controller;

    const fullRoute = useLocation().pathname.split('/').slice(1);
    const route = fullRoute.filter(item => item !== '');

    const {
        status,
        user,
        logout,
    } = useAuthStore();

    useEffect(() => {
        if (fixedNavbar) {
            setNavbarType('sticky');
        } else {
            setNavbarType('static');
        }

        const onTransparentNavbar = () => {
            setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
        };

        window.addEventListener("scroll", onTransparentNavbar);

        onTransparentNavbar();

        return () => window.removeEventListener("scroll", onTransparentNavbar);
    }, [dispatch, fixedNavbar]);


    const onMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
    const onConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

    const onProfileClick = () => {
        navigate('/profile');
    };

    const onLogout = () => {
        logout();
    };

    const onChangePwd = () => {
        console.log('onChangePwd');
        setShowChangePwd(true);
    };

    const onChangePwdClose = () => {
        setShowChangePwd(false);
    };

    return (
        <>
            <nav
                className={transparentNavbar ? navbarTypeStaticStyle : navbarTypeStyckyStyle}
                navbar-scroll={!transparentNavbar ? 'false' : 'true'}
            >
                <div className="container-fluid py-1 px-3">
                    <Breadcrums
                        icon={faHome}
                        title={!!navbarTitle ? navbarTitle : route[route.length - 1]}
                        route={route}
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
                            <NavDropdown
                                title={
                                    <span className="text-body font-weight-bold">
                                        <FontAwesomeIcon icon={faUser} className="me-sm-2" />
                                        <span className="d-sm-inline d-none me-sm-1">{user.givename}</span>
                                    </span>}
                                id="userMenu"
                            >
                                {/* <NavDropdown.Item onClick={ onProfileClick }>
                    <FontAwesomeIcon icon={ faUserGear } className="me-2" />
                    Profile
                </NavDropdown.Item> */}
                                <NavDropdown.Item onClick={onChangePwd}>
                                    <FontAwesomeIcon icon={faLock} className="me-2" />
                                    Change password
                                </NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={onLogout}>
                                    <FontAwesomeIcon icon={faArrowRightFromBracket} className="me-2" />
                                    Logout
                                </NavDropdown.Item>
                            </NavDropdown>
                            <li className="nav-item d-xl-none ps-3 d-flex align-items-center">
                                <a className="nav-link text-body p-0" onClick={onMiniSidenav}>
                                    <FontAwesomeIcon icon={faBars} />
                                </a>
                            </li>
                            <li className="nav-item ps-3 d-flex align-items-center">
                                <a href="#" className="nav-link text-body p-0" onClick={onConfiguratorOpen}>
                                    <FontAwesomeIcon icon={faGear} />
                                </a>
                            </li>
                            {/* <NavDropdown
                id="notificationsMenu"
                title={ <span className="text-body"><FontAwesomeIcon icon={ faBell } /></span> }
                >
                <NavDropdown.Item>
                    <div className="d-flex py-1">
                    <div className="my-auto mx-2">
                        <div className="icon icon-sm icon-shape bg-gradient-primary shadow border-radius-md d-flex align-items-center justify-content-center">
                        <FontAwesomeIcon icon={ faUserCircle } size="lg" className="opacity-10 text-white" aria-hidden="true" />
                        </div>
                    </div>
                    <div className="d-flex flex-column justify-content-center">
                        <h6 className="text-sm font-weight-normal mb-1">
                        <span className="font-weight-bold">New audit prospect </span>
                        by adrian.casillas
                        </h6>
                        <p className="text-xs text-secondary mb-0">
                        <FontAwesomeIcon icon={ faClock } className="me-1" />
                        18 minutes ago
                        </p>
                    </div>
                    </div>
                </NavDropdown.Item>
                <NavDropdown.Item>
                    <div className="d-flex py-1">
                    <div className="my-auto mx-2">
                        <div className="icon icon-sm icon-shape bg-gradient-info shadow border-radius-md d-flex align-items-center justify-content-center">
                        <FontAwesomeIcon icon={ faFile } size="lg" className="opacity-10 text-white" aria-hidden="true" />
                        </div>
                    </div>
                    <div className="d-flex flex-column justify-content-center">
                        <h6 className="text-sm font-weight-normal mb-1">
                        <span className="font-weight-bold">Audit 9k closed </span>
                        by Pame
                        </h6>
                        <p className="text-xs text-secondary mb-0">
                        <FontAwesomeIcon icon={ faClock } className="me-1" />
                        1 day
                        </p>
                    </div>
                    </div>
                </NavDropdown.Item>
                </NavDropdown> */}
                        </ul>
                    </div>
                </div>
            </nav>
            <ChangePwdModal show={showChangePwd} onHide={onChangePwdClose} />
        </>
    )
}

export default DashboardNavbar;