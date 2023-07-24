import React from 'react'
import { DefaultNavbar } from '../../components/DefaultNavbar';
import { Col, Container, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopyright } from '@fortawesome/free-regular-svg-icons';
import { Link } from 'react-router-dom';

export const BasicLayout = ({children}) => {
  return (
    <>
      <DefaultNavbar />
      <main className="main-content mt-0 ps">
        { children }
      </main>
      <footer className="footer py-5">
        <hr className="horizontal dark mb-5" />
        <Container>
          <Row>
            <Col lg="8" className="mb-4 mx-auto text-center">
              <a 
                href="http://ciudadguzman.gob.mx/Pagina.aspx?id=02674cee-df75-4309-8802-459dade93fbf" 
                className="text-secondary me-xl-5 me-3 mb-sm-0 mb-2"
                target="_blank"
              >
                Tecnologías de la Información
              </a>
              <Link to="/about" className="text-secondary me-xl-5 me-3 mb-sm-0 mb-2">
                Acerca de
              </Link>
            </Col>
          </Row>
          <Row>
            <Col lg="8" className="mx-auto text-center mt-1">
              <p className="mb-0 text-secondary">
                <FontAwesomeIcon icon={ faCopyright } className="me-1" />
                2023, desarrollado por <strong>Tecnologías de la Información</strong> - Área de Gobierno Electrónico
              </p>
            </Col>
          </Row>
        </Container>
      </footer>
    </>
  )
}

export default BasicLayout;