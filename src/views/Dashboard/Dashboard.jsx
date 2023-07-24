import React from 'react'
import DashboardLayout from '../../layouts/dashboard/DashboardLayout'
import { Card, Col, Container, ListGroup, ListGroupItem, Row } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faGlobe, faLaptopCode, faListCheck, faNewspaper, faSearch, faWandMagic } from '@fortawesome/free-solid-svg-icons'

import bgElectronic from '../../assets/img/bgElectronic.jpg';

export const Dashboard = () => {
  return (
    <DashboardLayout>
      <Container fluid className="py-4">
        <Row>
          <Col sm="6" xl="3" className="mb-xl-0 mb-4">
            <Card>
              <Card.Body className="p-3">
                <Row>
                  <Col xs="8">
                    <div className="numbers">
                      <p className="text-sm mb-0 text-capitalize font-weight-bold">Nuevas páginas</p>
                      <h5 className="font-weight-bolder mb-0">
                        12
                        <span className="text-info text-sm font-weight-bolder ms-1">en julio</span>
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
          </Col>
          <Col sm="6" xl="3" className="mb-xl-0 mb-4">
            <Card>
              <Card.Body className="p-3">
                <Row>
                  <Col xs="8">
                    <div className="numbers">
                      <p className="text-sm mb-0 text-capitalize font-weight-bold">En revisión</p>
                      <h5 className="font-weight-bolder mb-0">
                        34
                        <span className="text-danger text-sm font-weight-bolder ms-1">páginas</span>
                      </h5>
                    </div>
                  </Col>
                  <Col xs="4" className="d-flex align-items-center justify-content-end">
                    <div className="icon icon-shape bg-gradient-danger shadow text-white border-radius-md d-flex align-items-center justify-content-center">
                      <FontAwesomeIcon icon={ faSearch } size="lg" className="opacity-10" aria-hidden="true" />
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col sm="6" xl="3" className="mb-xl-0 mb-4">
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
                    <div className="icon icon-shape bg-gradient-success shadow text-white border-radius-md d-flex align-items-center justify-content-center">
                      <FontAwesomeIcon icon={ faWandMagic } size="lg" className="opacity-10" aria-hidden="true" />
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col sm="6" xl="3" className="mb-xl-0 mb-4">
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
                        <div className="icon icon-shape bg-gradient-warning shadow text-white border-radius-md d-flex align-items-center justify-content-center">
                          <FontAwesomeIcon icon={ faNewspaper } size="lg" className="opacity-10" aria-hidden="true" />
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col xs="12" lg="7" className="mb-lg-0 mb-4">
            <Card>
              <Card.Body className="p-3">
                <Row>
                  <Col lg="6">
                    <div className="d-flex flex-column h-100">
                      <p className="mb-1 pt-2 text-bold">Portal Web Municipal</p>
                      <h5 className="font-weight-bolder">Administrativo</h5>
                      <p className="mb-5">
                        Portal Web en etapa inicial de pruebas, desarrollandose con tecnologia 
                        reciente y metodos de programación actualizados.
                      </p>
                      <a className="text-body text-sm font-weight-bold mb-0 icon-move-right mt-auto" href="#" onClick={ () => alert('Esto no va a ningun lado') }>
                        Ver más
                        <FontAwesomeIcon icon={ faArrowRight } className="text-sm ms-1" />
                      </a>
                    </div>
                  </Col>
                  <Col lg="5" className="ms-auto text-center mt-5 mt-lg-0">
                    <div className="bg-gradient-info border-radius-lg h-100">
                      <div className="position-relative d-flex align-items-center justify-content-center h-100">
                        <FontAwesomeIcon icon={ faLaptopCode } size="6x" className="w-100 position-relative z-index-2 pt-4 text-white" />
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
                    Aquí ya no hay nada más que poner, wa ir probando una de las secciónes a ver que tal.
                  </p>
                </Card.Body>
              </div>
            </Card>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col xs="12" lg="8">
            <Card className="h-100 py-3">
              <Card.Body className="px-3">
                <Card.Subtitle>
                  <FontAwesomeIcon icon={ faListCheck } className="me-2" />
                  Aquí wa hacer una lista de los pendientes</Card.Subtitle>              
              </Card.Body>
              <ListGroup variant="flush" numbered>
                <ListGroupItem>Hacer la interfaz para manejar un listado de registros</ListGroupItem>
                <ListGroupItem>Hacer la interfaz para editar un registro</ListGroupItem>
                <ListGroupItem>Hacer la interfaz para consultar un registro</ListGroupItem>
                <ListGroupItem>Hacer la interfaz para inicio de sesión</ListGroupItem>
                <ListGroupItem>Hacer la interfaz para home</ListGroupItem>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      </Container>
    </DashboardLayout>
  )
}
