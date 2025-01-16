import { faCertificate } from "@fortawesome/free-solid-svg-icons";

const certificateValidityStatusProps = [
    { 
        icon: faCertificate,
        label: 'No certificates',
        singularLabel: 'No Certificate',
        variant: 'light',
    },
    { 
        icon: faCertificate,        
        label: 'All certificates are valid',
        singularLabel: 'Valid Certificate',
        variant: 'success',
    },
    {
        icon: faCertificate,        
        label: 'At least one certificate is about to expire',
        singularLabel: 'The certificate is about to expire',
        variant: 'warning',
    },
    {
        icon: faCertificate,
        label: 'At least one certificate has expired',
        singularLabel: 'The certificate has expired',
        variant: 'danger',
    },
];

export default certificateValidityStatusProps;