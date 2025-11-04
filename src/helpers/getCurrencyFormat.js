import currencyCodeProps from "./currencyCodeProps";

const getCurrencyFormat = (value, currencyCode) => {
    const code = currencyCodeProps.find(currency => currency.id == currencyCode);
    const number = parseFloat(value);

    if (isNaN(number)) {
        return `${!!code ? code.simbol : ''}0.00`;
    }

    return `${!!code ? code.simbol : ''}${number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};

export default getCurrencyFormat;