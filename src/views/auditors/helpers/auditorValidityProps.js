import { 
    faCircle,
    faCircleCheck,
    faCircleExclamation,
    faCircleXmark,
    faFile,
    faFileCircleCheck,
    faFileCircleExclamation,
    faFileCircleXmark 
} from "@fortawesome/free-solid-svg-icons";

const auditorValidityProps = [
    { 
        icon: faCircle, 
        iconFile: faFile, 
        label: 'There are no documents to validate', 
        singularLabel: 'No document',
        variant: 'light' 
    },
    { 
        icon: faCircleCheck, 
        iconFile: faFileCircleCheck, 
        label: 'All updated', 
        singularLabel: 'Updated document',
        variant: 'success' 
    },
    { 
        icon: faCircleExclamation, 
        iconFile: faFileCircleExclamation, 
        label: 'At least one document is close to expired', 
        singularLabel: 'The document is close to expired',
        variant: 'warning' 
    },
    { 
        icon: faCircleXmark, 
        iconFile: faFileCircleXmark,
        label: 'At least one document has expired',
        singularLabel: 'The document has expired',
        variant: 'danger' 
    },
];

export default auditorValidityProps;