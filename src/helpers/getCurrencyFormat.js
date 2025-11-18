import currencyCodeProps from "./currencyCodeProps";

const getCurrencyFormat = (value, currencyCode) => {
    const code = currencyCodeProps.find(currency => currency.id == currencyCode);
    const localeMap = {
        'MXN': 'es-MX',
        'USD': 'en-US',
        'EUR': 'es-ES', // o 'es-ES', 'fr-FR', cualquiera que use Euros
        'GBP': 'en-GB',
        'JPY': 'ja-JP',
        'CAD': 'en-CA',
        'ARS': 'es-AR',
        'COP': 'es-CO',
        'BRL': 'pt-BR'
    };
    const locale = localeMap[code.abbreviation] || 'es-MX';

    let number = parseFloat(value);

    if (isNaN(number)) {
        number = 0;
    }

    if (code.abbreviation == 'UF') {
        return `${!!code ? code.simbol : ''} ${number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
    }

    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: code.abbreviation
    }).format(number);

    //return `${!!code ? code.simbol : ''}${number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
}; // getCurrencyFormat

export default getCurrencyFormat;