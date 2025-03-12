import { faBan, faCalendar, faCalendarCheck, faCalendarPlus, faCheck, faCheckDouble, faCircleCheck, faClose, faDoorClosed, faFlagCheckered, faLock, faUserGear, faXmark } from "@fortawesome/free-solid-svg-icons";
import enums from "../../../helpers/enums";

const { AuditStatusType } = enums();

const auditStatusProps = [
    {
        id: AuditStatusType.nothing,
        icon: faCalendarPlus,
        label: 'New',
        variant: 'info',
    },
    {
        id: AuditStatusType.scheduled,
        icon: faCalendar,
        label: 'Scheduled',
        variant: 'info',
    },
    {
        id: AuditStatusType.confirmed,
        icon: faCalendarCheck,
        label: 'Confirmed',
        variant: 'info',
    },
    {
        id: AuditStatusType.inProcess,
        icon: faUserGear,
        label: 'In process',
        variant: 'primary',
    },
    {
        id: AuditStatusType.finished,
        icon: faFlagCheckered,
        label: 'Finished',
        variant: 'dark',
    },
    {
        id: AuditStatusType.completed,
        icon: faCheckDouble,
        label: 'Completed',
        variant: 'dark',
    },
    {
        id: AuditStatusType.closed,
        icon: faCircleCheck,
        label: 'Closed',
        variant: 'secondary',
    },
    {
        id: AuditStatusType.canceled,
        icon: faBan,
        label: 'Canceled',
        variant: 'ligth',
    },
    {
        id: AuditStatusType.deleted,
        icon: faXmark,
        label: 'Deleted',
        variant: 'danger',
    },
];

export default auditStatusProps;