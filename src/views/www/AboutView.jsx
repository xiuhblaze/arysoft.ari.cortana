
import { Card, Col, Container, ListGroup, Row } from "react-bootstrap";

import BasicLayout from "../../layouts/basic/BasicLayout"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faCertificate,
  faChevronRight,
  faComments,
  faFaceSmile,
  faGavel,
  faGraduationCap,
  faHandHoldingHand,
  faLock,
  faScaleBalanced,
  faShield,
  faStar
} from "@fortawesome/free-solid-svg-icons";

import { InfoCard, InfoHorizontalCard } from "../../components/Cards";

import bgPeople1 from '../../assets/img/bgPeople1.jpg';
import team_1 from '../../assets/img/team-1.jpg';
import team_2 from '../../assets/img/team-2.jpg';
import imgWhyUs from '../../assets/img/why-us.jpg';
import imgPeopleWork from '../../assets/img/people-at-work-first-plane.jpg';


export const AboutView = () => {
  return (
    <BasicLayout>
      <header>
        <div className="page-header min-vh-50 relative" style={{ backgroundImage: `url(${ bgPeople1 })` }}>
          <span className="mask bg-gradient-ari"></span>
          <Container>
            <Row>
              <Col lg="7" className="text-center mx-auto">
                <h1 className="text-white pt-3 mt-n3">About Us</h1>
                <p className="lead text-white text-shadow mt-3">
                  The most important asset is the people. That is the reason because ARI has the commitment for
                </p>
              </Col>
            </Row>
          </Container>
        </div>
      </header>
      <section className="my-5 py-5">
        <Container>
          <Row className="align-items-start">
            <Col lg="8" className="ms-auto">
              <Row className="justify-content-start">
                <Col md="4">
                  <InfoCard
                    title={{ text: 'Service' }}
                    icon={{ icon: faStar, color: 'warning' }}>
                    <p className="text-sm">
                      Because of their function, they must observe a permanent attitude of collaboration, 
                      providing support, friendly guidance to users and other staff itself.
                    </p>
                  </InfoCard>
                </Col>
                <Col md="4">
                  <InfoCard
                    title={{ text: 'Impartiality' }}
                    icon={{ icon: faScaleBalanced, color: 'ari' }}>
                    <p className="text-sm">
                      Being impartial, and being perceived to be impartial, is necessary for a certification 
                      body to deliver certification that provides confidence. It is important that all internal 
                      and external personnel are aware of the need for impartiality. (ISO 17021-1. 4.2).
                    </p>
                  </InfoCard>
                </Col>
                <Col md="4">
                  <InfoCard
                    title={{ text: 'Competence' }}
                    icon={{ icon: faGraduationCap, color: 'primary' }}>
                    <p className="text-sm">
                      Keep competent is always a way to offer a better service and employees must comply with 
                      their duties, aware of the commitment to quality service an organizational standard.
                    </p>
                  </InfoCard>
                </Col>
              </Row>
              <Row className="justify-content-start mt-3">
                <Col md="4" className="mt-3">
                  <InfoCard
                    title={{ text: 'Responsability/Honesty' }}
                    icon={{ icon: faHandHoldingHand, color: 'info' }}>
                    <p className="text-sm">
                      With all the people who have interaction and, in all situations, must behave with
                      responsible and honest in the performance of their duties, it should be addressed 
                      with respect and tolerance for all people.
                    </p>
                  </InfoCard>
                </Col>
                <Col md="4" className="mt-3">
                  <InfoCard
                    title={{ text: 'Oppenes' }}
                    icon={{ icon: faFaceSmile, color: 'success' }}>
                    <p className="text-sm">
                      All involved must understand that different situations can occur during the Certification 
                      activities. That's the reason they has to be open to provide service in accordance with 
                      the international standards and always trying to support clients and interested parties.
                    </p>
                  </InfoCard>
                </Col>
                <Col md="4" className="mt-3">
                  <InfoCard
                    title={{ text: 'Confidentiality' }}
                    icon={{ icon: faLock, color: 'danger' }}>
                    <p className="text-sm">
                      Information is a powerful tool. That's the reason ARI keep all Client's information highly 
                      confidential and make arrangements with involved personnel to keep it as confidential as possible.
                    </p>
                  </InfoCard>
                </Col>
              </Row>
              <Row className="justify-content-start mt-3">
                <Col md="4" className="mt-3">
                  <InfoCard
                    title={{ text: 'Legality' }}
                    icon={{ icon: faGavel, color: 'dark' }}>
                    <p className="text-sm">
                      Personnel must know, comply and understand the implication with laws, regulations, 
                      guidelines and guidelines governing ARI and they related activities.
                    </p>
                  </InfoCard>
                </Col>
                <Col md="4" className="mt-3">
                  <InfoCard
                    title={{ text: 'Responsiveness for Complaints' }}
                    icon={{ icon: faComments, color: 'secondary' }}>
                    <p className="text-sm">
                      Any act has consequences, that's why ARI keep processes to track on all interested parties complaints. 
                      And employees has the commitment to response and act for any complaint.
                    </p>
                  </InfoCard>
                </Col>
              </Row>
            </Col>
            <Col lg="3" className="ms-auto me-auto p-lg-4 mt-lg-0 mt-4">
              <Card className="card-background card-background-mask-warning tilt">
                <div className="full-background" style={{ backgroundImage: `url(${ imgPeopleWork })` }}></div>
                <div className="card-body pt-7 pb-6 text-center">
                  <div className="icon icon-lg up mb-3 mt-3 mx-auto">
                    <FontAwesomeIcon icon={ faShield } size="4x" />
                  </div>
                  <h2 className="text-white up mb-0">Risk-Based Approach</h2>
                  <p>
                    Personnel understand the risks related with Audit activities and the consequences and 
                    implications of not follow the rules and requirements.
                  </p>
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      <section>
        <Container>
          <Row>
            <Col lg="6" className="mx-auto text-center">
              <h2 className="text-primary text-gradient">Add value product</h2>
              <p className="lead">Evaluating commitments. The key factors that make our services added value are as follows</p>
            </Col>
          </Row>
          <Row className="mt-4 py-4">
            <Col md="5" className="my-auto">
              <InfoHorizontalCard icon={{ icon: faChevronRight, color: 'white' }}>
                <p className="mb-0">
                  Warmth and personal attention from the first contact.
                </p>
              </InfoHorizontalCard>
              <InfoHorizontalCard icon={{ icon: faChevronRight, color: 'white' }}>
                <p className="mb-0">
                  Staff committed to the organization and highly skilled.
                </p>
              </InfoHorizontalCard>
              <InfoHorizontalCard icon={{ icon: faChevronRight, color: 'white' }}>
                <p className="mb-0">
                  Training plans and ongoing training of all auditors & staff.
                </p>
              </InfoHorizontalCard>
              <InfoHorizontalCard icon={{ icon: faChevronRight, color: 'white' }}>
                <p className="mb-0">
                  Strategic prices according to market segment. With adherence to regulatory framework.
                </p>
              </InfoHorizontalCard>
              <InfoHorizontalCard icon={{ icon: faChevronRight, color: 'white' }}>
                <p className="mb-0">
                  Constant updating and provision of after sales service to our customers.
                </p>
              </InfoHorizontalCard>
              <InfoHorizontalCard icon={{ icon: faChevronRight, color: 'white' }}>
                <p className="mb-0">
                  Use of technological tools and communications, facilitating the interaction of our clients in administrative processes and operating on services performed.
                </p>
              </InfoHorizontalCard>
              <InfoHorizontalCard icon={{ icon: faChevronRight, color: 'white' }}>
                <p className="mb-0">
                  With distinction and quality service.
                </p>
              </InfoHorizontalCard>
            </Col>
            <Col md="5" className="ms-auto">
              <img className="w-100 border-radius-lg shadow-lg" src={ team_1 } />
            </Col>
          </Row>
        </Container>
      </section>

      <section className="py-sm-7">
        <div className="bg-gradient-dark position-relative m-3 border-radius-xl overflow-hidden">
          <img src={ imgWhyUs } className="position-absolute start-0 top-md-0 w-100 opacity-2" />
          <Container className="py-7 position-relative z-index-2 position-relative">
            <Row>
              <Col md="7" className="mx-auto text-center">
                <p className="lead text-white mb-5 opacity-7">
                  All these factors make our meeting a benchmark of quality service to meet the needs and expectations of our 
                  customers and stakeholders.
                </p>
                <Row>
                  <Col md="6">
                    <h3 className="text-info text-gradient">Mission</h3>
                    <p className="text-white">
                      American Registration Inc. is a company dedicated to providing quality certification services, 
                      seeking the satisfaction and loyalty of our customers.
                    </p>
                  </Col>
                  <Col md="6">
                    <h3 className="text-info text-gradient">Vision</h3>
                    <p className="text-white">
                      American Registration Inc., been the most attractive option for the companies to evaluate their 
                      Management Systems or Product Certification.
                    </p>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Container>
        </div>
      </section>

      <section>
        <Container>
          <Row>
            <Col lg="8" className="mx-auto text-center">
              <h2 className="text-ari text-gradient">Quality & Impartiality Policy</h2>
              <p className="lead">
                In American Registration Inc., Our COMMITMENT is provide assessment audits with high quality and protecting 
                the impartiality, as follow
              </p>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col lg="9" className="mx-auto pb-5">
              <Card className="card-profile p-3">
                <Row>
                  <Col lg="5">
                    <div className="position-relative">
                      <div className="blur-shadow-image">
                        <img src={ team_2 } className="w-100 rounded-3 shadow-lg" />
                      </div>
                    </div>
                  </Col>
                  <Col lg="7" className="ps-0 my-auto">                    
                    <Card.Body className="pt-lg-0 text-sm">
                      <ListGroup variant="flush">
                        <ListGroup.Item>We recognize that the source of our revenues are from clients, and that this may be a potential risk of impartiality;</ListGroup.Item>
                        <ListGroup.Item>The certification decision is based on objective evidence obtained during the audit process and reviewed by an independent Certification Committee, and will not have any influence from stakeholders, auditor/staff promises, family influences, or other;</ListGroup.Item>
                        <ListGroup.Item>No member of our company will act on their own or financial benefit. Our personnel is aware of this policy and report any activity that could threat impartiality, this includes but not limited to previous work or consultancy from last 2 years;</ListGroup.Item>
                        <ListGroup.Item>Our auditors recommend for certification We also have a Certification Committee who review of audit package and have the final decision to grant, reduce, suspend or withdraw a certificate;</ListGroup.Item>
                        <ListGroup.Item>Any threat of impartiality is communicated and taken into consideration in the final decision to grant the certificate;</ListGroup.Item>
                        <ListGroup.Item>We do not allow any commercial, financial or other pressure to threat impartiality;</ListGroup.Item>
                        <ListGroup.Item>ARI will not certify the management systems of other certification bodies;</ListGroup.Item>

                        <ListGroup.Item>ARI, will not have any subsidiaries offering or developing consultancy or internal audits to current clients, and will not share advertising with any consultancy company;</ListGroup.Item>
                        <ListGroup.Item>ARI, will not subcontract any consulting company or third part company to conduct audits on their behalf;</ListGroup.Item>
                        <ListGroup.Item>ARI will not outsource decisions for granting, refusing, maintaining of certification, expanding or reducing the scope of certification, renewing, suspending or restoring, or withdrawing of certification;</ListGroup.Item>
                        <ListGroup.Item>We understand the risk management process regarding with FSMS audit certification;</ListGroup.Item>
                        <ListGroup.Item>ARI, not offer consultancy services for any certification program;</ListGroup.Item>
                        <ListGroup.Item>Our commitments with the enviroment protection including contamination prevention and law compliance;</ListGroup.Item>
                        <ListGroup.Item>Our commitments with the healt and safety work conditions, risk reduction and law compliance.</ListGroup.Item>
                      </ListGroup>

                    </Card.Body>
                  </Col>
                </Row>
              </Card>
            </Col>
            {/* <Col lg="5" className="mx-auto pb-5">
            <Card className="h-100">
              <Card.Body className="mx-lg-3 text-sm">
                <ListGroup variant="flush">                
                  <ListGroup.Item>ARI, will not have any subsidiaries offering or developing consultancy or internal audits to current clients, and will not share advertising with any consultancy company;</ListGroup.Item>
                  <ListGroup.Item>ARI, will not subcontract any consulting company or third part company to conduct audits on their behalf;</ListGroup.Item>
                  <ListGroup.Item>ARI will not outsource decisions for granting, refusing, maintaining of certification, expanding or reducing the scope of certification, renewing, suspending or restoring, or withdrawing of certification;</ListGroup.Item>
                  <ListGroup.Item>We understand the risk management process regarding with FSMS audit certification;</ListGroup.Item>
                  <ListGroup.Item>ARI, not offer consultancy services for any certification program;</ListGroup.Item>
                  <ListGroup.Item>Our commitments with the enviroment protection including contamination prevention and law compliance;</ListGroup.Item>
                  <ListGroup.Item>Our commitments with the healt and safety work conditions, risk reduction and law compliance.</ListGroup.Item>
                </ListGroup>
               </Card.Body>
            </Card>
            </Col> */}
          </Row>
        </Container>
      </section>
    </BasicLayout>
  )
}

export default AboutView;