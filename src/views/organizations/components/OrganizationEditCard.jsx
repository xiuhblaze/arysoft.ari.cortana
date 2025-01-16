import { Card, Col, Image, Row } from 'react-bootstrap'
import { faBan, faEdit, faRotateRight, faSave, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useOrganizationsStore } from '../../../hooks/useOrganizationsStore';
import * as Yup from 'yup';
import enums from '../../../helpers/enums';
import envVariables from '../../../helpers/envVariables';
import isNullOrEmpty from '../../../helpers/isNullOrEmpty';
import Swal from 'sweetalert2';
import { Form, Formik } from 'formik';
import { AryFormikTextInput } from '../../../components/Forms';
import AryLastUpdatedInfo from '../../../components/AryLastUpdatedInfo/AryLastUpdatedInfo';

const OrganizationEditCard = ({ updatePhotoPreview, ...props }) => {
    const {
        PHONE_REGEX,
        URL_ORGANIZATION_FILES,
        VITE_FILES_URL,
    } = envVariables();
    const { OrganizationStatusType} =enums();
    const formDefaultValues = {
        nameInput: '',
        legalEntityInput: '',
        websiteInput: '',
        phoneInput: '',
        logoInputFile: '',
        qrcodeInputFile: '',
    };
    const validationSchema = Yup.object({
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
            .matches(PHONE_REGEX, 'Phone number is not valid'),
        logoInputFile: Yup.mixed()
            .test({
                name: 'is-type-valid',
                message: 'Some file update error', // <- este solo es visible si el último return es false
                test: (value, ctx) => {
                    if (!!value) {
                        const extension = value.name.split(/[.]+/).pop(); // value.name.split('.').slice(-1)[0]; // https://stackoverflow.com/questions/651563/getting-the-last-element-of-a-split-string-array
                        const validTypes = ['jpg', 'png'];
                        if (!validTypes.includes(extension)) {
                            return ctx.createError({
                                message: 'Only files with png or jpg extensions are allowed'
                            });
                        }
                    }
                    return true;
                }
            }),
        qrcodeInputFile: Yup.mixed()
            .test({
                name: 'is-type-valid',
                message: 'Some file update error', // <- este solo es visible si el último return es false
                test: (value, ctx) => {
                    if (!!value) {
                        const extension = value.name.split(/[.]+/).pop(); // value.name.split('.').slice(-1)[0]; // https://stackoverflow.com/questions/651563/getting-the-last-element-of-a-split-string-array
                        const validTypes = ['jpg', 'png'];
                        if (!validTypes.includes(extension)) {
                            return ctx.createError({
                                message: 'Only files with png or jpg extensions are allowed'
                            });
                        }
                    }
                    return true;
                }
            }),
    });

    // CUSTOM HOOKS

    const {
        isOrganizationSaving,
        organizationSavedOk,
        organization,
        
        organizationAsync,
        organizationSaveAsync,
        organizationDeleteAsync,
        organizationClear,
    } = useOrganizationsStore();

    // HOOKS

    const navigate = useNavigate();

    const [initialValues, setInitialValues] = useState(formDefaultValues);
    const [logoPreview, setLogoPreview] = useState(null);
    const [newLogo, setNewLogo] = useState(false);
    const [qrcodePreview, setQrcodePreview] = useState(null);
    const [newQRCode, setNewQRCode] = useState(false);

    useEffect(() => {
        if (!!organization) {
            setInitialValues({
                nameInput: organization?.Name ?? '',
                legalEntityInput: organization?.LegalEntity ?? '',
                websiteInput: organization?.Website ?? '',
                phoneInput: organization?.Phone ?? '',
                logoInputFile: '',
                qrcodeInputFile: '',
            });

            setNewLogo(isNullOrEmpty(organization.LogoFile));
            setNewQRCode(isNullOrEmpty(organization.QRCodeFile));
        }
    }, [organization]);

    useEffect(() => {
        if (!!organizationSavedOk) {
            Swal.fire('Organization', 'Changes made successfully', 'success');
            organizationClear();
            navigate('/organizations/');
        }
    }, [organizationSavedOk]);
    
    // METHODS

    const onFormSubmit = (values) => {
        const toSave = {
            ID: organization.ID,
            Name: values.nameInput,
            LegalEntity: values.legalEntityInput,
            Website: values.websiteInput,
            Phone: values.phoneInput,            
            Status: organization.Status,
        };

        organizationSaveAsync(toSave, values.logoInputFile, values.qrcodeInputFile);
    };

    const onCancelButton = () => {
        organizationClear();
        navigate('/organizations/');
    };

    return (
        <Card {...props}>
            <Card.Header className="pb-0">
                <Card.Title>
                    <FontAwesomeIcon icon={ faEdit } size="lg" className="text-dark me-2" />
                    Edit profile
                </Card.Title>
            </Card.Header>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                enableReinitialize
                onSubmit={onFormSubmit}
            >
                { formik => (
                    <Form>
                        <Card.Body className="py-0">
                            <Row>
                                <Col xs="12" sm="4">
                                    <div className="d-flex justify-content-between">
                                        <label className="form-label">Logotype</label>
                                        {
                                            !newLogo && !!organization.LogoFile &&
                                            <div className="d-flex justify-content-end gap-3">
                                                <button
                                                    type="button"
                                                    className="btn btn-link p-0 mb-0 text-secondary"
                                                    onClick={() => setNewLogo(true)}
                                                    title="Upload new logotype"
                                                >
                                                    <FontAwesomeIcon icon={faRotateRight} size="lg" />
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-link p-0 mb-0 text-secondary"
                                                    onClick={onDeleteFile}
                                                    title="Delete logotype file"
                                                >
                                                    <FontAwesomeIcon icon={faTrash} size="lg" />
                                                </button>
                                            </div>
                                        }
                                        {
                                            !!newLogo && !isNullOrEmpty(organization.LogoFile) &&
                                            <div className="text-end">
                                                <button
                                                    type="button"
                                                    className="btn btn-link p-0 mb-0 text-secondary"
                                                    onClick={() => {
                                                        setNewLogo(false);
                                                        setLogoPreview(null);
                                                        updatePhotoPreview(null);
                                                        formik.setFieldValue('logoInputFile', '');
                                                    }}
                                                    title="Cancel upload new file"
                                                >
                                                    <FontAwesomeIcon icon={faBan} size="lg" />
                                                </button>
                                            </div>
                                        }
                                    </div>
                                    {
                                        !!newLogo ? (
                                            <>
                                                {
                                                    !!logoPreview &&
                                                    <div>
                                                        <Image src={logoPreview}
                                                            thumbnail
                                                            fluid
                                                            className="mb-3"
                                                        />
                                                    </div>
                                                }
                                                <input
                                                    type="file"
                                                    name="logoFile"
                                                    accept="image/png,image/jpeg,image/jpg"
                                                    className="form-control"
                                                    onChange={(e) => {
                                                        const fileReader = new FileReader();
                                                        fileReader.onload = () => {
                                                            if (fileReader.readyState === 2) {
                                                                // formik.setFieldValue('logoInputFile', fileReader.result);
                                                                setLogoPreview(fileReader.result);
                                                                updatePhotoPreview(fileReader.result);
                                                            }
                                                        };
                                                        fileReader.readAsDataURL(e.target.files[0]);
                                                        formik.setFieldValue('logoInputFile', e.currentTarget.files[0]);
                                                    }}
                                                />
                                                {
                                                    formik.touched.logoInputFile && formik.errors.logoInputFile &&
                                                    <span className="text-danger text-xs">{formik.errors.logoInputFile}</span>
                                                }
                                            </>
                                        ) : !!organization.LogoFile && (
                                            <div>
                                                <Image src={`${VITE_FILES_URL}${URL_ORGANIZATION_FILES}/${organization.ID}/${organization.LogoFile}`}
                                                    thumbnail
                                                    fluid
                                                    className="mb-3"
                                                />
                                            </div>
                                        )
                                    }
                                </Col>
                                <Col xs="12" sm="8">
                                    <Row>
                                        <Col xs="12">
                                            <AryFormikTextInput
                                                name="nameInput"
                                                label="Name"
                                                type="text"
                                            />
                                        </Col>
                                        <Col xs="12">
                                            <AryFormikTextInput
                                                name="legalEntityInput"
                                                label="Legal entity"
                                                type="text"
                                            />
                                        </Col>
                                        <Col xs="12" sm="6">
                                            <AryFormikTextInput
                                                name="websiteInput"
                                                label="Website"
                                                type="text"
                                            />
                                        </Col>
                                        <Col xs="12" sm="6">
                                            <AryFormikTextInput
                                                name="phoneInput"
                                                label="Phone"
                                                type="text"
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Card.Body>
                        <Card.Footer>
                            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center">
                                <div className="text-secondary">
                                    <AryLastUpdatedInfo item={organization} />
                                </div>
                                <div className="d-flex justify-content-center justify-content-sm-between gap-2">
                                    <button type="submit"
                                        className="btn bg-gradient-dark mb-0"
                                        disabled={isOrganizationSaving}
                                    >
                                        <FontAwesomeIcon icon={faSave} className="me-1" size="lg" />
                                        Save
                                    </button>
                                    <button type="button" className="btn btn-link text-secondary mb-0" onClick={onCancelButton}>
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </Card.Footer>
                    </Form>
                )}
            </Formik>
        </Card>
    )
}

export default OrganizationEditCard;