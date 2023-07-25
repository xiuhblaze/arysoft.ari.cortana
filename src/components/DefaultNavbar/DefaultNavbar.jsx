import { faBars, faChartPie, faRightFromBracket, faRightToBracket, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Container, Nav, Navbar, Row } from "react-bootstrap";

import escudoArmas from '../../assets/img/lgoEscudoArmas.png';
import { useAuthStore } from "../../hooks/useAuthStore";
import { Link } from "react-router-dom";

export const DefaultNavbar = () => {

  const {
    status,
    user,
    logout,
  } = useAuthStore();

  const onLogout = () => {
    logout();
  };

  return (
    <Container className="position-sticky z-index-sticky top-0">
      <Row>
        <Col>
          <Navbar expand="lg" className="blur blur-rounded top-0 z-index-3 shadow position-absolute my-3 py-2 start-0 end-0 mx-4">
            <Container fluid className="pe-0">
              <Link to="/" className="navbar-brand font-weight-bolder ms-lg-0 ms-3 d-flex align-items-center">
                <img src={ escudoArmas } alt="" className="d-inline-block align-top me-3" height="32" />
                Zapotlán Admin
              </Link>
              <Navbar.Toggle aria-controls="navbarScroll">
                <FontAwesomeIcon icon={ faBars } />
              </Navbar.Toggle>
              <Navbar.Collapse id="navbarScroll">
                <Nav className="mx-auto">
                  { status === 'authenticated' ? (
                    <>
                      <Link to="/dashboard" className="nav-link d-flex align-items-center me-2" >
                        <FontAwesomeIcon icon={ faChartPie } className="opacity-6 text-dark me-1" />
                        Dashboard
                      </Link>
                      {/* <Link to="/perfil" className="nav-link d-flex align-items-center me-2">
                        <FontAwesomeIcon icon={ faUser } className="opacity-6 text-dark me-1" />
                        Perfil
                      </Link> */}
                    </>
                  ) : null }
                  <Nav.Link href="/about" className="d-flex align-items-center me-2">
                    About Us
                  </Nav.Link>
                  <Nav.Link href="/" className="d-flex align-items-center me-2">
                    Services
                  </Nav.Link>
                  <Nav.Link href="/" className="d-flex align-items-center me-2">
                    Steps for Certification
                  </Nav.Link>
                  <Nav.Link href="/" className="d-flex align-items-center me-2">
                    News
                  </Nav.Link>
                </Nav>
                <Nav>
                <Nav.Link href="/" className="d-flex align-items-center me-2">
                    Contact Us
                  </Nav.Link>
                {
                  status === 'not-authenticated' ? (
                    <Link to="/login" className="nav-link">
                      <FontAwesomeIcon icon={ faRightToBracket } className="opacity-6 text-dark me-1" />
                      Iniciar sesión
                    </Link>
                  ) : (
                    <Nav.Link onClick={ onLogout }>
                      <FontAwesomeIcon icon={ faRightFromBracket } className="opacity-6 text-dark me-1" />
                      Cerrar sesión
                    </Nav.Link>
                  )
                }
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </Col>
      </Row>
    </Container>
  )
}

export default DefaultNavbar;
