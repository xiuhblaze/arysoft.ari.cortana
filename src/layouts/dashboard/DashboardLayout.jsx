import { useLocation } from "react-router-dom";
import { Sidenav } from "../../components/Sidenav";
import { setLayout, useArysoftUIController } from "../../context/context";
import { useEffect } from "react";

import escudoArmas from '../../assets/img/lgoEscudoArmas.png';
import { Configurator } from "../../components/Configurator";
import { DashboardNavbar } from "../../components/DashboardNavbar";
import privateRoute from "../../routes/privateRoutes";
import { Col, Container, Row } from "react-bootstrap";

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
        brand={ escudoArmas }
        brandName="Zapotlan Dashboard"
        routes={ privateRoute }
      />
      <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg">
        <DashboardNavbar />
        <div className="container-fluid py-4">
          { children }
        </div>
        <footer className="footer pt-3">
          <Container fluid>
            <Row className="align-items-center justify-content-lg-between">
              <Col lg="6" className="mb-lg-0 mb-4">
                <div className="copyright text-center text-sm text-muted text-lg-start">
                  Desarrollado por <strong>Tecnologías de la Información</strong> - Gobierno Electrónico
                </div>
              </Col>
            </Row>
          </Container>
        </footer>
      </main>
      <Configurator help={ help } />
    </>
  )
}

export default DashboardLayout;
