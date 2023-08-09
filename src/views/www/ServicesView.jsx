import BasicLayout from "../../layouts/basic/BasicLayout";

import { Card, Col, Container, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFaceSmile } from "@fortawesome/free-solid-svg-icons";

import ServicesCard from "./components/ServicesCard";

import imgPeopleAtWork from '../../assets/img/people-at-work-first-plane.jpg';
import imgCertified9001 from '../../assets/img/9001-Certified Management System.png';
import imgCertified14001 from '../../assets/img/14001-Certified Management System.png';
import imgCertified22000 from '../../assets/img/22000-Certified Management System.png';
import imgCertified45001 from '../../assets/img/45001-Certified Management System.png';

export const ServicesView = () => {
  return (
    <BasicLayout>
      <header>
        <div className="page-header min-vh-25 relative" style={{ backgroundImage: `url(${ imgPeopleAtWork })`}}>
          <span className="mask bg-gradient-warning"></span>
          <Container>
            <Row>
              <Col lg="7" className="text-center mx-auto">
                <h1 className="text-white pt-5">Certification Services</h1>
              </Col>
            </Row>
          </Container>
        </div>
      </header>
      <section className="my-5 py-5">
        <Container>
          <Row>
            <Col lg="4">
              <ServicesCard
                title="ISO 45001:2018"
                subtitle="HEALTH AND SAFETY MANAGEMENT SYSTEM"
                desc="About tan 6,300 person diez per month because of accidents or health because of work activities."
                image={ imgCertified45001 }
              >
                <p>Lorem ipsum</p>
              </ServicesCard>
            </Col>
            <Col lg="4">
              <ServicesCard
                title="ISO 14001:2015"
                subtitle="ENVIRONMENTAL MANAGEMENT SYSTEM"
                desc="Environmental is always a concern when Organization have preventive pollution and environmental protection compromise."
                image={ imgCertified14001 }
              >
                <p>Lorem ipsum</p>
              </ServicesCard>
            </Col>
            <Col lg="4">
              <ServicesCard
                title="ISO 27001:2013"
                subtitle="INFORMATION SECURITY MANAGEMENT SYSTEM"
                desc="The application of these family estándar helps to the Organizations to manage the information security for all Information resources..."
                
              >
                <p>Lorem ipsum</p>
              </ServicesCard>
            </Col>
          </Row>
        </Container>

      </section>
    </BasicLayout>
  )
}

export default ServicesView;
