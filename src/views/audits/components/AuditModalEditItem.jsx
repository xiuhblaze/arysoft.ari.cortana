import { Formik } from "formik";
import { Modal } from "react-bootstrap";
import { useAuditsStore } from "../../../hooks/useAuditsStore";
import { useEffect, useRef, useState } from "react";
import { ViewLoading } from "../../../components/Loaders";
import * as Yup from "yup";
import enums from "../../../helpers/enums";
import { useAuditAuditorsStore } from "../../../hooks/useAuditAuditorsStore";
import { useAuditStandardsStore } from "../../../hooks/useAuditStandardsStore";
import { useAuditCyclesStore } from "../../../hooks/useAuditCyclesStore";
import { useOrganizationsStore } from "../../../hooks/useOrganizationsStore";
import Swal from "sweetalert2";

const AuditModalEditItem = ({ id, show, onHide, ...props }) => {

    const {
        AuditStatusType
    } = enums();
    const formDefaultValues = {
        descriptionInput: '',
        startDateInput: '',
        endDateInput: '',
        statusSelect: AuditStatusType.scheduled,
        hasWitnessCheck: false,
        standardsCountHidden: 0,
        auditorsCountHidden: 0,
    }; // formDefaultValues
    const validationSchema = Yup.object({
            descriptionInput: Yup.string()
                .max(1000, ''),
            startDateInput: Yup.date()
                .typeError('Start date has an invalid format')
                .required('Must specify start date'),
            endDateInput: Yup.date()
                .typeError('End date has an invalid format')
                .required('Must specify end date'),
            statusSelect: Yup.string()
                .oneOf(Object.values(AuditStatusType)
                        .filter(ast => ast != AuditStatusType.nothing)
                        .map(ast => ast + ''), 
                    'Select a valid option')
                .required('Must select a status'),
            standardsCountHidden: Yup.number()
                .min(1, 'Must have at least one standard'),
            auditorsCountHidden: Yup.number()
                .when('statusSelect', {
                    is: (statusSelect) => statusSelect > AuditStatusType.scheduled,
                    then: schema => schema.min(1, 'From the Confirmed status, there must be at least one auditor assigned')
                }),
        }); 

    // CUSTOM HOOKS

    const {
        isOrganizationLoading,
        organization,
        organizationAsync,
    } = useOrganizationsStore();

    const {
        isAuditCycleLoading,
        auditCycle,
        auditCycleAsync,
    } = useAuditCyclesStore();

    const {
        auditStandards
    } = useAuditStandardsStore();

    const {
        auditAuditors
    } = useAuditAuditorsStore();

    const {
        isAuditLoading,
        isAuditCreating,
        isAuditSaving,
        auditSavedOk,
        audit,
        auditsErrorMessage,

        auditsAsync,
        auditAsync,
        auditCreateAsync,
        auditSaveAsync,
        auditClear,
    } = useAuditsStore();

    // HOOKS

    const formikRef = useRef(null);

    const [showModal, setShowModal] = useState(!!show);
    const [initialValues, setInitialValues] = useState(formDefaultValues);

    useEffect(() => {
        
        if (!!show) {
            console.log('AuditModalEditItem', id);
            if (!!id) {
                auditAsync(id);
            } else if (!!auditCycle) {
                //* Crear nuevo audit
                auditCreateAsync({
                    AuditCycleID: auditCycle.ID,
                });
            } else {
                Swal.fire('Audit', 'You must specify the ID or the audit cycle', 'warning');
                onCloseModal();
            }
        }
    }, [show]);
    

    useEffect(() => {

        if (!!audit) {
            //setIsNew(audit.State == AuditStatusType.nothing);
            
        }

    }, [audit]);
    

    // METHODS

    const onCloseModal = () => {
        
        setShowModal(false);

        if (!!onHide) onHide();

    };  // onCloseModal

    return (
        <Modal {...props} show={showModal} onHide={ onCloseModal }>
            <Modal.Header>
                <Modal.Title>
                    { !id ? 'New audit' : 'Edit audit' }
                </Modal.Title>
            </Modal.Header>
            { 
                true ? (
                    <Modal.Body>
                        <ViewLoading />
                    </Modal.Body>
                ) : !!audit &&
                    <Formik>

                    </Formik>                    
            }
        </Modal>
    )
}

export default AuditModalEditItem