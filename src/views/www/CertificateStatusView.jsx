import React from 'react'
import BasicLayout from '../../layouts/basic/BasicLayout';
import { Col, Container, Row } from 'react-bootstrap';

import imgWhyUs from '../../assets/img/why-us.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';

export const CertificateStatusView = () => {
  return (
    <BasicLayout>
      <header>
        <div className="page-header min-vh-25 relative" style={{ backgroundImage: `url(${ imgWhyUs })`}}>
          <span className="mask bg-gradient-ari"></span>
          <Container>
            <Row>
              <Col lg="7" className="text-center mx-auto">
                <h1 className="text-white text-shadow pt-5">Certificate Status</h1>
              </Col>
            </Row>
          </Container>
        </div>
      </header>
      <section className="my-5 pt-5">
        <Container>
          <Row>
            <Col md="6" className="ms-auto mx-auto text-center">
              <h3 className="text-ari text-gradient mb-4">If you require information from a certification issued by ARI</h3>
              <p className="lead">
                <FontAwesomeIcon icon={ faEnvelope } className="me-2" />
                Send an email to <a href="mailto:sales@aarrin.com">sales@aarrin.com</a>
              </p>
              <p className="lead">
                <FontAwesomeIcon icon={ faPhone } className="me-2" />
                Call the phone number <a href="tel:3330442083">(52) 333 044 2083</a></p>
            </Col>
          </Row>
        </Container>
      </section>
    </BasicLayout>
  )
}

export default CertificateStatusView;