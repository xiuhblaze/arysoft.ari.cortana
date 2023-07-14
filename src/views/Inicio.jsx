import { faGear, faGlobe, faMoneyBill, faNewspaper, faRocket, faSearch, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, Col, Row } from "react-bootstrap";

import bgElectronic from "../assets/img/bgElectronic.jpg";

import { Navbar } from "../components/Navbar";
import { Sidenav } from "../components/Sidenav";

export const Inicio = () => {
  return (
    <>
      <Sidenav />
      <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg">
        <Navbar />
        <div className="container-fluid py-4">
          <div className="row">
            <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4">
              <Card>
                <Card.Body className="p-3">
                  <Row>
                    <Col xs="8">
                      <div className="numbers">
                        <p className="text-sm mb-0 text-capitalize font-weight-bold">Lorem ipsum dolor</p>
                        <h5 className="font-weight-bolder mb-0">
                          65,000
                          <span className="text-success text-sm font-weight-bolder ms-1">+00%</span>
                        </h5>
                      </div>
                    </Col>
                    <Col xs="4" className="d-flex align-items-center justify-content-end">
                      <div className="icon icon-shape bg-gradient-info shadow text-white border-radius-md d-flex align-items-center justify-content-center">
                        <FontAwesomeIcon icon={ faMoneyBill } size="lg" className="opacity-10" aria-hidden="true" />
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </div>
            <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4">
              <Card>
                <Card.Body className="p-3">
                  <Row>
                    <Col xs="8">
                      <div className="numbers">
                        <p className="text-sm mb-0 text-capitalize font-weight-bold">Dolor sit amet</p>
                        <h5 className="font-weight-bolder mb-0">
                          34.0
                          <span className="text-danger text-sm font-weight-bolder ms-1">+0</span>
                        </h5>
                      </div>
                    </Col>
                    <Col xs="4" className="d-flex align-items-center justify-content-end">
                      <div className="icon icon-shape bg-gradient-info shadow text-white border-radius-md d-flex align-items-center justify-content-center">
                        <FontAwesomeIcon icon={ faGlobe } size="lg" className="opacity-10" aria-hidden="true" />
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </div>
            <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4">
              <Card>
                <Card.Body className="p-3">
                  <Row>
                    <Col xs="8">
                      <div className="numbers">
                        <p className="text-sm mb-0 text-capitalize font-weight-bold">Nullam urna enim</p>
                        <h5 className="font-weight-bolder mb-0">
                          24
                          <span className="text-primary text-sm font-weight-bolder ms-1">+38%</span>
                        </h5>
                      </div>
                    </Col>
                    <Col xs="4" className="d-flex align-items-center justify-content-end">
                      <div className="icon icon-shape bg-gradient-info shadow text-white border-radius-md d-flex align-items-center justify-content-center">
                        <FontAwesomeIcon icon={ faNewspaper } size="lg" className="opacity-10" aria-hidden="true" />
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </div>
          </div>
          <Row className="mt-4">
            <Col xs="12" lg="7" className="mb-lg-0 mb-4">
              <Card>
                <Card.Body className="p-3">
                  <Row>
                    <Col lg="6">
                      <div className="d-flex flex-column h-100">
                        <p className="mb-1 pt-2 text-bold">Built by developers</p>
                        <h5 className="font-weight-bolder">Soft UI Dashboard</h5>
                        <p className="mb-5">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam urna enim, dapibus ut enim bibendum.</p>
                        <a className="text-body text-sm font-weight-bold mb-0 icon-move-right mt-auto" href="#">
                          Ver más
                          <i className="fas fa-arrow-right text-sm ms-1" aria-hidden="true"></i>
                        </a>
                      </div>
                    </Col>
                    <Col lg="5" className="ms-auto text-center mt-5 mt-lg-0">
                      <div className="bg-gradient-info border-radius-lg h-100">
                        <div className="position-relative d-flex align-items-center justify-content-center h-100">
                          <FontAwesomeIcon icon={ faRocket } size="6x" className="w-100 position-relative z-index-2 pt-4 text-white" />
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            <Col xs="12" lg="5">
              <Card className="h-100 p-3">
                <div 
                  className="overflow-hidden position-relative border-radius-lg bg-cover h-100"
                  style={{ backgroundImage: `url(${ bgElectronic })`}}
                >
                  <span className="mask bg-gradient-dark"></span>
                  <Card.Body className="position-relative z-index-1 d-flex flex-column h-100 p-3">
                    <h5 className="text-white font-weight-bolder mb-4 pt-2">Haciendo el dashboard</h5>
                    <p className="text-white">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam urna enim, dapibus ut enim bibendum, 
                      consectetur vehicula ante. Aliquam erat volutpat. Praesent congue vitae tortor non commodo.
                    </p>
                  </Card.Body>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </main>
    </>
  )
}

export default Inicio;