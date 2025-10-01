import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import './Helper.css';

const Helper = ({ title, urlContent }) => {

    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(urlContent)
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
                console.log(`Error fetching: '${urlContent}'`, err);
                setLoading(false);
                setContent(null);
            });
    }, [urlContent]);

    return (
        <div className="bg-gray-100 rounded-2 p-3 mb-3">
            {
                loading ? (
                    <h5 className="mb-3">Loading...</h5>
                ) : !!content ? (
                    <div>
                        { !!title && <h4 className="mb-3">{title}</h4> }
                        <div 
                            className="helper-content"
                            style={{ maxHeight: 'calc(100vh - 500px)', overflowY: 'auto' }}
                        >
                            <ReactMarkdown remarkPlugins={[remarkGfm]} >
                                {content}
                            </ReactMarkdown>
                        </div>
                    </div>
                ) : (
                    <h5 className="text-secondary mb-3">No content</h5>
                )
            }
        </div>
    )
}

export default Helper