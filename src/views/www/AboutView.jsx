
import { Col, Container, Row } from "react-bootstrap";

import BasicLayout from "../../layouts/basic/BasicLayout"

import landscape from "../../assets/img/phoLoginLandscape.jpg";
import bgElectronic from "../../assets/img/bgElectronic.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";


export const AboutView = () => {
  return (
    <BasicLayout>
      <header>
        <div className="page-header min-vh-50 relative" style={{ backgroundImage: `url(${ bgElectronic })` }}>
          <span className="mask bg-gradient-dark"></span>
          <Container>
            <Row>
              <Col lg="7" className="text-center mx-auto">
                <h1 className="text-white pt-3 mt-n3">Acerca de</h1>
                <p className="lead text-white shadow-lg mt-3">
                  Portal Web Municipal Administrativo del Gobierno Municipal de Zapotlán el Grande, Jalisco.
                </p>
              </Col>
            </Row>
          </Container>
        </div>
      </header>
      <section className="my-5 py-5">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg="6" className="">
              <h2 className="text-info text-gradient">Tecnologías de la Información</h2>
              <p className="text-start">
                Desarrollado por el departamento de <strong>Tecnologías de la Información</strong>
                en el área de Gobierno Electrónico.
              </p>
              <h4 className="my-4">Equipo de Desarrollo</h4>
              <ul className="list-group shadow-lg">
                <li className="list-group-item border-0 d-flex align-items-center px-2">                  
                  <div className="icon icon-sm icon-shape bg-gradient-primary border-radius-md d-flex align-items-center justify-content-center me-3">
                    <FontAwesomeIcon icon={ faUser } size="lg" className="opacity-10 text-white"></FontAwesomeIcon>
                  </div>
                  <div className="d-flex flex-column justify-content-center text-start">
                    <h6 className="mb-0 text-sm">Ofelia Larios Torrejón</h6>
                    <p className="text-xs text-secondary mb-0">Jefa de Tecnologías de la Información</p>
                  </div>                  
                </li>
                <li className="list-group-item border-0 d-flex align-items-center px-2">                  
                  <div className="icon icon-sm icon-shape bg-gradient-info border-radius-md d-flex align-items-center justify-content-center me-3">
                    <FontAwesomeIcon icon={ faUser } size="lg" className="opacity-10 text-white"></FontAwesomeIcon>
                  </div>
                  <div className="d-flex flex-column justify-content-center text-start">
                    <h6 className="mb-0 text-sm">Rodolfo Figueroa Chávez</h6>
                    <p className="text-xs text-secondary mb-0">Jefe Operativo de Tecnologías de la Información</p>
                  </div>                  
                </li>
                <li className="list-group-item border-0 d-flex align-items-center px-2">                  
                  <div className="icon icon-sm icon-shape bg-gradient-info border-radius-md d-flex align-items-center justify-content-center me-3">
                    <FontAwesomeIcon icon={ faUser } size="lg" className="opacity-10 text-white"></FontAwesomeIcon>
                  </div>
                  <div className="d-flex flex-column justify-content-center text-start">
                    <h6 className="mb-0 text-sm">Adrián Castillo Sánchez</h6>
                    <p className="text-xs text-secondary mb-0">Encargado de Gobierno Electrónico</p>
                  </div>                  
                </li>
                <li className="list-group-item border-0 d-flex align-items-center px-2">                  
                  <div className="icon icon-sm icon-shape bg-gradient-info border-radius-md d-flex align-items-center justify-content-center me-3">
                    <FontAwesomeIcon icon={ faUser } size="lg" className="opacity-10 text-white"></FontAwesomeIcon>
                  </div>
                  <div className="d-flex flex-column justify-content-center text-start">
                    <h6 className="mb-0 text-sm">Ana Cecilia Barajas moreno</h6>
                    <p className="text-xs text-secondary mb-0">Programador, analista y tester</p>
                  </div>                  
                </li>
              </ul>
            </Col>
          </Row>
        </Container>
      </section>
      <section className="py-sm-3">
        <div className="bg-gradient-dark position-relative m-3 border-radius-xl overflow-hidden">
          <img className="position-absolute start-0 top-md-0 w-100 opacity-6" src={ landscape } />
          <div className="container py-7 position-relative z-index-2">
            <Row>
              <Col md="7" className="mx-auto text-center">
                <h3 className="text-white mb-4">Tecnología</h3>
                <p className="text-white mb-5">
                  Portal Web Municipal ver 2.0 desarrollado con:
                </p>
                <ul className="nav flex-column text-white">
                  <li className="nav-item">SQL server</li>
                  <li>C#</li>
                  <li>Entity Framework</li>
                  <li>Javascript</li>
                  <li>CSS</li>
                  <li>React</li>
                </ul>
              </Col>
            </Row>
          </div>
        </div>
      </section>
    </BasicLayout>    
  )
}

export default AboutView;