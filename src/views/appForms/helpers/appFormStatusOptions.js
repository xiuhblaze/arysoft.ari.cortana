import enums from "../../../helpers/enums";

const appFormStatusOptions = (appFormCurrentStatus) => { //! Optimizar esto, con appformstatustype o optionsprops, estoy duplicando el codigo Jajaja
    
    const { AppFormStatusType } = enums();

    const optionsProps = [
        { value: AppFormStatusType.nothing, label: 'Nothing' },
        { value: AppFormStatusType.new, label: 'New' },
        { value: AppFormStatusType.salesReview, label: 'Send to sales review' },
        { value: AppFormStatusType.salesRejected, label: 'Rejected by sales' },
        { value: AppFormStatusType.applicantReview, label: 'Send to applicant review' },
        { value: AppFormStatusType.applicantRejected, label: 'Rejected by applicant' },
        { value: AppFormStatusType.active, label: 'Active' },
        { value: AppFormStatusType.inactive, label: 'Inactive' },
        { value: AppFormStatusType.cancel, label: 'Cancel' },
        { value: AppFormStatusType.deleted, label: 'Deleted' },
    ];
    const currentOption = { 
        value: optionsProps[appFormCurrentStatus].value,
        label: optionsProps[appFormCurrentStatus].label 
    };

    // console.log('appFormStatusOptions: currentOption', currentOption);

    switch (appFormCurrentStatus) {
        case AppFormStatusType.nothing:
        case AppFormStatusType.new:        
            return [
                currentOption,
                { value: AppFormStatusType.salesReview, label: 'Send to sales review' },
                { value: AppFormStatusType.cancel, label: 'Cancel' },
            ];

        case AppFormStatusType.salesReview:
            return [
                currentOption,
                { value: AppFormStatusType.salesRejected, label: 'Rejected' },
                { value: AppFormStatusType.applicantReview, label: 'Send to review' },
                { value: AppFormStatusType.cancel, label: 'Cancel' },
            ];

        case AppFormStatusType.salesRejected:
            return [
                currentOption,
                { value: AppFormStatusType.salesReview, label: 'Sales review' },
                { value: AppFormStatusType.cancel, label: 'Cancel' },
            ];

        case AppFormStatusType.applicantReview:
            return [
                currentOption,
                { value: AppFormStatusType.applicantRejected, label: 'Rejected' },
                { value: AppFormStatusType.active, label: 'Approved' },
            ];
            
        case AppFormStatusType.applicantRejected:
            return [
                currentOption,
                { value: AppFormStatusType.applicantReview, label: 'Applicant review' },
                { value: AppFormStatusType.cancel, label: 'Cancel' },
            ]
            break;
        case AppFormStatusType.active:
            return [
                currentOption,
                { value: AppFormStatusType.inactive, label: 'Inactive' }, // Mostrar advertencia que no se va a poder editar
                { value: AppFormStatusType.cancel, label: 'Cancel' },
            ]
            break;
        case AppFormStatusType.inactive:
            return [
                currentOption,
                // { value: AppFormStatusType.active, label: 'Active' },
                // { value: AppFormStatusType.cancel, label: 'Cancel' },
            ]
            break;
        case AppFormStatusType.cancel:
            return [
                currentOption,
                { value: AppFormStatusType.new, label: 'New' },
            ]
            break;
        case AppFormStatusType.deleted:
            return [
                { value: AppFormStatusType.deleted, label: 'Deleted' },
            ]
            break;
    }
};

export default appFormStatusOptions;
