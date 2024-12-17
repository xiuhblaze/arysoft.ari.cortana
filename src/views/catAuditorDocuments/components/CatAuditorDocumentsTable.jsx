import React, { useState } from 'react'
import { useCatAuditorDocumentsStore } from '../../../hooks/useCatAuditorDocumentsStore'
import { ViewLoading } from '../../../components/Loaders';
import CatAuditorDocumentsTableItem from './CatAuditorDocumentsTableItem';

const CatAuditorDocumentsTable = () => {
    const headStyle = 'text-uppercase text-secondary text-xxs font-weight-bolder';

    const {
        isCatAuditorDocumentsLoading,
        catAuditorDocuments,
        catAuditorDocumentAsync,
        catAuditorDocumentClear
    } = useCatAuditorDocumentsStore();

    // HOOKS

    const [showModal, setShowModal] = useState(false);

    // METHODS

    const onShowModal = (id) => {
        setShowModal(true);
        catAuditorDocumentAsync(id);
    }; // onShowModal

    const onCloseModal = () => {
        setShowModal(false);
        catAuditorDocumentClear();
    }; // onCloseModal

    if (isCatAuditorDocumentsLoading) return <ViewLoading />
    
    return (
        <div>
            { 
                !!catAuditorDocuments && 
                <>
                    <div className="table-responsive p-0">
                        <table className="table align-items-center mb-0">
                            <thead>
                                <tr>
                                    <th className={ headStyle }>Document</th>
                                    <th className={ headStyle }>Type</th>
                                    <th className={ headStyle }>Warning</th>
                                    <th className={ headStyle }>Update</th>
                                    <th className={ headStyle }>Order</th>
                                    <th className={ headStyle }>Status</th>
                                    <th className={ headStyle }>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    catAuditorDocuments.map(item => {
                                        return (
                                            <CatAuditorDocumentsTableItem key={item.ID} item={ item } />
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>

                </>
            } 
        </div>
    )
}

export default CatAuditorDocumentsTable