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

import imgHeaderBackground from '../../assets/img/bgWavesWhite.jpg';
import defaultPhoto from '../../assets/img/icoOrganizationDefault.jpg';
import envVariables from "../../helpers/envVariables";
import OrganizationEditCard from "./components/OrganizationEditCard";
import CertificatesCard from "../certificates/components/CertificatesCard";

const EditView = () => {
    const phoneRegExp = /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;
    const {
        URL_ORGANIZATION_FILES,
        VITE_FILES_URL,
    } = envVariables();
    const { OrganizationStatusType } = enums();
    
    // CUSTOM HOOKS
    
    const [controller, dispatch] = useArysoftUIController();
    
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
    
    // HOOKS
    
    const navigate = useNavigate();

    const { id } = useParams();
    
    const [avatarPreview, setAvatarPreview] = useState('/images/icoOfficeBuilding.png')
    const [photoPreview, setPhotoPreview] = useState(null);
    const [qrcodePreview, setQrcodePreview] = useState(null);

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

    const updatePhotoPreview = (value) => {
        setPhotoPreview(value);
    };

    return (
        <>
            <Container fluid>
                <div
                    className="page-header min-height-200 border-radius-lg"
                    style={{
                        background: `url(${imgHeaderBackground})`,
                        backgroundPositionY: '50%'
                    }}
                >
                    <span className={`mask bg-gradient-${isOrganizationLoading || !organization ? 'dark' : statusProps[organization.Status].bgColor} opacity-6`} />
                </div>
                <div className="card card-body blur shadow-blur mx-4 mt-n6 overflow-hidden">
                    <Row className="gx-4">
                        <div className="col-auto">
                            <div className="avatar avatar-xl position-relative">
                                <Image
                                    src={!!photoPreview
                                        ? photoPreview
                                        : !!organization && !!organization.LogoFile
                                            ? `${VITE_FILES_URL}${URL_ORGANIZATION_FILES}/${organization.ID}/${organization.LogoFile}`
                                            : defaultPhoto
                                    }
                                    className="border-radius-md"
                                    alt="Profile photo"
                                />
                            </div>
                        </div>
                        <div className="col-auto my-auto">
                            <div className="h-100">
                                <h5 className="mb-1">
                                    {!!organization ? organization.Name : '(new organization)'}
                                </h5>
                                <p className="mb-0 font-weight-bold text-sm">
                                    {!!organization ? organization.LegalEntity : ''}
                                </p>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6 my-sm-auto ms-sm-auto me-sm-0 mx-auto mt-3 text-end">
                            {
                                !!organization && 
                                <Status value={organization.Status} />
                            }
                        </div>
                    </Row>
                </div>
            </Container>
        <Container fluid className="py-4 px-0 px-sm-4">
            {
                isOrganizationLoading ? (
                    <ViewLoading />
                ) : !!organization && (
                    <Row>
                        <Col xs="12" sm="8" xxl="6">
                            <OrganizationEditCard
                                updatePhotoPreview={updatePhotoPreview}
                            />
                        </Col>
                    </Row>
                )
            }
            
            <Row className="mt-4">
                <Col xs={12} sm={4}>
                    <ContactsCard />
                </Col>
                <Col xs={12} sm={4}>
                    <SitesCard />
                </Col>
                <Col xs={12} sm={4}>
                    <CertificatesCard />
                </Col>
            </Row>
        </Container>
        </>
    )
}

export default EditView;