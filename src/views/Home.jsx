import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Button, Card, Col, Container, Row } from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPoo, faRightFromBracket, faRightToBracket } from "@fortawesome/free-solid-svg-icons";

import { BasicLayout } from "../layouts/basic/BasicLayout";
import { useAuthStore } from "../hooks/useAuthStore";

import landscape from '../assets/img/phoLoginLandscape.jpg';

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
        <div className="page-header min-vh-75 relative" style={{ backgroundImage: `url(${ landscape })`}}>
          <Container>
            <Row>
              <Col lg="7" className="text-center mx-auto">
                <h1 className="text-white pt-3 mt-n5">Zapotlán Admin</h1>
                <p className="lead text-white shadow-lg mt-3">
                  Sitio administrativo para el Portal Web del Gobierno Municipal de Zapotlán el Grande, Jalisco.
                </p>
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
                    <h1 className="text-gradient text-info">126</h1>
                    <h5 className="mt-3">Páginas</h5>
                    <p className="text-sm">Con información visibles en el Portal Web</p>
                  </div>
                  <hr className="vertical dark" />
                </Col>
                <Col md="4" className="position-relative">
                  <div className="p-3 text-center">
                    <h1 className="text-gradient text-success">24</h1>
                    <h5 className="mt-3">Noticias</h5>
                    <p className="text-sm">Publicadas en este año 2023</p>
                  </div>
                  <hr className="vertical dark" />
                </Col>
                <Col md="4" className="position-relative">
                  <div className="p-3 text-center">
                    <h1 className="text-gradient text-warning">203</h1>
                    <h5 className="mt-3">Trámites y servicios</h5>
                    <p className="text-sm">Que pueden ser consultados para darles seguimiento</p>
                  </div>
                </Col>
              </Row>
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