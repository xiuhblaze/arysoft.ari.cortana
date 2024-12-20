import { 
    faFile,
    faFileCircleCheck,
    faFileCircleXmark
} from "@fortawesome/free-solid-svg-icons";

const auditorRequiredProps = [
    {
        icon: faFile,
        label: '-',
        singularLabel: '',
        variant: 'secondary',
    },
    {
        icon: faFileCircleCheck,
        label: 'All required documents are up to date',
        singularLabel: 'Document up to date',
        variant: 'success',
    },
    {
        icon: faFileCircleXmark,
        label: 'At least one required document is missing',
        singularLabel: 'Document is required',
        variant: 'danger',
    },
];

export default auditorRequiredProps;