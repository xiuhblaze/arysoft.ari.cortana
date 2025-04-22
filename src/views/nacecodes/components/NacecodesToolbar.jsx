import { useEffect, useState } from "react";
import { Form, Formik } from "formik";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSearch, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";

import envVariables from "../../../helpers/envVariables";
import enums from "../../../helpers/enums";

import useNacecodesStore from "../../../hooks/useNaceCodesStore";
import { AryFormikTextInput, AryFormikSelectInput } from "../../../components/Forms";
import defaultCSSClasses from "../../../helpers/defaultCSSClasses";
import debounce from "lodash.debounce";
import nacecodeOnlyOptionsProps from "../helpers/nacecodeOnlyOptionsProps";
import nacecodeAccreditedStatusProps from "../helpers/nacecodeAccreditedStatusProps";

export const NacecodesToolbar = () => {
    const { DefaultStatusType, NacecodeOrderType } = enums();
    const { NACECODES_OPTIONS, VITE_PAGE_SIZE } = envVariables();
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
        isNacecodeCreating,
        nacecodesAsync,
        nacecodeCreateAsync
    } = useNacecodesStore();
    
    // HOOKS
    
    const [initialValues, setInitialValues] = useState(formDefaultData);

    useEffect(() => {
        const savedSearch = JSON.parse(localStorage.getItem(NACECODES_OPTIONS)) || null;
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

    // METHODS

    const sendSearch = (values) => {
        const savedSearch = JSON.parse(localStorage.getItem(NACECODES_OPTIONS)) || null;
        const search = {
            ...savedSearch,
            text: values.textInput,
            sector: values.sectorInput,
            division: values.divisionInput,
            group: values.groupInput,
            class: values.classInput,
            onlyOption: values.onlySelect,
            accreditedStatus: values.accreditedStatusSelect,
            status: values.statusSelect,
            includeDeleted: values.includeDeletedCheck,
            pageNumber: 1,
        };

        nacecodesAsync(search);
        localStorage.setItem(NACECODES_OPTIONS, JSON.stringify(search));
    }; // sendSearch

    const debouncedSearch = debounce(sendSearch, 500, {
        leading: true,
        trailing: false,
    });
     
    const onNewItem = () => {
        nacecodeCreateAsync();
    };

    const onSearchSubmit = (values) => {
        debouncedSearch(values);
        // const savedSearch = JSON.parse(localStorage.getItem(NACECODES_OPTIONS)) || null;
        // const search = {
        //     ...savedSearch,
        //     text: values.textInput,
        //     sector: values.sectorInput,
        //     division: values.divisionInput,
        //     group: values.groupInput,
        //     class: values.classInput,
        //     onlyOption: values.onlySelect,
        //     status: values.statusSelect,
        //     includeDeleted: values.includeDeletedCheck,
        //     pageNumber: 1,
        // };

        // nacecodesAsync(search);
        // localStorage.setItem(NACECODES_OPTIONS, JSON.stringify(search));
    }; // onSearchSubmit

    const onCleanSearch = () => {
        const savedSearch = JSON.parse(localStorage.getItem(NACECODES_OPTIONS)) || null;
        const search = {
            pageSize: savedSearch?.pageSize ?? VITE_PAGE_SIZE,
            pageNumber: 1,
            includeDeleted: false,
            order: NacecodeOrderType.sector,
        };

        setInitialValues(formDefaultData);
        nacecodesAsync(search);
        localStorage.setItem(NACECODES_OPTIONS, JSON.stringify(search));
    }; // onCleanSearch

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
                                        <button type="submit" className={BUTTON_SEARCH_CLASS}>
                                            <FontAwesomeIcon icon={faSearch} className="me-1" />
                                            Search
                                        </button>
                                    </div>
                                    <div className="d-grid d-md-block ps-md-2">
                                        <button type="button" className={BUTTON_CLEAR_SEARCH_CLASS} onClick={(values) => {
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

export default NacecodesToolbar;