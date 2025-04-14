import React, { useEffect, useRef, useState } from 'react'
import defaultCSSClasses from '../../../helpers/defaultCSSClasses';
import { useAuditNavigation } from '../hooks/useAuditNavigation';
import { useAuditsStore } from '../../../hooks/useAuditsStore';
import { Form, Formik } from 'formik';
import { AryFormikTextInput } from '../../../components/Forms';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faXmark } from '@fortawesome/free-solid-svg-icons';
import AryFormDebug from '../../../components/Forms/AryFormDebug';

const AuditsToolBar = () => {

    const formDefaultValues = {
        textInput: '',
        // organizationSelect: '',
        // auditorSelect: '',
        // standardSelect: '',
        // statusSelect: '',
        // startDateInput: '',
        // endDateInput: '',
        // includeDeletedCheck: false,
    };

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

    // HOOKS

    const formikRef = useRef(null);

    const [initialValues, setInitialValues] = useState(formDefaultValues);

    useEffect(() => {
        console.log('AuditsToolBar.useEffect[]:');
        const savedSearch = getSavedSearch();

        if (!!savedSearch) {
            //console.log('useEffect[]: savedSearch', savedSearch.text ?? '');
            setInitialValues({
                textInput: savedSearch.text ?? '',
                // organizationSelect: savedSearch.organizationID ?? '',
                // auditorSelect: savedSearch.auditorID ?? '',
                // standardSelect: savedSearch.standardID ?? '',
                // statusSelect: savedSearch.status ?? '',
                // startDateInput: savedSearch.startDate ?? '',
                // endDateInput: savedSearch.endDate ?? '',
                // includeDeletedCheck: savedSearch.includeDeleted ?? false,
            });
        }
    }, []);

    // METHODS
    
    const onSearchSubmit = (values) => {
        const search = {
            text: values.textInput,
            // organizationID: values.organizationSelect,
            // auditorID: values.auditorSelect,
            // standardID: values.standardSelect,
            // status: values.statusSelect,
            // startDate: values.startDateInput,
            // endDate: values.endDateInput,
            // includeDeleted: values.includeDeletedCheck,
        };

        onSearch(search);
    }; // onSearchSubmit

    const onClickClearSearch = () => {
        //console.log('onClickClearSearch');

        setInitialValues(formDefaultValues);
        formikRef.current.resetForm(formDefaultValues);
        //console.log(formikRef);
        
        onCleanSearch();
    };

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
                                        <div className="col-12 col-sm-3 col-xxl-2">
                                            <AryFormikTextInput
                                                name="textInput"
                                                type="text"
                                                placeholder="search..."
                                            />
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