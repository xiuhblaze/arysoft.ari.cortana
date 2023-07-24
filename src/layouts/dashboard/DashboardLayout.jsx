import { Link, useLocation } from "react-router-dom";
import { Sidenav } from "../../components/Sidenav";
import { setLayout, useArysoftUIController } from "../../context/context";
import { useEffect } from "react";

import escudoArmas from '../../assets/img/lgoEscudoArmas.png';
import { Configurator } from "../../components/Configurator";
import { DashboardNavbar } from "../../components/DashboardNavbar";
import privateRoute from "../../routes/privateRoutes";
import { Col, Container, Nav, Row } from "react-bootstrap";
import { DashboardFooter } from "../../components/Footers";

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
        { children }
        <DashboardFooter />
        {/* <div className="container-fluid py-3">
        
        <footer className="footer pt-3">
          <Container fluid>
            <Row className="align-items-center justify-content-lg-between">
              <Col lg="6" className="mb-lg-0 mb-4">
                <div className="copyright text-center text-sm text-muted text-lg-start">
                  Desarrollado por <strong>Tecnologías de la Información</strong> - Área de Gobierno Electrónico
                </div>
              </Col>
              <Col lg="6">
                {/* <Nav className="nav-footer justify-content-center justify-content-lg-end">
                  <Nav.Item href="/home">Inicio</Nav.Item>
                  <Nav.Item>Tecnologías de la Información</Nav.Item>
                  <Nav.Item>Acerca de</Nav.Item>                  
                </Nav> */}
                {/* <ul className="nav nav-footer justify-content-center justify-content-lg-end">
                  <li className="nav-item">
                    <Link to="/home" className="nav-link text-muted">
                      Inicio
                    </Link> */}
                    {/* <a className="nav-link text-muted" href="/home">
                      Inicio
                    </a> */}
                  {/* </li>
                  <li className="nav-item">
                    <Link to="/about" className="nav-link text-muted">
                      Acerca de 
                    </Link> */}
                    {/* <a className="nav-link text-muted" href="/about">
                      Acerca de
                    </a> */}
                  {/* </li>
                </ul>
              </Col>
            </Row>
          </Container>
        </footer>
        </div> */}
      </main>
      <Configurator help={ help } />
    </>
  )
}

export default DashboardLayout;
