import { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/dashboard/DashboardLayout';
import { Button, Card, Col, Container, ListGroup, Nav, Row } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCross, faUserEdit, faUserGear, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useUsersStore } from '../../hooks/useUsersStore';
import { useAuthStore } from '../../hooks/useAuthStore';

import bgElectronic from '../../assets/img/bgElectronic.jpg';
import imgHeaderBg from '../../assets/img/imgCiudad01.jpg'
import enums from '../../helpers/enums';
import defaultStatusProps from '../../helpers/defaultStatusProps';
import { getFullName } from '../../helpers/getFullName';
import { ViewLoading } from '../../components/Loaders';
import AryDefaultStatusBadge from '../../components/AryDefaultStatusBadge/AryDefaultStatusBadge';
import AryLastUpdatedInfo from '../../components/AryLastUpdatedInfo/AryLastUpdatedInfo';


export const Profile = () => {
    const [showNotifications, setShowNotifications] = useState(true);
    const [baja, setBaja] = useState(false);
    const [activeGruposTab, setActiveGruposTab] = useState('gruposTab');

    const onShowNotifications = () => setShowNotifications(!showNotifications);
    const onBaja = () => setBaja(!baja);
    const gruposSelectedKey = (selectedKey) => setActiveGruposTab(selectedKey);

    const {
        DefaultStatusType,
        UserType
    } = enums();



    // CUSTOM HOOKS

    const {
        user: authUser
    } =useAuthStore();

    const {
        isUserLoading,
        user,
        userAsync,
    } = useUsersStore();

    // HOOKS

    useEffect(() => {

        if (!!authUser) {
            // console.log(authUser);
            userAsync(authUser.id);
        }
    }, [authUser]);
    

    useEffect(() => {
        
        if (!!user) {
            console.log(user);
        }
    }, [user]);
    

    // METHODS

    return (
        <DashboardLayout>
            <Container fluid>
                <div className="page-header min-height-200 border-radius-xl"
                    style={{
                        backgroundImage: `url(${imgHeaderBg})`,
                        backgroundPosition: '50%',
                    }}
                >
                    <span className={`mask bg-gradient-${ isUserLoading || !user ? 'dark' : defaultStatusProps[user.Status].bgColor} opacity-6`}></span>
                </div>
                <div className="card card-body blur shadow-blur mx-4 mt-n6 overflow-hidden">
                    <Row className="gx-4">
                        <Col className="col-auto">
                            <div className="icon icon-lg icon-shape bg-gradient-info border-radius-md d-flex align-items-center justify-content-center">
                                <FontAwesomeIcon icon={faUserGear} size="2x" className="text-white" />
                            </div>
                        </Col>
                        <Col className="col-auto my-auto">
                            <div className="h-100">
                                <h5 className="mb-1">{ !!user && user.Username }</h5>
                                <p className="mb-0 font-weight-bold text-sm">{ !!user && user.Email }</p>
                            </div>
                        </Col>
                        <Col lg="4" md="6" className="col-lg-4 col-md-6 my-sm-auto ms-sm-auto me-sm-0 mx-auto mt-3 text-end">
                            <AryDefaultStatusBadge value={ !!user ? user.Status : DefaultStatusType.nothing } />
                        </Col>
                    </Row>
                </div>
            </Container>
            <Container fluid className="py-4">
                {
                    isUserLoading ? (
                        <ViewLoading />
                    ) : !!user && (
                        <>
                            <Row>
                                <Col xs="12" xl="4">
                                    <Card className="h-100">
                                        <Card.Header className="pb-0 p-3">
                                            <Row>
                                                <Col md="8" className="d-flex align-items-center">
                                                    <h6 className="mb-0">Profile Information</h6>
                                                </Col>
                                                <Col md="4" className="text-end">
                                                    {/* <Button variant="link" className="text-secondary px-2 py-1 mb-0" title="Edit info">
                                                        <FontAwesomeIcon icon={faUserEdit} />
                                                    </Button> */}
                                                </Col>
                                            </Row>
                                        </Card.Header>
                                        <Card.Body className="p-3">
                                            <p className="text-sm">User information, if you need some update, please contact the administrator.</p>
                                            <hr className="horizontal dark my-2" />
                                            <ul className="list-group">
                                                <li className="list-group-item border-0 ps-0 pt-0 text-sm">
                                                    <strong className="text-dark me-2">Name:</strong>
                                                    { getFullName(user) }
                                                </li>
                                                {/* <li className="list-group-item border-0 ps-0 text-sm">
                                                    <strong className="text-dark me-2">Area:</strong>
                                                    TI
                                                </li> */}
                                                <li className="list-group-item border-0 ps-0 text-sm">
                                                    <strong className="text-dark me-2">Type:</strong>
                                                    
                                                </li>
                                                <li className="list-group-item border-0 ps-0 text-sm">
                                                    <strong className="text-dark me-2">EMail:</strong>
                                                    { user.Email }
                                                </li>
                                                <li className="list-group-item border-0 ps-0 text-sm">
                                                    <strong className="text-dark me-2">Status:</strong>
                                                    <AryDefaultStatusBadge value={ !!user ? user.Status : DefaultStatusType.nothing } />
                                                </li>
                                                <li className="list-group-item border-0 ps-0 text-sm">
                                                    <strong className="text-dark me-2">Roles:</strong>
                                                    {
                                                        user.Roles.map( item => (
                                                            <span key={item.ID} className="badge bg-gradient-secondary">
                                                                { item.Name }
                                                            </span>
                                                        ))
                                                    }
                                                </li>
                                            </ul>
                                            <hr className="horizontal dark my-2" />
                                            <AryLastUpdatedInfo item={ user } />
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col xs="12" xl="4">
                                    <Card className="h-100">
                                        <Card.Header className="pb-0 p-3">
                                            <h6 className="mb-0">Settings</h6>
                                        </Card.Header>
                                        <Card.Body className="p-3">
                                            <h6 className="text-uppercase text-body text-xs font-weight-bolder">Account</h6>
                                            {/* <ul className="list-group">
                                                <li className="list-group-item border-0 px-0">
                                                    <div className="form-check form-switch ps-0">
                                                        <input type="checkbox"
                                                            id="showNotificationsCheckbox"
                                                            className="form-check-input ms-auto"
                                                            checked={showNotifications}
                                                            // onClick={ onShowNotifications }
                                                            onChange={onShowNotifications}
                                                        />
                                                        <label htmlFor="showNotificationsCheckbox"
                                                            className="form-check-label text-body ms-3 text-truncate w-80 mb-0"
                                                        >
                                                            Show notifications
                                                        </label>
                                                    </div>
                                                </li>
                                                <li className="list-group-item border-0 px-0">
                                                    <div className="form-check form-switch ps-0">
                                                        <input type="checkbox"
                                                            id="bajaCheckbox"
                                                            className="form-check-input ms-auto"
                                                            checked={baja}
                                                            // onClick={ onShowNotifications }
                                                            onChange={onBaja}
                                                        />
                                                        <label htmlFor="bajaCheckbox"
                                                            className="form-check-label text-body ms-3 text-truncate w-80 mb-0"
                                                        >
                                                            Other option
                                                        </label>
                                                    </div>
                                                </li>
                                            </ul> */}
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col xs="12" xl="4">
                                    <Card className="h-100">
                                        <Card.Header className="pb-0 p-3">
                                            <h6 className="mb-0">Notifications</h6>
                                        </Card.Header>
                                        <Card.Body>

                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                            <Row className="my-4 d-none">
                                <Col xs="12" xl="8">
                                    <Card className="h-100">
                                        <Card.Header className="pb-0 p-3">
                                            <h6 className="mb-1">Access Level</h6>
                                            <p className="text-sm mb-0">
                                                Listado de grupos a los que pertenece el usuario, estos deterniman el nivel de acceso a los
                                                módulos del sistema.
                                            </p>
                                        </Card.Header>
                                        <Card.Body className="p-3">
                                            <Nav
                                                variant="pills"
                                                onSelect={gruposSelectedKey}
                                                className="nav-fill p-1 mb-2"
                                                defaultActiveKey="gruposTab"
                                            >
                                                <Nav.Item>
                                                    <Nav.Link eventKey="gruposTab">
                                                        Grupos
                                                    </Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item>
                                                    <Nav.Link eventKey="permisosTab">
                                                        Permisos
                                                    </Nav.Link>
                                                </Nav.Item>
                                            </Nav>
                                            {activeGruposTab === 'gruposTab' ? (
                                                <ListGroup>
                                                    <ListGroup.Item className="border-0 d-flex align-items-center px-0">
                                                        <div className="d-flex align-items-start flex-column justify-content-center">
                                                            <h6 className="mb-0 text-sm">Lorem Ipsum</h6>
                                                            <p className="mb-0 text-xs">Sed ut quam enim curabitur congue sapien a sem vestibulum</p>
                                                        </div>
                                                        <Button variant="link" className="px-2 py-1 mb-0 text-dark ms-auto" size="lg" title="Quitar al usuario del grupo">
                                                            <FontAwesomeIcon icon={faXmark} />
                                                        </Button>
                                                    </ListGroup.Item>
                                                    <ListGroup.Item className="border-0 d-flex align-items-center px-0">
                                                        <div className="d-flex align-items-start flex-column justify-content-center">
                                                            <h6 className="mb-0 text-sm">Nombre del Grupo</h6>
                                                            <p className="mb-0 text-xs">Descripción del grupo al que está asignado</p>
                                                        </div>
                                                        <Button variant="link" className="px-2 py-1 mb-0 text-dark ms-auto" size="lg" title="Quitar al usuario del grupo">
                                                            <FontAwesomeIcon icon={faXmark} />
                                                        </Button>
                                                    </ListGroup.Item>
                                                </ListGroup>
                                            ) : (
                                                <ListGroup>
                                                    <ListGroup.Item className="border-0">
                                                        Proin in ultricies mauris
                                                    </ListGroup.Item>
                                                    <ListGroup.Item className="border-0">
                                                        Nam magna dui
                                                    </ListGroup.Item>
                                                </ListGroup>
                                            )}
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col xs="12" xl="4">
                                    <div className="p-3">
                                        <ul className="list-group bg-transparent">
                                            <li className="list-group-item text-secondary border-0 ps-0 text-sm bg-transparent">
                                                <strong className="me-2">Última actualización:</strong>
                                                01/03/2033
                                            </li>
                                            <li className="list-group-item text-secondary border-0 ps-0 text-sm bg-transparent">
                                                <strong className="me-2">Realizada por:</strong>
                                                adrian.castillo
                                            </li>
                                        </ul>
                                    </div>
                                </Col>
                            </Row>
                        </>
                    )
                }
                
            </Container>
        </DashboardLayout>
    )
}

export default Profile;
