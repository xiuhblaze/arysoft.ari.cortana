import BasicLayout from "../../layouts/basic/BasicLayout"

import landscape from "../../assets/img/phoLoginLandscape.jpg";
import { Col, Container, Row } from "react-bootstrap";

export const AboutView = () => {
  return (
    <BasicLayout>
      <header>
        <div className="page-header min-vh-50 relative" style={{ backgroundImage: `url(${ landscape })` }}>
          <span className="mask bg-gradient-dark"></span>
          <Container>
            <Row>
              <Col lg="7" className="text-center mx-auto">
                <h1 className="text-white pt-3 mt-n3">Acerca de</h1>
                <p className="lead text-white shadow-lg mt-3">
                  Lorem ipsum dolor sit ameth
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
              <h2 className="text-primary text-gradient">Hola mundo</h2>

            </Col>
          </Row>
        </Container>
      </section>
    </BasicLayout>    
  )
}

export default AboutView;