import { 
    faCamera,
    faClipboardList,
    faEnvelopeOpenText,
    faFile,
    faFileLines,
    faFileShield,
    faFileSignature,
    faHandshake,
    faLaptopFile,
    faListCheck,
    faMagnifyingGlass,
    faPaste,
    faPlane,
} from "@fortawesome/free-solid-svg-icons";
import enums from "../../../helpers/enums";

const {
    AuditDocumentType
} = enums();

const auditDocumentTypeProps = [
    {
        id: AuditDocumentType.nothing,
        icon: faFile,
        label: '-',
        helpText: '(not valid option)',
        variant: 'light',
    },
    {
        id: AuditDocumentType.auditPlan,
        icon: faClipboardList,
        label: 'Audit plan',
        helpText: 'Could be one or more documents',
        variant: 'primary',
    },
    {
        id: AuditDocumentType.oacm,
        icon: faHandshake,
        label: 'O&C Meeting',
        helpText: 'Opening and closing meeting',
        variant: 'warning',
    },
    {
        id: AuditDocumentType.auditReport,
        icon: faMagnifyingGlass,
        label: 'Audit report',
        helpText: 'Could be one or more documents',
        variant: 'success',
    },
    {
        id: AuditDocumentType.fsscIntegrityLetter,
        icon: faEnvelopeOpenText,
        label: 'FSSC integrity letter',
        helpText: 'Document for FSSC',
        variant: 'ari',
    },
    {
        id: AuditDocumentType.fsscAuditPlanSigned,
        icon: faFileSignature,
        label: 'FSSC audit plan signed',
        helpText: 'Document for FSSC',
        variant: 'ari',
    },
    {
        id: AuditDocumentType.actionPlan,
        icon: faFileShield,
        label: 'Action plan & evidence',
        helpText: 'For the NCs actions from organization',
        variant: 'warning',
    },
    {
        id: AuditDocumentType.ncCloseReport,
        icon: faPaste,
        label: 'Non conformities close report',
        helpText: 'Only if has NCs',
        variant: 'info',
    },
    {
        id: AuditDocumentType.techReport,
        icon: faLaptopFile,
        label: 'Technical report',
        helpText: 'Could be one or more documents',
        variant: 'primary',
    },
    {
        id: AuditDocumentType.cdc,
        icon: faListCheck,
        label: 'CDC - Certification decision checklist',
        helpText: 'Could be one or more documents',
        variant: 'warning',
    },
    {
        id: AuditDocumentType.fsscScreenShot,
        icon: faCamera,
        label: 'FSSC upload evidence',
        helpText: 'Screenshot of uploaded information in the FSSC portal',
        variant: 'ari',
    },
    {
        id: AuditDocumentType.travelExpenses,
        icon: faPlane,
        label: 'Travel expenses',
        helpText: 'Files for the travel expenses',
        variant: 'info',
    },
    {
        id: AuditDocumentType.witnessReport,
        icon: faFileLines,
        label: 'Witness report',
        helpText: 'I don\'t know what is this, hehehe -erease XD',
        variant: 'primary',
    },
    {
        id: AuditDocumentType.other,
        icon: faFile,
        label: 'Other files',  
        helpText: 'Any other document related to the audit',
        variant: 'dark',
    },
];

export default auditDocumentTypeProps;