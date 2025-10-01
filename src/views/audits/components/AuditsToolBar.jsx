import { useEffect, useRef, useState } from 'react'
import { faSearch, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Form, Formik } from 'formik';
import Select from 'react-select';

import { AryFormikSelectInput, AryFormikTextInput } from '../../../components/Forms';
import { useAuditorsStore } from '../../../hooks/useAuditorsStore';
import { useAuditsStore } from '../../../hooks/useAuditsStore';
import { useAuthStore } from '../../../hooks/useAuthStore';
import { useOrganizationsStore } from '../../../hooks/useOrganizationsStore';
import { useStandardsStore } from '../../../hooks/useStandardsStore';
import { useViewNavigation } from '../../../hooks/useViewNavigation';
import defaultCSSClasses from '../../../helpers/defaultCSSClasses';
import enums from '../../../helpers/enums';
import envVariables from '../../../helpers/envVariables';
import getSelectSearchOptions from '../../../helpers/getSelectSearchOptions';
import getSelectSearchOptionSelected from '../../../helpers/getSelectSearchOptionSelected';

// import AryFormDebug from '../../../components/Forms/AryFormDebug';

const AuditsToolBar = () => {
    const { AUDITS_OPTIONS } = envVariables();
    const {
        AuditOrderType,
        AuditorOrderType,
        AuditStatusType,
        OrganizationOrderType,
        StandardOrderType,
    } = enums();
    const {
        BUTTON_SEARCH_CLASS,
        BUTTON_CLEAR_SEARCH_CLASS,
    } = defaultCSSClasses();

    const formDefaultValues = {
        organizationSelect: '',
        auditorSelect: '',
        standardSelect: '',
        textInput: '',
        startDateInput: '',
        endDateInput: '',
        statusSelect: '',
        includeDeletedCheck: false,
    };

    const customSelectStyles = { // para el select, se muestre sobre otros elementos
        menu: (provided, state) => ({
            ...provided,
            zIndex: 1000,
        }),
    };

    // CUSTOM HOOKS

    const { ROLES, hasRole } = useAuthStore();

    const {
        isAuditsLoading,
        auditsAsync,
    } = useAuditsStore();

    const {
        isOrganizationsLoading,
        organizations,
        organizationsAsync
    } = useOrganizationsStore();


    const {
        isAuditorsLoading,
        auditors,
        auditorsAsync
    } = useAuditorsStore();

    const {
        isStandardsLoading,
        standards,
        standardsAsync
    } = useStandardsStore();

    const {
        getSavedSearch,
        onSearch,
        onCleanSearch,
     } = useViewNavigation({
        LS_OPTIONS: AUDITS_OPTIONS,
        DefultOrder: AuditOrderType.dateDesc,
        itemsAsync: auditsAsync,
    });

    // HOOKS

    const formikRef = useRef(null);

    const [initialValues, setInitialValues] = useState(formDefaultValues);

    useEffect(() => {
        const savedSearch = getSavedSearch();

        if (!!savedSearch) {
            setInitialValues({
                organizationSelect: savedSearch.organizationID ?? '',
                auditorSelect: savedSearch.auditorID ?? '',
                standardSelect: savedSearch.standardID ?? '',
                textInput: savedSearch.text ?? '',
                startDateInput: savedSearch.startDate ?? '',
                endDateInput: savedSearch.endDate ?? '',
                statusSelect: savedSearch.status ?? '',
                includeDeletedCheck: savedSearch.includeDeleted ?? false,
            });
        }

        organizationsAsync({
            pageSize: 0,
            includeDeleted: false,
            order: OrganizationOrderType.name,
        });

        auditorsAsync({
            pageSize: 0,
            includeDeleted: false,
            order: AuditorOrderType.name,
        });

        standardsAsync({
            pageSize: 0,
            includeDeleted: false,
            order: StandardOrderType.name,
        });
    }, []);

    // METHODS
    
    const onSearchSubmit = (values) => {
        const search = {
            organizationID: values.organizationSelect,
            auditorID: values.auditorSelect,
            standardID: values.standardSelect,
            text: values.textInput,
            startDate: values.startDateInput,
            endDate: values.endDateInput,
            status: values.statusSelect,
            includeDeleted: values.includeDeletedCheck,
        };

        onSearch(search);
    }; // onSearchSubmit

    const onClickClearSearch = () => {

        setInitialValues(formDefaultValues);
        formikRef.current.resetForm(formDefaultValues);                
        onCleanSearch();
    }; // onClickclearSearch

    return (
        <div className="d-flex flex-column flex-md-row justify-content-between gap-2">
            <div className="flex-fill">
                <Formik
                    initialValues={initialValues}
                    onSubmit={onSearchSubmit}
                    enableReinitialize
                    innerRef={formikRef}
                >
                    {(formik) => (
                        <Form>
                            <div className="d-flex flex-column flex-md-row">
                                <div className="flex-md-grow-1 me-md-3">
                                    <div className="row d-flex justify-content-end">
                                        <div className="col-12 col-sm-3 col-xxl-2 mt-auto">
                                            <AryFormikTextInput
                                                name="textInput"
                                                type="text"
                                                placeholder="search..."
                                            />
                                        </div>
                                        <div className="col-12 col-sm-4 col-xxl-3 mt-auto">
                                            <div className="mb-3">
                                                <Select name="organizationSelect" 
                                                    options={getSelectSearchOptions(organizations, 'ID', 'Name')}
                                                    value={getSelectSearchOptionSelected(organizations, 'ID', 'Name', formik.values.organizationSelect)}
                                                    onChange={item => formik.setFieldValue('organizationSelect', item.value)}
                                                    placeholder={ isOrganizationsLoading ? 'Loading...' : 'organizations' }
                                                    styles={customSelectStyles}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-12 col-sm-auto mt-auto">
                                            <AryFormikSelectInput
                                                name="auditorSelect"
                                                onChange={ (e) => {
                                                    const selectedValue = e.target.value;
                                                    formik.setFieldValue('auditorSelect', selectedValue);
                                                }}
                                            >
                                                {
                                                    isAuditorsLoading ? (
                                                        <option value="">(loading...)</option>
                                                    ) : (
                                                        <>
                                                            <option value="">(all auditors)</option>
                                                            {
                                                                !!auditors && auditors.length > 0 && auditors.map((item) => 
                                                                    <option
                                                                        key={item.ID}
                                                                        value={item.ID}
                                                                        className="text-capitalize"
                                                                    >
                                                                        {item.FullName}
                                                                    </option>
                                                                )
                                                            }
                                                        </>
                                                    )
                                                }
                                            </AryFormikSelectInput>
                                        </div>
                                        <div className="col-12 col-sm-auto mt-auto">
                                            <AryFormikSelectInput
                                                name="standardSelect"
                                                onChange={ (e) => {
                                                    const selectedValue = e.target.value;
                                                    formik.setFieldValue('standardSelect', selectedValue);
                                                }}
                                            >
                                                {
                                                    isStandardsLoading ? (
                                                        <option value="">(loading...)</option>
                                                    ) : (
                                                        <>
                                                            <option value="">(all standards)</option>
                                                            {
                                                                !!standards && standards.length > 0 && standards.map(item =>
                                                                    <option
                                                                        key={item.ID}
                                                                        value={item.ID}
                                                                        className="text-capitalize"
                                                                    >
                                                                        {item.Name}
                                                                    </option>
                                                                )
                                                            }
                                                        </>
                                                    )
                                                }
                                            </AryFormikSelectInput>
                                        </div>
                                        <div className="col-12 col-sm-auto mt-auto">
                                            <AryFormikSelectInput
                                                name="statusSelect"
                                                onChange={ (e) => {
                                                    const selectedValue = e.target.value;
                                                    formik.setFieldValue('statusSelect', selectedValue);                                                    
                                                }}
                                            >
                                                { !!AuditStatusType &&  Object.keys(AuditStatusType)
                                                    .filter(key => key != 'deleted')
                                                    .map(key =>
                                                    <option
                                                        key={key}
                                                        value={AuditStatusType[key]}
                                                        className="text-capitalize"
                                                    >
                                                        {key === 'nothing' ? '(all status)' : key}
                                                    </option>
                                                )}
                                            </AryFormikSelectInput>
                                        </div>
                                        <div className="col-12 col-sm-auto pb-2 mb-2 bg-gray-100 rounded">
                                            <div className="row">
                                                <div className="col-12">
                                                    <label className="form-label text-body">Date range (start - end)</label>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-12 col-sm-auto">
                                                    <AryFormikTextInput
                                                        name="startDateInput"
                                                        type="date"
                                                        placeholder="Start date"
                                                        classNameDiv="mb-0"
                                                    />
                                                </div>
                                                <div className="col-12 col-sm-auto">
                                                    <AryFormikTextInput
                                                        name="endDateInput"
                                                        type="date"
                                                        placeholder="End date"
                                                        classNameDiv="mb-0"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        {
                                            hasRole(ROLES.admin) ?
                                                <div className="col-12 col-sm-auto mt-auto">
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
                                                </div> : null
                                        }
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between gap-2">
                                    <div className="d-grid d-md-block flex-grow-1 ps-md-2">
                                        <button type="submit"
                                            className={ BUTTON_SEARCH_CLASS }
                                            disabled={ isAuditsLoading }
                                        >
                                            <FontAwesomeIcon icon={faSearch} className="me-1" />
                                            Search
                                        </button>
                                    </div>
                                    <div className="d-grid d-md-block ps-md-2">
                                        <button type="button" 
                                            className={ BUTTON_CLEAR_SEARCH_CLASS }
                                            onClick={onClickClearSearch}
                                        >
                                            <FontAwesomeIcon icon={faXmark} size="lg" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            {/* <AryFormDebug formik={formik} /> */}
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    )
};

export default AuditsToolBar;