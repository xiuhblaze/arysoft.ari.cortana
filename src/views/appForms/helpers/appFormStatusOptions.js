import enums from "../../../helpers/enums";
import appFormStatusProps from "./appFormStatusProps";

const appFormStatusOptions = (appFormCurrentStatus) => {
    
    const { AppFormStatusType } = enums();
    
    const currentOption = { 
        value: appFormStatusProps[appFormCurrentStatus].value,
        label: appFormStatusProps[appFormCurrentStatus].label 
    };

    switch (appFormCurrentStatus) {
        case AppFormStatusType.nothing:
        case AppFormStatusType.new:        
            return [
                currentOption,
                // { value: AppFormStatusType.salesReview, label: 'Send to sales review' },
                { value: AppFormStatusType.applicantReview, label: 'Send to review' }, 
                { value: AppFormStatusType.cancel, label: 'Cancel' },
            ];

        case AppFormStatusType.salesReview:
            return [
                currentOption,
                { value: AppFormStatusType.new, label: 'New' },
                // { value: AppFormStatusType.salesRejected, label: 'Rejected' },
                // { value: AppFormStatusType.applicantReview, label: 'Send to review' },
                { value: AppFormStatusType.cancel, label: 'Cancel' },
            ];

        case AppFormStatusType.salesRejected:
            return [
                currentOption,
                { value: AppFormStatusType.new, label: 'New' },
                // { value: AppFormStatusType.salesReview, label: 'Sales review' },
                { value: AppFormStatusType.cancel, label: 'Cancel' },
            ];

        case AppFormStatusType.applicantReview:
            return [
                currentOption,
                { value: AppFormStatusType.applicantRejected, label: 'Reject' },
                { value: AppFormStatusType.active, label: 'Approve' },
                { value: AppFormStatusType.cancel, label: 'Cancel' },
            ];
            
        case AppFormStatusType.applicantRejected:
            return [
                currentOption,
                { value: AppFormStatusType.applicantReview, label: 'Send to review' },
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
