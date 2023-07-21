import { useEffect } from 'react';

import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';

import { Button, Card, Col, Container, Row } from 'react-bootstrap';

import { useAuthStore } from '../../hooks/useAuthStore';
import BasicLayout from '../../layouts/basic/BasicLayout';
import ZapFormikTextInput from '../../components/Forms/ZapformikTextInput';

import landscape from "../../assets/img/phoLoginLandscape.jpg";

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
                    <h3 className="font-weight-bolder text-info text-gradient">Bienvenido</h3>
                    <p className="mb-0">
                      Ingresa tu nombre de usuario y contraseña para iniciar sesión
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
                          .required('Es necesario el nombre del usuario'),
                        passwordInput: Yup.string()
                          .required('Es necesaria la contraseña del usuario'),
                      })}
                    >
                      { (formik) => (
                        <Form>
                          <ZapFormikTextInput name="userInput" 
                            label="Usuario"
                            type="text"
                          />
                          <ZapFormikTextInput name="passwordInput" 
                            label="Contraseña"
                            type="password"
                          />
                          <div className="text-center">
                            <Button type="submit" variant="primary" className="bg-gradient-info w-100 mt-4 mb-0">Iniciar sesión</Button>
                          </div>
                        </Form>
                      )}
                    </Formik>
                  </Card.Body>
                  <Card.Footer className="text-center pt-0 px-lg-2 px-1">
                    <p className="mb-4 text-sm mx-auto">
                      ¿Necesitas una cuenta?<br />Solicitala al departamento de TI
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
