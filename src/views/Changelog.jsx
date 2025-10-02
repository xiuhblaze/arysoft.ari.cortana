import { useEffect, useState } from 'react'
import { Col, Container, Row, Card } from 'react-bootstrap';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm'

import { DashboardLayout } from '../layouts/dashboard';
import { ViewLoading } from '../components/Loaders';

import './changelog.css';

const Changelog = () => {    

    // HOOKS

    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/CHANGELOG.md')
            .then(res => {
                if (!res.ok) throw new Error('Error al cargar contenido');
                return (res.text());
            })
            .then(text => {
                const cleanText = text.replace(/<!--[\s\S]*?-->/g, '');                
                setContent(cleanText);
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
                                            <Markdown remarkPlugins={[remarkGfm]}>
                                                {content}
                                            </Markdown>
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