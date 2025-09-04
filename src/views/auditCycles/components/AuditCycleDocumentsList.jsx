//import { useState } from 'react';

import auditCycleDocumentTypeProps from '../helpers/auditCycleDocumentTypeProps';
import enums from '../../../helpers/enums';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEdit, faPlus, faStickyNote } from '@fortawesome/free-solid-svg-icons';
// import envVariables from '../../../helpers/envVariables';
// import { useOrganizationsStore } from '../../../hooks/useOrganizationsStore';
import AuditCycleDocumentEditItem from './AuditCycleDocumentEditItem';
//import isNullOrEmpty from '../../../helpers/isNullOrEmpty';
import AuditList from '../../audits/components/AuditList';
import AuditEditItem from '../../audits/components/AuditEditItem';
import { useAuditCycleDocumentsStore } from '../../../hooks/useAuditCycleDocumentsStore';
//import { useAuditCyclesStore } from '../../../hooks/useAuditCyclesStore';
import AuditCycleDocumentItem from './AuditCycleDocumentItem';
import { useOrganizationsStore } from '../../../hooks/useOrganizationsStore';
// import { faFile, faWindowMaximize } from '@fortawesome/free-solid-svg-icons';
// import AppFormModalEditItem from '../../appForms/components/AppFormModalEditItem';
import AppFormButtonNewItem from '../../appForms/components/AppFormButtonNewItem';
import AppFormAuditCycleList from '../../appForms/components/AppFormAuditCycleList';
import ADCAuditCycleList from '../../adcs/components/ADCAuditCycleList';
import { useADCsStore } from '../../../hooks/useADCsStore';
import { useAppFormsStore } from '../../../hooks/useAppFormsStore';

const AuditCycleDocumentsList = ({ readOnly = false, showAllFiles = false, ...props }) => {
    // console.log('AuditCycleDocumentsList');
    const { 
        AuditCycleDocumentType,
        DefaultStatusType,
        OrganizationStatusType,
    } = enums();

    // CUSTOM HOOKS

    const {
        organization
    } = useOrganizationsStore();

    const {
        auditCycleDocuments
    } = useAuditCycleDocumentsStore();

    const {
        appForms
    } = useAppFormsStore();

    const {
        adcs
    } = useADCsStore();

    // HOOKS

    // const [showAppFormModal, setShowAppFormModal] = useState(false);

    // METHODS

    // const onShowAppFormModal = () => {
    //     console.log('onShowAppFormModal: show new app form');
    //     setShowAppFormModal(true);
    // }; // onShowAppFormModal

    // const onHideAppFormModal = () => {
    //     console.log('onHideAppFormModal: hide');
    //     setShowAppFormModal(false);
    // }; // onHideAppFormModal

    return (
        <div {...props} className="timeline timeline-one-side">
            {
                auditCycleDocumentTypeProps
                    .filter(i => i.id != AuditCycleDocumentType.nothing && i.id != AuditCycleDocumentType.audit)
                    .map(item => {
                        let iconColorStyle = 'secondary';

                        const documents = auditCycleDocuments.filter(doc => doc.DocumentType == item.id
                            && (showAllFiles || doc.Status == DefaultStatusType.active)
                        );

                        // Para indicar si hay o no documentos o formularios de acuerdo al tipo
                        if ((item.id == AuditCycleDocumentType.appForm && !!appForms && appForms.length > 0) || documents.length > 0) {
                            iconColorStyle = `text-${item.variant} text-gradient`;
                        } else if ((item.id == AuditCycleDocumentType.adc && !!adcs && adcs.length > 0) || documents.length > 0) {
                            iconColorStyle = `text-${item.variant} text-gradient`;
                        } else {
                            iconColorStyle = `text-${ documents.length == 0 
                                ? 'secondary'
                                : item.variant} text-gradient`;
                        }

                        if (organization.Status == OrganizationStatusType.applicant
                            && item.id > AuditCycleDocumentType.proposal
                        ) 
                            return null;
                        
                        return (    
                            <div key={item.id}>
                                {
                                    item.id == AuditCycleDocumentType.appForm ?
                                    <div  className="timeline-block mb-3">
                                        <div className="timeline-step">
                                            <FontAwesomeIcon icon={item.icon} className={iconColorStyle} />
                                        </div>
                                        <div className="timeline-content" style={{ maxWidth: 'none' }}>
                                            <div className='d-flex justify-content-between align-items-center me-1 mb-0'>
                                                <div>
                                                    <h6 className="text-sm text-dark font-weight-bold mb-0">{item.label}</h6>
                                                    <p className="text-xs text-secondary mb-0">{item.helpText}</p>
                                                </div>
                                                <div className="d-flex align-items-center gap-3">
                                                    <AppFormButtonNewItem />
                                                    <div className="text-dark text-sm font-weight-bold">
                                                        <AuditCycleDocumentEditItem 
                                                            documentType={ item.id }
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="d-flex justify-content-start flex-wrap gap-2 mt-1 mb-0">
                                                {
                                                    documents.map(doc => <AuditCycleDocumentItem key={doc.ID} item={doc} readOnly={readOnly} />)
                                                }
                                            </div>
                                            { documents.length > 0 ? <hr className="horizontal dark my-3" /> : null }
                                            <AppFormAuditCycleList />
                                        </div>
                                    </div> : null
                                }
                                {
                                    item.id == AuditCycleDocumentType.adc ?
                                    <div  className="timeline-block mb-3">
                                        <div className="timeline-step">
                                            <FontAwesomeIcon icon={item.icon} className={iconColorStyle} />
                                        </div>
                                        <div className="timeline-content" style={{ maxWidth: 'none' }}>
                                            <div className='d-flex justify-content-between align-items-center me-1 mb-0'>
                                                <div>
                                                    <h6 className="text-sm text-dark font-weight-bold mb-0">{item.label}</h6>
                                                    <p className="text-xs text-secondary mb-0">{item.helpText}</p>
                                                </div>
                                                <div className="d-flex align-items-center gap-3">
                                                    <div className="text-dark text-sm font-weight-bold">
                                                        <AuditCycleDocumentEditItem 
                                                            documentType={ item.id }
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="d-flex justify-content-start flex-wrap gap-2 mt-1 mb-0">
                                                {
                                                    documents.map(doc => <AuditCycleDocumentItem key={doc.ID} item={doc} readOnly={readOnly} />)
                                                }
                                            </div>
                                            { documents.length > 0 ? <hr className="horizontal dark my-3" /> : null }
                                            <ADCAuditCycleList showAll={ showAllFiles } />
                                        </div>
                                    </div> : null
                                }
                                { // EL RESTO DE PASOS
                                    item.id != AuditCycleDocumentType.appForm 
                                    && item.id != AuditCycleDocumentType.adc ? (
                                        <div  className="timeline-block mb-3">
                                            <div className="timeline-step">
                                                <FontAwesomeIcon icon={item.icon} className={iconColorStyle} />
                                            </div>
                                            <div className="timeline-content" style={{ maxWidth: 'none' }}>
                                                <div className='d-flex justify-content-between align-items-center me-1 mb-0'>
                                                    <div>
                                                        <h6 className="text-sm text-dark font-weight-bold mb-0">{item.label}</h6>
                                                        <p className="text-xs text-secondary mb-0">{item.helpText}</p>
                                                    </div>
                                                    <div className="d-flex align-items-center gap-3">
                                                        <div className="text-dark text-sm font-weight-bold">
                                                            <AuditCycleDocumentEditItem 
                                                                documentType={ item.id }
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="d-flex justify-content-start flex-wrap gap-2 mt-1 mb-0">
                                                    {
                                                        documents.map(doc => <AuditCycleDocumentItem key={doc.ID} item={doc} readOnly={readOnly} />)
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    ) : null
                                }
                                {
                                    item.id == AuditCycleDocumentType.auditProgramme &&
                                    <div className="timeline-block mb-3">
                                        <div className="timeline-step">
                                            <FontAwesomeIcon 
                                                icon={auditCycleDocumentTypeProps[AuditCycleDocumentType.audit].icon} 
                                                className={`text-${auditCycleDocumentTypeProps[AuditCycleDocumentType.audit].variant} text-gradient`}
                                            />
                                        </div>
                                        <div className="timeline-content" style={{ maxWidth: 'none' }}>
                                            <div className='d-flex justify-content-between align-items-center me-1 mb-0'>
                                                <div>
                                                    <h6 className="text-sm text-dark font-weight-bold mb-0">
                                                        {auditCycleDocumentTypeProps[AuditCycleDocumentType.audit].label}
                                                    </h6>
                                                    <p className="text-xs text-secondary mb-0">
                                                        {auditCycleDocumentTypeProps[AuditCycleDocumentType.audit].helpText}
                                                    </p>
                                                </div>
                                                <div className="text-dark text-sm font-weight-bold">
                                                    <AuditEditItem />
                                                </div>
                                            </div>
                                            <div className="d-flex justify-content-start gap-3 mt-1 mb-0">
                                                <AuditList showAllFiles={ showAllFiles } />
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                        )
                    })
            }
        </div>        
    )
}

export default AuditCycleDocumentsList