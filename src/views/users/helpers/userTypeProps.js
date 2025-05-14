import enums from "../../../helpers/enums";

const { UserType } = enums();

const userTypeProps = [
    {
        id: UserType.nothing,
        label: '-',
        variant: 'light',
    },
    { 
        id: UserType.superAdmin,
        label: 'Super admin',
        variant: 'primary',
    },
    { 
        id: UserType.admin,
        label: 'Admin',
        variant: 'info',
    },
    { 
        id: UserType.auditor,
        label: 'Auditor',
        variant: 'warning',
    },
    { 
        id: UserType.organization,
        label: 'Organization',
        variant: 'success',
    },
];

export default userTypeProps;