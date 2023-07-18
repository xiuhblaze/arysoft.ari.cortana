import { useLocation } from "react-router-dom";
import { Sidenav } from "../../components/Sidenav";
import { setLayout, useArysoftUIController } from "../../context/context";
import { useEffect } from "react";
import { Navbar } from "../../components/Navbar";
import publicRoute from "../../routes/publicRoutes";

import escudoArmas from '../../assets/img/lgoEscudoArmas.png';

export const DashboardLayout = ({children}) => {
  const [ controller, dispatch ] = useArysoftUIController();
  const { miniSidenav } = controller;
  const { pathname } = useLocation();

  useEffect(() => {
    setLayout(dispatch, 'dashboard');
  }, [pathname]);
  
  return (
    <>
      <Sidenav
        brand={ escudoArmas }
        brandName="Zapotlan Dashboard"
        routes={ publicRoute }
      />
      <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg">
        <Navbar />
        <div className="container-fluid py-4">
          { children }
        </div>
      </main>
    </>
  )
}

export default DashboardLayout;
