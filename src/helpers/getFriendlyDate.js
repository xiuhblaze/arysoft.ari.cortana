import { format, formatDistanceToNow } from "date-fns";

const isValidDate = (date) => {
    return !!date && !isNaN(new Date(date));
}

/**
 * Devuelve una fecha con un formato amigable, comparando la fecha actual
 * con la fecha recibida como parámetro
 * @param {date} date 
 * @param {bool} includeTime opcional, indica si se debe devolver el tiempo también
 * @param {bool} isUTC opcional, indica si se debe usar la fecha UTC o la fecha local
 * @returns valor String que indica la fecha deforma amigable
 */
export const getFriendlyDate = (date, includeTime = false, isUTC = true) => {

    if (!isValidDate(date)) {
        return null;
    }

    //console.log(Intl.DateTimeFormat().resolvedOptions().timeZone); 
    //console.log(new Date().getTimezoneOffset());
    let fechaLocal = null;

    if (isUTC) {
        const fecha = new Date(date);
        const timeZoneOffset = fecha.getTimezoneOffset() * 60000;
        fechaLocal = new Date(fecha.getTime() - timeZoneOffset);
    } else {
        fechaLocal = new Date(date);
    }

    //let delta = Math.round((+new Date - date) / 1000);
    const delta = Math.round((+new Date - fechaLocal) / 1000);
    
    //let halfMinute = 30;
    const minute = 60;
    const hour = minute * 60;
    const day = hour * 24;
    const week = day * 7;

    // let message = '';

    // if (delta < halfMinute) {
    //   message = 'just then';    
    // } else if (delta < minute) {
    //   message = `${ delta } seconds ago`;
    // } else if (delta < 2 * minute) {
    //   message = 'a minute ago';
    // } else if (delta < hour) {
    //   message = `${ Math.floor(delta/minute) } minutes ago`;
    // } else if (Math.floor(delta / hour) == 1) {
    //   message = '1 hour ago';
    // } else if (delta < day) {
    //   message = `${Math.floor(delta/hour)} hours ago`;
    // } else if (delta < 2 * day) {
    //   message = 'yesterday';
    // } else if (delta < week) {
    //   message = `${ Math.floor(delta/day) } days ago`;
    // // } else if (Math.floor(delta/week) == 1) {
    // //   message = 'Hace una semana';
    // } else { //if (delta < week) {
    //   // basado en: https://www.freecodecamp.org/news/how-to-format-dates-in-javascript/
    //   const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    //   message = new Date(date).toLocaleDateString('en-us', options);
    //   message = includeTime ? `${ message } - ${ new Date(date).toLocaleTimeString()}` : message;
    // }

    // console.log('toIsoString', fechaLocal.toISOString());
    // console.log('toLocaleString', fechaLocal.toLocaleString());

    if (delta < week) {
        return formatDistanceToNow(fechaLocal, { addSuffix: true });
    }

    return format(new Date(fechaLocal), !!includeTime ? "dd/MM/yyyy HH:mm:ss" : "dd/MM/yyyy");
};

export default getFriendlyDate;