import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Formik } from 'formik'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faSearch, faXmark } from '@fortawesome/free-solid-svg-icons'

import { AryFormikTextInput } from '../../../components/Forms'
import { useApplicationFormsStore } from '../../../hooks/useApplicationFormsStore'
import defaultCSSClasses from '../../../helpers/defaultCSSClasses'

const ApplicationFormToolbar = () => {
    const formDefaultData = {
        textInput: '',
        standardSelect: '',
        nacecodeSelect: '',
        risklevelSelect: '',
        totalEmployesStart: '',
        totalEmployesEnd: '',
        statusSelect: '',
        includeDeletedCheck: false,
    };
    const {
        BUTTON_ADD_CLASS,
        BUTTON_SEARCH_CLASS,
        BUTTON_CLEAR_SEARCH_CLASS,
    } = defaultCSSClasses();

    // CUSTOM HOOKS

    const {
        isApplicationFormCreating,
        applicationFormCreatedOk,
        applicationForm,
        applicationFormsAsync,
        applicationFormCreateAsync
    } = useApplicationFormsStore();

    // HOOKS

    const navigate = useNavigate();

    const [initialValues, setInitialValues] = useState(formDefaultData);

    useEffect(() => {
        if (applicationFormCreatedOk) {
            navigate(`/application-forms/${ applicationForm.ID }`);
        }
    }, [applicationFormCreatedOk]);
    
    // METHODS

    const onNewItem = () => {

        applicationFormCreateAsync();
    };

    const onFormSubmit = (values) => {
        console.log(values);
    };

    const onCleanSearch = () => {

    };

    return (
        <div className="d-flex flex-column flex-md-row justify-content-between gap-2">
            <button
                className={ BUTTON_ADD_CLASS }
                onClick={ onNewItem }
            >
                <FontAwesomeIcon icon={ faPlus } className="me-1" />
                Add
            </button>
            <div className="flex-fill">
                <Formik
                    initialValues={ initialValues }
                    onSubmit={ onFormSubmit }
                    enableReinitialize
                >
                    { formik => (
                        <Form>
                            <div className="d-flex flex-column flex-md-row">
                                <div className="flex-md-grow-1 me-md-3">
                                    <div className="col-12 col-sm-auto">
                                        <AryFormikTextInput
                                            name="textInput"
                                            type="text"
                                            placeholder="search..."
                                        />
                                    </div>

                                </div>
                                <div className="d-flex justify-content-between gap-2 mb-3">
                                    <div className="d-grid d-md-block ps-md-2">
                                        <button type="submit" className={BUTTON_SEARCH_CLASS}>
                                            <FontAwesomeIcon icon={ faSearch } className="me-1" />
                                            Search
                                        </button>
                                    </div>
                                    <div className="d-grid d-md-block ps-md-2">
                                        <button type="button" 
                                            className={BUTTON_CLEAR_SEARCH_CLASS}
                                            onClick={ values => {
                                                onCleanSearch(values);
                                                formik.resetForm(initialValues);
                                            }}
                                        >
                                            <FontAwesomeIcon icon={ faXmark } size="lg" />
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

export default ApplicationFormToolbar