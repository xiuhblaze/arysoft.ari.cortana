import { Button, Card, Col, Container, Row } from 'react-bootstrap';

import { Form, Formik } from 'formik';
import * as Yup from 'yup';

import BasicLayout from '../../layouts/basic/BasicLayout';
import { AryFormikTextArea, AryFormikTextInput } from '../../components/Forms';

import bgElectronic from '../../assets/img/bgElectronic.jpg';
import imgTeam3 from '../../assets/img/team-3.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faPhoneSquare, faPhoneSquareAlt } from '@fortawesome/free-solid-svg-icons';

export const ContactView = () => {

  const initialValues = {
    nombreInput: '',
    emailInput: '',
    comentarioInput: '',
  };

  const validationSchema = Yup.object({
    nombreInput: Yup.string()
      .required('Required'),
    emailInput: Yup.string()
      .email('Must be a valid email')
      .required('Required'),
    comentarioInput: Yup.string()
      .required('Required')
  });

  const onFormSubmit = (values) => {
    console.log(values);
  };

  return (
    <BasicLayout>
      <header>
        <div className="page-header min-vh-85">
          <div>
            <img 
              className="position-absolute fixed-top ms-auto w-50 h-100 z-index-0 d-none d-sm-none d-md-block border-radius-section border-top-end-radius-0 border-top-start-radius-0 border-bottom-end-radius-0"
              src={ imgTeam3 } />
          </div>
          <Container>
            <Row>
              <Col lg="7" className="d-flex justify-content-center flex-column">
                <Card className="d-flex blur justify-content-center p-4 shadow-lg my-sm-0 my-sm-6 mt-8 mb-5">
                  <div className="text-center">
                    <h3 className="text-info text-gradient">Contact Us</h3>
                    {
                      false ? (
                        <>
                          <p className="mb-0">
                            For further questions contact using our contact form.
                          </p>
                          <Formik
                            initialValues={ initialValues }
                            validationSchema={ validationSchema }
                            onSubmit={ onFormSubmit }
                          >
                            { (formik) => (
                              <Form>
                                <Card.Body className="text-start pb-2">
                                  <Row>
                                    <Col md="6">
                                      <AryFormikTextInput name="nombreInput" 
                                        label="Name"
                                        type="text"
                                        placeholder="full name"
                                      />
                                    </Col>
                                    <Col md="6">
                                      <AryFormikTextInput name="emailInput"
                                        label="Email"
                                        type="email"
                                        placeholder="youremail@example.com"
                                      />
                                    </Col>
                                    <Col md="12">
                                      <AryFormikTextArea name="comentarioInput"
                                        label="How can we help you?"  
                                        rows="6"
                                        placeholder=""                            
                                      />
                                    </Col>
                                  </Row>
                                  <Row>
                                    <Col md="12" className="text-center">
                                      <Button type="submit" className="bg-gradient-info mt-3 mb-0">
                                        Send Message
                                      </Button>
                                    </Col>
                                  </Row>
                                </Card.Body>
                              </Form>
                            )}
                          </Formik>
                        </>
                      ) : (
                        <>
                          <Card.Body className="pb-2 text-start">
                            <p>
                              If you would like to speak with someone at ARI, please contact our local office 
                              at the number below. If you have a question, you can write us an email.
                            </p>
                            <h6>Our policies</h6>
                            <p>Complaints, disputes and appeals policy and process <a className="text-info" href="/files/ari-a-05-complaints-an-appeals-instructions.pdf" target="_blank">Download</a></p>
                            <h4 className='text-info text-gradient'>Contact Information</h4>
                            <Row>
                              {/* <Col md="6">
                                <h5>Ciudad de México</h5>
                                <div className="d-flex p-2">
                                  <div>
                                    <FontAwesomeIcon icon={ faPhone } />
                                  </div>
                                  <div className="ps-3">
                                    <a href="tel:5561308985" className="text-sm opacity-8">(+52) 556 130 8985</a>
                                  </div>
                                </div>
                                <div className="d-flex p-2">
                                  <div>
                                    <FontAwesomeIcon icon={ faEnvelope } />
                                  </div>
                                  <div className="ps-3">
                                    <a href="mailto:managermx@aarrin.com" className="text-sm opacity-8">managermx@aarrin.com</a>
                                  </div>
                                </div>
                              </Col> */}
                              <Col md="6">
                                <h5>Guadalajara</h5>
                                <div className="d-flex p-2 pb-0">
                                  <div>
                                    <FontAwesomeIcon icon={ faPhone } />
                                  </div>
                                  <div className="ps-3">
                                    <a href="tel:3330442083" className="text-sm opacity-8">(+52) 333 044 2083</a>
                                  </div>
                                  <div>
                                    <a href="https://api.whatsapp.com/send?phone=3330442083"
                                      className="text-sm opacity-8 text-success ms-2"
                                      target="_blank"
                                      title="Whatsapp"
                                    >
                                      <FontAwesomeIcon icon={ faPhoneSquare } size="xl" />
                                    </a>
                                  </div>
                                </div>
                                <div className="d-flex p-2">
                                  <div>
                                    <FontAwesomeIcon icon={ faEnvelope } />
                                  </div>
                                  <div className="ps-3">
                                    <a href="mailto:sales@aarrin.com" className="text-sm opacity-8">sales@aarrin.com</a>
                                  </div>
                                </div>
                              </Col>
                              <Col md="6">
                                <h5>Queretaro</h5>
                                <div className="d-flex p-2">
                                  <div>
                                    <FontAwesomeIcon icon={ faEnvelope } />
                                  </div>
                                  <div className="ps-3">
                                    <a href="mailto:contactqto@aarrin.com" className="text-sm opacity-8">contactqto@aarrin.com</a>
                                  </div>
                                </div>
                              </Col>
                              <Col md="6">
                                <h5>Puebla</h5>
                                <div className="d-flex p-2 pb-0">
                                  <div>
                                    <FontAwesomeIcon icon={ faPhone } />
                                  </div>
                                  <div className="ps-3">
                                    <a href="tel:2226712460" className="text-sm opacity-8">(+52) 222 671 2460</a>
                                  </div>
                                  <div>
                                    <a href="https://api.whatsapp.com/send?phone=2226712460"
                                      className="text-sm opacity-8 text-success ms-2"
                                      target="_blank"
                                      title="Whatsapp"
                                    >
                                      <FontAwesomeIcon icon={ faPhoneSquare } size="xl" />
                                    </a>
                                  </div>
                                </div>
                                <div className="d-flex p-2">
                                  <div>
                                    <FontAwesomeIcon icon={ faEnvelope } />
                                  </div>
                                  <div className="ps-3">
                                    <a href="mailto:salespuebla@aarrin.com" className="text-sm opacity-8">salespuebla@aarrin.com</a>
                                  </div>
                                </div>
                              </Col>
                              <Col md="6">
                                <h5>Santiago, Chile</h5>
                                <div className="d-flex p-2">
                                  <div>
                                    <FontAwesomeIcon icon={ faEnvelope } />
                                  </div>
                                  <div className="ps-3">
                                    <a href="mailto:salessantiago@aarrin.com" className="text-sm opacity-8">salessantiago@aarrin.com</a>
                                  </div>
                                </div>
                              </Col>
                              <Col md="6">
                                <h5>Linares, Chile</h5>
                                <div className="d-flex p-2">
                                  <div>
                                    <FontAwesomeIcon icon={ faEnvelope } />
                                  </div>
                                  <div className="ps-3">
                                    <a href="mailto:saleslinares@aarin.com" className="text-sm opacity-8">saleslinares@aarrin.com</a>
                                  </div>
                                </div>
                              </Col>
                              {/* <Col md="6">
                              <h5 className="text-success text-gradient">Whatsapp</h5>
                                <div className="d-flex p-2">
                                  <div>
                                    <FontAwesomeIcon icon={ faPhoneSquare } size="lg" />
                                  </div>
                                  <div className="ps-3">
                                    <a href="https://api.whatsapp.com/send?phone=3330442083" 
                                      className="text-sm opacity-8"
                                      target="_blank"
                                    >(+52) 556 130 8985</a>
                                  </div>
                                </div>
                              </Col> */}
                            </Row>
                          </Card.Body>
                        </>
                      )}
                  </div>

                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </header>
    </BasicLayout>
  )
}

export default ContactView;