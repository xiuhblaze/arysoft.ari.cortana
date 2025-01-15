import { Link } from "react-router-dom";

import { faBars, faCertificate, faChartPie, faCircleCheck, faEnvelope, faFileCircleCheck, faFileSignature, faList, faListCheck, faNewspaper, faRectangleList, faRightFromBracket, faRightToBracket, faShoePrints, faUser, faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Container, Nav, NavDropdown, Navbar, Row } from "react-bootstrap";

import { useAuthStore } from "../../hooks/useAuthStore";

import lgoARINavbar from '../../assets/img/lgoARINavbar.png';
import lgoLictus from '../../assets/img/lgoLictus.png';

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
          <Navbar expand="lg" variant="transparent" className="blur blur-rounded top-0 z-index-3 transparent shadow position-absolute my-3 py-2 start-0 end-0 mx-4">
            <Container fluid className="pe-0">
              <Link to="/" className="navbar-brand font-weight-bolder ms-lg-0 ms-3 d-flex align-items-center">
                <img src={ lgoARINavbar } alt="" className="d-inline-block align-top me-3" height="32" />
                {/* American Registration Inc */}
              </Link>
              <Navbar.Toggle aria-controls="navbarScroll">
                <FontAwesomeIcon icon={ faBars } />
              </Navbar.Toggle>
              <Navbar.Collapse id="navbarScroll">
                <Nav className="mx-auto">
                  {/* <Link to="/about" className="nav-link text-dark d-flex align-items-center me-2">
                    <FontAwesomeIcon icon={ faUserGroup } className="opacity-6 text-dark me-1" />
                    About Us
                  </Link>
                  <Link to="/services" className="nav-link text-dark d-flex align-items-center me-2">
                    <FontAwesomeIcon icon={ faFileSignature } className="opacity-6 text-dark me-1" />
                    Services
                  </Link>
                  <Link to="/steps-for-certification" className="nav-link text-dark d-flex align-items-center me-2">
                  <FontAwesomeIcon icon={ faShoePrints } className="opacity-6 text-dark me-1" />
                    Steps for Certification
                  </Link>
                  <Link to="/news" className="nav-link text-dark d-flex align-items-center me-2">
                    <FontAwesomeIcon icon={ faNewspaper } className="opacity-6 text-dark me-1" />
                    News
                  </Link> */}
                  {/* <NavDropdown 
                    title={ <>
                      <FontAwesomeIcon icon={ faCertificate } className="opacity-6 text-dark me-1" />
                      Certificates
                    </> } 
                    id="certificate-nav-dropdown" 
                    bsPrefix="dropdown-toggle nav-link text-dark"
                  > */}
                    {/* <NavDropdown.Item href="/about">Accreditation Certificate</NavDropdown.Item>
                    <NavDropdown.Item href="/">Certificate Status</NavDropdown.Item> */}
                    {/* <Link to="/accreditation" className="dropdown-item">
                      <FontAwesomeIcon icon={ faCircleCheck } className="opacity-6 text-dark me-2" />
                      Accreditation Certificate
                    </Link>
                    <Link to="/certificate-status" className="dropdown-item">
                      <FontAwesomeIcon icon={ faListCheck } className="opacity-6 text-dark me-2" />
                      Certificate Status
                    </Link> */}
                  {/* </NavDropdown> */}
                  {/* <Nav.Link href="http://www.lictus.com.mx" target="_blank" className="ms-2">
                    <img src={ lgoLictus } height="20" />
                  </Nav.Link>
                  <Nav.Link href="/" className="d-flex align-items-center me-2">
                    Accreditation Certificate
                  </Nav.Link>
                  <Nav.Link href="/" className="d-flex align-items-center me-2">
                    Certificate Status
                  </Nav.Link> */}
                </Nav>
                <Nav>
                  { status === 'authenticated' ? (
                    <>
                      <Link to="/dashboard" className="nav-link text-dark d-flex align-items-center me-2" >
                        <FontAwesomeIcon icon={ faChartPie } className="opacity-6 text-dark me-1" />
                        Dashboard
                      </Link>
                    </>
                  ) : null }
                  {/* <Link to="/contact" className="nav-link text-dark d-flex align-items-center me-2">
                    <FontAwesomeIcon icon={ faEnvelope } className="opacity-6 text-dark me-1" />
                    Contact Us
                  </Link> */}
                {/* {
                  status === 'not-authenticated' ? (
                    <Link to="/login" className="nav-link text-dark">
                      <FontAwesomeIcon icon={ faRightToBracket } className="opacity-6 text-dark me-1" />
                      Login
                    </Link>
                  ) : (
                    <Nav.Link onClick={ onLogout } className="text-dark">
                      <FontAwesomeIcon icon={ faRightFromBracket } className="opacity-6 text-dark me-1" />
                      Logout
                    </Nav.Link>
                  )
                } */}
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
