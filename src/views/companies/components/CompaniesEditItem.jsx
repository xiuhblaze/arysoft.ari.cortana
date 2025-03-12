import { faBuilding, faEdit, faPlus, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react"
import { Col, Modal, Row } from "react-bootstrap";
import * as Yup from "yup";
import envVariables from "../../../helpers/envVariables";
import { useCompaniesStore } from "../../../hooks/useCompaniesStore";
import { useOrganizationsStore } from "../../../hooks/useOrganizationsStore";
import enums from "../../../helpers/enums";
import Swal from "sweetalert2";
import { Form, Formik } from "formik";
import { AryFormikTextInput } from "../../../components/Forms";
import { ViewLoading } from "../../../components/Loaders";
import AryLastUpdatedInfo from "../../../components/AryLastUpdatedInfo/AryLastUpdatedInfo";

const CompaniesEditItem = ({ id, ...props }) => {
    const {
        COID_REGEX,
    } = envVariables();

    const { DefaultStatusType } = enums();

    const formDefaultValues = {
        nameInput: '',
        legalEntityInput: '',
        coidInput: '',
        statusCheck: false,        
    };

    const validationSchema = Yup.object({
        nameInput: Yup.string()
            .required('Name is required')
            .max(100, 'Name must be 100 characters or less'),
        legalEntityInput: Yup.string()
            .required('Legal entity is required')
            .max(50, 'Legal entity must be 50 characters or less'),
        coidInput: Yup.string()
            .max(20, 'COID number must be at most 20 characters')
            .matches(COID_REGEX, 'COID number is not valid'),
    });

    // CUSTOM HOOKS

    const {
        organization
    } = useOrganizationsStore();

    const {
        isCompanyLoading,
        isCompanyCreating,
        companyCreatedOk,
        isCompanySaving,
        companySavedOk,
        company,

        companiesAsync,
        companyAsync,
        companyCreateAsync,
        companySaveAsync,
        companyClear,
    } = useCompaniesStore();

    // HOOKS

    const [showModal, setShowModal] = useState(false);
    const [initialValues, setInitialValues] = useState(formDefaultValues);

    useEffect(() => {
        if (!!company && showModal) {
            setInitialValues({
                nameInput: company?.Name ?? '',
                legalEntityInput: company?.LegalEntity ?? '',
                coidInput: company?.COID ?? '',
                statusCheck: company?.Status == DefaultStatusType.active
                    || company?.Status == DefaultStatusType.nothing
            });
        }
    }, [company]);
    
    useEffect(() => {
        if (!!companySavedOk && showModal) {
            Swal.fire('Company', `Company ${!id ? 'created' : 'updated'} successfully`, 'success');
            companiesAsync({
                organizationID: organization.ID,
                pageSize: 0,
            });
            companyClear();
            setShowModal(false);
        }
    }, [companySavedOk]);

    // METHODS

    const onShowModal = () => {

        if(!id) {
            companyCreateAsync({
                OrganizationID: !!organization ? organization.ID : null,
            });
        } else {
            companyAsync(id);
        }

        setShowModal(true);
    } // onShowModal

    const onCloseModal = () => {

        companyClear();
        setShowModal(false);
    }

    const onFormSubmit = (values) => {

        const toSave = {
            ID: company.ID,
            Name: values.nameInput,
            LegalEntity: values.legalEntityInput,
            COID: values.coidInput,
            Status: values.statusCheck ? DefaultStatusType.active : DefaultStatusType.inactive,
        };

        companySaveAsync(toSave);
    }; // onFormSubmit

    return (
        <div {...props}>
            <button
                type="button"
                className="btn btn-link text-dark mb-0 p-0"
                title={ !!id ? 'Edit legal entity' : 'Add legal entity' }
                onClick={ onShowModal }
            >
                <FontAwesomeIcon icon={ !!id ? faEdit : faPlus } size="xl" />
            </button>
            <Modal show={ showModal } onHide={ onCloseModal }>
                <Modal.Header>
                    <Modal.Title>
                        <FontAwesomeIcon icon={ faBuilding } className="text-dark mx-3" />
                        { !!id ? 'Edit legal entity' : 'Add legal entity' }
                    </Modal.Title>
                </Modal.Header>
                {
                    isCompanyCreating || isCompanyLoading ? (
                        <Modal.Body>
                            <ViewLoading />
                        </Modal.Body>
                    ) : !!company &&
                    <Formik
                        initialValues={ initialValues }
                        validationSchema={ validationSchema }
                        enableReinitialize
                        onSubmit={ onFormSubmit }
                    >
                        { formik => (
                            <Form>
                                <Modal.Body>
                                    <Row>
                                        <Col xs="12">
                                            <AryFormikTextInput name="nameInput"
                                                label="Name"
                                            />
                                        </Col>
                                        <Col xs="12">
                                            <AryFormikTextInput name="legalEntityInput"
                                                label="Legal Entity"
                                                helpText="Provide the company's tax identification number"
                                            />
                                        </Col>
                                        <Col xs="12">
                                            <AryFormikTextInput name="coidInput"
                                                label="COID number"
                                                placeholder="MEX-0-0000-000000"
                                                helpText="Only for FSSC 22000"
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
                                            <AryLastUpdatedInfo item={ company } />
                                        </div>
                                        <div className="d-flex justify-content-end ms-auto ms-sm-0 mb-3 mb-sm-0 gap-2">
                                            <button type="submit"
                                                className="btn bg-gradient-dark mb-0"
                                                disabled={ isCompanySaving }
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

export default CompaniesEditItem