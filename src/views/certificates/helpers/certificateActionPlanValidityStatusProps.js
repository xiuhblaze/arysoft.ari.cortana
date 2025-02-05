import enums from "../../../helpers/enums";

const {
    DefaultValidityStatusType
} = enums();

/**
 * Contiene los diferentes estados para el Plan de Acción en caso de ser requerido
 */
const certificateActionPLanValidityStatusProps = [
    { 
        label: 'No needed action plan', 
        value: DefaultValidityStatusType.nothing,
        variant: 'secondary' 
    },
    { 
        label: 'All action plans are delivered, see de dates marked in green',
        singularLabel: 'The action plan is delivered',
        value: DefaultValidityStatusType.success,
        variant: 'success' 
    },
    { 
        label: 'At least an action plan is close to expire date, see de dates marked in yellow',
        singularLabel: 'Action plan must be delivered',
        value: DefaultValidityStatusType.warning,
        variant: 'warning' 
    },
    { 
        label: 'At least one action plan is not delivered, see de dates marked in red',
        singularLabel: 'The action plan is not delivered',
        value: DefaultValidityStatusType.danger, 
        variant: 'danger' 
    },
];

export default certificateActionPLanValidityStatusProps;