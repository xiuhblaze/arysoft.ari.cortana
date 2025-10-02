import { useEffect, useState, memo } from 'react'
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import './Helper.css';
import { Nav } from 'react-bootstrap';
import isNullOrEmpty from '../../helpers/isNullOrEmpty';

const Helper = memo(({ title, url, filename }) => {

    const [contentEN, setContentEN] = useState(null);
    const [contentES, setContentES] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(null);

    useEffect(() => {

        if (isNullOrEmpty(url) || isNullOrEmpty(filename)) {
            setLoading(false);
            return;
        }

        getContent(url + 'en/' + filename, setContentEN);
        getContent(url + 'es/' + filename, setContentES);

        setLoading(false);
    }, [url, filename]);

    useEffect(() => {
      
        if (!!contentEN) {
            setActiveTab('en');
        } else if (!!contentES) {
            setActiveTab('es');
        } else {
            setActiveTab(null);
        }
    }, [contentEN, contentES]);
    
    const getContent = (urlContent, setContent) => {

        try {
            fetch(urlContent)
                .then(res => {
                    // if (!res.ok) throw new Error('Error al cargar contenido');
                    return (res.text());
                })
                .then(text => {
                    const cleanText = text.replace(/<!--[\s\S]*?-->/g, '');
                    setContent(cleanText);
                    // setLoading(false);
                })
                .catch(err => {
                    // console.log(`Error fetching: '${urlContent}'`, err);
                    setContent(null);
                });
        } catch (err) {
            console.log(`Error fetching: '${urlContent}'`, err);
            return null;
        }
    }; // getContent

    return (
        <div className="bg-gray-100 rounded-2 p-3 mb-3">
            {
                loading ? (
                    <h5 className="mb-3">Loading...</h5>
                ) : !!activeTab ? (
                    <div>                        
                        { !!title && <h4 className="mb-3">{title}</h4> }
                        <Nav
                            variant="pills"
                            className="nav-fill p-1 mb-3"
                            activeKey={activeTab}
                            onSelect={(selectedKey) => {
                                console.log('selectedKey', selectedKey);
                                setActiveTab(selectedKey);
                            }}
                            role="tablist"
                        >
                            {
                                !!contentEN && <Nav.Item>
                                    <Nav.Link eventKey="en" className="text-dark">English</Nav.Link>
                                </Nav.Item>
                            }
                            {
                                !!contentES && <Nav.Item>
                                    <Nav.Link eventKey="es" className="text-dark">Español</Nav.Link>
                                </Nav.Item>
                            }
                        </Nav>
                        {
                            activeTab == 'en' && <div className="helper-content" style={{ maxHeight: 'calc(100vh - 600px)', overflowY: 'auto' }}>
                                <ReactMarkdown remarkPlugins={[remarkGfm]} >
                                    {contentEN}
                                </ReactMarkdown>
                            </div>
                        }
                        {
                            activeTab == 'es' && <div className="helper-content" style={{ maxHeight: 'calc(100vh - 600px)', overflowY: 'auto' }}>
                                <ReactMarkdown remarkPlugins={[remarkGfm]} >
                                    {contentES}
                                </ReactMarkdown>
                            </div>
                        }
                    </div>
                ) : (
                    <h5 className="text-secondary mb-3">No content</h5>
                )
            }
        </div>
    )
});

export default Helper;