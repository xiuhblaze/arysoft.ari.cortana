import { Card, Col, Container, ListGroup, ListGroupItem, Row } from 'react-bootstrap';

import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from "date-fns";
import enUS from 'date-fns/locale/en-US'
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowRight,
  faCalendar,
  faCommentsDollar,
  faGlobe,
  faLaptopCode,
  faListCheck,
  faNewspaper,
  faWandMagicSparkles
} from '@fortawesome/free-solid-svg-icons';

import { DashboardLayout } from '../../layouts/dashboard';
import { MiniStatisticsCard } from '../../components/Cards';

import bgElectronic from '../../assets/img/bgElectronic.jpg';
import { addDays, addHours } from 'date-fns';
import { setNavbarTitle, useArysoftUIController } from '../../context/context';
import { useEffect } from 'react';

const locales = {
  'en-US': enUS,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

const myEventsList = [
  {
      title: 'Auditoria ISO 9K Etapa 2',
      notes: 'Aun falta confirmación del cliente',
      start: new Date(),
      end: addHours(new Date(), 2),
      bgColor: '#347CF7',
      user: {
        id: '123',
        name: 'Adrián'
      }
    },
    {
      title: 'Auditoria ISO 14K Recertificación',
      notes: 'Viaticos en proceso',
      start: addDays(new Date(), 2),
      end: addDays(new Date(), 3),
      bgColor: '#82d616',
      user: {
        id: '123',
        name: 'Ariadne Elizabeth'
      }
    }
];

export const Dashboard = () => {
  const [controller, despatch] = useArysoftUIController();

  useEffect(() => {
    setNavbarTitle(despatch, null);
  }, []);
  

  return (
    <DashboardLayout>
      <Container fluid className="py-4">
        <Row>
          <Col sm="6" xl="3" className="mb-xl-0 mb-4">
            <MiniStatisticsCard 
              title="Audits"
              count="4" 
              percentage={{ text: 'in august', color: 'info' }}
              icon={{ icon: faGlobe, bgColor: 'info' }}
            />
          </Col>
          <Col sm="6" xl="3" className="mb-xl-0 mb-4">
            <MiniStatisticsCard
              title="Pending payments"
              count="2"
              percentage={{ text: 'for audits', color: 'danger' }}
              icon={{ icon: faCommentsDollar, bgColor: 'warning'}}
            />
          </Col>
          <Col sm="6" xl="3" className="mb-xl-0 mb-4">
            <MiniStatisticsCard
              title="Dolor sit amet"
              count="34.0"
              percentage={{ text: '+25%', color: 'success' }}
              icon={{ icon: faWandMagicSparkles, bgColor: 'success' }}
            />
          </Col>
          <Col sm="6" xl="3" className="mb-xl-0 mb-4">
            <MiniStatisticsCard
              title="Lorem ipsum"
              count="87.1"
              percentage={{ text: '+13', color: 'dark' }}
              icon={{ icon: faNewspaper, bgColor: 'primary' }}
            />
          </Col>
        </Row>
        <Row className="mt-4">
          <Col md="12">
            <Card>
              <Card.Body>
                <Calendar
                  localizer={localizer}
                  events={myEventsList}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: '60vh' }}
                />
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
                      <p className="mb-1 pt-2 text-bold">American Registration inc</p>
                      <h5 className="font-weight-bolder">Aqui va el calendario</h5>
                      <p className="mb-5">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Praesent ut nibh eget neque semper eleifend. 
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
                        <FontAwesomeIcon icon={ faCalendar } size="6x" className="w-100 position-relative z-index-2 pt-4 text-white" />
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
                <ListGroupItem>Ajustar los enlaces entre view para que sean con Link y no con hipervinculos</ListGroupItem>
                <ListGroupItem>Hacer la interfaz para editar un registro</ListGroupItem>
                <ListGroupItem>Quitar todo lo relacionado con el H</ListGroupItem>
                <ListGroupItem>Hacer la interfaz para home</ListGroupItem>
                <ListGroupItem>Agregar el lazy load</ListGroupItem>
                <ListGroupItem>Agregar el calendario en el dashboard</ListGroupItem>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      </Container>
    </DashboardLayout>
  )
}

export default Dashboard;