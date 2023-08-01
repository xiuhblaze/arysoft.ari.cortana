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
              <Link to="/contact"                
                className="text-secondary me-xl-5 me-3 mb-sm-0 mb-2"
              >
                Contact Us
              </Link>
              <Link to="/about" className="text-secondary me-xl-5 me-3 mb-sm-0 mb-2">
                About Us
              </Link>
            </Col>
          </Row>
          <Row>
            <Col lg="8" className="mx-auto text-center mt-1">
              <p className="mb-0 text-secondary">
                <FontAwesomeIcon icon={ faCopyright } className="me-1" />
                2023, dev by <strong>Arysoft</strong> for <span className="text-primary text-primary">ARI American Registration Inc.</span>
              </p>
            </Col>
          </Row>
        </Container>
      </footer>
    </>
  )
}

export default BasicLayout;