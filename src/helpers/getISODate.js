/**
 * basado en: https://stackoverflow.com/questions/7556591/is-the-javascript-date-object-always-one-day-off
 * @param {string} value una fecha en formato cadena con la estructura yyyy-mm-ddT00:00:00.00
 * @returns un string con el formato en YYYY-mm-dd sin tener afectaciones en su valor por la conversión
 */

const getISODate = (value) => {

    // console.log(value);
    // console.log(Object.prototype.toString.call(value));

    if (value instanceof Date) {
        //console.log('es Date');
        return value.toISOString().split('T')[0];
    } else if (Object.prototype.toString.call(value) === '[object String]') {
        //console.log('es un String');
        return new Date(value).toISOString().split('T')[0];
    } 

    // Sino, pos la antigua forma
    return new Date(value.replace(/-/g, '\/').replace(/T.+/, '')).toISOString().slice(0, 10);;
}

export default getISODate;