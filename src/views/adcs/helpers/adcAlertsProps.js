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
        description: 'The number of employees at some of the sites does not match the number of employees at the ADC. The information has been updated. Please check.'
    },
    {
        value: ADCAlertType.sitesMistmatch,
        label: 'Sites mismatch',
        variant: 'danger',
        description: 'The Sites do not match the AppForm, it has been updated, check the added sites'
    }
];

export default adcAlertsProps;
