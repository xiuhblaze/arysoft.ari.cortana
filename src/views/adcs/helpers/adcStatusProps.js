import enums from "../../../helpers/enums";

const { ADCStatusType } = enums();

const adcStatusProps = [
    { 
        value: ADCStatusType.nothing,
        label: 'New', 
        variant: 'secondary',
        description: 'New temporary audit day calculation' 
    },
    { 
        value: ADCStatusType.new,
        label: 'New', 
        variant: 'info',
        description: 'New audit day calculation'
    },
    {
        value: ADCStatusType.review,
        label: 'In review',
        variant: 'warning',
        description: 'In review'
    },
    {
        value: ADCStatusType.rejected,
        label: 'Rejected',
        variant: 'warning',
        description: 'Rejected by reviewer, check the comments'
    },
    { 
        value: ADCStatusType.active,
        label: 'Active', 
        variant: 'success',
        description: 'Active audit day calculation'
    },
    { 
        value: ADCStatusType.inactive,
        label: 'Inactive', 
        variant: 'secondary',
        description: 'Inactive audit day calculation'
    },
    { 
        value: ADCStatusType.canceled,
        label: 'Canceled',
        variant: 'light',
        description: 'Canceled audit day calculation'
    },
    {
        value: ADCStatusType.deleted,
        label: 'Deleted',
        variant: 'danger',
        description: 'Deleted audit day calculation'
    }
];

export default adcStatusProps;
