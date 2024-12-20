import React from 'react'
import BasicLayout from '../../layouts/basic/BasicLayout';

import { Col, Container, Row } from 'react-bootstrap';

import imgPeopleWork from '../../assets/img/people-at-work-first-plane.jpg';
import lgoAnabIafAri from '../../assets/img/lgoAnabIafAri.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

export const AccreditationView = () => {
  return (
    <BasicLayout>
      <header>
        <div className="page-header min-vh-25 relative" style={{ backgroundImage: `url(${ imgPeopleWork })` }}>
          <span className="mask bg-gradient-success"></span>
          <Container>
            <Row>
              <Col lg="7" className="text-center mx-auto">
                <h1 className="text-white text-shadow pt-5">Accreditation Certificate</h1>
                {/* <p className="lead text-white text-shadow mt-3">
                  The most important asset is the people. That is the reason because ARI has the commitment for
                </p> */}
              </Col>
            </Row>
          </Container>
        </div>
      </header>
      <section className="my-5">
        <Container>
          <Row>
            <Col md="7" className="my-auto">
              <h3 className="text-gradient text-success mb-0">
                Accreditation Certificate Number: MS-5965
              </h3>
              <h5>
                For more information consult: &nbsp;
                <a href="https://anab.ansi.org/management-systems-accreditation/certification-bodies" target="_blank" className="text-ari">
                  anab.ansi.org
                </a>
              </h5>
              <p className="pe-md-5 mb-4">
                Organizations that recognize the benefits of implementing management systems often seek 
                independent verification of conformance to standards by third-party certification bodies 
                (CBs). Accreditation by a recognized and respected body such as ANAB ensures the impartiality 
                and competence of the CB and fosters confidence and acceptance of the CB´s certifications by 
                end users in the public and private sectors. ANAB assesses and accredits management systems 
                CBs that demonstrate competence to audit and certify organizations and conform with 
                ISO/IEC 17021-1, the international standard for CBs.
              </p>
              <h4>CB Directory</h4>
              <ul>
                <li>ISO 9001:2015</li>
                <li>ISO 14001:2015</li>
                <li>ISO 22000:2018</li>
                <li>ISO 45001:2018</li>
              </ul>
              <p>
                For more information consult:&nbsp;
                <a href="https://anabdirectory.remoteauditor.com/" className="icon-move-right">
                  ANAB CB Directory
                  <FontAwesomeIcon icon={ faArrowRight } className="ms-1" />
                </a>
              </p>
            </Col>
            <Col md="5" className="my-auto">
              <img src={ lgoAnabIafAri } alt="" className="w-100 border-radius-lg shadow-lg" />
            </Col>
          </Row>
        </Container>
      </section>
    </BasicLayout>
  )
}

export default AccreditationView;