/**
 * Devuelve un número aleatorio con la cantidad de digitos indicado en el parametro
 * @param {int} length tamaño del numero aleatorio
 */
const getRandomNumber = (length = 4) => {
    let result = '';
    const values = '0123456789';

    for (let i = 0; i < length; i++) {
        result += values.charAt(Math.floor(Math.random() * values.length));
    }

    return result;
}; // getRandomNumber

export default getRandomNumber;