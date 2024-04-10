import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Formik } from "formik";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSearch, faXmark } from "@fortawesome/free-solid-svg-icons";

import enums from "../../../helpers/enums";
import envVariables from "../../../helpers/envVariables";
import { useOrganizationsStore } from "../../../hooks/useOrganizationsStore";
import { AryFormikSelectInput, AryFormikTextInput } from "../../../components/Forms";

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

    // CUSTOM HOOKS

    const navigate = useNavigate();
    const {
        isOrganizationCreating,
        organizationCreatedOk,
        organization,
        organizationsAsync,
        organizationCreateAsync,
    } = useOrganizationsStore();

    // HOOKS

    const [initialValues, setInitialValues] = useState(formDefaultData);

    useEffect(() => {
        const savedSearch = JSON.parse(localStorage.getItem(ORGANIZATIONS_OPTIONS)) || null;

        if (!!savedSearch) {
            setInitialValues({
                ...savedSearch,
                textInput: savedSearch.text,
                statusSelect: savedSearch.status,
                includeDeletedCheck: savedSearch.includeDeleted,
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
                    className="btn bg-gradient-dark d-flex justify-content-center align-items-center mb-0"
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
                                        <div className="col-auto ps-0">
                                            <div className="form-check form-switch mt-lg-2 mt-xxl-2">
                                                <input id="includeDeletedCheck" name="includeDeletedCheck"
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    onChange={formik.handleChange}
                                                    checked={formik.values.includeDeletedCheck}
                                                />
                                                <label className="form-check-label" htmlFor="includeDeletedCheck">Show deleted records</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between gap-2">
                                    <div className="d-grid d-md-block ps-md-2">
                                        <button type="button" className="btn bg-gradient-secondary" onClick={(values) => {
                                            onCleanSearch(values);
                                            formik.resetForm(initialValues);
                                        }}>
                                            <FontAwesomeIcon icon={faXmark} size="lg" />
                                        </button>
                                    </div>
                                    <div className="d-grid d-md-block flex-grow-1 ps-md-2">
                                        <button type="submit" className="btn bg-gradient-info d-flex justify-content-center align-items-center">
                                            <FontAwesomeIcon icon={faSearch} className="me-1" />
                                            Search
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