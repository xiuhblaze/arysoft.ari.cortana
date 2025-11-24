import enums from "./enums";

const { DefaultCurrencyCodeType } = enums();

const currencyCodeProps = [
    {
        id: DefaultCurrencyCodeType.nothing,
        abbreviation: '-',
        label: '-',
        symbol: '-',
    },
    {
        id: DefaultCurrencyCodeType.usd,
        abbreviation: 'USD',
        label: 'Dollars',
        symbol: '$',
    },
    {
        id: DefaultCurrencyCodeType.mxn,
        abbreviation: 'MXN',
        label: 'Pesos',
        symbol: '$',
    },
    {
        id: DefaultCurrencyCodeType.eur,
        abbreviation: 'EUR',
        label: 'Euros',
        symbol: '€',
    },
    {
        id: DefaultCurrencyCodeType.uf,
        abbreviation: 'UF',
        label: 'Unit of account',
        symbol: 'UF',
    }
];

export default currencyCodeProps;