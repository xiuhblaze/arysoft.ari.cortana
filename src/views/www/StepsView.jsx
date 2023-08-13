import React from 'react'
import BasicLayout from '../../layouts/basic/BasicLayout';
import { Card, Col, Container, Row } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBarsStaggered, faBell, faCertificate, faComment, faDiagramProject, faFilter, faHand, faListCheck, faShoePrints } from '@fortawesome/free-solid-svg-icons';
import StepsTimeline from './components/StepsTimeline';

import imgPeopleSteps from '../../assets/img/people-steps.jpg'
import imgAuditCertification from '../../assets/img/ari-audit-certification-process.jpg';
import imgSuspendingCertification from '../../assets/img/ari-suspending-certification-flow-process.jpg';
import imgReducingScope from '../../assets/img/ari-reducing-scope-flow-process.jpg';
import imgShortNotice from '../../assets/img/ari-short-notice-flow-process.jpg';
import imgInformationUpon from '../../assets/img/ari-information-upon-request-flow-process.jpg';
import imgCertificateRestoration from '../../assets/img/ari-certificate-restoration.jpg';

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

const SuspendingCertification = () => {
  return (
    <Row>
      <Col lg="12">
        <a href={ imgSuspendingCertification } target="_blank" title="Open in new tab">
          <img src={ imgSuspendingCertification } alt="" className="img-fluid" />
        </a>
      </Col>
    </Row>
  )
};

const ReducingScope = () => {
  return (
    <Row>
      <Col lg="12">
        <a href={ imgReducingScope } target="_blank" title="Open in new tab">
          <img src={ imgReducingScope } alt="" className="img-fluid" />
        </a>
      </Col>
    </Row>
  )
};

const ShortNotice = () => {
  return (
    <Row>
      <Col lg="12">
        <a href={ imgShortNotice } target="_blank" title="Open in new tab">
          <img src={ imgShortNotice } alt="" className="img-fluid" />
        </a>
      </Col>
    </Row>
  )
};

const InformationUpon = () => {
  return (
    <Row>
      <Col lg="12">
        <a href={ imgInformationUpon } target="_blank" title="Open in new tab">
          <img src={ imgInformationUpon } alt="" className="img-fluid" />
        </a>
      </Col>
    </Row>
  )
};

const CertificateRestoration = () => {
  return (
    <Row>
      <Col lg="12">
        <a href={ imgCertificateRestoration } target="_blank" title="Open in new tab">
          <img src={ imgCertificateRestoration } alt="" className="img-fluid" />
        </a>
      </Col>
    </Row>
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
            <Col md="6" className="ms-auto">
              <div className="timeline timeline-one-side">
                <StepsTimeline
                  icon={{ icon: faShoePrints, color: 'success' }}
                  text='Typical Process Flow for audit and certification process'
                  subtext='Rev A ARI-FR-67'
                >
                  <TypicalProcess />
                </StepsTimeline>
                <StepsTimeline
                  icon={{ icon: faHand, color: 'secondary' }}
                  text="Suspending Certification flow proces"
                  subtext="Rev A ARI-FR-67"
                >
                  <SuspendingCertification />
                </StepsTimeline>
                <StepsTimeline
                  icon={{ icon: faFilter, color: 'info' }}
                  text="Reducing Scope flow process"
                  subtext="Rev A ARI-FR-67"
                >
                  <ReducingScope />
                </StepsTimeline>
                <StepsTimeline
                  icon={{ icon: faDiagramProject, color: 'primary' }}
                  text="Short Notice flow process"
                  subtext="Rev A ARI-FR-67"
                >
                  <ShortNotice />
                </StepsTimeline>
                <StepsTimeline
                  icon={{ icon: faListCheck, color: 'ari' }}
                  text="Information Upon Request flow process"
                  subtext="Rev A ARI-FR-67"
                >
                  <InformationUpon />
                </StepsTimeline>
                <StepsTimeline
                  icon={{ icon: faCertificate, color: 'warning' }}
                  text="CERTIFICATE RESTORATION"
                  subtext="Rev A ARI-FR-67"
                >
                  <CertificateRestoration />
                </StepsTimeline>
              </div>
            </Col>
            <Col md="3" className="me-auto">
              <Card className="mb-4">
                <Card.Body className="p-3">
                  <h6>Frequently Questions</h6>
                  <p className="text-xs font-weight-bold">
                    Frequently asked questions
                  </p>
                  <a href="/files/ari-faq.pdf" target="_blank" className="btn bg-gradient-primary btn-sm w-100 mb-0">
                    Download
                  </a>
                </Card.Body>
              </Card>
              <Card className="overflow-hidden">
                <span className="mask bg-gradient-primary"></span>
                <Card.Body className="position-relative z-index-1 p-3">
                  <h6 className="text-white">Use of Mark</h6>
                  <p className="text-white text-xs font-weight-bold">
                    Preferences to certifications marks
                  </p>
                  <a href="/files/ari-references-to-certifications-marks.pdf" target="_blank" className="btn btn-white btn-sm w-100 mb-0">
                    Download
                  </a>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </BasicLayout>
  )
}

export default StepsView;
