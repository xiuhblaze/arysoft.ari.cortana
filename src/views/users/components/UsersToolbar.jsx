import React, { useEffect, useRef, useState } from 'react'
import enums from '../../../helpers/enums';
import defaultCSSClasses from '../../../helpers/defaultCSSClasses';
import useUsersNavigation from '../hooks/useUsersNavigation';
import { useUsersStore } from '../../../hooks/useUsersStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSearch, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Form, Formik } from 'formik';
import { AryFormikSelectInput, AryFormikTextInput } from '../../../components/Forms';

const UsersToolbar = () => {

    const formDefaultValues = {
        textInput: '',
        typeSelect: '',
        statusSelect: '',
        includeDeletedCheck: false,
    };

    const {
        UserType,
        DefaultStatusType,
    } = enums();

    const {
        BUTTON_ADD_CLASS,
        BUTTON_SEARCH_CLASS,
        BUTTON_CLEAR_SEARCH_CLASS,
    } = defaultCSSClasses();

    // CUSTOM HOOKS

    const {
        getSavedSearch,
        onSearch,
        onCleanSearch,
    } = useUsersNavigation();

    const {
        isUserCreating,

        userCreateAsync,
    } = useUsersStore();

    // HOOKS

    const formikRef = useRef(null);

    const [initialValues, setInitialValues] = useState(formDefaultValues);

    useEffect(() => {
        const savedSearch = getSavedSearch();

        if (!!savedSearch) {
            setInitialValues({
                textInput: savedSearch.text ?? '',
                typeSelect: savedSearch.type ?? '',
                statusSelect: savedSearch.status ?? '',
                includeDeletedCheck: savedSearch.includeDeleted ?? false,
            });
        }
    }, []);

    // METHODS

    const onNewItem = () => {
        userCreateAsync();
    };

    const onSearchSubmit = (values) => {
        const search = {
            text: values.textInput,
            type: values.typeSelect,
            status: values.statusSelect,
            includeDeleted: values.includeDeletedCheck,
        };

        onSearch(search);
    }; // onSearchSubmit

    const onClickClearSearch = () => {
        setInitialValues(formDefaultValues);
        formikRef.current.resetForm(formDefaultValues);
        onCleanSearch();
    };

    return (
        <div className="d-flex flex-column flex-md-row justify-content-between gap-2">
            <div>
                <button
                    className={ BUTTON_ADD_CLASS }
                    onClick={onNewItem}
                    title="New user"
                    disabled={isUserCreating }
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
                                        <div className="col-12 col-sm-4 col-xxl-3 mt-auto">
                                            <AryFormikSelectInput
                                                name="typeSelect"
                                                onChange={ (e) => {
                                                    const selectedValue = e.target.value;
                                                    formik.setFieldValue('typeSelect', selectedValue);
                                                }}
                                            >
                                                <option value="">(all types)</option>
                                                {
                                                    Object.keys(UserType).map((key) => {
                                                        if (key === 'nothing') return (<option key={key} value={UserType[key]}>(type)</option>);
                                                        return (<option key={key} value={UserType[key]} className="text-capitalize">{key}</option>);
                                                    })
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
                                                    .filter(key => key != 'nothing')
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
                                        <button type="button" 
                                            className={BUTTON_CLEAR_SEARCH_CLASS} 
                                            onClick={onClickClearSearch}
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

export default UsersToolbar;