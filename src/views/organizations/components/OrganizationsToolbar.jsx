import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Formik } from "formik";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSearch, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";

import enums from "../../../helpers/enums";
import envVariables from "../../../helpers/envVariables";
import { useOrganizationsStore } from "../../../hooks/useOrganizationsStore";
import { AryFormikSelectInput, AryFormikTextInput } from "../../../components/Forms";
import defaultCSSClasses from "../../../helpers/defaultCSSClasses";
import certificateValidityStatusProps from "../../certificates/helpers/certificateValidityStatusProps";
import { useStandardsStore } from "../../../hooks/useStandardsStore";

const OrganizationsToolbar = ({ applicantsOnly = false, ...props }) => {
    const formDefaultData = {
        folioInput: '',
        textInput: '',
        standardSelect: '',
        certificatesValidityStatusSelect: '',
        statusSelect: '',
        includeDeletedCheck: false,
    };
    const { 
        CertificatesValidityStatusType,
        OrganizationOrderType, 
        OrganizationStatusType,
        StandardOrderType,
    } = enums();
    const {
        APPLICANTS_OPTIONS,
        ORGANIZATIONS_OPTIONS,
        VITE_PAGE_SIZE
    } = envVariables();
    const {
        BUTTON_ADD_CLASS,
        BUTTON_SEARCH_CLASS,
        BUTTON_CLEAR_SEARCH_CLASS,
    } = defaultCSSClasses();

    const SEARCH_OPTIONS = applicantsOnly
        ? APPLICANTS_OPTIONS
        : ORGANIZATIONS_OPTIONS;

    // CUSTOM HOOKS

    const {
        isOrganizationCreating,
        organizationCreatedOk,
        organization,
        organizationsAsync,
        organizationCreateAsync,
    } = useOrganizationsStore();

    const {
        standards,
        standardsAsync,
    } = useStandardsStore();
    
    // HOOKS
    
    const navigate = useNavigate();

    const [initialValues, setInitialValues] = useState(formDefaultData);
    const [statusOptions, setStatusOptions] = useState(null);

    useEffect(() => {
        const savedSearch = JSON.parse(localStorage.getItem(SEARCH_OPTIONS)) || null;

        if (!!savedSearch) {
            setInitialValues({
                folioInput: savedSearch.folio ?? '',
                textInput: savedSearch.text ?? '',
                standardSelect: savedSearch.standardID ?? '',
                certificatesValidityStatusSelect: savedSearch.certificatesValidityStatus ?? '',
                statusSelect: applicantsOnly
                    ? OrganizationStatusType.applicant
                    : savedSearch.status ?? '',
                includeDeletedCheck: savedSearch.includeDeleted ?? false,
            });
        }

        standardsAsync({
            pageSize: 0,
            includeDeleted: false,
            order: StandardOrderType.name,
        });

        if (applicantsOnly) {
            setStatusOptions([
                { label: 'Applicant', value: OrganizationStatusType.applicant },
            ]);
        } else {
            setStatusOptions([
                { label: '(status)', value: '' },
                { label: 'Active', value: OrganizationStatusType.active },
                { label: 'Inactive', value: OrganizationStatusType.inactive },
                // { label: 'Deleted', value: OrganizationStatusType.deleted },
            ]);
        }
    }, []);

    useEffect(() => {
        if (organizationCreatedOk) {            
            navigate(`/applicants/${organization.ID}`);
        }
    }, [organizationCreatedOk]);

    // METHODS

    const onNewItem = () => {
        organizationCreateAsync();
    };

    const onSearchSubmit = (values) => {
        const savedSearch = JSON.parse(localStorage.getItem(SEARCH_OPTIONS)) || null;
        const search = {
            ...savedSearch,
            folio: values.folioInput,
            text: values.textInput,
            standardID: values.standardSelect,
            status: values.statusSelect,
            certificatesValidityStatus: values.certificatesValidityStatusSelect,
            includeDeleted: values.includeDeletedCheck,
            pageNumber: 1,
        };

        organizationsAsync(search);
        localStorage.setItem(SEARCH_OPTIONS, JSON.stringify(search));
    };

    const onCleanSearch = () => {
        const savedSearch = JSON.parse(localStorage.getItem(SEARCH_OPTIONS)) || null;
        const search = {
            pageSize: savedSearch?.pageSize ?? VITE_PAGE_SIZE,
            pageNumber: 1,
            includeDeleted: false,
            order: OrganizationOrderType.folioDesc,
        };

        setInitialValues(formDefaultData);
        organizationsAsync(search);
        localStorage.setItem(SEARCH_OPTIONS, JSON.stringify(search));
    };

    return (
        <div {...props} className="d-flex flex-column flex-md-row justify-content-between gap-2">
            {
                applicantsOnly &&
                <div>
                    <button
                        className={ BUTTON_ADD_CLASS }
                        onClick={onNewItem}
                        title="New applicant"
                        disabled={isOrganizationCreating}
                    >
                        <FontAwesomeIcon icon={faPlus} className="me-1" />
                        Add
                    </button>
                </div>
            }
            <div className="flex-fill">
                <Formik
                    initialValues={initialValues}
                    onSubmit={onSearchSubmit}
                    enableReinitialize
                >
                    {(formik) => (
                        <Form>
                            <div className="d-flex flex-column flex-md-row">
                                <div className="flex-md-grow-1 me-md-3">
                                    <div className="row d-flex justify-content-end">
                                        <div className="col-12 col-sm-2 col-xxl-1">
                                            <AryFormikTextInput 
                                                name="folioInput" 
                                                type="text" 
                                                placeholder="folio"
                                            />
                                        </div>
                                        <div className="col-12 col-sm-auto">
                                            <AryFormikTextInput
                                                name="textInput"
                                                type="text"
                                                placeholder="search..."
                                            />
                                        </div>
                                        <div className="col-12 col-sm-auto mb-3">
                                            <AryFormikSelectInput name="standardSelect">
                                                <option value="">(standard)</option>
                                                {
                                                    standards.map(item =>
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
                                        </div>
                                        {
                                            !applicantsOnly &&
                                            <div className="col-12 col-sm-3 col-xxl-2">
                                                <AryFormikSelectInput name="certificatesValidityStatusSelect">
                                                    {
                                                        Object.keys(CertificatesValidityStatusType).map(key =>
                                                            <option
                                                                key={key}
                                                                value={CertificatesValidityStatusType[key]}
                                                                className="text-capitalize"
                                                            >
                                                                {key === 'nothing' ? '(certificates validity)' : certificateValidityStatusProps[CertificatesValidityStatusType[key]].label}
                                                            </option>
                                                        )}
                                                </AryFormikSelectInput>
                                            </div>
                                        }
                                        <div className="col-12 col-sm-auto">
                                            <AryFormikSelectInput
                                                name="statusSelect"
                                                onChange={ (e) => {
                                                    const selectedValue = e.target.value;
                                                    formik.setFieldValue('statusSelect', selectedValue);                                                    
                                                }}
                                                disabled={!!applicantsOnly}
                                            >
                                                { !!statusOptions && statusOptions.map(item =>
                                                    <option
                                                        key={item.value}
                                                        value={item.value}
                                                    >
                                                        {item.label}
                                                    </option>
                                                )}
                                            </AryFormikSelectInput>
                                            {/* <AryFormikSelectInput name="statusSelect">
                                                {
                                                    Object.keys(OrganizationStatusType).map(key =>
                                                        <option
                                                            key={key}
                                                            value={OrganizationStatusType[key]}
                                                            className="text-capitalize"
                                                        >
                                                            {key === 'nothing' ? '(status)' : key}
                                                        </option>
                                                    )}
                                            </AryFormikSelectInput> */}
                                        </div>
                                        <div className="col-auto ps-sm-0">
                                            <div className="p-2 bg-gray-100 border-radius-md mb-3">
                                                <div className="form-check form-switch">
                                                    <input id="includeDeletedCheck" name="includeDeletedCheck"
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        onChange={formik.handleChange}
                                                        checked={formik.values.includeDeletedCheck}
                                                    />
                                                    <label className="form-check-label text-secondary mb-0" htmlFor="includeDeletedCheck">
                                                        <FontAwesomeIcon icon={ faTrash } size="lg" title="Show deleted records" />
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between gap-2">
                                    <div className="d-grid d-md-block flex-grow-1 ps-md-2">
                                        <button type="submit" className={ BUTTON_SEARCH_CLASS }>
                                            <FontAwesomeIcon icon={faSearch} className="me-1" />
                                            Search
                                        </button>
                                    </div>
                                    <div className="d-grid d-md-block ps-md-2">
                                        <button type="button" 
                                            className={ BUTTON_CLEAR_SEARCH_CLASS }
                                            onClick={(values) => {
                                                onCleanSearch(values);
                                                formik.resetForm(initialValues);
                                        }}>
                                            <FontAwesomeIcon icon={faXmark} size="lg" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    )
}

export default OrganizationsToolbar;