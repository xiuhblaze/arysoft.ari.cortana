import { AryFormikTextInput } from '../../../components/Forms';
import { Button, Col, Modal, Row } from 'react-bootstrap';
import { faEdit, faSave } from '@fortawesome/free-solid-svg-icons';
import { faSquarePlus } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useOrganizationsStore } from '../../../hooks/useOrganizationsStore';
import { useSitesStore } from '../../../hooks/useSiteStore';
import { ViewLoading } from '../../../components/Loaders';
import * as Yup from 'yup';
import AryLastUpdatedInfo from '../../../components/AryLastUpdatedInfo/AryLastUpdatedInfo';
import enums from '../../../helpers/enums';
import ShiftsCard from '../../shifts/components/ShiftsCard';
import Swal from 'sweetalert2';

const EditSiteModal = ({ id, ...props }) => {
    const DEFAULT_COUNTRY = 'México';
    const { 
        DefaultStatusType, 
        SiteOrderType,
    } = enums();

    const formDefaultValues = {
        descriptionInput: '',
        isMainSiteCheck: false,
        addressInput: '',
        countryInput: DEFAULT_COUNTRY,
        locationUrlInput: '',
        statusCheck: false,
    };
    const validationSchema = Yup.object({
        descriptionInput: Yup.string()
            .required('Description is required')
            .max(500, 'Description must be less than 500 characters'),
        addressInput: Yup.string()
            .max(500, 'Address must be less than 500 characters'),
        countryInput: Yup.string()
            .max(50, 'Country must be less than 50 characters'),
        locationUrlInput: Yup.string()
            .max(250, 'Location URL must be less than 250 characters'),
    });
    // CUSTOM HOOKS

    const {
        organization
    } = useOrganizationsStore();

    const {
        isSiteLoading,
        isSiteCreating,
        isSiteSaving,
        siteSavedOk,
        site,
        siteAsync,
        sitesAsync,
        siteCreateAsync,
        siteSaveAsync,
        siteClear,
    } = useSitesStore();

    // HOOKS

    const [showModal, setShowModal] = useState(false);
    const [initialValues, setInitialValues] = useState(formDefaultValues);
    // const [activeSite, setActiveSite] = useState(false);
    // const [isMainSiteCheck, setIsMainSiteCheck] = useState(false);

    useEffect(() => {
        
        if (!!site) {
            setInitialValues({
                descriptionInput: site?.Description ?? '',
                isMainSiteCheck: site?.IsMainSite ?? false,
                addressInput: site?.Address ?? '',
                countryInput: site?.Country ?? DEFAULT_COUNTRY,
                locationUrlInput: site?.LocationURL ?? '',
                statusCheck: site?.Status === DefaultStatusType.active,
            });

            // setActiveSite(site?.Status === DefaultStatusType.active);
            // setIsMainSiteCheck(site?.IsMainSite ?? false);
        }
    }, [site]);

    useEffect(() => {
        if (siteSavedOk) {
            Swal.fire('Site', `Site ${ !id ? 'created' : 'updated' } successfully`, 'success');
            sitesAsync({
                organizationID: organization.ID,
                pageSize: 0,
                order: SiteOrderType.isMainSiteDesc,
            });
            siteClear();
            setShowModal(false);
        }
    }, [siteSavedOk]);

    // METHODS

    const onShowModal = () => {

        if (!id) { // nuevo
            siteCreateAsync({
                OrganizationID: organization.ID,
            });
        } else { // editar
            siteAsync(id);
        }

        setShowModal(true);
    }; // onShowModal

    const onCloseModal = () => {
        
        siteClear();
        setShowModal(false);
    }; // onCloseModal

    const onFormSubmit = (values) => {
        // console.log(values);

        const toSave = {
            ID: site.ID,
            Description: values.descriptionInput,
            Address: values.addressInput,
            Country: values.countryInput,
            IsMainSite: values.isMainSiteCheck,
            LocationURL: values.locationUrlInput,
            Status: values.statusCheck ? DefaultStatusType.active : DefaultStatusType.inactive,
        };

        // console.log(toSave);

        siteSaveAsync(toSave);
    }; // onFormSubmit

    return (
        <>
            <Button
                variant="link"
                className="text-dark p-0 mb-0"
                onClick={ onShowModal }
                title={ !!id ? 'Edit site' : 'Add site' }
            >
                <FontAwesomeIcon icon={ !!id ? faEdit : faSquarePlus } size="xl" />
            </Button>
            <Modal show={ showModal} onHide={ onCloseModal } size="lg" >
                <Modal.Header closeButton>
                    <Modal.Title>
                        {
                            !!id ? (
                                <>
                                    <FontAwesomeIcon icon={ faEdit } className="px-3" />
                                    Edit site
                                </>
                            ) : (
                                <>
                                    <FontAwesomeIcon icon={ faSquarePlus } className="px-3" />
                                    Add site
                                </>
                            )
                        }
                    </Modal.Title>
                </Modal.Header>
                {
                    isSiteCreating ||  isSiteLoading ? (
                        <ViewLoading />
                    ) : !!site ? (
                        <Formik
                            initialValues={ initialValues }
                            validationSchema={ validationSchema }
                            onSubmit={ onFormSubmit }
                            enableReinitialize
                        >
                            { formik => (
                                <Form>
                                    <Modal.Body>
                                        <Row>
                                            <Col xs="12" sm="6">
                                                <Row>
                                                    <Col xs="12">
                                                        <AryFormikTextInput name="descriptionInput"
                                                            label="Description"
                                                        />
                                                    </Col>
                                                    <Col xs="12">
                                                        <AryFormikTextInput name="addressInput"
                                                            label="Address"
                                                        />
                                                    </Col>
                                                    <Col xs="12">
                                                        <AryFormikTextInput name="countryInput"
                                                            label="Country"
                                                        />
                                                    </Col>
                                                    <Col xs="12">
                                                        <AryFormikTextInput name="locationUrlInput"
                                                            label="Location Map URL"
                                                            helpText="URL of the site's location on Google Maps"
                                                        />
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xs="12" sm="6">
                                                        <div className="form-check form-switch">
                                                            <input id="isMainSiteCheck" name="isMainSiteCheck"
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                onChange={ (e) => {
                                                                    const isChecked = e.target.checked;
                                                                    formik.setFieldValue('isMainSiteCheck', isChecked);
                                                                    // setIsMainSiteCheck(isChecked);
                                                                }}
                                                                checked={ formik.values.isMainSiteCheck }
                                                            />
                                                            <label
                                                                className="form-check-label text-secondary mb-0"
                                                                htmlFor="isMainSiteCheck"
                                                            >
                                                                Is main site
                                                            </label>
                                                        </div>
                                                    </Col>
                                                    <Col xs="12" sm="6">
                                                        <div className="form-check form-switch">
                                                            <input id="statusCheck" name="statusCheck"
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                // onChange={ formik.handleChange }
                                                                onChange= { (e) => {
                                                                    const isChecked = e.target.checked;
                                                                    formik.setFieldValue('statusCheck', isChecked);
                                                                    // setActiveSite(isChecked);
                                                                }} 
                                                                checked={ formik.values.statusCheck }
                                                            />
                                                            <label 
                                                                className="form-check-label text-secondary mb-0"
                                                                htmlFor="statusCheck"
                                                            >
                                                                Active site
                                                            </label>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col xs="12" sm="6">
                                                <ShiftsCard />
                                            </Col>
                                        </Row>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <div className="d-flex justify-content-between align-items-center w-100">
                                            <div className="text-secondary">
                                                {
                                                    !!site && <AryLastUpdatedInfo item={ site } />
                                                }
                                            </div>
                                            <div className="d-flex justify-content-end gap-2">
                                                <button type="submit"
                                                    className="btn bg-gradient-dark mb-0"
                                                    disabled={ isSiteSaving }
                                                >
                                                    <FontAwesomeIcon icon={ faSave } className="me-1" size="lg" />
                                                    Save
                                                </button>
                                                <button type="button" 
                                                    className="btn btn-link text-secondary mb-0" 
                                                    onClick={onCloseModal}
                                                >
                                                    Close
                                                </button>
                                            </div>
                                        </div>
                                    </Modal.Footer>
                                </Form>
                            )}
                        </Formik>
                    ) : null
                }
                {/* <ShiftsCard /> */}
            </Modal>
        </>
    )
}

export default EditSiteModal