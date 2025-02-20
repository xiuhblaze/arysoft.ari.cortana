import { faCamera, faClipboardList, faEnvelopeOpenText, faFile, faFileLines, faFileShield, faFileSignature, faHandshake, faLaptopFile, faListCheck, faMagnifyingGlass, faPaste, faPlane } from "@fortawesome/free-solid-svg-icons";
import enums from "../../../helpers/enums";

const {
    AuditDocumentType
} = enums();

const auditDocumentTypeProps = [
    {
        id: AuditDocumentType.nothing,
        icon: faFile,
        label: '-',
        variant: 'light',
    },
    {
        id: AuditDocumentType.auditPlan,
        icon: faClipboardList,
        label: 'Audit plan',
        variant: 'primary',
    },
    {
        id: AuditDocumentType.oacm,
        icon: faHandshake,
        label: 'Opening and closing meeting',
        variant: 'dark',
    },
    {
        id: AuditDocumentType.auditReport,
        icon: faMagnifyingGlass,
        label: 'Audit report',
        variant: 'dark',
    },
    {
        id: AuditDocumentType.fsscIntegrityLetter,
        icon: faEnvelopeOpenText,
        label: 'FSSC integrity letter',
        variant: 'dark',
    },
    {
        id: AuditDocumentType.fsscAuditPlanSigned,
        icon: faFileSignature,
        label: 'FSSC audit plan signed',
        variant: 'dark',
    },
    {
        id: AuditDocumentType.actionPlan,
        icon: faFileShield,
        label: 'Action plan & evidence',
        variant: 'dark',
    },
    {
        id: AuditDocumentType.ncCloseReport,
        icon: faPaste,
        label: 'Non conformities close report',
        variant: 'dark',
    },
    {
        id: AuditDocumentType.techReport,
        icon: faLaptopFile,
        label: 'Technical report',  
        variant: 'dark',
    },
    {
        id: AuditDocumentType.cdc,
        icon: faListCheck,
        label: 'Certification decision checklist',  
        variant: 'dark',
    },
    {
        id: AuditDocumentType.fsscScreenShot,
        icon: faCamera,
        label: 'FSSC upload evidence',  
        variant: 'dark',
    },
    {
        id: AuditDocumentType.travelExpenses,
        icon: faPlane,
        label: 'Travel expenses',  
        variant: 'dark',
    },
    {
        id: AuditDocumentType.witnessReport,
        icon: faFileLines,
        label: 'Witness report',
        variant: 'dark',
    },
    {
        id: AuditDocumentType.other,
        icon: faFile,
        label: 'Other files',  
        variant: 'secondary',
    },
];

export default auditDocumentTypeProps;