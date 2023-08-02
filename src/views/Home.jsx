
import { useNavigate } from "react-router-dom";

import { Button, Card, Col, Container, Row } from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faFileSignature, faGears, faPoo, faRankingStar, faRightFromBracket, faRightToBracket } from "@fortawesome/free-solid-svg-icons";

import { BasicLayout } from "../layouts/basic/BasicLayout";
import { useAuthStore } from "../hooks/useAuthStore";

import landscape from '../assets/img/phoLoginLandscape.jpg';
import bgAnalist from '../assets/img/bg-analisis-papel.jpg';
import lgoARI from '../assets/img/lgoARI.png';
import lgoARIblanco from '../assets/img/lgoAriBlanco.png';

export const Home = () => {
  const navigate = useNavigate();
  const {
    status,
    user,
    logout,
  } = useAuthStore();

  const onLoginClick = () => {
    navigate('/login');
  };

  const onLogoutClick = () => {
    logout();
  };

  return (
    <BasicLayout>
      <header className="header-2">
        <div className="page-header min-vh-75 relative" style={{ backgroundImage: `url(${ bgAnalist })`}}>
          <span className="mask bg-gradient-info opacity-8"></span>
          <Container>
            <Row>
              <Col lg="7" className="text-center mx-auto">
                <img src={ lgoARIblanco } height="200px" className="mt-n5" />
                <h1 className="text-white text-shadow-lg pt-3 mt-3">Improving your management systems!</h1>
                {/* <p className="lead text-white text-shadow mt-3">
                Improving your management systems!
                </p> */}
              </Col>
            </Row>
          </Container>
          <div className="position-absolute w-100 z-index-1 bottom-0">

          </div>
        </div>
      </header>

      <section className="pt-3 pb-4">
        <Container>
          <Row>
            <Col lg="9" className="z-index-2 border-radius-xl mt-n10 mx-auto py-3 blur shadow-blur">
              <Row>
                <Col md="4" className="position-relative">
                  <div className="p-3 text-center">
                    <h1 className="text-gradient text-info">56</h1>
                    <h5 className="mt-3">Organizations</h5>
                    <p className="text-sm">Who use our services</p>
                  </div>
                  <hr className="vertical dark" />
                </Col>
                <Col md="4" className="position-relative">
                  <div className="p-3 text-center">
                    <h1 className="text-gradient text-success">14</h1>
                    <h5 className="mt-3">Certifications</h5>
                    <p className="text-sm">In this month</p>
                  </div>
                  <hr className="vertical dark" />
                </Col>
                <Col md="4" className="position-relative">
                  <div className="p-3 text-center">
                    <h1 className="text-gradient text-warning">16</h1>
                    <h5 className="mt-3">Certifications services</h5>
                    <p className="text-sm">Where we can help you</p>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="mb-5">
        <Container>
          <Row>
            <Col xs="12" md="7" className="py-sm-7">
              <h3 className="text-gradient text-info mb-0">Why Choose Us?</h3>
              <h3>Process approach</h3>
              <p className="pe-md-5 mb-4">
                Our service is a guarantee of conducting audits according to the client’s requirements, 
                standard compliance and considering the applicable legal requirements. This means that 
                we use auditor experience according to the sector of the organization and not just a 
                generic audit. This allows the auditor use the Process Approach needed by the Organization 
                Audit to reach better results, and not just an audit.
              </p>
              <div className="p-3 info-horizontal">
                <div className="icon icon-shape rounded-circle bg-gradient-info shadow d-flex align-items-center justify-content-center">
                  <FontAwesomeIcon icon={ faFileSignature } size="lg" className="text-white" />
                </div>
                <div className="description ps-3">
                  <p className="mb-0">
                    In our experience we have seen many management systems with focus only in obtain 
                    a piece of paper <span className="text-dark font-weight-bold">“The Certificate”</span>.
                  </p>
                </div>
              </div>
              <div className="p-3 info-horizontal">
                <div className="icon icon-shape rounded-circle bg-gradient-info shadow d-flex align-items-center justify-content-center">
                  <FontAwesomeIcon icon={ faGears } size="lg" className="text-white" />
                </div>
                <div className="description ps-3">
                  <p className="mb-0">
                    We do really believe a Management System, is more than just a paper. The Management 
                    System is a Commitment. But also is a tool to reach results.
                  </p>
                </div>
              </div>
              <div className="p-3 info-horizontal">
                <div className="icon icon-shape rounded-circle bg-gradient-info shadow d-flex align-items-center justify-content-center">
                  <FontAwesomeIcon icon={ faRankingStar } size="lg" className="text-white" />
                </div>
                <div className="description ps-3">
                  <h6 className="mb-0 font-weight-bolder">Results</h6>
                  <p className="mb-0">
                    Results in organization objectives through the evaluation focus on the best practices 
                    such as: Balance Score Card, Risk Management, Strategic Objectives, Evaluation of Suppliers 
                    and Audits of first and second part, among others.
                  </p>
                </div>
              </div>
            </Col>
            <Col xs="12" md="5" className="my-auto">
              <Card className="card-background card-background-mask-info tilt" data-tilt="">
                <div className="full-background" style={{ backgroundImage: `url(${ landscape })`}}>
                </div>
                <Card.Body className="pt-7 text-center d-flex flex-column justify-content-center align-items-center">
                  <div className="icon icon-lg up mb-3 mt-3">
                    <FontAwesomeIcon icon={ faChartLine } size="4x" />
                  </div>
                  <h2 className="text-white up mb-0">We have the conviction</h2>
                  <p>
                     of promoting management systems to allows organizations 
                    to improving your management systems with the highest quality standards.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
      <section>
        <Container>
          <Row className="align-items-center">
            <Col lg="6" className="ms-auto">
              { status === 'authenticated' ? (
                <div className="warning">
                  <div className="icon text-gradient text-warning">
                    <FontAwesomeIcon icon={ faRightFromBracket } size="2x" />
                  </div>
                  <h5 className="font-weight-bolder mt-3">Cerrar sesión</h5>
                  <p className="pe-5">
                    Una vez finalizadas las tareas es recomendable cerrar sesión para evitar que alguien más
                    haga uso indebido de su cuenta.
                  </p>
                  <div className="text-end">
                    <Button type="button" onClick={ onLogoutClick } variant="warning" className="bg-gradient-warning">Cerrar Sesión</Button>
                  </div>
                </div>
              ) : (
                <div className="info">
                  <div className="icon text-gradient text-info">
                    <FontAwesomeIcon icon={ faRightToBracket } size="2x" />
                  </div>
                  <h5 className="font-weight-bolder mt-3">Iniciar sesión</h5>
                  <p className="pe-5">
                    Solo personal autorizado puede acceder a publicar información dentro de nuestro Portal Web,
                    cada departamento cuenta con un enlace técnico quien es el que publica la información.
                  </p>
                  <div className="text-end">
                    <Button type="button" onClick={ onLoginClick } variant="info" className="bg-gradient-info" >Iniciar sesión</Button>
                  </div>
                </div>
              )}
            </Col>
            <Col lg="4" className="ms-auto me-auto p-lg-4 mt-lg-0 mt-4">
              <Card className="card-background card-background-mask-info tilt" data-tilt="">
                <div className="full-background" style={{ backgroundImage: `url(${ landscape })`}}>
                </div>
                <Card.Body className="pt-7 text-center d-flex flex-column justify-content-center align-items-center">
                  <div className="icon icon-lg up mb-3 mt-3">
                    <FontAwesomeIcon icon={ faPoo } size="4x" />
                  </div>
                  <h2 className="text-white up mb-0">Hola mundo</h2>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </BasicLayout>
  )
}

export default Home;