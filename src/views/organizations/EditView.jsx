import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { setNavbarTitle, useArysoftUIController } from "../../context/context";
import * as Yup from 'yup';
import Swal from 'sweetalert2';

import enums from "../../helpers/enums";
import { useOrganizationsStore } from "../../hooks/useOrganizationsStore";
import { Card, Col, Container, Image, Row } from "react-bootstrap";
import { ViewLoading } from "../../components/Loaders";
import Status from "./components/Status";
import { Form, Formik } from "formik";
import { AryFormikTextInput } from "../../components/Forms";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faCheckDouble, faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import statusProps from "./helpers/StatusProps";

import bgHead from '../../assets/img/bgTrianglesBW.jpg';
import { Button } from "react-bootstrap";
import ContactsCard from "../contacts/components/ContactsCard";
import SitesCard from "../sites/components/SitesCard";
import AryLastUpdatedInfo from "../../components/AryLastUpdatedInfo/AryLastUpdatedInfo";

const EditView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [avatarPreview, setAvatarPreview] = useState('/images/icoOfficeBuilding.png')
    const [controller, dispatch] = useArysoftUIController();
    const { OrganizationStatusType } = enums();
    const {
        isOrganizationLoading,
        isOrganizationSaving,
        organizationSavedOk,
        isOrganizationDeleting,
        organizationDeletedOk,
        organization,
        organizationsErrorMessage,

        organizationAsync,
        organizationSaveAsync,
        organizationDeleteAsync,
        organizationClear,
    } = useOrganizationsStore();
    const phoneRegExp = /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

    // HOOKS

    const [photoPreview, setPhotoPreview] = useState(null);

    useEffect(() => {
        if (!!id) organizationAsync(id);
    }, [id]);

    useEffect(() => {
        if (!!organization) {
            setNavbarTitle(dispatch, organization.Name);
        }
    }, [organization]);

    useEffect(() => {
        if (organizationSavedOk) {
            Swal.fire('Organization', 'The changes were made successfully', 'success');
            organizationClear();
            navigate('/organizations/');
        }
    }, [organizationSavedOk]);

    useEffect(() => {
        if (organizationDeletedOk) {
            Swal.fire('Organization', 'Record deleted successfully', 'success');
            organizationClear();
            navigate('/organizations/');
        }
    }, [organizationDeletedOk]);

    useEffect(() => {
        if (!!organizationsErrorMessage) {
            Swal.fire('Organization', organizationsErrorMessage, 'error');
        }
    }, [organizationsErrorMessage]);

    // METHODS

    const onFormSubmit = (values) => {
        // console.log(values);

        const itemToSave = {
            ID: organization.ID,
            Name: values.nameInput,
            LegalEntity: values.legalEntityInput,
            LogoFile: '',
            Website: values.websiteInput,
            Phone: values.phoneInput,
            Status: organization.Status,
        };
        
        organizationSaveAsync(itemToSave);
    };

    const onCancelButton = () => {
        organizationClear();
        navigate('/organizations/');
    }

    const onApproveButton = () => {
        console.log('onApproveButton');
    }; // onApproveButton

    // const onActiveButton //! Aqui voy... y ahi me quede jojojo!
    const onDeleteButton = () => {

        Swal.fire({
            title: 'Organizations',
            text: 'This action will remove the registry. Do you wish to continue?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel'
        }).then(resp => {
            if (resp.value) {
                organizationDeleteAsync(organization.OrganizationID);
            }
        });
    };

    return (
        <Container fluid className="py-4 px-0 px-sm-4">
            <Row>
                <Col xs={12}>
                    <Card>
                        {
                            isOrganizationLoading ? (
                                <Card.Body>
                                    <ViewLoading />
                                </Card.Body>
                            ) : !!organization ? (
                                <>
                                    <Card.Body>
                                        <div
                                            className="page-header min-height-150 border-radius-lg"
                                            style={{
                                                backgroundImage: `url(${bgHead})`,
                                                backgroundPositionY: '50%'
                                            }}
                                        >
                                            <span className={`mask bg-gradient-${statusProps[organization.Status].bgColor} opacity-6`}></span>
                                        </div>
                                        <div className="card card-body blur shadow-blur mx-4 mt-n7 overflow-hidden">
                                            <div className="row gx-4">
                                                <div className="col-auto">
                                                    <div className="avatar avatar-xl position-relative">
                                                        <img src={avatarPreview} alt="Organization logotype" className="w-100 border-radius-lg shadow-sm" />
                                                    </div>
                                                </div>
                                                <div className="col-auto my-auto">
                                                    <div className="h-100">
                                                        <h5 className="mb-1">
                                                            {organization.Name}
                                                        </h5>
                                                        <p className="mb-0 font-weight-bold text-sm">
                                                            {organization.LegalEntity}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="col-lg-4 col-md-6 my-sm-auto ms-sm-auto me-sm-0 mx-auto mt-3 text-end">
                                                    <Status value={organization.Status} />
                                                </div>
                                            </div>
                                        </div>
                                        <Formik
                                            initialValues={{
                                                nameInput: organization?.Name || '',
                                                legalEntityInput: organization?.LegalEntity || '',
                                                websiteInput: organization?.Website || '',
                                                phoneInput: organization?.Phone || '',
                                                logotipoInputFile: '',
                                            }}
                                            onSubmit={onFormSubmit}
                                            validationSchema={Yup.object({
                                                nameInput: Yup.string()
                                                    .required('Name is required')
                                                    .max(250, 'Name must be at most 250 characters'),
                                                legalEntityInput: Yup.string()
                                                    .required('Legal entity is required')
                                                    .max(250, 'Legal entity must be at most 250 characters'),
                                                websiteInput: Yup.string()
                                                    .max(250, 'Web site must be at most 250 characters'),
                                                phoneInput: Yup.string()
                                                    .max(25, 'Phone number must be at most 25 characters')
                                                    .matches(phoneRegExp, 'Phone number is not valid')
                                            })}
                                        >
                                            {(formik) => (
                                                <Form>
                                                    <Row className="mt-4">
                                                        <Col xs={12} sm={8}>
                                                            <Row>
                                                                <Col xs={12}>
                                                                    <AryFormikTextInput name="nameInput"
                                                                        label="Name"
                                                                        type="text"
                                                                    />
                                                                </Col>
                                                                <Col xs={12}>
                                                                    <AryFormikTextInput name="legalEntityInput"
                                                                        label="Legal entity"
                                                                        type="text"
                                                                    />
                                                                </Col>
                                                                <Col xs={12} sm="6">
                                                                    <AryFormikTextInput name="websiteInput"
                                                                        label="Website"
                                                                        type="text"
                                                                    />
                                                                </Col>
                                                                <Col xs={12} sm="6">
                                                                    <AryFormikTextInput name="phoneInput"
                                                                        label="Phone"
                                                                        type="text"
                                                                    />
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                        <Col xs={12} sm={4}>
                                                            <Row>
                                                                <Col xs={12}>
                                                                    <div className="mb-3">
                                                                        <label className="form-label">Logotype</label>
                                                                        { !!photoPreview && 
                                                                            <div>
                                                                                <Image src={ photoPreview }
                                                                                    thumbnail
                                                                                    fluid
                                                                                    className="mb-3"
                                                                                />
                                                                            </div>
                                                                        }
                                                                        <input
                                                                            type="file"
                                                                            name="logotypeFile"
                                                                            accept="image/*"
                                                                            className="form-control"
                                                                            onChange={(e) => {
                                                                                const fileReader = new FileReader();
                                                                                fileReader.onload = () => {
                                                                                    if (fileReader.readyState === 2) {
                                                                                        formik.setFieldValue('logotipoInputFile', fileReader.result);
                                                                                        setAvatarPreview(fileReader.result);
                                                                                        setPhotoPreview(fileReader.result);
                                                                                    }
                                                                                };
                                                                                fileReader.readAsDataURL(e.target.files[0]);
                                                                                formik.setFieldValue('logotipoInputFile', e.currentTarget.files[0]);
                                                                                //console.log('onChange', e);
                                                                            }}
                                                                        />
                                                                        <span className="text-xs text-secondary me-2">Enter a logo image</span>
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col xs={12}>
                                                            <span className="text-secondary">(aquí van las opciones de cambio de status)</span>
                                                            <hr className="horizontal dark my-3" />
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col xs={12} className="d-flex gap-2">
                                                            <Button type="button" variant="success" className="bg-gradient-success">
                                                                <FontAwesomeIcon icon={faCheck} size="lg" className="me-1" />
                                                                Approve
                                                            </Button>
                                                            <Button type="button" className="bg-gradient-info">
                                                                <FontAwesomeIcon icon={faCheckDouble} size="lg" className="me-1" />
                                                                Active
                                                            </Button>
                                                            <button type="button"
                                                                className="btn bg-gradient-secondary"
                                                                onClick={onDeleteButton}
                                                                disabled={isOrganizationDeleting}
                                                            >
                                                                <FontAwesomeIcon icon={faTrashCan} size="lg" className="me-1" />
                                                                Delete
                                                            </button>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col className="d-flex flex-column flex-sm-row justify-content-between">
                                                            <div className="text-secondary">
                                                                <AryLastUpdatedInfo item={ organization } />
                                                            </div>
                                                            <div className="d-flex justify-content-center justify-content-sm-between gap-2">
                                                                <button type="submit"
                                                                    className="btn bg-gradient-dark mb-0"
                                                                    disabled={isOrganizationSaving}
                                                                >
                                                                    <FontAwesomeIcon icon={faSave} size="lg" className="me-1" />
                                                                    Save
                                                                </button>
                                                                <button type="button" className="btn btn-link text-secondary mb-0" onClick={onCancelButton}>
                                                                    Cancel
                                                                </button>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </Form>
                                            )}
                                        </Formik>
                                    </Card.Body>
                                </>
                            ) : null
                        }
                    </Card>
                </Col>
            </Row>
            <Row className="mt-4">
                <Col xs={12} sm={4}>
                    <ContactsCard />
                </Col>
                <Col xs={12} sm={4}>
                    <SitesCard />
                </Col>
                <Col xs={12} sm={4}>
                    <Card className="h-100">
                        <Card.Header className="pb-0 p-3">
                            <h6 className="mb-0">Certificates</h6>
                        </Card.Header>
                        <Card.Body className="p-3">
                            Lorem ipsum
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default EditView;