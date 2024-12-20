import isNullOrEmpty from "./isNullOrEmpty";

/**
 * Devuelve el nombre completo en base a un objeto con las propiedades FirstName, MiddleName y LastName
 * @param {object} item Objecot que al menos tiene las propiedades de FirstName, MiddleName y LastName
 * @returns El nombre completo ordenado por nombre y apellidos
 */
export const getFullName = (item) => {
    let fullName = '';

    fullName = !isNullOrEmpty(item.FirstName) ? item.FirstName : ''
    fullName += !isNullOrEmpty(item.MiddleName) ? ' ' + item.MiddleName : ''
    fullName += !isNullOrEmpty(item.LastName) ? ' ' + item.LastName : ''

    return fullName.trim();
}; // getFullName