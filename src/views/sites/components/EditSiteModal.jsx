import React, { useEffect, useState } from 'react';
import envVariables from '../../../helpers/envVariables';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import enums from '../../../helpers/enums';
import { useOrganizationsStore } from '../../../hooks/useOrganizationsStore';
import { useSitesStore } from '../../../hooks/useSiteStore';
import { Button, Col, ListGroup, Modal, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faEdit, faSave } from '@fortawesome/free-solid-svg-icons';
import { faSquarePlus } from '@fortawesome/free-regular-svg-icons';
import { ViewLoading } from '../../../components/Loaders';
import { Form, Formik } from 'formik';
import { AryFormikTextInput } from '../../../components/Forms';
import { formatDistanceToNow } from 'date-fns';

const EditSiteModal = ({ id, ...props }) => {
    
    const { 
        DefaultStatusType, 
        SiteOrderType,
    } = enums();

    const formDefaultValues = {
        descriptionInput: '',
        addressInput: '',
        isMainSiteCheck: false,
        statusCheck: false,
    };

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
    const [activeSite, setActiveSite] = useState(false);
    const [isMainSiteCheck, setIsMainSiteCheck] = useState(false);

    useEffect(() => {
        
        if (!!site) {
            setInitialValues({
                descriptionInput: site?.Description ?? '',
                addressInput: site?.Address ?? '',
                isMainSiteCheck: site?.IsMainSite ?? false,
                statusCheck: site?.Status === DefaultStatusType.active,
            });

            setActiveSite(site?.Status === DefaultStatusType.active);
            setIsMainSiteCheck(site?.IsMainSite ?? false);
        }
    }, [site]);

    useEffect(() => {
        if (siteSavedOk) {
            Swal.fire('Site', `Site ${ !id ? 'created' : 'updated' } successfully`, 'success');
            siteAsync({
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

        if (!id) {

            siteCreateAsync({
                OrganizationID: organization.ID,
            });
        } else {
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
            IsMainSite: values.isMainSiteCheck,
            Status: values.statusCheck ? DefaultStatusType.active : DefaultStatusType.inactive,
        };

        console.log(toSave);

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
            <Modal show={ showModal} onHide={ onCloseModal } >
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
                            onSubmit={ onFormSubmit }
                            enableReinitialize
                        >
                            { formik => (
                                <Form>
                                    <Modal.Body>
                                        <Row>
                                            <Col xs="12">
                                                <AryFormikTextInput name="descriptionInput"
                                                    label="Description"
                                                />
                                            </Col>
                                            <Col xs="12">
                                                <AryFormikTextInput name="addressInput"
                                                    label="Address"
                                                    placeholder="3312 Example Street, City 00000"
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs="12" sm="4">
                                                <div className="form-check form-switch">
                                                    <input id="isMainSiteCheck" name="isMainSiteCheck"
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        onChange={ (e) => {
                                                            const isChecked = e.target.checked;
                                                            formik.setFieldValue('isMainSiteCheck', isChecked);
                                                            setIsMainSiteCheck(isChecked);
                                                        }}
                                                        checked={ formik.values.isMainSiteCheck }
                                                    />
                                                    <label
                                                        className="form-check-label text-secondary mb-0"
                                                        htmlFor="isMainSiteCheck"
                                                    >
                                                        {
                                                            isMainSiteCheck ? 'Is main site' : 'Is secondary site'
                                                        }
                                                    </label>
                                                </div>
                                            </Col>
                                            <Col xs="12" sm="4">
                                                <div className="form-check form-switch">
                                                    <input id="statusCheck" name="statusCheck"
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        // onChange={ formik.handleChange }
                                                        onChange= { (e) => {
                                                            const isChecked = e.target.checked;
                                                            formik.setFieldValue('statusCheck', isChecked);
                                                            setActiveSite(isChecked);
                                                        }} 
                                                        checked={ formik.values.statusCheck }
                                                    />
                                                    <label 
                                                        className="form-check-label text-secondary mb-0"
                                                        htmlFor="statusCheck"
                                                    >
                                                        { 
                                                            activeSite ? 'Active site' : 'Inactive site'
                                                        }
                                                    </label>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <div className="d-flex justify-content-between align-items-center w-100">
                                            <div>
                                                {
                                                    !!site && (
                                                        <ListGroup className="opacity-7">
                                                            <ListGroup.Item className="border-0 py-0 ps-0 text-xs text-secondary">
                                                                <strong className="me-2">Created:</strong>
                                                                { formatDistanceToNow(new Date(site.Created)) }
                                                            </ListGroup.Item>
                                                            <ListGroup.Item className="border-0 py-0 ps-0 text-xs text-secondary">
                                                                <strong className="me-2">Updated:</strong>
                                                                { formatDistanceToNow(new Date(site.Updated)) }
                                                            </ListGroup.Item>
                                                            <ListGroup.Item className="border-0 py-0 ps-0 text-xs text-secondary">
                                                                <strong className="me-2">Updated by:</strong>
                                                                { site.UpdatedUser }
                                                            </ListGroup.Item>
                                                        </ListGroup>
                                                    )
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
            </Modal>
        </>
    )
}

export default EditSiteModal