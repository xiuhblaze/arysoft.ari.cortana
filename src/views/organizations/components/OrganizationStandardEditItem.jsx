import { faEdit, faPlus, faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import enums from '../../../helpers/enums';
import * as Yup from "yup";
import { useStandardsStore } from '../../../hooks/useStandardsStore';
import { useOrganizationStandardsStore } from '../../../hooks/useOrganizationStandardsStore';
import { Col, Modal, Row } from 'react-bootstrap';
import { ViewLoading } from '../../../components/Loaders';
import { Form, Formik } from 'formik';
import { AryFormikSelectInput, AryFormikTextInput } from '../../../components/Forms';
import { useEffect, useState } from 'react';
import { useOrganizationsStore } from '../../../hooks/useOrganizationsStore';
import AryLastUpdatedInfo from '../../../components/AryLastUpdatedInfo/AryLastUpdatedInfo';
import Swal from 'sweetalert2';

const OrganizationStandardEditItem = ({ id, ...props }) => {

    const {
        DefaultStatusType,
        OrganizationStandardOrderType,
        StandardOrderType,
    } = enums();

    const formDefaultValues = {
        standardSelect: '',
        extraInfoInput: '',
        statusCheck: false,
    };

    const validationSchema = Yup.object({
        standardSelect: Yup.string()
            .required('Must select a standard'),
        extraInfoInput: Yup.string()
            .max(1000, 'Extra Info must be at most 1000 characters'),
    });

    // CUSTOM HOOKS

    const {
        organization,
    } = useOrganizationsStore();

    const {
        isOrganizationStandardLoading,
        isOrganizationStandardCreating,
        isOrganizationStandardSaving,
        organizationStandardSavedOk,
        organizationStandard,
        organizationStandardsErrorMessage,

        organizationStandardsAsync,
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
                extraInfoInput: organizationStandard?.ExtraInfo ?? '',
                statusCheck: 
                    organizationStandard.Status === DefaultStatusType.active
                    || organizationStandard.Status === DefaultStatusType.nothing,
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
            organizationStandardsAsync({
                organizationID: organization.ID,
                pageSize: 0,
            });
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
            //CRN: values.crnInput,
            ExtraInfo: values.extraInfoInput,
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
                        <FontAwesomeIcon icon={ !!id ? faEdit : faPlus } className="px-3" />
                        { !! id ? 'Edit assigned standard' : 'Assign standard' }
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
                                        <Col xs="12">
                                            <AryFormikTextInput name="extraInfoInput"
                                                label="Aditional Info"
                                            />
                                        </Col>
                                        <Col xs="12">
                                            <div className="form-check form-switch mb-3">
                                                <input id="statusCheck" name="statusCheck"
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    onChange={ formik.handleChange }
                                                    checked={ formik.values.statusCheck }
                                                />
                                                <label 
                                                    className="form-check-label text-secondary mb-0" 
                                                    htmlFor="statusCheck"
                                                >
                                                    Active
                                                </label>
                                            </div>
                                        </Col>
                                    </Row>
                                </Modal.Body>
                                <Modal.Footer>
                                    <div className="d-flex justify-content-between align-items-start align-items-sm-center w-100">
                                        <div className="text-secondary mb-3 mb-sm-0">
                                            <AryLastUpdatedInfo item={ organizationStandard } />
                                        </div>
                                        <div className="d-flex justify-content-end ms-auto ms-sm-0 mb-3 mb-sm-0 gap-2">
                                            <button type="submit"
                                                className="btn bg-gradient-dark mb-0"
                                                disabled={ isOrganizationStandardSaving }
                                            >
                                                <FontAwesomeIcon icon={ faSave } className="me-1" size="lg" />
                                                Save
                                            </button>
                                            <button type="button"
                                                className="btn btn-link text-secondary mb-0"
                                                onClick={ onCloseModal }
                                            >
                                                Close
                                            </button>
                                        </div>
                                    </div>
                                </Modal.Footer>
                            </Form>
                        )}
                    </Formik>
                }
            </Modal>
        </div>
    )
}

export default OrganizationStandardEditItem