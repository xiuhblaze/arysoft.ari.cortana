import enums from "../../../helpers/enums";

const { AuditStepType } = enums();

const auditStepProps = [
    {
        id: AuditStepType.nothing,
        label: '-',
        variant: 'light',
    },
    {
        id: AuditStepType.stage1,
        label: 'Stage 1',
        variant: 'dark',
    },
    {
        id: AuditStepType.stage2,
        label: 'Stage 2',
        variant: 'dark',
    },
    {
        id: AuditStepType.survey1,
        label: 'Survey 1',
        variant: 'dark',
    },
    {
        id: AuditStepType.survey2,
        label: 'Survey 2',
        variant: 'dark',
    },
    {
        id: AuditStepType.recertification,
        label: 'Recertification',
        variant: 'info',
    },
    {
        id: AuditStepType.transfer,
        label: 'Transfer',
        variant: 'info',
    },
    {
        id: AuditStepType.special,
        label: 'Special',
        variant: 'warning',
    }
];

export default auditStepProps;