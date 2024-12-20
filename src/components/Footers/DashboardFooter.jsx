
import { faCopyright } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Container, Row } from "react-bootstrap"
import { Link } from "react-router-dom"

export const DashboardFooter = () => {
  return (
    <Container fluid className="pb-4">
      <footer className="footer">
        <Container fluid>
          <Row className="align-items-center justify-content-lg-between">
            <Col lg="6" className="mb-lg-0 mb-4">
              <div className="copyright text-center text-sm text-muted text-lg-start">
                <FontAwesomeIcon icon={ faCopyright } className="me-1" />
                2024, all rights reserved
                <span className="text-info text-gradient"> ARI - American Registration Inc.</span>
              </div>
            </Col>
            <Col lg="6">
              <ul className="nav nav-footer justify-content-center justify-content-lg-end">
                <li className="nav-item">
                  <Link to="/home" className="nav-link text-muted">
                    Home
                  </Link>
                  {/* <a className="nav-link text-muted" href="/home">
                    Inicio
                  </a> */}
                </li>
                <li className="nav-item">
                  <Link to="/contact" className="nav-link text-muted">
                    Contact
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/about" className="nav-link text-muted">
                    About Us
                  </Link>
                </li>
              </ul>
            </Col>
          </Row>
        </Container>
      </footer>
    </Container>
  )
}

export default DashboardFooter;