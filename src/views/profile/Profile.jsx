import React from 'react'
import DashboardLayout from '../../layouts/dashboard/DashboardLayout';
import { Card, Col, Container, Row } from 'react-bootstrap';

import bgElectronic from '../../assets/img/bgElectronic.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUserGear } from '@fortawesome/free-solid-svg-icons';

export const Profile = () => {
  return (
    <DashboardLayout>
      <div className="page-header min-height-300 border-radius-xl"
        style={{ 
          backgroundImage: `url(${ bgElectronic })`,
          backgroundPosition: '50%',
        }}
      >
        <span className="mask bg-gradient-info opacity-6"></span>
      </div>
      <div className="card card-body blur shadow-blur mx-4 mt-n6 overflow-hidden">
        <Row className="gx-4">
          <Col className="col-auto">
            <div className="icon icon-lg icon-shape bg-gradient-info border-radius-md d-flex align-items-center justify-content-center">
              <FontAwesomeIcon icon={ faUserGear } size="2x" className="text-white" />
            </div>
          </Col>
          <Col className="col-auto my-auto">
            <div className="h-100">
              <h5 className="mb-1">Adrián Castillo</h5>
              <p className="mb-0 font-weight-bold text-sm">Encargado de Gobierno Electrónico</p>
            </div>
          </Col>
          <Col lg="4" md="6" className="my-sm-auto ms-sm-auto me-sm-0 mx-auto mt-3">
            
          </Col>
        </Row>
      </div>
      <Container fluid className="py-4">
        <Row>
          <Col xs="12" xl="4">
            <Card className="h-100">
              <Card.Header className="pb-0 p-3">
                <h6 className="mb-0">Opciones</h6>
              </Card.Header>
              <Card.Body className="p-3">
                <h6 className="text-uppercase text-body text-xs font-weight-bolder">De la cuenta</h6>
                <p className="text-sm text-secondary"><em>Poner aquí el número de registros por página, si quiere las notificaciones y a ver que más</em></p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </DashboardLayout>
  )
}

export default Profile;
