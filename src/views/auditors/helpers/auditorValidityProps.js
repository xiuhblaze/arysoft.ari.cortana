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
        label: 'At least one document is about to expire', 
        singularLabel: 'The document is about to expire',
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