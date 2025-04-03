import enums from "../../../helpers/enums";

const { AuditStepType } = enums();

const auditStepProps = [
    {
        id: AuditStepType.nothing,
        label: '-',
        abbreviation: '-',
        variant: 'light',
    },
    {
        id: AuditStepType.stage1,
        label: 'Stage 1',
        abbreviation: 'st1',
        variant: 'dark',
    },
    {
        id: AuditStepType.stage2,
        label: 'Stage 2',
        abbreviation: 'st2',
        variant: 'dark',
    },
    {
        id: AuditStepType.surveillance1,
        label: 'Surveillance 1',
        abbreviation: 's1',
        variant: 'dark',
    },
    {
        id: AuditStepType.surveillance2,
        label: 'Surveillance 2',
        abbreviation: 's2',
        variant: 'dark',
    },
    {
        id: AuditStepType.recertification,
        label: 'Recertification',
        abbreviation: 'rr',
        variant: 'info',
    },
    {
        id: AuditStepType.transfer,
        label: 'Transfer',
        abbreviation: 't',
        variant: 'info',
    },
    {
        id: AuditStepType.special,
        label: 'Special',
        abbreviation: 's',
        variant: 'warning',
    }
];

export default auditStepProps;