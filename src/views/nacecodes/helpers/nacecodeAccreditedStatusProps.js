import enums from "../../../helpers/enums";

const { NaceCodeAccreditedType } = enums();

const nacecodeAccreditedStatusProps = [
    { 
        id: NaceCodeAccreditedType.nothing,
        variant: 'light',
        label: '(accredited)',
        description: 'The NACE code is not accredited',
    },
    { 
        id: NaceCodeAccreditedType.accredited,
        variant: 'success',
        label: 'Accredited',
        description: 'The NACE code is accredited',
    },
    { 
        id: NaceCodeAccreditedType.mustAccredited,
        variant: 'warning', 
        label: 'Must accredited',
        description: 'The NACE code must be accredited',
    },
    { 
        id: NaceCodeAccreditedType.notAccredited,
        variant: 'secondary',
        label: 'Not accredited',
        description: 'The NACE code is not accredited',
    },
];

export default nacecodeAccreditedStatusProps;