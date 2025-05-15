import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { setLayout, useArysoftUIController } from "../../context/context";
import { Configurator } from "../../components/Configurator";

import { Sidenav } from "../../components/Sidenav";
import { DashboardNavbar } from "../../components/DashboardNavbar";
import { DashboardFooter } from "../../components/Footers";

import privateRoute from "../../routes/privateRoutes";

import lgoARINavbar from '../../assets/img/lgoARINavbar.png';

export const DashboardLayout = ({ help = null, children }) => {
  const [ controller, dispatch ] = useArysoftUIController();
  const { miniSidenav } = controller;
  const { pathname } = useLocation();

  useEffect(() => {
    setLayout(dispatch, 'dashboard');
  }, [pathname]);
  
  return (
    <>
      <Sidenav
        brand={ lgoARINavbar }
        brandName="American Registration"
        routes={ privateRoute }
      />
      <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg">
        <DashboardNavbar />
        { children }
        {/* <DashboardFooter /> */}
      </main>
      <Configurator help={ help } />
    </>
  )
}

export default DashboardLayout;
