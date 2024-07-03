import { useParams } from "react-router-dom"
import { useApplicationFormsStore } from "../../hooks/useApplicationFormsStore";
import { useEffect } from "react";
import { setNavbarTitle, useArysoftUIController } from "../../context/context";

const ApplicationFormEditView = () => {
    const {id} = useParams();

    // CUSTOM HOOKS

    const [controller, dispatch] = useArysoftUIController();

    const {
        isApplicationFormLoading,
        isApplicationFormSaving,
        applicationFormCreatedOk,
        isApplicationFormDeleting,
        applicationFormDeletedOk,
        applicationForm,
        applicationFormsErrorMessage,

        applicationFormAsync,
        applicationFormSaveAsync,
        applicationFormDeleteAsync,
        applicationFormClear
    } = useApplicationFormsStore();

    // HOOKS

    useEffect(() => {
        if (!!id) applicationFormAsync(id);
    }, [id]);

    useEffect(() => {
        if (!!applicationForm) {
            setNavbarTitle(dispatch, `${applicationForm.Organization.Name} - ${applicationForm.Standard.Name}` );
        }
    }, [applicationForm]);
    

    return (
        <div>ApplicationFormEditView</div>
    )
}

export default ApplicationFormEditView