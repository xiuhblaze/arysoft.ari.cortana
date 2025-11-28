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

// switch (audit.Status) {
            //     case AuditStatusType.scheduled:
            //         setStatusOptions([
            //             { label: 'Scheduled', value: AuditStatusType.scheduled },
            //             { label: 'Confirmed', value: AuditStatusType.confirmed },
            //             { label: 'Canceled', value: AuditStatusType.canceled },
            //         ]);
            //         break;
            //     case AuditStatusType.confirmed:
            //         setStatusOptions([
            //             { label: 'Confirmed', value: AuditStatusType.confirmed },
            //             { label: 'Canceled', value: AuditStatusType.canceled },
            //         ]);
            //         break;                
            //     case AuditStatusType.inProcess:
            //         setStatusOptions([
            //             { label: 'In process', value: AuditStatusType.inProcess },
            //             { label: 'Canceled', value: AuditStatusType.canceled },
            //         ]);
            //         break;
            //     case AuditStatusType.finished:
            //         setStatusOptions([
            //             { label: 'Finished', value: AuditStatusType.finished },
            //             { label: 'Completed', value: AuditStatusType.completed },
            //             { label: 'Canceled', value: AuditStatusType.canceled },
            //         ]);
            //         break;
            //     case AuditStatusType.completed:
            //         setStatusOptions([
            //             { label: 'Completed', value: AuditStatusType.completed },
            //             { label: 'Closed', value: AuditStatusType.closed },
            //             { label: 'Canceled', value: AuditStatusType.canceled },
            //         ]);
            //         break;
            //     case AuditStatusType.closed:
            //         setStatusOptions([
            //             { label: 'Closed', value: AuditStatusType.closed },
            //         ]);
            //         break;
            //     case AuditStatusType.canceled:
            //         setStatusOptions([
            //             { label: 'Scheduled', value: AuditStatusType.scheduled },
            //             { label: 'Canceled', value: AuditStatusType.canceled },
            //         ]);
            //         break;
            //     default:
            //         setStatusOptions([
            //             { label: '(select)', value: AuditStatusType.nothing },
            //             { label: 'Scheduled', value: AuditStatusType.scheduled },
            //             { label: 'Confirmed', value: AuditStatusType.confirmed },
            //             // { label: 'In process', value: AuditStatusType.inProcess },
            //             // { label: 'Finished', value: AuditStatusType.finished },
            //             { label: 'Completed', value: AuditStatusType.completed },
            //             { label: 'Closed', value: AuditStatusType.closed },
            //             { label: 'Canceled', value: AuditStatusType.canceled },
            //         ]);
            //         break;
            // } // switch