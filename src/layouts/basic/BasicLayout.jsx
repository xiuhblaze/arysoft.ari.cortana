import React from 'react'
import { DefaultNavbar } from '../../components/DefaultNavbar';
import { Col, Container, Row } from 'react-bootstrap';

export const BasicLayout = ({children}) => {
  return (
    <>
      <DefaultNavbar />
      <main className="main-content mt-0 ps">
        { children }
      </main>
      <footer className="footer py-5">
        <Container>
          <Row>
            <Col lg="8" className="mb-4 mx-auto text-center">
              <a href="#" className="text-secondary me-xl-5 me-3 mb-sm-0 mb-2">
                Tecnologías de la Información
              </a>
              <a href="#" className="text-secondary me-xl-5 me-3 mb-sm-0 mb-2">
                Acerca de
              </a>
            </Col>
          </Row>
          <Row>
            <Col lg="8" className="mx-auto text-center mt-1">
              <p className="mb-0 text-secondary">
                Desarrollado por Tecnologías de la Información - Gobierno Electrónico
              </p>
            </Col>
          </Row>
        </Container>
      </footer>
    </>
  )
}

export default BasicLayout;