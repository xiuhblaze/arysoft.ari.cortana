/**
 * Devuelve una fecha con un formato amigable, comparando la fecha actual
 * con la fecha recibida como parámetro, basado en:
 * https://stackoverflow.com/questions/7641791/javascript-library-for-human-friendly-relative-date-formatting
 * @param {date} date 
 * @param {bool} includeTime opcional, indica si se debe devolver el tiempo también
 * @returns valor String que indica la fecha deforma amigable
 */
export const getFriendlyDate = (date, includeTime = false) => {
  let delta = Math.round((+new Date - date) / 1000);

  let halfMinute = 30;
  let minute = 60;
  let hour = minute * 60;
  let day = hour * 24;
  let week = day * 7;

  let message = '';

  if (delta < halfMinute) {
    message = 'just then';    
  } else if (delta < minute) {
    message = `${ delta } seconds ago`;
  } else if (delta < 2 * minute) {
    message = 'a minute ago';
  } else if (delta < hour) {
    message = `${ Math.floor(delta/minute) } minutes ago`;
  } else if (Math.floor(delta / hour) == 1) {
    message = '1 hour ago';
  } else if (delta < day) {
    message = `${Math.floor(delta/hour)} hours ago`;
  } else if (delta < 2 * day) {
    message = 'yesterday';
  } else if (delta < week) {
    message = `${ Math.floor(delta/day) } days ago`;
  // } else if (Math.floor(delta/week) == 1) {
  //   message = 'Hace una semana';
  } else { //if (delta < week) {
    // basado en: https://www.freecodecamp.org/news/how-to-format-dates-in-javascript/
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    message = new Date(date).toLocaleDateString('en-us', options);
    message = includeTime ? `${ message } - ${ new Date(date).toLocaleTimeString()}` : message;
  }

  return message;
};

export default getFriendlyDate;