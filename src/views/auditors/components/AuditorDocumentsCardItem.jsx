import { faExclamation, faFile, faFileCircleCheck, faFileCircleExclamation, faFileCircleXmark, faPlay, faRotate } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'
import { ListGroupItem } from 'react-bootstrap'
import isNullOrEmpty from '../../../helpers/isNullOrEmpty';
import enums from '../../../helpers/enums';
import { format } from 'date-fns';

const AuditorDocumentsCardItem = ({ item, document, ...props }) => {
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

    const validityStatusStyle = [
        { icon: faFile, label: 'No document', color: 'text-light', bgColor: 'bg-gradient-light' },
        { icon: faFileCircleCheck , label: 'Updated document', color: 'text-success', bgColor: 'bg-gradient-success' },
        { icon: faFileCircleExclamation ,label: 'The document is close to expired', color: 'text-warning', bgColor: 'bg-gradient-warning' },
        { icon: faFileCircleXmark , label: 'The document has expired', color: 'text-danger', bgColor: 'bg-gradient-danger' },
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
                        className={`icon icon-sm icon-shape ${ validityStatusStyle[validityStatus].bgColor } border-radius-md d-flex align-items-center justify-content-center me-2`}
                        title={ validityStatusStyle[validityStatus].label }
                    >
                        <FontAwesomeIcon icon={ validityStatusStyle[validityStatus].icon } className="opacity-10 text-white" aria-hidden="true" />
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
                        <p className={`text-end text-xs mb-0 ${ validityStatusStyle[validityStatus].color }`} title="Next update">
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
            </div>
        </ListGroupItem>
    )
}

export default AuditorDocumentsCardItem