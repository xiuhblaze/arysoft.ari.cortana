import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuditorsStore } from "../../../hooks/useAuditorsStore"
import { faPlus, faSearch, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";
import enums from "../../../helpers/enums";
import envVariables from "../../../helpers/envVariables";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Form, Formik } from "formik";
import { AryFormikSelectInput, AryFormikTextInput } from "../../../components/Forms";
import defaultCSSClasses from "../../../helpers/defaultCSSClasses";
import { useStandardsStore } from "../../../hooks/useStandardsStore";

const AuditorsToolbar = () => {
    const formDefaultData = {
        textInput: '',
        standardSelect: '',
        isLeaderSelect: '',
        validitySelect: '',
        statusSelect: '',
        includeDeletedCheck: false,
    };
    const {
        BUTTON_ADD_CLASS,
        BUTTON_SEARCH_CLASS,
        BUTTON_CLEAR_SEARCH_CLASS
    } =defaultCSSClasses();
    const { 
        AuditorIsLeaderType,
        AuditorDocumentValidityType,
        AuditorOrderType,
        DefaultStatusType,
        StandardOrderType
    } = enums();
    const {
        AUDITORS_OPTIONS,
        VITE_PAGE_SIZE
    } = envVariables();

    // CUSTOM HOOKS

    const {
        isAuditorCreating,
        auditorCreatedOk,
        auditor,
        auditorsAsync,
        auditorCreateAsync,
    } = useAuditorsStore();

    const {
        standards,
        standardsAsync,
    } = useStandardsStore();

    // HOOKS

    const navigate = useNavigate();

    const [initialValues, setInitialValues] = useState(formDefaultData);

    useEffect(() => {
        const savedSearch = JSON.parse(localStorage.getItem(AUDITORS_OPTIONS)) || null;

        if (!!savedSearch) {
            setInitialValues({
                textInput: savedSearch.text ?? '',
                standardSelect: savedSearch.standardID ?? '',
                isLeaderSelect: savedSearch.isLeader ?? '',
                validitySelect: savedSearch.validity ?? '',
                statusSelect: savedSearch.status ?? '',
                includeDeletedCheck: savedSearch.includeDeleted ?? false,
            });
        }

        standardsAsync({
            pageSize: 0,
            includeDeleted: false,
            order: StandardOrderType.name,
        });
    }, []);
    
    useEffect(() => {
        if (auditorCreatedOk) {
            navigate(`/auditors/${auditor.ID}`);
        }
    }, [auditorCreatedOk]);    

    // METHODS

    const onNewItem = () => {
        auditorCreateAsync();
    }; // onNewItem

    const onSearchSubmit = (values) => {
        const savedSearch = JSON.parse(localStorage.getItem(AUDITORS_OPTIONS)) || null;
        const search = {
            ...savedSearch,
            text: values.textInput,
            standardID: values.standardSelect,
            isLeader: values.isLeaderSelect,
            validity: values.validitySelect,
            status: values.statusSelect,
            includeDeleted: values.includeDeletedCheck,
            pageNumber: 1,
        };

        //console.log(search);

        auditorsAsync(search);
        localStorage.setItem(AUDITORS_OPTIONS, JSON.stringify(search));
    }; // onSearchSubmit

    const onCleanSearch = () => {
        const savedSearch = JSON.parse(localStorage.getItem(AUDITORS_OPTIONS)) || null;
        const search = {
            pageSize: savedSearch?.pageSize ?? VITE_PAGE_SIZE,
            pageNumber: 1,
            includeDeleted: false,
            order: AuditorOrderType.firstName,
        };

        setInitialValues(formDefaultData);
        auditorsAsync(search);
        localStorage.setItem(AUDITORS_OPTIONS, JSON.stringify(search));
    }; // onCleanSearch

    return (
        <div className="d-flex flex-column flex-md-row justify-content-between gap-2">
            <div>
                <button
                    className={ BUTTON_ADD_CLASS }
                    onClick={ onNewItem }
                    title="New auditor"
                    disabled={ isAuditorCreating }
                >
                    <FontAwesomeIcon icon={ faPlus } className="me-1" />
                    Add
                </button>
            </div>
            <div className="flex-fill">
                <Formik
                    initialValues={ initialValues }
                    onSubmit={onSearchSubmit}
                    enableReinitialize
                >
                    { formik => (
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
                                        <div className="col-12 col-sm-auto">
                                            <AryFormikSelectInput name="isLeaderSelect">
                                                {
                                                    Object.keys(AuditorIsLeaderType).map(key =>
                                                        <option
                                                            key={key}
                                                            value={AuditorIsLeaderType[key]}
                                                            className="text-capitalize"
                                                        >
                                                            {key === 'nothing' ? '(auditor)' : key}
                                                        </option>
                                                    )}
                                            </AryFormikSelectInput>
                                        </div>
                                        <div className="col-12 col-sm-auto">
                                            <AryFormikSelectInput name="validitySelect">
                                                {
                                                    Object.keys(AuditorDocumentValidityType).map(key =>
                                                        <option
                                                            key={key}
                                                            value={AuditorDocumentValidityType[key]}
                                                            className="text-capitalize"
                                                        >
                                                            {key === 'nothing' ? '(documentation)' : key}
                                                        </option>
                                                    )}
                                            </AryFormikSelectInput>
                                        </div>
                                        <div className="col-12 col-sm-auto">
                                            <AryFormikSelectInput name="statusSelect">
                                                {
                                                    Object.keys(DefaultStatusType).map(key =>
                                                        <option
                                                            key={key}
                                                            value={DefaultStatusType[key]}
                                                            className="text-capitalize"
                                                        >
                                                            {key === 'nothing' ? '(status)' : key}
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
                                <div className="d-flex justify-content-between gap-2 mb-3">
                                    <div className="d-grid d-md-block flex-grow-1 ps-md-2">
                                        <button type="submit" className={ BUTTON_SEARCH_CLASS}>
                                            <FontAwesomeIcon icon={faSearch} className="me-1" />
                                            Search
                                        </button>
                                    </div>
                                    <div className="d-grid d-md-block ps-md-2">
                                        <button type="button" className={ BUTTON_CLEAR_SEARCH_CLASS }
                                            onClick={ (values) => {
                                                onCleanSearch(values);
                                                formik.resetForm(initialValues);
                                            }}
                                        >
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

export default AuditorsToolbar;