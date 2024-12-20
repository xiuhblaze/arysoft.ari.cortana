/**
 * Revisa si un objeto string contiene texto, si no contiene devuelve true, de lo contrario false, 
 * sino es un objeto string, devuelve false de igual forma.
 * @param {string} value objeto de tipo cadena a evaluar
 * @returns valor de tipo booleano para indicar si esta vacio (true) o no (false)
 */
export const isNullOrEmpty = (value) => {
    
    return !(typeof value === 'string' && value.trim().length > 0);
};

export default isNullOrEmpty;