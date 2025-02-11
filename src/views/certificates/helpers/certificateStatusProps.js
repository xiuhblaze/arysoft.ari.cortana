import { faCertificate } from "@fortawesome/free-solid-svg-icons";

export const certificateStatusProps = [
    {
        icon: faCertificate,
        label: '-',
        variant: 'light',
    },
    {
        icon: faCertificate,
        label: 'Active',
        variant: 'info',
    },
    {
        icon: faCertificate,
        label: 'Suspended',
        variant: 'warning',
    },
    {
        icon: faCertificate,
        label: 'Expired',
        variant: 'secondary',
    },
];