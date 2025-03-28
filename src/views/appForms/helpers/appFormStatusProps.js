import enums from "../../../helpers/enums";

const { AppFormStatusType } = enums();

const appFormStatusProps = [
    { 
        value: AppFormStatusType.nothing,
        label: 'New', 
        variant: 'secondary',
        description: 'New application form' 
    },
    { 
        value: AppFormStatusType.new, // Este es un appform nuevo desde un usuario de ARI
        label: 'New', 
        variant: 'info',
        description: 'New recorded application form'
    },
    { 
        value: AppFormStatusType.send, // Este es un appform nuevo desde una organización
        label: 'Send', 
        variant: 'warning',
        description: 'Application form sent from applicant'
    }, 
    {
        value: AppFormStatusType.salesReview,
        label: 'Sales review', 
        variant: 'info',
        description: 'Sales review and approval'
    },
    { value: 3, label: 'Sales rejected', bgColor: 'bg-gradient-danger', variant: 'danger' },
    { value: 4, label: 'Applicant review', bgColor: 'bg-gradient-warning', variant: 'warning' },
    { value: 5, label: 'Applicant rejected', bgColor: 'bg-gradient-danger', variant: 'danger' },
    { value: 6, label: 'Active', bgColor: 'bg-gradient-success', variant: 'success' },
    { value: 7, label: 'Inactive', bgColor: 'bg-gradient-secondary', variant: 'secondary' },
    { value: 8, label: 'Canceled', bgColor: 'bg-gradient-dark', variant: 'dark' },
    { value: 9, label: 'Deleted', bgColor: 'bg-gradient-dark', variant: 'dark' },
];

export default appFormStatusProps;