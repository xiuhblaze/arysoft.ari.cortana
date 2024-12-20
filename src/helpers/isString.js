/**
 * Revisa el objeto recibido como parametro y determina si es de tipo cadena
 * @param {object} value objeto a comprobar si es de tipo string
 * @returns valoor booleano que determina si el objeto recibido es de tipo string (true)
 */
export const isString = (value) => {
    return typeof value === 'string' 
      || value instanceof String 
      || Object.prototype.toString.call(value) === '[object String]';
  }
  
  export default isString;
  