import { faExclamation, faFile, faFileCircleCheck, faFileCircleExclamation, faFileCircleXmark, faPlay, faRotate } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'
import { ListGroupItem } from 'react-bootstrap'
import isNullOrEmpty from '../../../helpers/isNullOrEmpty';
import enums from '../../../helpers/enums';
import { format } from 'date-fns';
import AuditorDocumentsEditItem from './AuditorDocumentsEditItem';
import auditorValidityProps from '../helpers/auditorValidityProps';

const AuditorDocumentsCardItem = ({ item, document, readOnly = false, ...props }) => {
    const { 
        AuditorDocumentValidityType,
        AuditorDocumentRequiredType,
        CatAuditorDocumentSubCategoryType
    } = enums();
    const itemStyle = `border-0 d-flex justify-content-between align-items-center px-0`;

    const subCategory = [
        { label: '-' },
        { label: 'CIV' },
        { label: 'K' },
        { label: 'L' },
    ];

    const requiredStatusStyle = [
        { color: 'text-secondary', label: '-'},
        { color: 'text-success', label: 'Current document'},
        { color: 'text-danger', label: 'The document is required'},
    ];

    const validityStatus = !!document 
        ? document.ValidityStatus
        : AuditorDocumentValidityType.nothing;

    const requiredStatus = item.IsRequired 
        ? !!document 
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
                            { item.SubCategory != CatAuditorDocumentSubCategoryType.nothing ? (
                                <span>Sub-Category {subCategory[item.SubCategory].label} - </span>
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
            <div className="d-flex justify-content-end align-items-center gap-1">
                {
                    !!document &&
                    <div className="d-flex flex-column me-2">
                        <p className="text-end text-xs mb-0" title="Date updated">
                            <FontAwesomeIcon icon={ faPlay } className="me-1" />
                            { format(new Date(document.StartDate), 'yyyy-MM-dd') }
                        </p>
                        <p className={`text-end text-xs mb-0 text-${ auditorValidityProps[validityStatus].variant }`} title="Next update">
                            <FontAwesomeIcon icon={ faRotate } className="me-1" />
                            { format(new Date(document.DueDate), 'yyyy-MM-dd') }
                        </p>
                    </div>
                }
                {
                    item.IsRequired && 
                    <FontAwesomeIcon 
                        icon={ faExclamation } 
                        size="lg" 
                        className={ requiredStatusStyle[requiredStatus].color }
                        title={ requiredStatusStyle[requiredStatus].label }

                    />
                }
                {
                    !!document ? (
                        <a href={`/files/auditors/${ document.AuditorID }/${ document.Filename }`}
                            alt="View file"
                            target="_blank"
                        >
                            <FontAwesomeIcon icon={ faFile } size="lg" />
                        </a>
                    ) : <FontAwesomeIcon icon={ faFile } size="lg" className="text-secondary" />
                }
                {
                    !readOnly && 
                    <div className="ms-2">
                        <AuditorDocumentsEditItem  
                            catAuditorDocumentID={ item.ID } 
                            auditorDocumentID={ !!document ? document.ID : null } 
                        />
                    </div>
                }
            </div>
        </ListGroupItem>
    )
}

export default AuditorDocumentsCardItem