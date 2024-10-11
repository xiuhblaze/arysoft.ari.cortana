import { useEffect, useState } from "react";
import { Form, Formik } from "formik";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSearch, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";

import envVariables from "../../../helpers/envVariables";
import enums from "../../../helpers/enums";

import { useStandardsStore } from "../../../hooks/useStandardsStore";
import { AryFormikTextInput, AryFormikSelectInput } from "../../../components/Forms";

export const ToolbarForm = () => {
    const { DefaultStatusType, StandardOrderType } = enums();
    const { STANDARDS_OPTIONS, VITE_PAGE_PAGESIZE } = envVariables();
    const [initialValues, setInitialValues] = useState({
        textInput: '',
        statusSelect: '',
        includeDeletedCheck: false,
    })
    const {
        isStandardCreating,
        standardsAsync,
        standardCreateAsync,
    } = useStandardsStore();

    useEffect(() => {
        const savedSearch = JSON.parse(localStorage.getItem(STANDARDS_OPTIONS)) || null;
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
        const savedSearch = JSON.parse(localStorage.getItem(STANDARDS_OPTIONS)) || null;
        const search = {
            ...savedSearch,
            text: values.textInput,
            status: values.statusSelect,
            includeDeleted: values.includeDeletedCheck,
            pageNumber: 1,
        };

        standardsAsync(search);
        localStorage.setItem(STANDARDS_OPTIONS, JSON.stringify(search));
    };

    const onCleanSearch = (e) => {
        e.preventDefault();

        const savedSearch = JSON.parse(localStorage.getItem(STANDARDS_OPTIONS)) || null;
        const search = {
            pageSize: savedSearch?.pageSize ?? VITE_PAGE_PAGESIZE,
            pageNumber: 1,
            includeDeleted: false,
            order: StandardOrderType.name,
        };

        setInitialValues({
            textInput: '',
            statusSelect: '',
            includeDeletedCheck: false,
        });

        standardsAsync(search);
        localStorage.setItem(STANDARDS_OPTIONS, JSON.stringify(search));
    };

    return (
        <div className="d-flex flex-column flex-md-row justify-content-between gap-2">
            <div>
                <button
                    className="btn bg-gradient-dark d-flex justify-content-center align-items-center mb-0"
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
                                                        if (key === 'nothing') return (<option key={key} value={DefaultStatusType[key]}>(all)</option>);
                                                        return (<option key={key} value={DefaultStatusType[key]} className="text-capitalize">{key}</option>);
                                                    })}
                                            </AryFormikSelectInput>
                                        </div>
                                        <div className="col-auto ps-sm-0">
                                            <div className="p-2 bg-gray-100 border-radius-md">
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
                                        <button type="submit" className="btn bg-gradient-info d-flex justify-content-center align-items-center">
                                            <FontAwesomeIcon icon={faSearch} className="me-1" />
                                            Search
                                        </button>
                                    </div>
                                    <div className="d-grid d-md-block ps-md-2">
                                        <button type="button" className="btn btn-outline-secondary" onClick={(values) => {
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

export default ToolbarForm;