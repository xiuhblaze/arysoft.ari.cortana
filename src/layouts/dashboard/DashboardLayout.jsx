import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { setLayout, useArysoftUIController } from "../../context/context";
import { Configurator } from "../../components/Configurator";

import { Sidenav } from "../../components/Sidenav";
import { DashboardNavbar } from "../../components/DashboardNavbar";
import { DashboardFooter } from "../../components/Footers";

import privateRoute from "../../routes/privateRoutes";

<<<<<<< HEAD
import lgoARINavbar from '../../assets/img/lgoARINavbar.png';
import { Configurator } from "../../components/Configurator";
import { DashboardNavbar } from "../../components/DashboardNavbar";
import privateRoute from "../../routes/privateRoutes";
import { DashboardFooter } from "../../components/Footers";
=======
import escudoArmas from '../../assets/img/lgoEscudoArmas.png';
>>>>>>> bac6da10390ddfe9f09ac177ed557df13fa6646b

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
        <DashboardFooter />
      </main>
      <Configurator help={ help } />
    </>
  )
}

export default DashboardLayout;
