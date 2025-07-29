import enums from "../../../helpers/enums";

const { ADCAlertType } = enums();

const adcAlertsProps = [
    {
        value: ADCAlertType.nothing,
        label: '-',
        variant: 'secondary',
        description: 'No alerts'
    },
    {
        value: ADCAlertType.employeesMistmatch,
        label: 'Employees mismatch',
        variant: 'danger',
        description: 'The number of employees in the site does not match the number of employees in the ADC'
    },
    {
        value: ADCAlertType.sitesMistmatch,
        label: 'Sites mismatch',
        variant: 'danger',
        description: 'The number or kind of sites does not match the number or kind of sites in the ADC'
    }
];

export default adcAlertsProps;
