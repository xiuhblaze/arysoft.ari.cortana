import React from 'react'
import BasicLayout from '../../layouts/basic/BasicLayout';
import { Col, Container, Row } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faHand, faShoePrints } from '@fortawesome/free-solid-svg-icons';
import StepsTimeline from './components/StepsTimeline';

import imgPeopleSteps from '../../assets/img/people-steps.jpg'
import imgAuditCertification from '../../assets/img/ari-audit-certification-process.jpg';

const TypicalProcess = () => {
  return (
    <>
      <ol>
        <li>Contact ARI sales representative</li>
        <li>Fillout the Application Form, with basic information to quote
          <ul>
            <li>Quality</li>
            <li>Environmental</li>
            <li>Food Safety</li>
          </ul>
        </li>
        <li>ARI will provide you with a Proposal for Certificatio Services</li>
        <li>Ones approved the Proposal, will signed the Certification Agreement</li>
        <li>Tipical process flow is as follow:</li>
      </ol>
      <Row>
        <Col lg="12">
          <a href={ imgAuditCertification } target="_blank" title="Open in new tab">
            <img src={ imgAuditCertification } alt=""  className="img-fluid" />
          </a>
        </Col>
      </Row>
    </>
  )
};

export const StepsView = () => {
  return (
    <BasicLayout>
      <header>
        <div className="page-header min-vh-25 relative" style={{ backgroundImage: `url(${ imgPeopleSteps })`}}>
          <span className="mask bg-gradient-primary"></span>
          <Container>
            <Row>
              <Col lg="7" className="text-center mx-auto">
                <h1 className="text-white text-shadow pt-5">Steps for Certification</h1>
              </Col>
            </Row>
          </Container>
        </div>
      </header>
      <section className="my-5 pt-5">
        <Container>
          <Row>
            <Col md="6" className="mx-auto">
              <div className="timeline timeline-one-side">
                <StepsTimeline
                  icon={{ icon: faShoePrints, color: 'success' }}
                  text='Typical Process Flow for audit and certification process'
                  subtext='Rev A ARI-FR-67'
                >
                  <TypicalProcess />
                </StepsTimeline>
                
                <div className="timeline-block mb-3">
                  <span className="timeline-step">
                    <FontAwesomeIcon icon={ faHand } className='text-warning text-gradient' />
                  </span>
                  <div className="timeline-content">
                    <h6 className="text-dark text-sm font-weight-bold mb-0">Suspending Certification flow proces</h6>
                    <p className="text-secondary font-weight-bold text-xs mt-1 mb-0">Rev A ARI-FR-67</p>
                  </div>
                </div>
                <div className="timeline-block mb-3">
                  <span className="timeline-step">
                    <i className="ni ni-cart text-info text-gradient"></i>
                  </span>
                  <div className="timeline-content">
                    <h6 className="text-dark text-sm font-weight-bold mb-0">Reducing Scope flow process</h6>
                    <p className="text-secondary font-weight-bold text-xs mt-1 mb-0">21 DEC 9:34 PM</p>
                  </div>
                </div>
                <div className="timeline-block mb-3">
                  <span className="timeline-step">
                    <i className="ni ni-credit-card text-warning text-gradient"></i>
                  </span>
                  <div className="timeline-content">
                    <h6 className="text-dark text-sm font-weight-bold mb-0">Short Notice flow process</h6>
                    <p className="text-secondary font-weight-bold text-xs mt-1 mb-0">20 DEC 2:20 AM</p>
                  </div>
                </div>
                <div className="timeline-block mb-3">
                  <span className="timeline-step">
                    <i className="ni ni-key-25 text-primary text-gradient"></i>
                  </span>
                  <div className="timeline-content">
                    <h6 className="text-dark text-sm font-weight-bold mb-0">Information Upon Request flow process</h6>
                    <p className="text-secondary font-weight-bold text-xs mt-1 mb-0">18 DEC 4:54 AM</p>
                  </div>
                </div>
                <div className="timeline-block">
                  <span className="timeline-step">
                    <i className="ni ni-money-coins text-dark text-gradient"></i>
                  </span>
                  <div className="timeline-content">
                    <h6 className="text-dark text-sm font-weight-bold mb-0">CERTIFICATE RESTORATION</h6>
                    <p className="text-secondary font-weight-bold text-xs mt-1 mb-0">17 DEC</p>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </BasicLayout>
  )
}

export default StepsView;
