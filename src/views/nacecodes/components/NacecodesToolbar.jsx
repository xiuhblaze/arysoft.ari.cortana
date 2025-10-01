import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Formik } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSearch, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";
import debounce from "lodash.debounce";

import { AryFormikTextInput, AryFormikSelectInput } from "../../../components/Forms";
import { useAuthStore } from "../../../hooks/useAuthStore";
import { useViewNavigation } from "../../../hooks/useViewNavigation";
import defaultCSSClasses from "../../../helpers/defaultCSSClasses";
import enums from "../../../helpers/enums";
import envVariables from "../../../helpers/envVariables";
import nacecodeAccreditedStatusProps from "../helpers/nacecodeAccreditedStatusProps";
import nacecodeOnlyOptionsProps from "../helpers/nacecodeOnlyOptionsProps";
import useNacecodesStore from "../../../hooks/useNaceCodesStore";

export const NacecodesToolbar = () => {
    const { 
        DefaultStatusType,
        NacecodeOrderType,
    } = enums();
    const { NACECODES_OPTIONS } = envVariables();
    const {
        BUTTON_ADD_CLASS,
        BUTTON_SEARCH_CLASS,
        BUTTON_CLEAR_SEARCH_CLASS,
    } = defaultCSSClasses();

    const formDefaultData = {
        textInput: '',
        sectorInput: '',
        divisionInput: '',
        groupInput: '',
        classInput: '',
        onlySelect: '',
        accreditedStatusSelect: '',
        statusSelect: '',
        includeDeletedCheck: false,
    };

    // CUSTOM HOOKS

    const { 
        ROLES, 
        hasRole,
    } = useAuthStore();

    const {
        isNacecodeCreating,
        nacecodeCreatedOk,
        nacecode,
        nacecodesAsync,
        nacecodeCreateAsync
    } = useNacecodesStore();

    const {
        getSavedSearch,
        onSearch,
        onCleanSearch,
    } = useViewNavigation({
        LS_OPTIONS: NACECODES_OPTIONS,
        DefultOrder: NacecodeOrderType.sector,
        itemsAsync: nacecodesAsync,
    });
    
    // HOOKS

    const navigate = useNavigate();
    const formikRef = useRef(null);

    const [initialValues, setInitialValues] = useState(formDefaultData);

    useEffect(() => {
        const savedSearch = getSavedSearch();
        
        if (!!savedSearch) {
            setInitialValues({
                textInput: savedSearch?.text ?? '',
                sectorInput: savedSearch?.sector ?? '',
                divisionInput: savedSearch?.division ?? '',
                groupInput: savedSearch?.group ?? '',
                classInput: savedSearch?.class ?? '',
                onlySelect: savedSearch?.onlyOption ?? '',
                accreditedStatusSelect: savedSearch?.accreditedStatus ?? '',
                statusSelect: savedSearch?.status ?? '',
                includeDeletedCheck: savedSearch?.includeDeleted ?? false,
            });
        }
    }, []);

    useEffect(() => {

        if (nacecodeCreatedOk) {
            navigate(`/nace-codes/${nacecode.ID}`);
        }
    }, [nacecodeCreatedOk]);
    
    // METHODS

    const onNewItem = () => {
        nacecodeCreateAsync();
    }; // onNewItem

    const sendSearch = (values) => {
        const search = {
            text: values.textInput,
            sector: values.sectorInput,
            division: values.divisionInput,
            group: values.groupInput,
            class: values.classInput,
            onlyOption: values.onlySelect,
            accreditedStatus: values.accreditedStatusSelect,
            status: values.statusSelect,
            includeDeleted: values.includeDeletedCheck,
            //pageNumber: 1,
        };
        onSearch(search);
    }; // sendSearch

    const debouncedSearch = debounce(sendSearch, 500, {
        leading: true,
        trailing: false,
    }); // debouncedSearch
    
    const onSearchSubmit = (values) => {
        debouncedSearch(values);
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
                    className={ BUTTON_ADD_CLASS }
                    onClick={onNewItem}
                    title="New NACE code"
                    disabled={isNacecodeCreating}
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
                                            <AryFormikTextInput 
                                                name="textInput"
                                                type="text"
                                                placeholder="search..."
                                            />
                                        </div>
                                        <div className="col-3 col-sm-1 ps-sm-0">
                                            <AryFormikTextInput 
                                                name="sectorInput" 
                                                type="text"
                                                placeholder="sector" 
                                            />
                                        </div>
                                        <div className="col-3 col-sm-1 ps-sm-0">
                                            <AryFormikTextInput 
                                                name="divisionInput" 
                                                type="text"
                                                placeholder="division" 
                                            />
                                        </div>
                                        <div className="col-3 col-sm-1 ps-sm-0">
                                            <AryFormikTextInput 
                                                name="groupInput" 
                                                type="text"
                                                placeholder="group" 
                                            />
                                        </div>
                                        <div className="col-3 col-sm-1 ps-sm-0">
                                            <AryFormikTextInput 
                                                name="classInput" 
                                                type="text"
                                                placeholder="class" 
                                            />
                                        </div>
                                        <div className="col-12 col-sm-auto ps-sm-0">
                                            <AryFormikSelectInput name="onlySelect">
                                                {
                                                    nacecodeOnlyOptionsProps.map((option) => (
                                                        <option key={option.value} value={option.value}>{option.label}</option>
                                                    ))
                                                }
                                            </AryFormikSelectInput>
                                        </div>
                                        <div className="col-12 col-sm-auto ps-sm-0">
                                            <AryFormikSelectInput name="accreditedStatusSelect">
                                                {
                                                    nacecodeAccreditedStatusProps.map((option) => (
                                                        <option key={option.id} value={option.id}>{option.label}</option>
                                                    ))
                                                }
                                            </AryFormikSelectInput>
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
                                        <button type="button" className={BUTTON_CLEAR_SEARCH_CLASS} onClick={ handleClearSearch }>
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

export default NacecodesToolbar;