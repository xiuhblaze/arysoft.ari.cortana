import { faBars, faExclamation, faFile, faFileCircleCheck, faFileCircleExclamation, faFileCircleXmark, faPlay, faRotate, faStickyNote, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'
import { ListGroupItem } from 'react-bootstrap'
import isNullOrEmpty from '../../../helpers/isNullOrEmpty';
import enums from '../../../helpers/enums';
import { format } from 'date-fns';
import AuditorDocumentsEditItem from './AuditorDocumentsEditItem';
import auditorValidityProps from '../helpers/auditorValidityProps';
import auditorRequiredProps from '../helpers/auditorRequiredProps';
import AuditorDocumentsHistoryList from './AuditorDocumentsHistoryList';
import catAuditorDocumentSubCategoryProps from '../../catAuditorDocuments/helpers/catAuditorDocumentSubCategoryProps';
import auditorDocumentTypeProps from '../helpers/auditorDocumentTypeProps';
import envVariables from '../../../helpers/envVariables';

const AuditorDocumentsCardItem = ({ item, document, readOnly = false, hideHistory = false, ...props }) => {
    const { 
        VITE_FILES_URL,
        URL_AUDITOR_FILES,
    } = envVariables();
    const { 
        AuditorDocumentType,
        AuditorDocumentValidityType,
        AuditorDocumentRequiredType,
        CatAuditorDocumentSubCategoryType,
        DefaultStatusType
    } = enums();
    const itemStyle = `border-0 d-flex justify-content-between align-items-center px-0${ !!document && document.Status == DefaultStatusType.inactive ? ' opacity-6' : '' }`;
    
    const validityStatus = !!document 
        ? document.ValidityStatus
        : AuditorDocumentValidityType.nothing;

    const requiredStatus = item.IsRequired 
        ? !!document && document.Status == DefaultStatusType.active
            ? AuditorDocumentRequiredType.success 
            : AuditorDocumentRequiredType.danger
        : AuditorDocumentRequiredType.nothing;

    return (
        <ListGroupItem {...props} className={ itemStyle }>
            <div className="d-flex align-items-center me-2">
                <div>
                    <div 
                        className={`icon icon-sm icon-shape bg-gradient-${ auditorValidityProps[validityStatus].variant } border-radius-md d-flex align-items-center justify-content-center me-2`}
                        title={ auditorValidityProps[validityStatus].singularLabel }
                    >
                        <FontAwesomeIcon icon={ auditorValidityProps[validityStatus].iconFile } className="opacity-10 text-white" aria-hidden="true" />
                    </div>
                </div>
                <div className="d-flex align-items-start flex-column justify-content-top">
                    {
                        !isNullOrEmpty(item.Name) &&
                        <h6 className="mb-0 text-sm text-dark text-gradient">
                            { !!item.SubCategory && item.SubCategory != CatAuditorDocumentSubCategoryType.nothing ? (
                                <span>Sub-Category {catAuditorDocumentSubCategoryProps[item.SubCategory].label} - </span>
                            ) : null }
                            { item.Name }
                        </h6>
                    }
                    { 
                        !isNullOrEmpty(item.Description) &&
                        <p className="text-xs font-weight-bold mb-0">
                            { item.Description }
                        </p>
                    }
                </div>
            </div>
            <div className="d-flex justify-content-end align-items-center gap-2">
                {
                    !!document &&
                    <div className="d-flex flex-column me-2">
                        {
                            !!document?.Type && document.Type != AuditorDocumentType.nothing &&
                            <p className="d-flex flex-row text-xs font-weight-bold justify-content-start mb-0" title="Document type">
                                <FontAwesomeIcon icon={ faFile } className="me-1" fixedWidth />
                                { auditorDocumentTypeProps[document.Type].label }
                            </p>
                        }
                        <p className="d-flex flex-row justify-content-start text-xs mb-0" title="Date updated">
                            <FontAwesomeIcon icon={ faPlay } className="me-1" fixedWidth />
                            { format(new Date(document.StartDate), 'dd-MM-yyyy') }
                        </p>
                        <p className={`d-flex flex-row justify-content-start text-xs mb-0 text-${ auditorValidityProps[validityStatus].variant }`} title="Next update">
                            <FontAwesomeIcon icon={ faRotate } className="me-1" fixedWidth />
                            { format(new Date(document.DueDate), 'dd-MM-yyyy') }
                        </p>
                    </div>
                }
                {
                    item.IsRequired && 
                    <FontAwesomeIcon 
                        icon={ faTriangleExclamation } 
                        size="lg" 
                        // className={ `text-${auditorRequiredProps[requiredStatus].variant}` }
                        className={ requiredStatus == AuditorDocumentRequiredType.success ? 'text-light' : 'text-danger'}
                        title={ auditorRequiredProps[requiredStatus].singularLabel }
                    />
                }
                {
                    !!document ? (
                        <a href={`${VITE_FILES_URL}${URL_AUDITOR_FILES}/${ document.AuditorID }/${ document.Filename }`}
                            alt="View file"
                            target="_blank"
                        >
                            <FontAwesomeIcon icon={ faFile } size="lg" />
                        </a>
                    ) : <FontAwesomeIcon icon={ faFile } size="lg" className="text-light" />
                }
                {/* <div className="d-flex justify-content-end align-items-center ms-2 gap-2"> */}
                    { 
                        !!document && !isNullOrEmpty(document.Observations) 
                            ? <FontAwesomeIcon icon={ faStickyNote } className="text-warning" title={ document.Observations } />
                            : <FontAwesomeIcon icon={ faStickyNote } className="text-light" title="No observations" />
                    }
                    {
                        !readOnly && 
                            <AuditorDocumentsEditItem  
                                catAuditorDocumentID={ item.ID } 
                                auditorDocumentID={ !!document ? document.ID : null } 
                            />
                    }
                    {
                        !hideHistory && <AuditorDocumentsHistoryList catAuditorDocumentID={ item.ID } readOnly={ readOnly } />
                    }
                {/* </div> */}
            </div>
        </ListGroupItem>
    )
}

export default AuditorDocumentsCardItem