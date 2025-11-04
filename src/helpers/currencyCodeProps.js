import enums from "./enums";

const { DefaultCurrencyCodeType } = enums();

const currencyCodeProps = [
    {
        id: DefaultCurrencyCodeType.nothing,
        abbreviation: '-',
        label: '-',
        simbol: '-',
    },
    {
        id: DefaultCurrencyCodeType.usd,
        abbreviation: 'USD',
        label: 'Dollars',
        simbol: '$',
    },
    {
        id: DefaultCurrencyCodeType.mxn,
        abbreviation: 'MXN',
        label: 'Pesos',
        simbol: '$',
    },
    {
        id: DefaultCurrencyCodeType.eur,
        abbreviation: 'EUR',
        label: 'Euros',
        simbol: '€',
    },
    {
        id: DefaultCurrencyCodeType.other,
        abbreviation: 'Other',
        label: 'Other',
        simbol: '$',
    }
];

export default currencyCodeProps;