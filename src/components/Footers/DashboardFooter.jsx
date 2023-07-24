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
                Desarrollado por <strong>Tecnologías de la Información</strong> - Área de Gobierno Electrónico
              </div>
            </Col>
            <Col lg="6">
              <ul className="nav nav-footer justify-content-center justify-content-lg-end">
                <li className="nav-item">
                  <Link to="/home" className="nav-link text-muted">
                    Inicio
                  </Link>
                  {/* <a className="nav-link text-muted" href="/home">
                    Inicio
                  </a> */}
                </li>
                <li className="nav-item">
                  <Link to="/about" className="nav-link text-muted">
                    Acerca de 
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