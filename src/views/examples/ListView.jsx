import { Button, Card, Col, Container, Row, Table } from 'react-bootstrap';

import DashboardLayout from '../../layouts/dashboard/DashboardLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faUser } from '@fortawesome/free-solid-svg-icons';

const headStyle = 'text-uppercase text-secondary text-xxs font-weight-bolder opacity-7';

const dataList = [
  {
    id: 1,
    estatus: 1,
    nombreCompleto: 'Adrián Castillo',
    email: 'adrian.castillo@arysoft.com.mx',
    area: 'Development',
    puesto: 'Project Manager',
    fechaIngreso: '01/03/2001',
  },
  {
    id: 2,
    estatus: 2,
    nombreCompleto: 'Fulano de Tal',
    email: 'fulano.detal@aarrin.com',
    area: 'Auditor',
    puesto: '9K, 14K',
    fechaIngreso: '01/01/0001',
  },
  // {
  //   id: 3,
  //   estatus: 1,
  //   nombreCompleto: 'Rodolfo Figueroa',
  //   email: 'rodolfo.figueroa@ciudadguzman.gob.mx',
  //   area: 'Tecnologías de la Información',
  //   puesto: 'Jefe Operativo',
  //   fechaIngreso: '01/01/2008',
  // },
  // {
  //   id: 4,
  //   estatus: 1,
  //   nombreCompleto: 'Ofelia Larios',
  //   email: 'ofelia.larios@ciudadguzman.gob.mx',
  //   area: 'Tecnologías de la Información',
  //   puesto: 'Jefe Administrativo',
  //   fechaIngreso: '01/01/1990',
  // },
  // {
  //   id: 5,
  //   estatus: 2,
  //   nombreCompleto: 'Armando de la Torre',
  //   email: 'armando.delatorre@ciudadguzman.gob.mx',
  //   area: 'Tecnologías de la Información',
  //   puesto: 'Encargado de Redes',
  //   fechaIngreso: '01/01/2001',
  // },
];

export const ListView = () => {
  return (
    <DashboardLayout>
      <Container fluid className="py-4">
        <Row className="mt-4">
          <Col xs="12">
            <Card className="mb-4">
              <Card.Header className="pb-0">
                <h6>List view</h6>
              </Card.Header>
              <Card.Body className="px-0 pt-0 pb-2">
                <div className="table-responsive p-0">
                  <table className="table align-items-center mb-0">
                    <thead>
                      <tr>
                        <th className={ headStyle }>Employee</th>
                        <th className={ headStyle }>Function</th>
                        <th className={ `text-center ${ headStyle }` }>Empleoyed</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        dataList.map(item => {
                          const iconStyle = `icon icon-sm icon-shape ${ item.estatus === 1 ? 'bg-gradient-info' : 'bg-gradient-warning' } border-radius-md d-flex align-items-center justify-content-center me-3`;

                          return (
                          <tr key={ item.id }>
                            <td>
                              <div className="d-flex px-2 py-1">
                                <div>
                                  <div className={ iconStyle }>
                                    <FontAwesomeIcon icon={ faUser } size="lg" className="opacity-10 text-white" aria-hidden="true" />
                                  </div>
                                </div>
                                <div className="d-flex flex-column justify-content-center">
                                  <h6 className="mb-0 text-sm">{ item.nombreCompleto }</h6>
                                  <p className="text-xs text-secondary mb-0">
                                    { item.email }
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td>
                              <p className="text-xs font-weight-bold mb-0">{ item.area }</p>
                              <p className="text-xs text-secondary mb-0">{ item.puesto }</p>
                            </td>
                            <td className="align-middle text-center">
                              <span className="text-secondary text-xs font-weight-bold">01/03/2021</span>
                            </td>
                            <td>
                              <a href="#" onClick={ () => alert(`Editar a: ${ item.id }`) }>
                                <FontAwesomeIcon icon={ faEdit } />
                              </a>
                            </td>
                          </tr>
                        )})
                      }
                    </tbody>
                  </table>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </DashboardLayout>
  )
}

export default ListView;