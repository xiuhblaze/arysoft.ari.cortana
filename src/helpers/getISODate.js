/**
 * basado en: https://stackoverflow.com/questions/7556591/is-the-javascript-date-object-always-one-day-off
 * @param {string} value una fecha en formato cadena con la estructura yyyy-mm-ddT00:00:00.00
 * @returns un string con el formato en YYYY-mm-dd sin tener afectaciones en su valor por la conversión
 */

const getISODate = (value) => {
    return new Date(value.replace(/-/g, '\/').replace(/T.+/, '')).toISOString().slice(0, 10);
}

export default getISODate