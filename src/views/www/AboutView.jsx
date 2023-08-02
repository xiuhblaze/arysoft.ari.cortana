
import { Col, Container, ListGroup, Row } from "react-bootstrap";

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

import landscape from "../../assets/img/phoLoginLandscape.jpg";
import bgElectronic from "../../assets/img/bgElectronic.jpg";
import bgPeople1 from '../../assets/img/bgPeople1.jpg';
import team_1 from '../../assets/img/team-1.jpg';


export const AboutView = () => {
  return (
    <BasicLayout>
      <header>
        <div className="page-header min-vh-50 relative" style={{ backgroundImage: `url(${ bgPeople1 })` }}>
          <span className="mask bg-gradient-dark"></span>
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
          <Row className="align-items-center">
            <Col lg="12">
              <Row className="justify-content-start">
                <Col md="3">
                  <div className="info">
                    <div className="icon icon-shape text-center">
                      <FontAwesomeIcon icon={ faStar } size="xl" className="text-warning" />
                    </div>
                    <h5>Service</h5>
                    <p className="text-sm">
                      Because of their function, they must observe a permanent attitude of collaboration, 
                      providing support, friendly guidance to users and other staff itself.
                    </p>
                  </div>
                </Col>
                <Col md="3">
                  <div className="info">
                    <div className="icon icon-shape text-center">
                      <FontAwesomeIcon icon={ faScaleBalanced } size="xl" className="text-dark" />
                    </div>
                    <h5>Impartiality</h5>
                    <p className="text-sm">
                      Being impartial, and being perceived to be impartial, is necessary for a certification 
                      body to deliver certification that provides confidence. It is important that all internal 
                      and external personnel are aware of the need for impartiality. (ISO 17021-1. 4.2).
                    </p>
                  </div>
                </Col>
                <Col md="3">
                  <div className="info">
                    <div className="icon icon-shape text-center">
                      <FontAwesomeIcon icon={ faGraduationCap } size="xl" className="text-primary" />
                    </div>
                    <h5>Competence</h5>
                    <p className="text-sm">
                      Keep competent is always a way to offer a better service and employees must comply with 
                      their duties, aware of the commitment to quality service an organizational standard.
                    </p>
                  </div>
                </Col>
                <Col md="3">
                  <div className="info">
                    <div className="icon icon-shape text-center">
                      <FontAwesomeIcon icon={ faHandHoldingHand } size="xl" className="text-info" />
                    </div>
                    <h5>Responsability/Honesty</h5>
                    <p className="text-sm">
                      With all the people who have interaction and, in all situations, must behave with
                      responsible and honest in the performance of their duties, it should be addressed 
                      with respect and tolerance for all people.
                    </p>
                  </div>
                </Col>
              </Row>
              <Row className="justify-content-start">
                <Col md="3">
                  <div className="info">
                    <div className="icon icon-shape text-center">
                      <FontAwesomeIcon icon={ faFaceSmile } size="xl" className="text-success" />
                    </div>
                    <h5>Oppenes</h5>
                    <p className="text-sm">
                      All involved must understand that different situations can occur during the Certification 
                      activities. That's the reason they has to be open to provide service in accordance with 
                      the international standards and always trying to support clients and interested parties.
                    </p>
                  </div>
                </Col>
                <Col md="3">
                  <div className="info">
                    <div className="icon icon-shape text-center">
                      <FontAwesomeIcon icon={ faLock } size="xl" className="text-danger" />
                    </div>
                    <h5>Confidentiality</h5>
                    <p className="text-sm">
                      Information is a powerful tool. That's the reason ARI keep all Client's information highly 
                      confidential and make arrangements with involved personnel to keep it as confidential as possible.
                    </p>
                  </div>
                </Col>
                <Col md="3">
                  <div className="info">
                    <div className="icon icon-shape text-center">
                      <FontAwesomeIcon icon={ faGavel } size="xl" className="text-dark" />
                    </div>
                    <h5>Legality</h5>
                    <p className="text-sm">
                      Personnel must know, comply and understand the implication with laws, regulations, 
                      guidelines and guidelines governing ARI and they related activities.
                    </p>
                  </div>
                </Col>
                <Col md="3">
                  <div className="info">
                    <div className="icon icon-shape text-center">
                      <FontAwesomeIcon icon={ faComments } size="xl" className="text-secondary" />
                    </div>
                    <h5>Responsiveness for Complaints</h5>
                    <p className="text-sm">
                      Any act has consequences, that's why ARI keep processes to track on all interested parties complaints. And employees has the commitment to response and act for any complaint.
                    </p>
                  </div>
                </Col>
                <Col md="3">
                  <div className="info">
                    <div className="icon icon-shape text-center">
                      <FontAwesomeIcon icon={ faShield } size="xl" className="text-warning" />
                    </div>
                    <h5>Risk-Based Approach</h5>
                    <p className="text-sm">
                      Personnel understand the risks related with Audit activities and the consequences and 
                      implications of not follow the rules and requirements.
                    </p>
                  </div>
                </Col>
              </Row>
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
              <div className="p-3 info-horizontal">
                <div className="icon icon-shape rounded-circle bg-gradient-primary shadow d-flex align-items-center justify-content-center">
                  <FontAwesomeIcon icon={ faChevronRight } className="text-white" />
                </div>
                <div className="description ps-3">
                  <p className="mb-0">
                    Warmth and personal attention from the first contact.
                  </p>
                </div>
              </div>
              <div className="p-3 info-horizontal">
                <div className="icon icon-shape rounded-circle bg-gradient-primary shadow d-flex align-items-center justify-content-center">
                  <FontAwesomeIcon icon={ faChevronRight } className="text-white" />
                </div>
                <div className="description ps-3">
                  <p className="mb-0">
                    Staff committed to the organization and highly skilled.
                  </p>
                </div>
              </div>
              <ListGroup variant="flush">
                <ListGroup.Item className="border-0 bg-transparent">
                  Warmth and personal attention from the first contact.
                </ListGroup.Item>
                <ListGroup.Item className="border-0 bg-transparent">
                  Staff committed to the organization and highly skilled.
                </ListGroup.Item>
                <ListGroup.Item className="border-0 bg-transparent">
                  Training plans and ongoing training of all auditors & staff.
                </ListGroup.Item>
                <ListGroup.Item className="border-0 bg-transparent">
                  Strategic prices according to market segment. With adherence to regulatory framework.
                </ListGroup.Item>
                <ListGroup.Item>
                  Constant updating and provision of after sales service to our customers.
                </ListGroup.Item>
                <ListGroup.Item>
                  Use of technological tools and communications, facilitating the interaction of our clients 
                  in administrative processes and operating on services performed.
                </ListGroup.Item>
                <ListGroup.Item>
                  With distinction and quality service.  
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md="5" className="ms-auto">
              <img className="w-100 border-radius-lg shadow-lg" src={ team_1 } />
            </Col>
          </Row>
        </Container>
      </section>
    </BasicLayout>    
  )
}

export default AboutView;