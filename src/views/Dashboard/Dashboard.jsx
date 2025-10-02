import { useEffect, useState } from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import {
    faMagnifyingGlass,
    faHourglassStart
} from '@fortawesome/free-solid-svg-icons';

import { setHelpContent, setNavbarTitle, useArysoftUIController } from "../../context/context";
import { DashboardLayout } from "../../layouts/dashboard";
import { MiniStatisticsCard } from "../../components/Cards";

import CalendarCard from './components/CalendarCard';
import MiniNextAuditCard from './components/MiniNextAuditCard';
import Helper from '../../components/Helper/Helper';

export const Dashboard = () => {
    
    // CUSTOM HOOKS

    const [controller, despatch] = useArysoftUIController();

    // HOOKS

    const [statAudits, setStatAudits] = useState({
        total: 0,
        title: '-'
    });

    useEffect(() => {

        setNavbarTitle(despatch, 'Dashboard');
        setHelpContent(despatch, <Helper title="Dashboard" url="/help/" filename="dashboardHelp.md" />);
    }, []);

    return (
        <DashboardLayout>
            <Container fluid className="py-4">
                <Row>
                    <Col sm="6" xl="3" className="mb-xl-0 mb-4">
                        <MiniNextAuditCard />
                    </Col>
                    <Col sm="6" xl="3" className="mb-xl-0 mb-4">
                        <MiniStatisticsCard
                            title="Lorem ipsum"
                            count="0"
                            percentage={{ text: 'dolor sit amet', color: 'light' }}
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
                    <Col xs="12">
                        <Card>
                            <Card.Body>
                                <CalendarCard />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </DashboardLayout>
    )
}

export default Dashboard;