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

const Iso45001Content = () => {
  return (
    <>
      <p>
        About tan 6,300 person diez per month because of accidents or health because of work activities.
      </p>
      <p>
        These accidents and health sickness because of work activities is really important for the employees 
        and more important for the organization, because of the productivity, pensions, absenteeism, 
        rotation, accident payment and other related with accidents.
      </p>
      <p>
        To avoid the problem, ISO has develop the new estándar ISO 45001:2018 Health an Safety Management System, 
        based on the recognized OHSAS 18001. These standards has the specific requirements to identify potential 
        safety and health risks and to improve the organization performance, reducing to he acceptable levels the 
        probability of accidents and improving the work environment, requested by the Quality Standards.
      </p>
      <h4>Benefits</h4>
      <ul>
        <li>Prevention in: Insurances</li>
        <li>Lost human life: Absenteeism and Rotation</li>
        <li>Disability payments: Productivity</li>
      </ul>
    </>
  );
};

const Iso14001Content = () => {
  return (
    <>
      <p>
        Environmental is always a concern when Organization have preventive pollution and environmental 
        protection compromise.
      </p>
      <p>
        ISO 14001:2015 and the ISO 14000 family, such as standard ISO 14006 are focus on Environmental 
        systems to achieve the Environmental protection objectives.
      </p>
      <p>
        ISO 14001:2015 helps to the Organizations to improve their Environmental performance, by promoting 
        the efficiency on the use of resources, waste reduction and as consequence, the operation cost 
        reduction and third parties confident.
      </p>
      <h4>Benefits</h4>
      <ul>
        <li>Waste reduction</li>
        <li>Use of Energy reduction (Gas, fuels, Electricity)</li>
        <li>Legal compliance and penalties prevention.</li>
      </ul>
    </>
  );
};

const Iso27001Content = () => {
  return (
    <>
      <p>
        The application of these family estándar helps to the Organizations to manage the information 
        security for all Information resources, such as Financial Information, Intellectual property, 
        employees details or any other third party information under your responsibility.
      </p>
      <p>
        The ISMS has a simple systematic approach for the information Management System to protect the 
        information confidentiality.
      </p>
      <p>
        The information protection includes the process to control information used by employees, processes, 
        and any other technology.
      </p>
      <p>
        This estándar can helps to small to big Companies to manage their information resources to protect 
        the information confidentiality.
      </p>
      <h4>Benefits</h4>
      <h6>Prevention</h6>
      <ul>
        <li>Client information lost</li>
        <li>Losses of financial information</li>
        <li>Organization sensitive information lost</li>
        <li>Hardware and Software management</li>
      </ul>
    </>
  );
};

const Iso22000Content = () => {
  return (
    <>
      <p>
        Is focused to guarantee the effective implementation on controls to prevent that the food can harm 
        customer during the Hazard Analysis based on Alimentarius CODEX to identify Hazard: Physical, 
        Chemical, Biological, Radiological.
      </p>
      <p>
        The consequences of unsafe food can be serious and ISO´s food safety management standards help 
        organizations identify and control food safety hazards. As many of today’s food products repeatedly 
        cross national boundaries, International Standards are needed to ensure the safety of the global 
        food supply chain.
      </p>
      <h4>Benefits</h4>
      <h6>Prevention in</h6>
      <ul>
        <li>Serious harm to customer health</li>
        <li>Complains or legals persecution</li>
        <li>Recall associated cost</li>
        <li>Rework and scrap reduction</li>
      </ul>
    </>
  );
};

const Iso9001Content = () => {
  return (
    <>
      <p>
        This standard provides orientation and tolos to those Companies and Organisations who want to assure 
        quality in their products and services. The new High Level Structure on ISO 9001, includes the 
        orientation to Client requirements, but also focus on Stakeholders such as the Company itself.
      </p>
      <p>
        This new versión try to balance the Quality principles, Client Satisfaction with the expectation from 
        the Top Managements and Business perspective; and how the can be reach the results based on Risk 
        Management approach.
      </p>
      <h4>Benefits</h4>
      <p>
        Risk evaluation for Product or Service requirements, increasing the Client Satisfaction and 
        Stakeholders satisfaction.
      </p>
      <ul>
        <li>Process approach: Continuous improvement</li>
        <li>Business approach: Productivity</li>
        <li>KPI's focus on results: Cost reduction</li>
        <li>Rework</li>
        <li>Client complaint, non conformity product</li>
        <li>Process environment</li>
      </ul>
    </>
  );
};

const GlobalMarkets = () => {
  return (
    <>
      <p>
        It is a program designed for small and medium-sized companies that wish to enter Continuous 
        Improvement processes in Food Safety and as a consequence, the certification of their processes.
      </p>
      <p>
        GFSI has developed a solution for this: the GLOBAL MARKETS Program as "The Path to Global Market 
        Access and Certification". The GLOBAL MARKETS Program is a voluntary access system designed as a 
        non-accredited, non-certified evaluation process.
      </p>
      <p>
        The scope defined by GFSI is limited to Primary Production in the field such as Food and Ingredient 
        Production and focuses on supplier development as a basis for the implementation of good 
        manufacturing practices and good agricultural practices. This does not limit that the evaluations 
        can be extended to other sectors such as: Food Packaging, Transportation and Storage, Restaurants, 
        among others.
      </p>
    </>
  )
};

export const ServicesView = () => {
  return (
    <BasicLayout>
      <header>
        <div className="page-header min-vh-25 relative" style={{ backgroundImage: `url(${ imgPeopleAtWork })`}}>
          <span className="mask bg-gradient-warning"></span>
          <Container>
            <Row>
              <Col lg="7" className="text-center mx-auto">
                <h1 className="text-white text-shadow pt-5">Certification Services</h1>
              </Col>
            </Row>
          </Container>
        </div>
      </header>
      <section className="my-5 pt-5">
        <Container>
          <Row>
            <Col lg="4" className="mb-4">
              <ServicesCard
                title="ISO 45001:2018"
                subtitle="HEALTH AND SAFETY MANAGEMENT SYSTEM"
                accredited={ true }
                desc="About tan 6,300 person diez per month because of accidents or health because of work activities."
                image={ imgCertified45001 }
              >
                <Iso45001Content />
              </ServicesCard>
            </Col>
            <Col lg="4" className="mb-4">
              <ServicesCard
                title="ISO 14001:2015"
                subtitle="ENVIRONMENTAL MANAGEMENT SYSTEM"
                accredited={ true }
                desc="Environmental is always a concern when Organization have preventive pollution and environmental protection compromise."
                image={ imgCertified14001 }
              >
                <Iso14001Content />
              </ServicesCard>
            </Col>
            <Col lg="4" className="mb-4">
              <ServicesCard
                title="ISO 27001:2013"
                subtitle="INFORMATION SECURITY MANAGEMENT SYSTEM"
                accredited={ false }
                desc="The application of these family estándar helps to the Organizations to manage the information security for all Information resources..."
              >
                <Iso27001Content />
              </ServicesCard>
            </Col>
            <Col lg="4" className="mb-4">
              <ServicesCard
                title="ISO 22000:2018"
                subtitle="FOOD SAFETY MANAGEMENT SYSTEM"
                accredited={ true }
                desc="Is focused to guarantee the effective implementation on controls to prevent that the food can harm customer during the Hazard Analysis..."
                image={ imgCertified22000 }
              >
                <Iso22000Content />
              </ServicesCard>
            </Col>
            <Col lg="4" className="mb-4">
              <ServicesCard
                title="ISO 9001:2015"
                subtitle="QUALITY MANAGEMENT SYSTEM"
                accredited={ true }
                desc="This standard provides orientation and tolos to those Companies and Organisations who want to assure quality in their products and services..."
                image={ imgCertified9001 }
              >
                <Iso9001Content />
              </ServicesCard>
            </Col>
            <Col lg="4" className="mb-4">
              <ServicesCard
                title="Global Markets"
                accredited={ false }
                desc="It is a program designed for small and medium-sized companies that wish to enter Continuous Improvement..."
              >
                <GlobalMarkets />
              </ServicesCard>
            </Col>
          </Row>
        </Container>

      </section>
    </BasicLayout>
  )
}

export default ServicesView;
