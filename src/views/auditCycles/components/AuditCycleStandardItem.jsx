import { ListGroup } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLandmark, faTrash, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

import auditCycleProps from '../helpers/auditCycleProps'
import AuditCycleStandardEditItem from './AuditCycleStandardEditItem';
import auditStepProps from '../../audits/helpers/auditStepProps';
import enums from '../../../helpers/enums';
import { useAuthStore } from '../../../hooks/useAuthStore';
import { useAuditCycleStandardsStore } from '../../../hooks/useAuditCycleStandardsStore';
import { useEffect } from 'react';
import { isADCConceptValueDeleted } from '../../../store/slices/adcConceptValuesSlice';
import defaultStatusProps from '../../../helpers/defaultStatusProps';

const AuditCycleStandardItem = ({ item, readOnly = false, ...props }) => {
    const { DefaultStatusType } = enums();
    const itemStyle = `border-0 d-flex justify-content-between align-items-center px-0${item.Status >= DefaultStatusType.inactive ? ' opacity-6' : ''}${item.Status == DefaultStatusType.deleted ? ' text-decoration-line-through' : ''}`;

    const { ROLES, hasRole } = useAuthStore();

    const {
        isAuditCycleStandardDeleting,
        auditCycleStandardDeletedOk,
        auditCycleStandardsAsync,
        auditCycleStandardDeleteAsync,
        auditCycleStandardClear,
    } = useAuditCycleStandardsStore();

    // HOOKS

    useEffect(() => {
        if (auditCycleStandardDeletedOk) {

            auditCycleStandardsAsync({
                auditCycleID: item.AuditCycleID,
                pageSize: 0,
                includeDeleted: hasRole(ROLES.admin),
            });
            auditCycleStandardClear();

        }
    }, [auditCycleStandardDeletedOk]);
   
    // METHODS

    const onDelete = () => {
        Swal.fire({
            title: 'Delete standard',
            text: 'Are you sure you want to delete this standard?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {

            if (result.isConfirmed) {
                auditCycleStandardDeleteAsync(item.ID);
            }
        });
    }; // onDelete

    return (
        <ListGroup.Item {...props} className={itemStyle} title={ defaultStatusProps[item.Status].label }>
            <div className="d-flex justify-content-start align-items-center">
                <FontAwesomeIcon icon={faLandmark} size="lg" className="text-dark me-2" /> 
                <div>
                    <h6 className="text-sm mb-0">
                        {item.StandardName}
                    </h6>
                    <p className="text-xs text-secondary mb-0">
                        {auditCycleProps[item.CycleType].label} | { auditStepProps[item.InitialStep].label } 
                    </p>
                </div>
            </div>
            {
                !readOnly ? (
                    <div className="d-flex justify-content-end gap-2">
                        <AuditCycleStandardEditItem id={ item.ID } />
                        {
                            hasRole(ROLES.admin) ? (
                                <button
                                    type="button"
                                    className="btn btn-link p-0 mb-0"
                                    onClick={ onDelete }
                                    disabled={ isAuditCycleStandardDeleting }
                                >
                                    <FontAwesomeIcon icon={ faTrashAlt } size="lg" className="text-dark" />
                                </button>
                            ) : null
                        }
                    </div>
                ) : null
            }
        </ListGroup.Item>
    )
}

export default AuditCycleStandardItem