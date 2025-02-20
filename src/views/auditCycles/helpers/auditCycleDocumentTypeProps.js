import { faCertificate, faClipboardList, faClock, faFile, faFileCircleCheck, faFileContract, faFileSignature, faListCheck, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import enums from "../../../helpers/enums";

const { AuditCycleDocumentType } = enums();

const auditCycleDocumentTypeProps = [
    {
        id: AuditCycleDocumentType.nothing,
        icon: faFile,
        label: '-',
        variant: 'light',
    },
    {
        id: AuditCycleDocumentType.appForm,
        icon: faFile,
        label: 'Application form',
        variant: 'primary',
    },
    {
        id: AuditCycleDocumentType.acd,
        icon: faClock,
        label: 'Audit day calculation',
        variant: 'warning',
    },
    {
        id: AuditCycleDocumentType.proposal,
        icon: faFileSignature,
        label: 'Proposal',
        variant: 'danger',
    },
    {
        id: AuditCycleDocumentType.contract,
        icon: faFileContract,
        label: 'Contract',
        variant: 'success',
    },
    {
        id: AuditCycleDocumentType.auditProgramme,
        icon: faFileCircleCheck,
        label: 'Audit programme',
        variant: 'info',
    },
    {
        id: AuditCycleDocumentType.certificate,
        icon: faCertificate,
        label: 'Certificate',
        variant: 'success',
    },
    {
        id: AuditCycleDocumentType.survey,
        icon: faClipboardList,
        label: 'Survey',
        variant: 'info',
    },
    {
        id: AuditCycleDocumentType.other,
        icon: faFile,
        label: 'Other',
        variant: 'secondary',
    },
    {
        id: AuditCycleDocumentType.audit,
        icon: faMagnifyingGlass,
        label: 'Audits',
        variant: 'dark',
    },
];

export default auditCycleDocumentTypeProps;