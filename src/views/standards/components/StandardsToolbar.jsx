import { useEffect, useState, useRef } from "react";
import { Form, Formik } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSearch, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";

import { AryFormikTextInput, AryFormikSelectInput } from "../../../components/Forms";
import { useAuthStore } from "../../../hooks/useAuthStore";
import { useStandardsStore } from "../../../hooks/useStandardsStore";
import { useViewNavigation } from "../../../hooks/useViewNavigation";
import defaultCSSClasses from "../../../helpers/defaultCSSClasses";
import enums from "../../../helpers/enums";
import envVariables from "../../../helpers/envVariables";

export const StandardsToolbar = () => {
    const { DefaultStatusType, StandardOrderType } = enums();
    const { STANDARDS_OPTIONS } = envVariables();
    const {
        BUTTON_ADD_CLASS,
        BUTTON_SEARCH_CLASS,
        BUTTON_CLEAR_SEARCH_CLASS,
    } = defaultCSSClasses();
    const formDefaultData = {
        textInput: '',
        statusSelect: '',
        includeDeletedCheck: false,
    }

    // CUSTOM HOOKS

    const { ROLES, hasRole } = useAuthStore();
    const {
        isStandardCreating,
        standardsAsync,
        standardCreateAsync,
    } = useStandardsStore();
    const {
        getSavedSearch,
        onSearch,
        onCleanSearch,
    } = useViewNavigation({
        LS_OPTIONS: STANDARDS_OPTIONS,
        DefultOrder: StandardOrderType.name,
        itemsAsync: standardsAsync,
    });

    // HOOKS

    const formikRef = useRef(null);
    const [initialValues, setInitialValues] = useState(formDefaultData);

    useEffect(() => {
        const savedSearch = getSavedSearch();
        if (!!savedSearch) {
            setInitialValues({
                textInput: savedSearch?.text ?? '',
                statusSelect: savedSearch?.status ?? '',
                includeDeletedCheck: savedSearch?.includeDeleted ?? false,
            });
        }
    }, []);

    // METHODS

    const onNewItem = () => {
        standardCreateAsync();
    };

    const onSearchSubmit = (values) => {
        const search = {
            text: values.textInput,
            status: values.statusSelect,
            includeDeleted: values.includeDeletedCheck,
            pageNumber: 1,
        };
        onSearch(search);
    }; // onSearchSubmit

    const handleClearSearch = () => {
        setInitialValues(formDefaultData);
        formikRef.current.resetForm(initialValues);

        onCleanSearch();
    }; // handleClearSearch

    return (
        <div className="d-flex flex-column flex-md-row justify-content-between gap-2">
            <div>
                <button
                    className={BUTTON_ADD_CLASS}
                    onClick={onNewItem}
                    title="New NACE code"
                    disabled={isStandardCreating}
                >
                    <FontAwesomeIcon icon={faPlus} className="me-1" />
                    Add
                </button>
            </div>
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
                                        <div className="col-12 col-sm-auto">
                                            <AryFormikTextInput name="textInput" type="text" />
                                        </div>
                                        <div className="col-12 col-sm-auto ps-sm-0">
                                            <AryFormikSelectInput name="statusSelect">
                                                {
                                                    Object.keys(DefaultStatusType).map((key) => {
                                                        if (key === 'nothing') return (<option key={key} value={DefaultStatusType[key]}>(status)</option>);
                                                        return (<option key={key} value={DefaultStatusType[key]} className="text-capitalize">{key}</option>);
                                                    })}
                                            </AryFormikSelectInput>
                                        </div>
                                        {
                                            hasRole(ROLES.admin) ?
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
                                                </div> : null
                                        }
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between gap-2 mb-3">
                                    <div className="d-grid d-md-block flex-grow-1 ps-md-2">
                                        <button type="submit" className={BUTTON_SEARCH_CLASS}>
                                            <FontAwesomeIcon icon={faSearch} className="me-1" />
                                            Search
                                        </button>
                                    </div>
                                    <div className="d-grid d-md-block ps-md-2">
                                        <button type="button" className={BUTTON_CLEAR_SEARCH_CLASS} onClick={handleClearSearch}>
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

export default StandardsToolbar;