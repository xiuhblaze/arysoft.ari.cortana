import enums from "../../../helpers/enums";

const { ProposalStatusType } = enums();

const proposalStatusProps = [
    {
        value: ProposalStatusType.nothing,
        label: 'New',
        variant: 'secondary',
        description: 'New temporary proposal'
    },
    {
        value: ProposalStatusType.new,
        label: 'New',
        variant: 'info',
        description: 'New proposal'
    },
    {
        value: ProposalStatusType.review,
        label: 'Under review',
        variant: 'warning',
        description: 'The proposal is under review'
    },
    {
        value: ProposalStatusType.rejected,
        label: 'Rejected',
        variant: 'danger',
        description: 'The proposal has been rejected'
    },
    {
        value: ProposalStatusType.approved,
        label: 'Approved',
        variant: 'success',
        description: 'The proposal has been approved'
    },
    {
        value: ProposalStatusType.sended,
        label: 'Sended',
        variant: 'success',
        description: 'The proposal has been sent for signature.'
    },
    {
        value: ProposalStatusType.active,
        label: 'Active',
        variant: 'success',
        description: 'Proposal active'
    },
    {
        value: ProposalStatusType.inactive,
        label: 'Inactive',
        variant: 'secondary',
        description: 'The proposal is currently inactive.'
    },
    {
        value: ProposalStatusType.cancel,
        label: 'Cancel',
        variant: 'secondary',
        description: 'The proposal has been cancelled'
    },
    {
        value: ProposalStatusType.deleted,
        label: 'Deleted',
        variant: 'secondary',
        description: 'Proposal logically eliminated'
    }
];

export default proposalStatusProps;