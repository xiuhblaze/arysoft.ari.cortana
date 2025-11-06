import enums from "../../../helpers/enums";
import proposalStatusProps from "./proposalStatusProps";

const proposalSetStatusOptions = (proposalCurrentStatus) => {
    const { ProposalStatusType } = enums();
    const currentOption = {
        value: proposalStatusProps[proposalCurrentStatus].value,
        label: proposalStatusProps[proposalCurrentStatus].label,
    };

    switch (proposalCurrentStatus) {
        case ProposalStatusType.nothing:
        case ProposalStatusType.new:
            return [
                currentOption,
                { value: ProposalStatusType.review, label: 'Review', },
                { value: ProposalStatusType.cancel, label: 'Cancel', },
            ];

        case ProposalStatusType.review:
            return [
                currentOption,
                { value: ProposalStatusType.rejected, label: 'Rejected', }, // Rechazado por el revisor
                { value: ProposalStatusType.approved, label: 'Approved', },
                { value: ProposalStatusType.cancel, label: 'Cancel', },
            ];

        case ProposalStatusType.rejected:
            return [
                currentOption,
                { value: ProposalStatusType.review, label: 'Review', },
                { value: ProposalStatusType.cancel, label: 'Cancel', },
            ];

        case ProposalStatusType.approved:
            return [
                currentOption,
                { value: ProposalStatusType.sended, label: 'Sended', },
                { value: ProposalStatusType.cancel, label: 'Cancel', },
            ];

        case ProposalStatusType.sended:
            return [
                currentOption,
                { value: ProposalStatusType.active, label: 'Active', },
                { value: ProposalStatusType.rejected, label: 'Rejected', }, // Rechazada por el cliente
                { value: ProposalStatusType.cancel, label: 'Cancel', },
            ];

        case ProposalStatusType.active:
            return [
                currentOption,
                { value: ProposalStatusType.inactive, label: 'Inactive', },
                { value: ProposalStatusType.cancel, label: 'Cancel', },
            ];

        case ProposalStatusType.inactive:
            return [
                currentOption,
                { value: ProposalStatusType.review, label: 'Review', },
                { value: ProposalStatusType.cancel, label: 'Cancel', },
            ];

        case ProposalStatusType.cancel:
            return [
                currentOption,
                { value: ProposalStatusType.new, label: 'Restart to new', },
            ];

        case ProposalStatusType.deleted: // Probablemente no sea visible
            return [
                currentOption,
                { value: ProposalStatusType.new, label: 'Restore to new', },
            ];
    };
}; // proposalSetStatusOptions

export default proposalSetStatusOptions;    