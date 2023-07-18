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
        <Navbar title="Dashboard" />
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
          <Row>
            <Col xm="12">
              <h5>Lorem ipsum dolor sit amet</h5>
              <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent ut nibh eget neque semper eleifend. Nullam aliquam tortor odio, quis congue quam scelerisque in. Proin in ultricies mauris. Aenean ut nulla nisi. Mauris nec faucibus justo. Aenean molestie, enim ut eleifend imperdiet, eros nunc faucibus ex, sed mattis nunc ante cursus massa. Vestibulum eget consequat tortor, a porta magna. In non ante dui. Curabitur condimentum tempus tristique. Praesent accumsan tortor eget neque fermentum, nec sodales magna suscipit. Proin sed euismod risus. Sed rhoncus massa eu elit finibus, vel tristique mauris placerat. Quisque at nibh facilisis, euismod nulla ac, ultrices leo. Suspendisse ut aliquam ipsum. Donec quis sagittis erat, et cursus turpis. Sed non euismod nibh, dapibus laoreet sapien.
              </p>
              <p>
              Sed ut quam enim. Curabitur congue sapien a sem vestibulum, vitae mollis lacus efficitur. Etiam massa augue, eleifend vel auctor at, finibus eget lectus. Nullam sit amet massa facilisis, egestas quam et, volutpat odio. Proin rhoncus metus rhoncus tellus molestie tristique. Fusce a lacus at mi feugiat aliquam. Aliquam mollis risus eros, ut ullamcorper nunc faucibus nec. Duis nulla nisl, egestas eu est nec, condimentum pulvinar nunc. Fusce dignissim eros tortor, et blandit nisi facilisis sit amet. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum pellentesque, massa a convallis aliquam, nulla ipsum vulputate elit, sit amet convallis mauris est at sem. Ut dignissim libero enim, quis luctus diam feugiat in. Sed imperdiet, ante sed rutrum accumsan, nisl ante iaculis quam, ut congue ex sapien eu metus.
              </p>
              <p>
              Nullam venenatis scelerisque orci id maximus. Phasellus quis sodales augue. Nunc sit amet lobortis dolor, id molestie ipsum. Morbi non semper urna, at elementum purus. Aenean eleifend massa nisl, ac mollis velit rutrum vel. In id ex et nibh aliquam auctor at ut velit. Ut vel ornare metus. Aliquam tempor efficitur ante ac porttitor. Nulla non fringilla nisl. 
              </p>
              <p>
              Mauris augue felis, consequat quis scelerisque a, aliquam vel metus. Cras eget eros sagittis, aliquet tellus a, molestie nunc. Phasellus ultricies elit id ultricies vulputate. Nam magna dui, ultricies nec turpis sed, condimentum tempor est. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Proin vehicula vestibulum egestas. Ut aliquam molestie nisl, quis placerat dolor vulputate sit amet. Suspendisse eget varius sem. Fusce varius rutrum interdum. Aliquam sit amet ultricies nulla. Aliquam pellentesque ultrices velit quis finibus. Cras ullamcorper sed arcu a porttitor. Cras venenatis et enim eu euismod. Nunc mollis nisl nec neque sollicitudin, nec facilisis diam sollicitudin. Integer quam erat, pellentesque et eleifend vel, mattis eu ligula. Morbi neque neque, feugiat posuere rhoncus non, imperdiet nec massa.
              </p>
            </Col>
          </Row>
        </div>
      </main>
    </>
  )
}

export default Inicio;