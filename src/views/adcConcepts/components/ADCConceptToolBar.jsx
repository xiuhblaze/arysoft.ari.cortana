import { useEffect, useRef, useState } from "react";
import enums from "../../../helpers/enums";
import envVariables from "../../../helpers/envVariables";
import { useADCConceptsStore } from "../../../hooks/useADCConceptsStore";
import { useModuleNavigation } from "../../../hooks/useModuleNavigation";
import { useStandardsStore } from "../../../hooks/useStandardsStore";
import { Form, Formik } from "formik";
import { useAuthStore } from "../../../hooks/useAuthStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSearch, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";
import defaultCSSClasses from "../../../helpers/defaultCSSClasses";
import { AryFormikSelectInput, AryFormikTextInput } from "../../../components/Forms";
import { useNavigate } from "react-router-dom";
import { useViewNavigation } from "../../../hooks/useViewNavigation";


const ADCConceptToolBar = () => {

    const formDefaultValues = {
        standardSelect: '',
        textInput: '',
        statusSelect: '',
        includeDeletedCheck: false,
    };
    const { ADCCONCEPTS_OPTIONS } = envVariables();
    const {
        ADCConceptOrderType,
        DefaultStatusType,
        StandardOrderType
    } = enums();
    const {
        BUTTON_ADD_CLASS,
        BUTTON_SEARCH_CLASS,
        BUTTON_CLEAR_SEARCH_CLASS,
    } = defaultCSSClasses();

    // CUSTOM HOOKS

    const { ROLES, hasRole } = useAuthStore();

    const {
        isADCConceptCreating,
        adcConceptCreatedOk,
        isADCConceptsLoading,
        adcConcept,
        adcConceptsAsync,
        adcConceptCreateAsync,
    } = useADCConceptsStore();

    const {
        isStandardsLoading,
        standards,
        standardsAsync
    } = useStandardsStore();
    const {
        getSavedSearch,
        onSearch,
        onCleanSearch
    } = useViewNavigation({
        LS_OPTIONS: ADCCONCEPTS_OPTIONS,
        DefultOrder: ADCConceptOrderType.standard,
        itemsAsync: adcConceptsAsync,
    });
    // const {
    //     getSavedSearch,
    //     onSearch,
    //     onCleanSearch,
    // } = useModuleNavigation(adcConceptsAsync, ADCCONCEPTS_OPTIONS, ADCConceptOrderType.standard);

    // HOOKS

    const navigate = useNavigate();
    const formikRef = useRef(null);

    const [initialValues, setInitialValues] = useState(formDefaultValues);

    useEffect(() => {
        const savedSearch = getSavedSearch();

        if (!!savedSearch) {
            setInitialValues({
                standardSelect: savedSearch.standardID ?? '',
                textInput: savedSearch.text ?? '',
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
        if (!!adcConceptCreatedOk) {
            navigate(`/adc-concepts/${adcConcept.ID}`);
        }
    }, [adcConceptCreatedOk]);

    // METHODS

    const onNewItem = () => {
        adcConceptCreateAsync();
    }; // onNewItem

    const onSearchSubmit = (values) => {
        const search = {
            standardID: values.standardSelect,
            text: values.textInput,
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
            <div>
                <button
                    className={ BUTTON_ADD_CLASS }
                    onClick={onNewItem}
                    title="New concept"
                    disabled={ isADCConceptsLoading || isADCConceptCreating }
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
                                        <div className="col-12 col-sm-3 col-xxl-2 mt-auto">
                                            <AryFormikTextInput
                                                name="textInput"
                                                type="text"
                                                placeholder="search..."
                                            />
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
                                                { !!DefaultStatusType &&  Object.keys(DefaultStatusType)
                                                    .filter(key => key != 'deleted')
                                                    .map(key =>
                                                    <option
                                                        key={key}
                                                        value={DefaultStatusType[key]}
                                                        className="text-capitalize"
                                                    >
                                                        {key === 'nothing' ? '(all status)' : key}
                                                    </option>
                                                )}
                                            </AryFormikSelectInput>
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
                                        <button 
                                            type="submit" 
                                            className={ BUTTON_SEARCH_CLASS }
                                            disabled={ isADCConceptsLoading || isADCConceptCreating }
                                        >
                                            <FontAwesomeIcon icon={faSearch} className="me-1" />
                                            Search
                                        </button>
                                    </div>
                                    <div className="d-grid d-md-block ps-md-2">
                                        <button type="button" 
                                            className={ BUTTON_CLEAR_SEARCH_CLASS }
                                            onClick={onClickClearSearch}
                                            disabled={ isADCConceptsLoading || isADCConceptCreating }
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

export default ADCConceptToolBar