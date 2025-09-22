import enums from "../../../helpers/enums";

const { AppFormStatusType } = enums();

const appFormStatusProps = [
    { 
        value: AppFormStatusType.nothing,
        label: 'New', 
        variant: 'secondary',
        description: 'New application form',
        bgCss: 'item-action',
    },
    { 
        value: AppFormStatusType.new, // Este es un appform nuevo desde un usuario de ARI
        label: 'New', 
        variant: 'info',
        description: 'New recorded application form',
        bgCss: 'item-action',
    },
    {
        value: AppFormStatusType.salesReview,   //! Not used for now
        label: 'Sales review', 
        variant: 'warning',
        description: 'Sales review and approval',
        bgCss: 'bg-warning-light',
    },
    { 
        value: AppFormStatusType.salesRejected, //! Not used for now
        label: 'Sales rejected', 
        variant: 'danger',
        description: 'Rejected by sales, check the comments',
        bgCss: 'bg-danger-light',
    },
    { 
        value: AppFormStatusType.applicantReview,
        label: 'In review', // Applicant review
        variant: 'warning',
        description: 'Applicant review and approval',
        bgCss: 'bg-warning-light',
    },
    {
        value: AppFormStatusType.applicantRejected,
        label: 'Rejected', // Applicant rejected
        variant: 'danger',
        description: 'Rejected by reviewer, check the comments',
        bgCss: 'bg-danger-light',
    },
    { 
        value: AppFormStatusType.active, 
        label: 'Active', 
        variant: 'success',
        description: 'Active application form',
        bgCss: 'item-action',
    },
    { 
        value: AppFormStatusType.inactive,
        label: 'Inactive', 
        variant: 'secondary',
        description: 'Inactive application form',
        bgCss: 'item-action',
    },
    { 
        value: AppFormStatusType.canceled,
        label: 'Canceled',
        variant: 'light',
        description: 'Canceled application form',
        bgCss: 'item-action',
    },
    { 
        value: AppFormStatusType.deleted,
        label: 'Deleted',
        variant: 'danger',
        description: 'Deleted application form',
        bgCss: 'bg-danger-light',
    },
];

export default appFormStatusProps;