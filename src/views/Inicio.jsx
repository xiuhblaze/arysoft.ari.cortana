import { faGear, faGlobe, faHome, faLandmark, faMoneyBill, faNewspaper, faRocket, faSearch, faTimes, faUser, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, Col, Row } from "react-bootstrap";

import bgElectronic from "../assets/img/bgElectronic.jpg";

export const Inicio = () => {
  return (
    <>
      <aside className="sidenav navbar navbar-vertical navbar-expand-xs border-0 border-radius-xl my-3 fixed-start ms-3">
        <div className="sidenav-header">
          <FontAwesomeIcon icon={ faTimes } className="p-3 cursor-pointer text-secondary opacity-5 position-absolute end-0 top-0 d-none d-xl-none" />
          <a className="navbar-brand m-0" href="#">
            <span className="ms-1 font-weight-bold">Zapotlán Admin</span>
          </a>
        </div>
        <hr className="horizontal dark mt-0" />
        <div className="collapse navbar-collapse w-auto">
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link" href="#">
                <div className="icon icon-shape icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
                  <FontAwesomeIcon icon={ faHome } />
                </div>
                <span className="nav-link-text ms-1">
                  Dashboard
                </span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link active" href="#">
                <div className="icon icon-shape icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
                  <FontAwesomeIcon icon={ faLandmark } />
                </div>
                <span className="nav-link-text ms-1">
                  Administraciones
                </span>
              </a>
            </li>
            <li className="nav-item mt-3">
              <h6 className="ps-4 ms-2 text-uppercase text-xs font-weight-bolder opacity-6">Catálogos</h6>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                <div className="icon icon-shape icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
                  <FontAwesomeIcon icon={ faUsers } />
                </div>
                <span className="nav-link-text ms-1">
                  Empleados
                </span>
              </a>
            </li>
          </ul>
        </div>
      </aside>
      <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg">
        <nav className="navbar navbar-main navbar-expand-lg px-0 mx-4 shadow-none border-radius-xl" navbar-scroll="true">
          <div className="container-fluid py-1 px-3">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0 me-sm-6 me-5">
                <li className="breadcrumb-item text-sm"><a className="opacity-5 text-dark" href="#">Pages</a></li>
                <li className="breadcrumb-item text-sm text-dark active" aria-current="page">Dashboard</li>
              </ol>
              <h6 className="font-weight-bolder mb-0">Titulo de la página</h6>
            </nav>

            <div className="collapse navbar-collapse mt-sm-0 mt-2 me-md-0 me-sm-4">
              <div className="ms-md-auto pe-md-3 d-flex align-items-center">
                <div className="input-group">
                  <span className="input-group-text text-body">
                    <FontAwesomeIcon icon={ faSearch }></FontAwesomeIcon>
                  </span>
                  <input type="text" className="form-control" placeholder="Buscar..."></input>
                </div>
              </div>

              <ul className="navbar-nav justify-content-end">
                  <li className="nav-item d-flex align-items-center">
                    <a href="#" className="nav-link text-body font-weight-bold px-0">
                      <FontAwesomeIcon icon={ faUser } className="me-sm-1" />
                      <span className="d-sm-inline d-none">adrian.castillo</span>
                    </a>
                  </li>
                  <li className="nav-item px-3 d-flex align-items-center">
                    <a href="#" className="nav-link text-body p-0">
                      <FontAwesomeIcon icon={ faGear } />
                    </a>
                  </li>
              </ul>
            </div>
          </div>
        </nav>
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
            <Col xs="7" className="mb-lg-0 mb-4">
              <Card>
                <Card.Body className="p-3">
                  <Row>
                    <Col xs="6">
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
                    <Col xs="5" className="ms-auto text-center mt-5 mt-lg-0">
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
            <Col xs="5">
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