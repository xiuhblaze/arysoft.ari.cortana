import { useEffect } from 'react';

import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';

import { Button, Card, Col, Container, Row } from 'react-bootstrap';

import { useAuthStore } from '../../hooks/useAuthStore';
import BasicLayout from '../../layouts/basic/BasicLayout';

import landscape from "../../assets/img/phoLoginLandscape.jpg";
import { AryFormikTextInput } from '../../components/Forms';

export const Login = () => {  
  const {
    status,
    user,
    userErrorMessage,
    loginASync,
  } = useAuthStore();

  useEffect(() => {
    if (!!userErrorMessage) {
      Swal.fire('Sesión', userErrorMessage, 'error');
    }
  }, [userErrorMessage]);

  const onSubmitForm = (values) => {
    //console.log(values);

    loginASync({
      username: values.userInput,
      password: values.passwordInput,
    });
  };

  return (
    <BasicLayout>
      <section>
        <div className="page-header min-vh-75">
          <Container>
            <Row>
              <Col xl="4" lg="5" md="6" className="d-flex flex-column mx-auto">
                <Card className="card-plain mt-8">
                  <Card.Header className="pb-0 text-left bg-transparent">
                    <h3 className="font-weight-bolder text-info text-gradient">Welcome back</h3>
                    <p className="mb-0">
                      Enter your username and password to sign in
                    </p>
                  </Card.Header>
                  <Card.Body>
                    <Formik
                      initialValues={{
                        userInput: '',
                        passwordInput: '',
                      }}
                      onSubmit={ onSubmitForm }
                      validationSchema={ Yup.object({
                        userInput: Yup.string()
                          .required('Required'),
                        passwordInput: Yup.string()
                          .required('Required'),
                      })}
                    >
                      { (formik) => (
                        <Form>
                          <AryFormikTextInput name="userInput" 
                            label="Username"
                            type="text"
                          />
                          <AryFormikTextInput name="passwordInput" 
                            label="Password"
                            type="password"
                          />
                          <div className="text-center">
                            <Button type="submit" variant="primary" className="bg-gradient-info w-100 mt-4 mb-0">Login</Button>
                          </div>
                        </Form>
                      )}
                    </Formik>
                  </Card.Body>
                  <Card.Footer className="text-center pt-0 px-lg-2 px-1">
                    <p className="mb-4 text-sm mx-auto">
                      Don't have an account?
                    </p>
                  </Card.Footer>
                </Card>
              </Col>
              <Col md="6">
                <div className="oblique position-absolute top-0 h-100 d-md-block d-none me-n8">
                  <div 
                    className="oblique-image bg-cover position-absoulte fixed-top ms-auto h-100 z-index-0 ms-n6"
                    style={{ backgroundImage: `url(${landscape})` }}
                  ></div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </section>
    </BasicLayout>
  )
}
