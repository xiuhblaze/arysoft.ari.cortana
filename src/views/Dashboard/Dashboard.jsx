import { useEffect, useState } from 'react';
import { Card, Col, Container, ListGroup, ListGroupItem, Row } from 'react-bootstrap';

import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, startOfMonth, startOfDay, endOfDay, endOfMonth, endOfWeek } from "date-fns";
import enUS from 'date-fns/locale/en-US'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { addDays, addHours } from 'date-fns'; // xBLAZE: Puede que sean temporales

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowRight,
    faCalendar,
    faCommentsDollar,
    faGlobe,
    faHourglass,
    faLaptopCode,
    faListCheck,
    faMagnifyingGlass,
    faNewspaper,
    faWandMagicSparkles,
    faHourglassStart
} from '@fortawesome/free-solid-svg-icons';

import { setNavbarTitle, useArysoftUIController } from "../../context/context";
import envVariables from "../../helpers/envVariables";
import enums from "../../helpers/enums";
import { DashboardLayout } from "../../layouts/dashboard";
import { MiniStatisticsCard } from "../../components/Cards";
import { useAuditsStore } from "../../hooks/useAuditsStore";

import bgElectronic from "../../assets/img/bgElectronic.jpg";
import CalendarEvent from './components/CalendarEvent';
import DashboardToolbar from './components/DashboardToolbar';
import auditStatusProps from '../audits/helpers/auditStatusProps';
import AuditModalEditItem from '../audits/components/AuditModalEditItem';
import auditStepProps from '../audits/helpers/auditStepProps';
import consoleLog from '../../helpers/consoleLog';


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

export const Dashboard = () => {
    const CALENDAR_LASTVIEW = 'ari-ariit-dashboard-lastview';

    const {
        DASHBOARD_OPTIONS,
        VITE_PAGE_SIZE,
    } = envVariables();

    const {
        AuditOrderType,
        DefaultStatusType,
    } = enums();

    // CUSTOM HOOKS

    const [controller, despatch] = useArysoftUIController();

    const {
        isAuditsLoading,
        audits,
        auditsMeta,

        auditsAsync,
        auditsClear,
        auditsErrorMessage,
    } = useAuditsStore();

    // HOOKS

    const [eventsList, setEventsList] = useState([]);
    const [lastview, setLastview] = useState(localStorage.getItem(CALENDAR_LASTVIEW) || 'month');
    const [auditID, setAuditID] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [statAudits, setStatAudits] = useState({
        total: 0,
        title: '-'
    });

    useEffect(() => {
        const { start, end } = getInitialRange();        
        const savedSearch = JSON.parse(localStorage.getItem(DASHBOARD_OPTIONS)) || null;
        const newSearch = {
            currentDate: currentDate,
            startDate: start, // : firstMonthDay,
            endDate: end, // lastMonthDay,
            pageSize: 0, // savedSearch?.pageSize ? savedSearch.pageSize : VITE_PAGE_SIZE,
            pageNumber: 1,
            order: savedSearch?.order ? savedSearch.order : AuditOrderType.date,
        };
        const search = !!savedSearch ? savedSearch : newSearch;
        
        if (!!search.currentDate) setCurrentDate(new Date(search.currentDate));

// consoleLog('useEffect[]: search', search);
        auditsAsync(search);
        localStorage.setItem(DASHBOARD_OPTIONS, JSON.stringify(search));
        setNavbarTitle(despatch, null);
    }, []);

    useEffect(() => {

        if (!!audits) {

            setEventsList(audits.map(item => {
                const endDate = new Date(item.EndDate);
                endDate.setHours(23, 59, 59, 999);

                const auditors = item.Auditors
                    .filter(i => i.Status == DefaultStatusType.active)
                    .map(i => i.AuditorName).join(', ');
    
                const toolTip = item.Description + '\n' 
                    + item.OrganizationName + '\n' 
                    + auditors + '\n' //item.Auditors.map(i => i.AuditorName).join(', ') + '\n'
                    + item.Standards.map(i => {
                        let s = i.StandardName;
                        s += ' - ' + auditStepProps[i.Step].
                        abbreviation.toUpperCase();
                        return s;
                    }).join(', ');
    
                return {
                    title: toolTip,
                    notes: item.OrganizationName,
                    start: new Date(item.StartDate),
                    end: endDate, // new Date(item.EndDate),
                    bgColor: item.Status == 1 ? '#347CF7' : '#82d616',
                    audit: item,
                    //allDay: true,
                    allDayAccessor: true,
                    // user: {
                    //     id: item.AuditorID,
                    //     name: item.AuditorName
                    // }
                }
            }));

            setStatAudits({
                total: audits.length,
                title: lastview
            });
        } else {
            setEventsList([]);
            setStatAudits({
                total: 0,
                title: '-'
            });
        }

        // console.log('audits', audits);
    }, [audits]);
    
    // METHODS

    const getInitialRange = () => {
        // Por defecto, calculamos el rango basado en la fecha actual y la vista predeterminada
        const currentDate = new Date();
        const view = lastview; // O la vista que uses por defecto

        let start, end;

        if (view === 'month') {
            const firstDayOfMonth = startOfMonth(currentDate);
            const lastDayOfMonth = endOfMonth(currentDate);
            const firstVisibleDay = startOfWeek(firstDayOfMonth);
            const lastVisibleDay = endOfWeek(lastDayOfMonth);

            start = firstVisibleDay;
            end = lastVisibleDay;         
        } else if (view === 'week') {

            start = startOfWeek(currentDate);
            end = endOfWeek(currentDate);
        } else if (view === 'day') {
            start = startOfDay(currentDate);
            end = endOfDay(currentDate);  
        } else {
            // Agenda view (por defecto 4 días en muchas configuraciones)
            start = currentDate;
            end = addDays(currentDate, 4);
        }

        if (!!start) start.setHours(0, 0, 0, 0);
        if (!!end) end.setHours(23, 59, 59, 999);

        // consoleLog('getInitialRange', start, end);

        return { start, end };
    }; // getInitialRange

    // Se ejecuta cada que se rendereiza un evento del calendario
    const eventPropGetter = (event, start, end, isSelected) => {
        // console.log('eventPropGetter', event);
        if (!!event) {
            // const style = {
            //     backgroundColor: isSelected ? '#17c1e8' : '#cb0c9f',
            //     backgroundImage: isSelected ? linearGradientPrimary : linearGradientInfo,
            // };
    
            let myClassName = ''; // isSelected ? 'bg-gradient-primary' : 'bg-gradient-info';
            myClassName += ` border-radius-lg`;
            myClassName += ` bg-gradient-${auditStatusProps[event.audit.Status].variant}`;
    
            return {
                className: myClassName,
            }
        }
    }; // eventPropGetter

    const onDoubleClick = (event) => {
        // console.log('onDoubleClick', event);

        setAuditID(event.audit.ID);
        setShowModal(true);
    }; // onDoubleClick

    const onSelect = (event) => {
        // consoleLog('onSelect', event);
    }; // onSelect

    const onViewChanged = (event) => {
        // console.log('onViewChanged', event);

        localStorage.setItem(CALENDAR_LASTVIEW, event);
        setLastview(event);
    }; // onViewChanged

    /// Se ejecuta cuando cambia el rango de fechas por cualquier motivo
    const onRangeChange = (range) => {
        // El formato de range depende de la vista actual
        // Para 'month' view: range es un array con un solo objeto {start, end}
        // Para 'week' o 'day' view: range es un objeto {start, end}
        // Para 'agenda' view: range es un array de fechas
        
        //consoleLog('Dashboard.onRangeChange(range)', range);

        let startDate, endDate;

        if (Array.isArray(range)) { // Creo que el valor de range ya es un array siempre
            if (range.length === 1) {
                // Vista mensual
                startDate = range[0];
                endDate = range[0];
            } else {
                // Vista agenda
                startDate = range[0];
                endDate = range[range.length - 1];
            }
        } else {
            // Vistas de semana o día
            startDate = range.start;
            endDate = range.end;
        }

        //consoleLog('Dashboard.onRangeChange(startDate, endDate)', startDate, endDate);

        // Actualizamos la consulta de auditorias con el rango de fechas a consultar
        const savedSearch = JSON.parse(localStorage.getItem(DASHBOARD_OPTIONS)) || null;
        const search = {
            ...savedSearch,
            startDate: startDate,
            endDate: endDate,
        };        
        auditsAsync(search);
        localStorage.setItem(DASHBOARD_OPTIONS, JSON.stringify(search));
    }; // onRangeChange

    const onNavigate = (date) => {
        // consoleLog('onNavigate', date);

        setCurrentDate(date);

        // Actualizamos la consulta de auditorias con la fecha base a mostrarse
        const savedSearch = JSON.parse(localStorage.getItem(DASHBOARD_OPTIONS)) || null;
        const search = {
            ...savedSearch,
            currentDate: date,
        };
        localStorage.setItem(DASHBOARD_OPTIONS, JSON.stringify(search));
    };

    const onCloseModal = () => {
        setShowModal(false);

        //console.log('onCloseModal');
        //! Actualizar listado o lo que se ocupe ne el Dashboard - YA!

        const savedSearch = JSON.parse(localStorage.getItem(DASHBOARD_OPTIONS)) || null;
        auditsAsync(savedSearch);
    }; // onCloseModal

    return (
        <DashboardLayout>
            <Container fluid className="py-4">
                <Row>
                    <Col sm="6" xl="3" className="mb-xl-0 mb-4">
                        <MiniStatisticsCard
                            title="Audits"
                            count={statAudits.total}
                            percentage={{ text: 'in the view', color: 'info' }}
                            icon={{ icon: faMagnifyingGlass, bgColor: 'info' }}
                        />
                    </Col>
                    <Col sm="6" xl="3" className="mb-xl-0 mb-4">
                        <MiniStatisticsCard
                            title="Lorem ipsum"
                            count="0"
                            percentage={{ text: 'dolor sit amet', color: 'light' }}
                            // icon={{ icon: faCommentsDollar, bgColor: 'warning' }}
                            icon={{ icon: faHourglassStart, bgColor: 'secondary' }}
                        />
                    </Col>
                    <Col sm="6" xl="3" className="mb-xl-0 mb-4">
                        <MiniStatisticsCard
                            title="Consectetur"
                            count="0"
                            percentage={{ text: 'adipiscing elit', color: 'light' }}
                            icon={{ icon: faHourglassStart, bgColor: 'secondary' }}
                        />
                    </Col>
                    <Col sm="6" xl="3" className="mb-xl-0 mb-4">
                        <MiniStatisticsCard
                            title="Sed id elit"
                            count="0"
                            percentage={{ text: 'sed gravida', color: 'light' }}
                            icon={{ icon: faHourglassStart, bgColor: 'secondary' }}
                        />
                    </Col>
                    {/* <Col sm="6" xl="3" className="mb-xl-0 mb-4">
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
                    </Col> */}
                </Row>
                <Row className="mt-4">
                    <Col md="12">
                        <Card>
                            <Card.Header className="pb-0">
                                <DashboardToolbar />
                            </Card.Header>
                            <Card.Body className="pt-0">
                                <Calendar
                                    date={currentDate}
                                    defaultView={lastview}
                                    localizer={localizer}
                                    events={eventsList}
                                    startAccessor="start"
                                    endAccessor="end"
                                    style={{ 
                                        minHeight: '800px',
                                        height: 'calc(100vh - 100px)' 
                                    }}
                                    eventPropGetter={eventPropGetter}
                                    components={{
                                        event: CalendarEvent
                                    }}
                                    onDoubleClickEvent={onDoubleClick}
                                    onSelectEvent={onSelect}
                                    onView={onViewChanged}
                                    onRangeChange={onRangeChange}
                                    onNavigate={onNavigate}
                                />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                {/* <Row className="mt-4">
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
                                            <a className="text-body text-sm font-weight-bold mb-0 icon-move-right mt-auto" href="#" onClick={() => alert('Esto no va a ningun lado')}>
                                                Ver más
                                                <FontAwesomeIcon icon={faArrowRight} className="text-sm ms-1" />
                                            </a>
                                        </div>
                                    </Col>
                                    <Col lg="5" className="ms-auto text-center mt-5 mt-lg-0">
                                        <div className="bg-gradient-info border-radius-lg h-100">
                                            <div className="position-relative d-flex align-items-center justify-content-center h-100">
                                                <FontAwesomeIcon icon={faCalendar} size="6x" className="w-100 position-relative z-index-2 pt-4 text-white" />
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
                                style={{ backgroundImage: `url(${bgElectronic})` }}
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
                                    <FontAwesomeIcon icon={faListCheck} className="me-2" />
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
                </Row> */}
                <AuditModalEditItem
                    id={ auditID }
                    show={showModal}
                    onHide={onCloseModal}
                />
            </Container>
        </DashboardLayout>
    )
}

export default Dashboard;