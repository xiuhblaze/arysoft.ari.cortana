import { faCertificate, faClipboardList, faClock, faFile, faFileCircleCheck, faFileContract, faFileSignature, faListCheck, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import enums from "../../../helpers/enums";

const { AuditCycleDocumentType } = enums();

const auditCycleDocumentTypeProps = [
    {
        id: AuditCycleDocumentType.nothing,
        icon: faFile,
        label: '-',
        helpText: '(not valid option)',
        variant: 'light',
    },
    {
        id: AuditCycleDocumentType.appForm,
        icon: faFile,
        label: 'Application form',
        helpText: 'An app form document for each standard',
        variant: 'primary',
    },
    {
        id: AuditCycleDocumentType.acd,
        icon: faClock,
        label: 'ADC - Audit day calculation',
        helpText: 'A document for each standard',
        variant: 'warning',
    },
    {
        id: AuditCycleDocumentType.proposal,
        icon: faFileSignature,
        label: 'Proposal',
        helpText: 'A proposal for each standard',
        variant: 'info',
    },
    {
        id: AuditCycleDocumentType.contract,
        icon: faFileContract,
        label: 'Contract',
        helpText: 'A unique document',
        variant: 'success',
    },
    {
        id: AuditCycleDocumentType.auditProgramme,
        icon: faFileCircleCheck,
        label: 'Audit programme',
        helpText: 'Confirmation letter', 
        variant: 'primary',
    },
    {
        id: AuditCycleDocumentType.certificate,
        icon: faCertificate,
        label: 'Certificate',
        helpText: 'A certificate file for each standard, could be included draft version',
        variant: 'success',
    },
    {
        id: AuditCycleDocumentType.survey,
        icon: faClipboardList,
        label: 'Survey',
        helpText: 'Customer satisfaction survey',
        variant: 'info',
    },
    {
        id: AuditCycleDocumentType.other,
        icon: faFile,
        label: 'Other',
        helpText: 'Any other document necesary for the audit cycle',
        variant: 'dark',
    },
    {
        id: AuditCycleDocumentType.audit,
        icon: faMagnifyingGlass,
        label: 'Audits',
        helpText: 'Audits events scheduled, in process or completed',
        variant: 'ari',
    },
];

export default auditCycleDocumentTypeProps;