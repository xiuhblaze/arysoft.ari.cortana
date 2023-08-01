import { Button, Card, Col, Container, Row } from 'react-bootstrap';

import { Form, Formik } from 'formik';
import * as Yup from 'yup';

import BasicLayout from '../../layouts/basic/BasicLayout';
import { AryFormikTextArea, AryFormikTextInput } from '../../components/Forms';

import bgElectronic from '../../assets/img/bgElectronic.jpg';

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
              src={ bgElectronic} />
          </div>
          <Container>
            <Row>
              <Col lg="7" className="d-flex justify-content-center flex-column">
                <Card className="d-flex blur justify-content-center p-4 shadow-lg my-sm-0 my-sm-6 mt-8 mb-5">
                  <div className="text-center">
                    <h3 className="text-info text-gradient">Contact Us</h3>
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

                    <Card.Body className="pb-2">

                    </Card.Body>
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