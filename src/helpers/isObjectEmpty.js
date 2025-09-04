// Una funcion que devuelve si un objeto esta vacio o no

const isObjectEmpty = (obj) => {
    if (!obj || typeof obj !== 'object') return true;
    return Object.keys(obj).length === 0;
}; // isObjectEmpty

export default isObjectEmpty;