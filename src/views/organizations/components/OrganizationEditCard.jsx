import { Card, Col, Image, ListGroup, Row } from 'react-bootstrap'
import { faBan, faEdit, faPlus, faRotateRight, faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useOrganizationsStore } from '../../../hooks/useOrganizationsStore';
import * as Yup from 'yup';
import enums from '../../../helpers/enums';
import envVariables from '../../../helpers/envVariables';
import isNullOrEmpty from '../../../helpers/isNullOrEmpty';
import Swal from 'sweetalert2';
import { Field, Form, Formik } from 'formik';
import { AryFormikSelectInput, AryFormikTextArea, AryFormikTextInput } from '../../../components/Forms';
import AryLastUpdatedInfo from '../../../components/AryLastUpdatedInfo/AryLastUpdatedInfo';
import organizationStatusProps from '../helpers/organizationStatusProps';
import { useNotesStore } from '../../../hooks/useNotesStore';
import NotesListModal from '../../notes/components/NotesListModal';
import { useCompaniesStore } from '../../../hooks/useCompaniesStore';
import { faSquarePlus } from '@fortawesome/free-regular-svg-icons';
import CompaniesList from '../../companies/components/CompaniesList';

const OrganizationEditCard = ({ updatePhotoPreview, ...props }) => {
    const {
        COID_REGEX,
        PHONE_REGEX,
        URL_ORGANIZATION_FILES,
        VITE_FILES_URL,
    } = envVariables();
    const { OrganizationStatusType, CompanyOrderType } = enums();
    const formDefaultValues = {
        nameInput: '',
        // legalEntityInput: '',
        websiteInput: '',
        phoneInput: '',
        logoInputFile: '',
        // qrcodeInputFile: '',
        // coidInput: '',
        extraInfoInput: '',
        statusSelect: '',
        noteInput: '',
        companiesCountHidden: 0,
    };
    const validationSchema = Yup.object({
        nameInput: Yup.string()
            .required('Name is required')
            .max(250, 'Name must be at most 250 characters'),
        // legalEntityInput: Yup.string()
        //     .required('Legal entity is required')
        //     .max(250, 'Legal entity must be at most 250 characters'),
        websiteInput: Yup.string()
            .url('Web site must be a valid URL')
            .max(250, 'Web site must be at most 250 characters'),
        phoneInput: Yup.string()
            .max(25, 'Phone number must be at most 25 characters')
            .matches(PHONE_REGEX, 'Phone number is not valid'),
        extraInfoInput: Yup.string()
            .max(1000, 'Extra info must be at most 1000 characters'),
        // coidInput: Yup.string()
        //     .max(20, 'COID number must be at most 20 characters')
        //     .matches(COID_REGEX, 'COID number is not valid'),
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
        // qrcodeInputFile: Yup.mixed()
        //     .test({
        //         name: 'is-type-valid',
        //         message: 'Some file update error', // <- este solo es visible si el último return es false
        //         test: (value, ctx) => {
        //             if (!!value) {
        //                 const extension = value.name.split(/[.]+/).pop(); // value.name.split('.').slice(-1)[0]; // https://stackoverflow.com/questions/651563/getting-the-last-element-of-a-split-string-array
        //                 const validTypes = ['jpg', 'png'];
        //                 if (!validTypes.includes(extension)) {
        //                     return ctx.createError({
        //                         message: 'Only files with png or jpg extensions are allowed'
        //                     });
        //                 }
        //             }
        //             return true;
        //         }
        //     }),
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
        organizationDeletedOk,
        organization,
        
        organizationSaveAsync,
        organizationDeleteAsync,
        organizationClear,
    } = useOrganizationsStore();

    const {
        isCompaniesLoading,
        companies,
        companiesAsync,
        companiesErrorMessage
    } = useCompaniesStore();

    const {
        isNoteCreating,
        noteCreatedOk,
        note,
        noteCreateAsync,
    } = useNotesStore();

    // HOOKS

    const navigate = useNavigate();

    const formikRef = useRef(null);

    const [initialValues, setInitialValues] = useState(formDefaultValues);
    const [logoPreview, setLogoPreview] = useState(null);
    const [newLogo, setNewLogo] = useState(false);
    // const [qrcodePreview, setQrcodePreview] = useState(null);
    // const [newQRCode, setNewQRCode] = useState(false);
    const [statusOptions, setStatusOptions] = useState(null);
    const [showAddNote, setShowAddNote] = useState(false);

    useEffect(() => {
        if (!!organization) {
            setInitialValues({
                nameInput: organization?.Name ?? '',
                // legalEntityInput: organization?.LegalEntity ?? '',
                websiteInput: organization?.Website ?? '',
                phoneInput: organization?.Phone ?? '',
                //coidInput: organization?.COID ?? '',
                logoInputFile: '',
                extraInfoInput: organization?.ExtraInfo ?? '',
                // qrcodeInputFile: '',
                statusSelect: organization?.Status ?? '',
                noteInput: '',
                companiesCountHidden: organization?.Companies?.length ?? 0,
            });

            setNewLogo(isNullOrEmpty(organization.LogoFile));
            //setNewQRCode(isNullOrEmpty(organization.QRFile));

            switch (organization.Status) {
                case OrganizationStatusType.prospect:
                    setStatusOptions([
                        { label: 'Applicant', value: OrganizationStatusType.applicant },
                        { label: 'Active', value: OrganizationStatusType.active },
                    ]);
                    break;
                case OrganizationStatusType.active:
                    setStatusOptions([
                        { label: 'Active', value: OrganizationStatusType.active },
                        { label: 'Inactive', value: OrganizationStatusType.inactive },
                    ]);
                    break;
                case OrganizationStatusType.inactive:
                    setStatusOptions([
                        { label: 'Active', value: OrganizationStatusType.active },
                        { label: 'Inactive', value: OrganizationStatusType.inactive },
                    ]);
                    break;
                case OrganizationStatusType.deleted:
                    setStatusOptions([
                        { label: 'Active', value: OrganizationStatusType.active },
                        { label: 'Deleted', value: OrganizationStatusType.deleted },
                    ]);
                    break;
                default:
                    setStatusOptions([
                        { label: '(status)', value: '' },
                        { label: 'Applicant', value: OrganizationStatusType.applicant },
                        { label: 'Active', value: OrganizationStatusType.active },
                        { label: 'Inactive', value: OrganizationStatusType.inactive },
                        { label: 'Deleted', value: OrganizationStatusType.deleted },
                    ]);
                    break;
            } // switch

            // companiesAsync({
            //     organizationID: organization.ID,
            //     pageSize: 0,
            //     order: CompanyOrderType.name,
            // });
        }
    }, [organization]);

    useEffect(() => {
        if (!!companies) {
            formikRef.current.setFieldValue('companiesCountHidden', companies.length);
        }
    }, [companies])
    

    useEffect(() => {
        if (!!organizationSavedOk) {
            Swal.fire('Organization', 'Changes made successfully', 'success');
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
    
    // METHODS

    const onFormSubmit = (values) => {
        const toSave = {
            ID: organization.ID,
            Name: values.nameInput,
            // LegalEntity: values.legalEntityInput,
            Website: values.websiteInput,
            Phone: values.phoneInput,
            ExtraInfo: values.extraInfoInput,
            // COID: values.coidInput,
            Status: values.statusSelect,
        };

        //console.log(values);

        if (organization.Status != values.statusSelect) {
            const text = "Status changed to " + organizationStatusProps[values.statusSelect].label.toUpperCase();
            noteCreateAsync({
                OwnerID: organization.ID,
                Text: `${text}${!isNullOrEmpty(values.noteInput) ? ': ' + values.noteInput : ''}`,
            });
        }

        organizationSaveAsync(toSave, values.logoInputFile, values.qrcodeInputFile);
    }; // onFormSubmit

    const onCancelButton = () => {
        organizationClear();
        navigate('/organizations/');
    }; // onCancelButton

    const onDeleteFile = (file) => {

    }; // onDeleteFile

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
    }; // onDeleteButton

    return (
        <Card {...props}>
            <Card.Header className="pb-0">
                <Card.Title>
                    <FontAwesomeIcon icon={ faEdit } size="lg" className="text-dark me-2" />
                    Edit organization
                </Card.Title>
            </Card.Header>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                enableReinitialize
                onSubmit={onFormSubmit}
                innerRef={formikRef}
            >
                { formik => (
                    <Form>
                        <Field name="companiesCountHidden" type="hidden" value={ formik.values.companiesCountHidden } />
                        <Card.Body className="py-0">
                            <Row>
                                <Col xs="12" sm="4">
                                    <Row>
                                        <Col xs="12">
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
                                                        {/* <button
                                                            type="button"
                                                            className="btn btn-link p-0 mb-0 text-secondary"
                                                            onClick={onDeleteFile}
                                                            title="Delete logotype file"
                                                        >
                                                            <FontAwesomeIcon icon={faTrash} size="lg" />
                                                        </button> */}
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
                                    </Row>
                                    {/* <Row>
                                        <Col xs="12">
                                            <div className="d-flex justify-content-between">
                                                <label className="form-label">QR Code</label>
                                                {
                                                    !newQRCode && !!organization.QRFile &&
                                                    <div className="d-flex justify-content-end gap-3">
                                                        <button
                                                            type="button"
                                                            className="btn btn-link p-0 mb-0 text-secondary"
                                                            onClick={() => setNewQRCode(true)}
                                                            title="Upload new QR Code"
                                                        >
                                                            <FontAwesomeIcon icon={faRotateRight} size="lg" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn btn-link p-0 mb-0 text-secondary"
                                                            onClick={onDeleteFile}
                                                            title="Delete QR code file"
                                                        >
                                                            <FontAwesomeIcon icon={faTrash} size="lg" />
                                                        </button>
                                                    </div>
                                                }
                                                {
                                                    !!newQRCode && !isNullOrEmpty(organization.QRFile) &&
                                                    <div className="text-end">
                                                        <button
                                                            type="button"
                                                            className="btn btn-link p-0 mb-0 text-secondary"
                                                            onClick={ () => {
                                                                setNewQRCode(false);
                                                                setQrcodePreview(null);
                                                                formik.setFieldValue("qrcodeInputFile", '');
                                                            }}
                                                            title="Cancel upload new QR Code"
                                                        >
                                                            <FontAwesomeIcon icon={faBan} size="lg" />
                                                        </button>
                                                    </div>
                                                }
                                            </div>
                                            {
                                                !!newQRCode ? (
                                                    <>
                                                        {
                                                            !!qrcodePreview && 
                                                            <div>
                                                                <Image src={qrcodePreview}
                                                                    thumbnail
                                                                    fluid
                                                                    className="mb-3"
                                                                />
                                                            </div>
                                                        }
                                                        <input
                                                            type="file"
                                                            name="qrFile"
                                                            accept="image/png,image/jpeg,image/jpg"
                                                            className="form-control mb-3"
                                                            onChange={(e) => {
                                                                const fileReader = new FileReader();
                                                                fileReader.onload = () => {
                                                                    if (fileReader.readyState === 2) {
                                                                        setQrcodePreview(fileReader.result);                                                                        
                                                                    }
                                                                };
                                                                fileReader.readAsDataURL(e.target.files[0]);
                                                                formik.setFieldValue('qrcodeInputFile', e.currentTarget.files[0]);
                                                            }}
                                                        />
                                                        {
                                                            formik.touched.qrcodeInputFile && formik.errors.qrcodeInputFile &&
                                                            <span className="text-danger text-xs">{formik.errors.qrcodeInputFile}</span>
                                                        }
                                                    </>
                                                ) : !!organization.QRFile && (
                                                    <div>
                                                        <Image 
                                                            src={`${VITE_FILES_URL}${URL_ORGANIZATION_FILES}/${organization.ID}/${organization.QRFile}`}
                                                            thumbnail
                                                            fluid
                                                            className="mb-3"
                                                        />
                                                    </div>
                                                )
                                            }
                                        </Col>
                                    </Row> */}
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
                                        <Col xs="12">
                                            <AryFormikSelectInput
                                                name="statusSelect"
                                                label="Status"
                                                onChange={ (e) => {
                                                    const selectedValue = e.target.value;
                                                    formik.setFieldValue('statusSelect', selectedValue);
                                                    setShowAddNote(selectedValue != organization.Status);
                                                }}
                                            >
                                                {
                                                    !!statusOptions && statusOptions.map(item => 
                                                        <option
                                                            key={ item.value }
                                                            value={ item.value }
                                                        >
                                                            { item.label }
                                                        </option>
                                                    )
                                                }
                                            </AryFormikSelectInput>
                                        </Col>
                                        {
                                            showAddNote &&
                                            <Col xs="12">
                                                <AryFormikTextInput
                                                    name="noteInput"
                                                    label="Note"
                                                    helpText="Add a note for the status change"
                                                />
                                            </Col>
                                        }
                                        { 
                                            !!organization.Notes && organization.Notes.length > 0 &&
                                            <Col xs="12">
                                                <NotesListModal notes={organization.Notes} buttonLabel="View notes" />
                                            </Col>
                                        }
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