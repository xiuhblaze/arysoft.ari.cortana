import { useEffect, useRef, useState } from 'react'
import { faBan, faEdit, faRotateRight, faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Field, Form, Formik } from 'formik';
import { Col, Modal, Row, Image } from 'react-bootstrap';
import * as Yup from 'yup';

import { useNotesStore } from '../../../hooks/useNotesStore';
import { useOrganizationsStore } from '../../../hooks/useOrganizationsStore';
import { ViewLoading } from '../../../components/Loaders';
import AryLastUpdatedInfo from '../../../components/AryLastUpdatedInfo/AryLastUpdatedInfo';
import enums from '../../../helpers/enums';
import envVariables from '../../../helpers/envVariables';
import isNullOrEmpty from '../../../helpers/isNullOrEmpty';
import { AryFormikTextArea, AryFormikTextInput } from '../../../components/Forms';
import CompaniesList from '../../companies/components/CompaniesList';

const OrganizationModalEditItem = ({ show, onHide, ...props }) => {
    const {
        PHONE_REGEX,
        URL_ORGANIZATION_FILES,
        VITE_FILES_URL,
    } = envVariables();
    const { OrganizationStatusType } = enums();

    const formDefaultValues = {
        nameInput: '',
        websiteInput: '',
        phoneInput: '',
        logoInputFile: '',
        extraInfoInput: '',
        folderFolioInput: '',
        statusSelect: '',
        noteInput: '',
        companiesCountHidden: 0,
    };
    const validationSchema = Yup.object({
        nameInput: Yup.string()
            .required('Name is required')
            .max(250, 'Name must be at most 250 characters'),
        websiteInput: Yup.string()
            .url('Web site must be a valid URL')
            .max(250, 'Web site must be at most 250 characters'),
        phoneInput: Yup.string()
            .max(25, 'Phone number must be at most 25 characters')
            .matches(PHONE_REGEX, 'Phone number is not valid'),
        extraInfoInput: Yup.string()
            .max(1000, 'Extra info must be at most 1000 characters'),
        folderFolioInput: Yup.number()
            .typeError('Must be a number')
            .positive('Must be a positive number')
            .integer('Must be an integer'),
        logoInputFile: Yup.mixed()
            .test({
                name: 'is-type-valid',
                message: 'Some file update error', // <- este solo es visible si el último return es false
                test: (value, ctx) => {
                    if (!!value) {
                        const extension = value.name.split(/[.]+/).pop();
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
        statusSelect: Yup.string()
            .required('Must select a status'),
        noteInput: Yup.string()
            .max(250, 'The note cannot exceed more than 250 characters'),
        companiesCountHidden: Yup.number()
            .min(1, 'Must have at least one legal entity')
    }); 

    // CUSTOM HOOKS
    
    const {
        isOrganizationSaving,
        organizationSavedOk,
        organization,
        organizationSaveAsync,
        organizationClear,
    } = useOrganizationsStore();
    const { noteCreateAsync } =useNotesStore();

    // HOOKS

    const formikRef = useRef(null);

    const [showModal, setShowModal] = useState(false);
    const [initialValues, setInitialValues] = useState(formDefaultValues);
    const [logoPreview, setLogoPreview] = useState(null);
    const [newLogo, setNewLogo] = useState(false);
    const [statusOptions, setStatusOptions] = useState(null);

    const [showAddNote, setShowAddNote] = useState(false);
    const [saveNote, setSaveNote] = useState('');

    useEffect(() => {
        if (!!show) {
            setShowModal(true);
        }
    }, [show])
    
    useEffect(() => {

        if (!!organization && !!show) {
console.log('loading organization', organization);
            setInitialValues({
                nameInput: organization?.Name ?? '',
                websiteInput: organization?.Website ?? '',
                phoneInput: organization?.Phone ?? '',
                logoInputFile: '',
                extraInfoInput: organization?.ExtraInfo ?? '',
                folderFolioInput: organization?.FolderFolio ?? '',
                statusSelect: organization.Status == OrganizationStatusType.nothing 
                    ? OrganizationStatusType.applicant 
                    : organization?.Status ?? '',
                noteInput: '',
                companiesCountHidden: organization?.Companies?.length ?? 0,
            });
            setNewLogo(isNullOrEmpty(organization.LogoFile));
        }
    }, [organization, show]);

    // METHODS

    const onFormSubmit = (values) => {
        console.log('onFormSubmit', values);

        const toSave = {
            ID: organization.ID,
            Name: values.nameInput,
            Website: values.websiteInput,
            Phone: values.phoneInput,
            ExtraInfo: values.extraInfoInput,
            FolderFolio: values.folderFolioInput,
            Status: values.statusSelect,
        };

        organizationSaveAsync(toSave, values.logoInputFile);
    }; // onFormSubmit

    const onCloseModal = () => {
        setShowModal(false);
        onHide();
    };

    return (
        <Modal {...props} show={showModal} onHide={onCloseModal}
            size="lg"
            // contentClassName="border-0 shadow-lg"
            fullscreen="sm-down"
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    <FontAwesomeIcon icon={faEdit} size="lg" className="text-dark me-2" />
                    Edit organization
                </Modal.Title>
            </Modal.Header>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                enableReinitialize
                onSubmit={onFormSubmit}
                innerRef={formikRef}
            >
                {formik => (
                    <Form>
                        <Field name="companiesCountHidden" type="hidden" value={formik.values.companiesCountHidden} />                        
                        <Modal.Body>
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
                                                        //updatePhotoPreview(null);
                                                        formik.setFieldValue('logoInputFile', '');
                                                    }}
                                                    title="Cancel upload new logotype"
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
                                                    className="form-control mb-3"
                                                    onChange={(e) => {
                                                        const fileReader = new FileReader();
                                                        fileReader.onload = () => {
                                                            if (fileReader.readyState === 2) {
                                                                setLogoPreview(fileReader.result);
                                                                //updatePhotoPreview(fileReader.result);
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
                                                label="General name"
                                                type="text"
                                                helpText="This name will be used for the certificates"
                                            />
                                        </Col>
                                        <Col xs="12">
                                            <CompaniesList />
                                            {
                                                formik.touched.companiesCountHidden && formik.errors.companiesCountHidden &&
                                                <span className="text-danger text-xs">{formik.errors.companiesCountHidden}</span>
                                            }
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs="12">
                                    <Row>
                                        <Col xs="12">
                                            <AryFormikTextInput
                                                type="text"
                                                name="websiteInput"
                                                label="Website"
                                                placeholder="http[s]://www.example.com"
                                                helpText="Include http:// or https://"
                                            />
                                        </Col>
                                        <Col xs="12">
                                            <AryFormikTextInput
                                                name="phoneInput"
                                                label="Phone"
                                                type="text"
                                                placeholder="00-0000-0000"
                                                helpText="[0000000000] [x0000]"
                                            />
                                        </Col>
                                        <Col xs="12">
                                            <AryFormikTextArea
                                                name="extraInfoInput"
                                                label="Extra info"
                                                helpText="Add any extra info about the organization"
                                                rows="3"
                                            />
                                        </Col>
                                        <Col xs="12" sm="6">
                                            <AryFormikTextInput
                                                name="folderFolioInput"
                                                label="Folder folio"
                                                type="text"
                                                helpText="Folio number of the folder where the organization is located"
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Modal.Body>
                        <Modal.Footer>
                            <div className="d-flex justify-content-between align-items-start align-items-sm-center w-100">
                                <div className="text-secondary mb-3 mb-sm-0">
                                    <AryLastUpdatedInfo item={organization} />
                                </div>
                                <div className="d-flex justify-content-end ms-auto ms-sm-0 mb-3 mb-sm-0 gap-2">
                                    <button type="submit"
                                        className="btn bg-gradient-dark mb-0"
                                        disabled={isOrganizationSaving}
                                    >
                                        <FontAwesomeIcon icon={faSave} className="me-1" size="lg" />
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
            
        </Modal>
    )
}

export default OrganizationModalEditItem;