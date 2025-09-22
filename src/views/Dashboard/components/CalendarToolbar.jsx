import { AryFormikSelectInput, AryFormikTextInput } from '../../../components/Forms';
import { faPlus, faSearch, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Form, Formik } from 'formik';
import { useAuditorsStore } from '../../../hooks/useAuditorsStore';
import { useAuditsStore } from '../../../hooks/useAuditsStore';
import { useOrganizationsStore } from '../../../hooks/useOrganizationsStore';
import defaultCSSClasses from '../../../helpers/defaultCSSClasses'
import enums from '../../../helpers/enums';
import envVariables from '../../../helpers/envVariables';
import React, { useEffect, useState } from 'react'
import Select from 'react-select';
import { useStandardsStore } from '../../../hooks/useStandardsStore';
import { useAuthStore } from '../../../hooks/useAuthStore';
import getInitialRange from '../helpers/getInitialRange';

const CalendarToolbar = ({ ...props }) => {
    const {
        DASHBOARD_OPTIONS,
    } = envVariables();
    const {
        DefaultStatusType,
        AuditStatusType,
        AuditOrderType,
        AuditorOrderType,
        OrganizationStatusType,
        OrganizationOrderType,
        StandardOrderType,
    } = enums();
    const formDefaultData = {
        textInput: '',
        organizationSelect: '',
        auditorSelect: '',
        standardSelect: '',
        statusSelect: '',
        includeDeletedCheck: false,
    };
    const {
        BUTTON_ADD_CLASS,
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

    const { ROLES, hasRole } = useAuthStore();

    const {
        isAuditsLoading,
        auditsAsync,
    } = useAuditsStore();

    const {
        isOrganizationsLoading,
        organizations,
        organizationsAsync,
    } = useOrganizationsStore();

    const {
        auditors,
        auditorsAsync,
    } = useAuditorsStore();

    const {
        standards,
        standardsAsync,
    } = useStandardsStore();

    // HOOKS

    const [initialValues, setInitialValues] = useState(formDefaultData);

    useEffect(() => {
        const savedSearch = JSON.parse(localStorage.getItem(DASHBOARD_OPTIONS)) || null;
        
        if (!!savedSearch) {
            setInitialValues({
                textInput: savedSearch.text ?? '',
                organizationSelect: savedSearch.organizationID ?? '',
                auditorSelect: savedSearch.auditorID ?? '',
                standardSelect: savedSearch.standardID ?? '',
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

    const getSelectOptions = (items, propertyValueName, propertyLabelName) => {
        let options = [];
        if (!!items) {
            options = items.map(item => ({ 
                value: item[propertyValueName],
                label: item[propertyLabelName]
            }));
        }
        return options;
    } // getSelectOptions

    const getSelectOptionSelected = (items, propertyValueName, propertyLabelName, selectedID) => {

        if (!!items) {
            const selectedItem = items.find(item => item[propertyValueName] === selectedID);        
            if (!!selectedItem) {
                return {
                    value: selectedItem[propertyValueName],
                    label: selectedItem[propertyLabelName]
                }
            }
        }

        return null;
    };

    const onSearchSubmit = (values) => {
        const savedSearch = JSON.parse(localStorage.getItem(DASHBOARD_OPTIONS)) || null;
        const search = {
            ...savedSearch,
            text: values.textInput,
            organizationID: values.organizationSelect,
            auditorID: values.auditorSelect,
            standardID: values.standardSelect,
            status: values.statusSelect,
            includeDeleted: values.includeDeletedCheck,
            pageNumber: 0,
        };

        auditsAsync(search);
        localStorage.setItem(DASHBOARD_OPTIONS, JSON.stringify(search));
    }; // onSearchSubmit

    const onCleanSearch = () => {
        const savedSearch = JSON.parse(localStorage.getItem(DASHBOARD_OPTIONS)) || null;
        const search = {
            ...savedSearch,
            text: '',
            organizationID: '',
            auditorID: '',
            standardID: '',
            status: '',
            includeDeleted: false,
            pageNumber: 0,
        };

        setInitialValues(formDefaultData);
        auditsAsync(search);
        localStorage.setItem(DASHBOARD_OPTIONS, JSON.stringify(search));
    }; // onCleanSearch

    return (
        <div {...props} className="d-flex flex-column flex-md-row justify-content-between gap-2">
            {/* <div>
                <button className={BUTTON_ADD_CLASS}>
                    <FontAwesomeIcon icon={faPlus} className="me-1" />
                    Add
                </button>
            </div> */}
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
                                        <div className="col-12 col-sm-3 col-xxl-2">
                                            <AryFormikTextInput
                                                name="textInput"
                                                type="text"
                                                placeholder="search..."
                                            />
                                        </div>
                                        <div className="col-12 col-sm-4 col-xxl-3">
                                            <div className="mb-3">
                                                <Select name="organizationSelect" 
                                                    options={getSelectOptions(organizations, 'ID', 'Name')}
                                                    value={getSelectOptionSelected(organizations, 'ID', 'Name', formik.values.organizationSelect)}
                                                    onChange={item => formik.setFieldValue('organizationSelect', item.value)}
                                                    placeholder={ isOrganizationsLoading ? 'Loading...' : 'organizations' }
                                                    //menuPortalTarget={ document.body } 
                                                    styles={customSelectStyles}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-12 col-sm-auto">
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
                                        <div className="col-12 col-sm-auto">
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
                                        <div className="col-12 col-sm-auto">
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
                                        {
                                            hasRole(ROLES.admin) ?
                                                <div className="col-12 col-sm-auto">
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

export default CalendarToolbar