import { faEdit, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import enums from '../../../helpers/enums';
import * as Yup from "yup";
import { useStandardsStore } from '../../../hooks/useStandardsStore';
import { useOrganizationStandardsStore } from '../../../hooks/useOrganizationStandardsStore';
import { Col, Modal, Row } from 'react-bootstrap';
import { ViewLoading } from '../../../components/Loaders';
import { Form, Formik } from 'formik';
import { AryFormikSelectInput } from '../../../components/Forms';
import { useEffect, useState } from 'react';
import { useOrganizationsStore } from '../../../hooks/useOrganizationsStore';

const OrganizationStandardEditItem = ({ id, ...props }) => {

    const {
        DefaultStatusType,
        OrganizationStandardOrderType,
        StandardOrderType,
    } = enums();

    const  formDefaultValues = {
        standardSelect: '',
        crnInput: '',
        statusCheck: false,
    };

    const validationSchema = Yup.object({
        standardSelect: Yup.string()
            .required('Must select a standard'),
        crnInput: Yup.string()
            .max(10, 'Certificate Registration Number must be at most 10 characters'),
    });

    // CUSTOM HOOKS

    const {
        organization,
        organizationAsync,
    } = useOrganizationsStore();

    const {
        isOrganizationStandardLoading,
        isOrganizationStandardCreating,
        isOrganizationStandardSaving,
        organizationStandardSavedOk,
        organizationStandard,
        organizationStandardsErrorMessage,

        organizationStandardAsync,
        organizationStandardCreateAsync,
        organizationStandardSaveAsync,
        organizationStandardClear,
    } = useOrganizationStandardsStore();

    const {
        isStandardsLoading,
        standards,
        standardsAsync,
    } = useStandardsStore();

    // HOOKS

    const [showModal, setShowModal] = useState(false);
    const [initialValues, setInitialValues] = useState(formDefaultValues);

    useEffect(() => {
      
        if (!!organizationStandard && showModal) {
            setInitialValues({
                standardSelect: organizationStandard?.StandardID ?? '',
                crnInput: organizationStandard?.CRN ?? '',
                statusCheck: organizationStandard.Status === DefaultStatusType.active,
            });

            standardsAsync({
                status: DefaultStatusType.active,
                pageSize: 0,
                includeDeleted: false,
                order: StandardOrderType.name,
            });
        }
    }, [organizationStandard]);

    useEffect(() => {
        if (!!organizationStandardSavedOk && showModal) {
            Swal.fire('Standard', `Standard ${!id ? 'assigned' : 'updated'} successfully`, 'success');            
            organizationAsync(organization.ID);
            organizationStandardClear();
            setShowModal(false);
        }
    }, [organizationStandardSavedOk]);
    
    useEffect(() => {
        if (!!organizationStandardsErrorMessage && showModal) {
            Swal.fire('Standard', organizationStandardsErrorMessage, 'error');
            organizationStandardClear();
            onCloseModal();
        }
    }, [organizationStandardsErrorMessage]);
    
    // METHODS

    const onShowModal = () => {

        if (!id) {
            organizationStandardCreateAsync({
                OrganizationID: organization.ID,
            });
        } else {
            organizationStandardAsync(id);
        }

        setShowModal(true);
    }; // onShowModal

    const onCloseModal = () => {

        organizationStandardClear();
        setShowModal(false);        
    }; // onCloseModal

    const onFormSubmit = (values) => {

        const toSave = {
            ID: organizationStandard.ID,
            StandardID: !!id ? organizationStandard.StandardID : values.standardSelect,
            CRN: values.crnInput,
            Status: values.statusCheck ? DefaultStatusType.active : DefaultStatusType.inactive,
        };

        organizationStandardSaveAsync(toSave);
    }; // onFormSubmit

    return (
        <div {...props}>
            <button
                type="button"
                className="btn btn-link mb-0 p-0 text-lg"
                title={ !!id ? 'Edit standard assigned' : 'Assign standard' }
                onClick={onShowModal}
            >
                <FontAwesomeIcon icon={ !!id ? faEdit : faPlus } className="text-dark" />
            </button>
            <Modal show={showModal} onHide={onCloseModal}>
                <Modal.Header>
                    <Modal.Title>
                        {
                            !!id ? (
                                <>
                                    <FontAwesomeIcon icon={faEdit} className="px-3" />
                                    Edit assigned standard
                                </>
                            ) : (
                                <>
                                    <FontAwesomeIcon icon={faPlus} className="px-3" />
                                    Assign standard
                                </>
                            )
                        }
                    </Modal.Title>
                </Modal.Header>
                {
                    isOrganizationStandardLoading || isOrganizationStandardCreating || isStandardsLoading ? (
                        <Modal.Body>
                            <ViewLoading />
                        </Modal.Body>
                    ) : !!organizationStandard && showModal &&
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        enableReinitialize
                        onSubmit={onFormSubmit}
                    >
                        {formik => (
                            <Form>
                                <Modal.Body>
                                    <Row>
                                        <Col xs="12">
                                            <AryFormikSelectInput
                                                name="standardSelect"
                                                label="Standard"
                                                disabled={!!id}
                                            >
                                                { !id && <option value="">(select)</option> }
                                                {
                                                    standards
                                                        .filter(item => (
                                                            !!id
                                                                ? item.ID === organizationStandard.StandardID
                                                                : !organization.Standards.find(x => x.StandardID === item.ID)
                                                        ))
                                                        .map(item =>
                                                            <option
                                                                key={item.ID}
                                                                value={item.ID}
                                                                className="text-capitalize"
                                                            >
                                                                {item.Name}
                                                            </option>
                                                        )
                                                }
                                            </AryFormikSelectInput>
                                        </Col>
                                    </Row>
                                </Modal.Body>
                            </Form>
                        )}
                    </Formik>
                }
            </Modal>
        </div>
    )
}

export default OrganizationStandardEditItem