import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown';
import { Col, Container, Row, Card } from 'react-bootstrap';

import { DashboardLayout } from '../layouts/dashboard';
import { ViewLoading } from '../components/Loaders';

import './changelog.css';

const Changelog = () => {    

    // HOOKS

    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/CHANGELOG.md')
            .then(res => res.text())
            .then(text => {
                setContent(text);
                setLoading(false);
            })
            .catch(err => {
                console.log('Error fetching CHANGELOG.md', err);
                setLoading(false);
            });
    }, []);
    
    return (
        <DashboardLayout>
            <Container fluid className="py-4 px-0 px-sm-4">
                <Row>
                    <Col>
                        <Card className="mb-4">
                            <Card.Body>
                                {
                                    loading
                                    ? ( <ViewLoading /> ) 
                                    : (
                                        <div className="changelog-content">
                                            <ReactMarkdown
                                                components={{ html: () => null }}
                                                skipHtml={true}
                                            >
                                                {content}
                                            </ReactMarkdown>
                                        </div>
                                    )
                                }
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </DashboardLayout>
    )
}

export default Changelog