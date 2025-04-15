import React, { useEffect, useRef, useState } from 'react'
import defaultCSSClasses from '../../../helpers/defaultCSSClasses';
import { useAuditNavigation } from '../hooks/useAuditNavigation';
import { useAuditsStore } from '../../../hooks/useAuditsStore';
import { Form, Formik } from 'formik';
import { AryFormikSelectInput, AryFormikTextInput } from '../../../components/Forms';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';
import AryFormDebug from '../../../components/Forms/AryFormDebug';
import { useOrganizationsStore } from '../../../hooks/useOrganizationsStore';
import { useAuditorsStore } from '../../../hooks/useAuditorsStore';
import { useStandardsStore } from '../../../hooks/useStandardsStore';
import Select from 'react-select';
import enums from '../../../helpers/enums';
import getSelectSearchOptions from '../../../helpers/getSelectSearchOptions';
import getSelectSearchOptionSelected from '../../../helpers/getSelectSearchOptionSelected';

const AuditsToolBar = () => {

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
    const {
        AuditStatusType,
        AuditorOrderType,
        OrganizationOrderType,
        StandardOrderType,
    } = enums();

    const {
        BUTTON_SEARCH_CLASS,
        BUTTON_CLEAR_SEARCH_CLASS,
    } = defaultCSSClasses();

    const customSelectStyles = {
        menu: (provided, state) => ({
            ...provided,
            zIndex: 1000,
        }),
    };

    // CUSTOM HOOKS

    const {
        getSavedSearch,
        onSearch,
        onCleanSearch,
    } = useAuditNavigation();

    const {
        isAuditsLoading
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

    // HOOKS

    const formikRef = useRef(null);

    const [initialValues, setInitialValues] = useState(formDefaultValues);

    useEffect(() => {
        //console.log('AuditsToolBar.useEffect[]:');
        const savedSearch = getSavedSearch();

        if (!!savedSearch) {
            //console.log('useEffect[]: savedSearch', savedSearch.text ?? '');
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
        //console.log('onClickClearSearch');

        setInitialValues(formDefaultValues);
        formikRef.current.resetForm(formDefaultValues);
        //console.log(formikRef);
        
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