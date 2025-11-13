import enums from "../../../helpers/enums";
import auditStatusProps from "./auditStatusProps";

const auditSetStatusOptions = (status) => {
    const { AuditStatusType } = enums();
    const currentOption = {
        label: auditStatusProps[status].label,
        value: status,
    };

    switch (status) {
        case AuditStatusType.nothing:
            return [
                currentOption,
                { label: 'Confirmed', value: AuditStatusType.confirmed },
            ];
        case AuditStatusType.scheduled:
            return [
                currentOption,
                { label: 'Confirmed', value: AuditStatusType.confirmed },
                { label: 'Cancel', value: AuditStatusType.canceled },
            ];
        case AuditStatusType.confirmed:
            return [
                currentOption,
                // { label: 'In process', value: AuditStatusType.inProcess }, // Este cambio es automático
                { label: 'Cancel', value: AuditStatusType.canceled },
            ];
        case AuditStatusType.inProcess:
            return [
                currentOption,
                { label: 'Cancel', value: AuditStatusType.canceled },
            ];
        case AuditStatusType.finished:
            return [
                currentOption,
                { label: 'Complete', value: AuditStatusType.completed },
                { label: 'Cancel', value: AuditStatusType.canceled },
            ];
        case AuditStatusType.completed:
            return [
                currentOption,
                { label: 'Closed', value: AuditStatusType.closed },
                { label: 'Cancel', value: AuditStatusType.canceled },
            ];
        // case AuditStatusType.closed: // Es lo mismo que default, por el momento
        //     return [
        //         currentOption,
        //     ];
        // case AuditStatusType.canceled:
        //     return [
        //         currentOption,
        //     ];
        // case AuditStatusType.deleted:
        //     return [
        //         currentOption,
        //     ];
        default:
            return [
                currentOption,
            ];
    }
}; // auditSetStatusOptions

export default auditSetStatusOptions;