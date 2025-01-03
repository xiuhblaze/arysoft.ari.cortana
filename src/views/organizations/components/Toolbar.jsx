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

const Toolbar = () => {
    const formDefaultData = {
        textInput: '',
        statusSelect: '',
        includeDeletedCheck: false,
    };
    const { OrganizationOrderType, OrganizationStatusType } = enums();
    const {
        ORGANIZATIONS_OPTIONS,
        VITE_PAGE_SIZE
    } = envVariables();
    const {
        BUTTON_ADD_CLASS,
        BUTTON_SEARCH_CLASS,
        BUTTON_CLEAR_SEARCH_CLASS,
    } = defaultCSSClasses();

    // CUSTOM HOOKS

    const {
        isOrganizationCreating,
        organizationCreatedOk,
        organization,
        organizationsAsync,
        organizationCreateAsync,
    } = useOrganizationsStore();
    
    // HOOKS
    
    const navigate = useNavigate();

    const [initialValues, setInitialValues] = useState(formDefaultData);

    useEffect(() => {
        const savedSearch = JSON.parse(localStorage.getItem(ORGANIZATIONS_OPTIONS)) || null;

        if (!!savedSearch) {
            setInitialValues({
                textInput: savedSearch.text ?? '',
                statusSelect: savedSearch.status ?? '',
                includeDeletedCheck: savedSearch.includeDeleted ?? false,
            });
        }
    }, []);

    useEffect(() => {
        if (organizationCreatedOk) {
            navigate(`/organizations/${organization.ID}`);
        }
    }, [organizationCreatedOk]);

    // METHODS

    const onNewItem = () => {
        organizationCreateAsync();
    };

    const onSearchSubmit = (values) => {
        const savedSearch = JSON.parse(localStorage.getItem(ORGANIZATIONS_OPTIONS)) || null;
        const search = {
            ...savedSearch,
            text: values.textInput,
            status: values.statusSelect,
            includeDeleted: values.includeDeletedCheck,
            pageNumber: 1,
        };

        organizationsAsync(search);
        localStorage.setItem(ORGANIZATIONS_OPTIONS, JSON.stringify(search));
    };

    const onCleanSearch = () => {
        const savedSearch = JSON.parse(localStorage.getItem(ORGANIZATIONS_OPTIONS)) || null;
        const search = {
            pageSize: savedSearch?.pageSize ?? VITE_PAGE_SIZE,
            pageNumber: 1,
            includeDeleted: false,
            order: OrganizationOrderType.name,
        };

        setInitialValues(formDefaultData);
        organizationsAsync(search);
        localStorage.setItem(ORGANIZATIONS_OPTIONS, JSON.stringify(search));
    };

    return (
        <div className="d-flex flex-column flex-md-row justify-content-between gap-2">
            <div>
                <button
                    className={ BUTTON_ADD_CLASS }
                    onClick={onNewItem}
                    title="New organization"
                    disabled={isOrganizationCreating}
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
                >
                    {(formik) => (
                        <Form>
                            <div className="d-flex flex-column flex-md-row">
                                <div className="flex-md-grow-1 me-md-3">
                                    <div className="row d-flex justify-content-end">
                                        <div className="col-12 col-sm-auto">
                                            <AryFormikTextInput
                                                name="textInput"
                                                type="text"
                                                placeholder="search..."
                                            />
                                        </div>
                                        <div className="col-12 col-sm-auto">
                                            <AryFormikSelectInput name="statusSelect">
                                                {
                                                    Object.keys(OrganizationStatusType).map(key =>
                                                        <option
                                                            key={key}
                                                            value={OrganizationStatusType[key]}
                                                            className="text-capitalize"
                                                        >
                                                            {key === 'nothing' ? '(all)' : key}
                                                        </option>
                                                    )}
                                            </AryFormikSelectInput>
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

export default Toolbar