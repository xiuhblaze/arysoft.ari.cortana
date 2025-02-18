import { faBan, faCalendar, faCalendarCheck, faCheckDouble, faClose, faDoorClosed, faFlagCheckered, faLock, faUserGear, faXmark } from "@fortawesome/free-solid-svg-icons";
import enums from "../../../helpers/enums";

const { AuditStatusType } = enums();

const auditStatusProps = [
    {
        id: AuditStatusType.nothing,
        icon: null,
        label: '-',
        variant: 'light',
    },
    {
        id: AuditStatusType.scheduled,
        icon: faCalendar,
        label: 'Scheduled',
        variant: 'primary',
    },
    {
        id: AuditStatusType.confirmed,
        icon: faCalendarCheck,
        label: 'Confirmed',
        variant: 'success',
    },
    {
        id: AuditStatusType.inProcess,
        icon: faUserGear,
        label: 'In process',
        variant: 'info',
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
        variant: 'success',
    },
    {
        id: AuditStatusType.closed,
        icon: faDoorClosed,
        label: 'Closed',
        variant: 'dark',
    },
    {
        id: AuditStatusType.canceled,
        icon: faBan,
        label: 'Canceled',
        variant: 'secondary',
    },
    {
        id: AuditStatusType.deleted,
        icon: faXmark,
        label: 'Deleted',
        variant: 'danger',
    },
];

export default auditStatusProps;